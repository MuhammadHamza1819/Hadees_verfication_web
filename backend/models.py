"""
Pydantic Models for Hadith Verification Web Application
"""
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ScholarQuote(BaseModel):
    scholar: str
    quote: str
    ruling: str

class NarratorBio(BaseModel):
    id: str
    name_ar: str
    name_en: str
    name_ur: str
    generation: str  # Sahabi, Kibar al-Tabi'in, Wusta al-Tabi'in, Sughra al-Tabi'in, Atba' al-Tabi'in, etc.
    death_hijri: Optional[int] = None
    city: Optional[str] = None
    reliability_tier: str  # thiqah_hafiz, thiqah, saduq, saduq_yahim, maqbul, daif, matruk, kadhdhab
    integrity_score: int  # 0 to 100 ('Adalah)
    memory_score: int  # 0 to 100 (Dabt)
    is_mudallis: bool = False
    mudallis_tier: Optional[int] = 0  # 1 to 5 (Ibn Hajar's Tabaqat)
    notes_en: str
    notes_ar: str
    notes_ur: str
    scholar_quotes: List[ScholarQuote] = []

class TransmissionLink(BaseModel):
    from_narrator: str
    to_narrator: str
    formula: str  # "sami'tu", "haddathana", "akhbarana", "anba'ana", "an", "qala"
    explicit_audition: bool

class RuleAuditItem(BaseModel):
    rule_id: str  # ittisal, adalah, dabt, shudhudh, illah
    rule_name_ar: str
    rule_name_en: str
    rule_name_ur: str
    status: str  # PASS, WARNING, FAIL
    score: int  # 0 to 100
    title_en: str
    title_ar: str
    title_ur: str
    details_en: List[str]
    details_ar: List[str]
    details_ur: List[str]
    classical_rule: str
    scholar_reference: str

class VerificationRequest(BaseModel):
    hadith_id: Optional[str] = None
    hadith_text: Optional[str] = None
    chain_narrators: Optional[List[str]] = None
    chain_formulas: Optional[List[str]] = None
    matn_text: Optional[str] = None
    corroborated: Optional[bool] = None
    language: Optional[str] = "en"

class VerificationResponse(BaseModel):
    grade: str = ""  # SAHIH_LI_DHATIHI, SAHIH_LI_GHAYRIHI, HASAN_LI_DHATIHI, HASAN_LI_GHAYRIHI, DAIF, MAWDU
    badge_class: str = "sahih"
    corroborated: bool = False
    verdict: str
    verdict_ar: str
    verdict_ur: str
    sub_verdict_en: str
    sub_verdict_ar: str
    sub_verdict_ur: str
    overall_score: int
    rule_audits: List[RuleAuditItem]
    chain_nodes: List[Dict[str, Any]]
    chain_edges: List[Dict[str, Any]]
    matn: Dict[str, str]
    summary_en: str
    summary_ar: str
    summary_ur: str
    canonical_sources: List[str]
    classical_verdicts: List[Dict[str, str]]

class HadithCorpusItem(BaseModel):
    id: str
    title_en: str
    title_ar: str
    title_ur: str
    book: str
    hadith_number: Optional[str] = None
    chapter_ar: str
    chapter_en: str
    chapter_ur: str
    sanad_ar: str
    sanad_en: str
    sanad_ur: str
    matn_ar: str
    matn_en: str
    matn_ur: str
    narrator_ids: List[str]
    transmission_formulas: List[str]
    known_verdict: str  # SAHIH_LI_DHATIHI, SAHIH_LI_GHAYRIHI, HASAN_LI_DHATIHI, HASAN_LI_GHAYRIHI, DAIF, MAWDU
    corroborated: bool = False
    known_sub_verdict: str
    ruling_summary_en: str
    ruling_summary_ar: str
    ruling_summary_ur: str
    classical_scholars: List[Dict[str, str]]
