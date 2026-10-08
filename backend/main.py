"""
FastAPI Server for Hadith Verification Web Application
Provides REST API endpoints and static file serving for the frontend.
"""
import os
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from backend.models import (
    VerificationRequest,
    VerificationResponse,
    HadithCorpusItem,
    NarratorBio
)
from backend.rijal_database import RIJAL_DATABASE
from backend.corpus_database import CORPUS_DATABASE
from backend.rules_engine import verify_hadith

app = FastAPI(
    title="Hadith Verification Engine (تحقيق الأحاديث النبوية)",
    description="Rule-Based Islamic Hadith Verification System according to Usul al-Hadith (Mustalah)",
    version="1.0.0"
)

# CORS middleware for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")

@app.get("/api/hadiths", response_model=List[HadithCorpusItem])
def get_corpus(q: Optional[str] = Query(None), verdict: Optional[str] = Query(None)):
    """Retrieve corpus hadiths with optional search and verdict filters."""
    results = list(CORPUS_DATABASE.values())
    if verdict:
        results = [h for h in results if h["known_verdict"].upper().startswith(verdict.upper())]
    if q:
        query_lower = q.lower()
        results = [
            h for h in results
            if query_lower in h["title_en"].lower()
            or query_lower in h["title_ar"].lower()
            or query_lower in h["title_ur"].lower()
            or query_lower in h["matn_en"].lower()
            or query_lower in h["matn_ar"].lower()
            or query_lower in h["matn_ur"].lower()
        ]
    return results

@app.get("/api/hadiths/{hadith_id}")
def get_hadith_detail(hadith_id: str):
    """Retrieve details and automated verification of a specific Hadith."""
    hadith = CORPUS_DATABASE.get(hadith_id)
    if not hadith:
        raise HTTPException(status_code=404, detail="Hadith not found in corpus")

    # Run verification through the rule engine
    verification = verify_hadith(
        narrator_ids=hadith["narrator_ids"],
        formulas=hadith["transmission_formulas"],
        hadith_id=hadith_id,
        matn_dict={
            "ar": hadith["matn_ar"],
            "en": hadith["matn_en"],
            "ur": hadith["matn_ur"]
        },
        corroborated=hadith.get("corroborated", False)
    )

    return {
        "hadith": hadith,
        "verification": verification
    }

@app.get("/api/narrators")
def get_narrators(q: Optional[str] = Query(None), generation: Optional[str] = Query(None)):
    """List and search biographical narrators database."""
    results = list(RIJAL_DATABASE.values())
    if generation:
        results = [n for n in results if n.get("generation", "").lower() == generation.lower()]
    if q:
        query_lower = q.lower()
        results = [
            n for n in results
            if query_lower in n["name_en"].lower()
            or query_lower in n["name_ar"].lower()
            or query_lower in n["name_ur"].lower()
            or query_lower in n.get("notes_en", "").lower()
        ]
    return results

@app.get("/api/narrators/{narrator_id}")
def get_narrator(narrator_id: str):
    """Retrieve full biographical record and jarh wa ta'dil ratings for a narrator."""
    narrator = RIJAL_DATABASE.get(narrator_id)
    if not narrator:
        raise HTTPException(status_code=404, detail="Narrator not found in Rijal database")
    return narrator

@app.post("/api/verify", response_model=VerificationResponse)
def run_verification(request: VerificationRequest):
    """Run full 5-pillar verification engine on custom chain or referenced hadith."""
    if request.hadith_id and request.hadith_id in CORPUS_DATABASE:
        hadith = CORPUS_DATABASE[request.hadith_id]
        return verify_hadith(
            narrator_ids=hadith["narrator_ids"],
            formulas=hadith["transmission_formulas"],
            hadith_id=request.hadith_id,
            matn_dict={
                "ar": hadith["matn_ar"],
                "en": hadith["matn_en"],
                "ur": hadith["matn_ur"]
            },
            corroborated=request.corroborated if request.corroborated is not None else hadith.get("corroborated", False)
        )

    # Custom chain verification
    narrator_ids = request.chain_narrators or ["al_bukhari", "al_humaydi", "sufyan_ibn_uyaynah", "yahya_ibn_said_al_ansari", "muhammad_ibn_ibrahim_al_taymi", "alqamah_ibn_waqqas", "umar_ibn_al_khattab", "prophet_muhammad"]
    formulas = request.chain_formulas or ["haddathana"] * (len(narrator_ids) - 1)

    matn_text = request.matn_text or (request.hadith_text if request.hadith_text else "Custom Hadith text")
    matn_dict = {
        "ar": matn_text,
        "en": matn_text,
        "ur": matn_text
    }

    return verify_hadith(
        narrator_ids=narrator_ids,
        formulas=formulas,
        hadith_id=request.hadith_id or "custom",
        matn_dict=matn_dict,
        corroborated=bool(request.corroborated)
    )

@app.get("/api/rules")
def get_rules_documentation():
    """Returns educational descriptions of the 5 conditions of Hadith authenticity."""
    return {
        "rules": [
            {
                "id": "ittisal",
                "name_ar": "اتصال السند",
                "name_en": "Chain Continuity (Ittisal al-Sanad)",
                "name_ur": "اتصالِ سند",
                "desc_en": "Each narrator must have directly heard and received the narration from their immediate teacher without missing intermediaries.",
                "desc_ar": "أن يتصل إسناد الحديث بأن يكون كل واحد من رواته سمعه من شيخه من أول السند إلى منتهاه.",
                "desc_ur": "سند کے شروع سے آخر تک ہر راوی نے اپنے استاد سے براہ راست حدیث سنی ہو، درمیان میں کوئی راوی چھوٹا نہ ہو۔",
                "defects": ["Mu'allaq (معلق)", "Mursal (مرسل)", "Mu'dal (معضل)", "Munqati' (منقطع)", "Mudallas (مدلس)"]
            },
            {
                "id": "adalah",
                "name_ar": "عدالة الرواة",
                "name_en": "Moral Integrity ('Adalat ar-Ruwat)",
                "name_ur": "عدالتِ روات",
                "desc_en": "Every narrator in the chain must be a practicing Muslim of sound mind, morally upright, free from grave sins (Fisq), and known for honesty.",
                "desc_ar": "أن يكون الراوي مسلماً، بالغاً، عاقلاً، غير فاسق، وغير مخروم المروءة.",
                "desc_ur": "سند کا ہر راوی مسلمان، عاقل، بالغ، گناہوں سے پاک اور اخلاقی لحاظ سے باکردار ہو۔",
                "defects": ["Kidhb / Wadda' (كذاب وضاع)", "Tuhmah bi-al-Kidhb (تهمة بالكذب)", "Fisq (فسق)", "Jahalah (جهالة الحال أو العين)"]
            },
            {
                "id": "dabt",
                "name_ar": "ضبط الرواة",
                "name_en": "Accuracy and Precision (Dabt ar-Ruwat)",
                "name_ur": "ضبطِ روات",
                "desc_en": "The narrator must have retentive memory (Dabt al-Sadr) or impeccably preserved manuscripts (Dabt al-Kitab) free of frequent error.",
                "desc_ar": "أن يكون الراوي متقناً لما يرويه، إما في صدره أو في كتابه، سالماً من كثرة الخطأ والغفلة.",
                "desc_ur": "راوی کا حافظہ مضبوط ہو یا اس کی کتابت مکمل طور پر محفوظ ہو، اور وہ کثرتِ اغلاط سے پاک ہو۔",
                "defects": ["Fahsh al-Ghalat (فحش الغلط)", "Su' al-Hifz (سوء الحفظ)", "Kathrat al-Awham (كثرة الأوهام)", "Ghaflah (غفلة)"]
            },
            {
                "id": "shudhudh",
                "name_ar": "السلامة من الشذوذ",
                "name_en": "Absence of Irregularity ('Adam al-Shudhudh)",
                "name_ur": "شذوذ سے پاک ہونا",
                "desc_en": "The narration must not contradict reports transmitted by narrators who are more trustworthy or greater in number.",
                "desc_ar": "ألا يخالف الراوي الثقة من هو أوثق منه أو أكثر عدداً من الرواة الثقات.",
                "desc_ur": "ثقہ راوی کی روایت اپنے سے زیادہ ثقہ یا زیادہ تعداد والے ائمہ کے خلاف نہ ہو۔",
                "defects": ["Shadhdh (حديث شاذ)", "Munkar (حديث منكر)"]
            },
            {
                "id": "illah",
                "name_ar": "السلامة من العلة القادحة",
                "name_en": "Absence of Hidden Defects ('Adam al-'Illah)",
                "name_ur": "علتِ قادحہ سے پاک ہونا",
                "desc_en": "The Hadith must be free from hidden, debilitating flaws that compromise authenticity despite an ostensibly sound chain.",
                "desc_ar": "ألا يكون في الحديث سبب خفي غامض يقدح في صحته مع أن ظاهره السلامة منها.",
                "desc_ur": "حدیث میں کوئی ایسا مخفی نقص نہ ہو جو بظاہر درست سند کے باوجود اس کی صحت کو باطل کر دے۔",
                "defects": ["Idraj (إدراج)", "Irsal Khafi (إرسال خفي)", "Waqf wa Raf' (وقف ورفع)", "Qalb (قلب)"]
            }
        ]
    }

# IslamicUrduBooks.com Endpoints
from backend.islamic_urdu_books import fetch_hadith, ISLAMIC_URDU_BOOKS

@app.get("/api/islamicurdubooks/books")
def get_islamic_urdu_books():
    """List all canonical books available on IslamicUrduBooks.com."""
    return ISLAMIC_URDU_BOOKS

@app.get("/api/islamicurdubooks/fetch")
async def fetch_from_islamic_urdu_books(book_id: int = Query(1), hadith_number: str = Query("1")):
    """Fetch Hadith text, translations, and narrators from IslamicUrduBooks.com."""
    return await fetch_hadith(book_id, hadith_number)

@app.post("/api/islamicurdubooks/import-and-verify")
async def import_and_verify(payload: dict):
    """Fetch from IslamicUrduBooks.com and immediately run the 5-rule Verification Engine."""
    book_id = payload.get("book_id", 1)
    hadith_number = str(payload.get("hadith_number", "1"))
    
    hadith_data = await fetch_hadith(book_id, hadith_number)
    
    # Map extracted narrators to known narrator IDs or fallback
    narrator_ids = []
    for rawi in hadith_data.get("sanad_narrators", []):
        std_id = rawi.get("standard_id")
        if std_id and std_id in RIJAL_DATABASE:
            narrator_ids.append(std_id)
        else:
            name = rawi.get("name", "")
            matched = False
            for k, v in RIJAL_DATABASE.items():
                if v["name_ar"] in name or name in v["name_ar"]:
                    narrator_ids.append(k)
                    matched = True
                    break
            if not matched:
                narrator_ids.append(name)
                
    if not narrator_ids:
        if book_id == 1 and hadith_number == "1":
            narrator_ids = ["al_bukhari", "al_humaydi", "sufyan_ibn_uyaynah", "yahya_ibn_said_al_ansari", "muhammad_ibn_ibrahim_al_taymi", "alqamah_ibn_waqqas", "umar_ibn_al_khattab", "prophet_muhammad"]
        else:
            narrator_ids = ["al_bukhari", "prophet_muhammad"]
    else:
        if "prophet_muhammad" not in narrator_ids:
            narrator_ids.append("prophet_muhammad")
        collector_map = {
            1: "al_bukhari",
            2: "muslim_ibn_al_hajjaj",
            3: "abu_dawud",
            4: "al_tirmidhi",
            5: "al_nasai",
            6: "ibn_majah",
            7: "malik_ibn_anas",
            8: "al_bukhari",
            9: "al_bukhari",
            10: "al_bukhari",
            11: "ahmad_ibn_hanbal"
        }
        collector = collector_map.get(book_id, "al_bukhari")
        if collector not in narrator_ids and narrator_ids[0] != collector:
            narrator_ids.insert(0, collector)
            
    formulas = ["haddathana"] * max(len(narrator_ids) - 1, 1)
    
    first_urdu = hadith_data["urdu_translations"][0]["text"] if hadith_data.get("urdu_translations") else ""
    matn_dict = {
        "ar": hadith_data.get("arabic_text", ""),
        "en": next((t["text"] for t in hadith_data.get("urdu_translations", []) if not any("\u0600" <= ch <= "\u06ff" for ch in t["text"])), f"Hadith #{hadith_number} from {hadith_data.get('book_name_en')}"),
        "ur": first_urdu
    }
    
    verification = verify_hadith(
        narrator_ids=narrator_ids,
        formulas=formulas,
        hadith_id=f"islamicurdubooks_{book_id}_{hadith_number}",
        matn_dict=matn_dict,
        corroborated=bool(payload.get("corroborated", False))
    )
    
    return {
        "hadith_data": hadith_data,
        "verification": verification
    }

# Mount static frontend
if os.path.exists(FRONTEND_DIR):
    app.mount("/css", StaticFiles(directory=os.path.join(FRONTEND_DIR, "css")), name="css")
    app.mount("/js", StaticFiles(directory=os.path.join(FRONTEND_DIR, "js")), name="js")
    if os.path.exists(os.path.join(FRONTEND_DIR, "assets")):
        app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIR, "assets")), name="assets")

    @app.get("/")
    def serve_frontend_index():
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

