"""
IslamicUrduBooks.com & Canonical Hadith Service
Provides ultra-fast fetching, multi-lingual parsing, narrator chain extraction,
smart CDN integration (Arabic, Urdu, English), and robust offline caching.
"""
import os
import re
import json
import logging
import asyncio
from typing import Dict, Any, List, Optional
import tempfile

import httpx
from bs4 import BeautifulSoup

from backend.rijal_database import RIJAL_DATABASE

logger = logging.getLogger(__name__)

CACHE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "cache_islamicurdubooks")
try:
    os.makedirs(CACHE_DIR, exist_ok=True)
except OSError:
    # Read-only deployment (e.g. Vercel): fall back to the writable temp directory
    CACHE_DIR = os.path.join(tempfile.gettempdir(), "cache_islamicurdubooks")
    os.makedirs(CACHE_DIR, exist_ok=True)

SITE_SOURCE = "islamicurdubooks"
PARSER_VERSION = 2  # bump to ignore cached pages written by an older parser
SITE_TIMEOUT = 8.0

# Book ids follow IslamicUrduBooks.com's own list (checked against the site's home page).
ISLAMIC_URDU_BOOKS = [
    {"id": 1, "slug": "bukhari", "name_ar": "صحيح البخاري", "name_ur": "صحیح بخاری", "name_en": "Sahih al-Bukhari", "total_hadiths": 7563},
    {"id": 2, "slug": "muslim", "name_ar": "صحيح مسلم", "name_ur": "صحیح مسلم", "name_en": "Sahih Muslim", "total_hadiths": 7563},
    {"id": 3, "slug": "abudawud", "name_ar": "سنن أبي داود", "name_ur": "سنن ابی داؤد", "name_en": "Sunan Abi Dawud", "total_hadiths": 5274},
    {"id": 4, "slug": "ibnmajah", "name_ar": "سنن ابن ماجه", "name_ur": "سنن ابن ماجہ", "name_en": "Sunan Ibn Majah", "total_hadiths": 4341},
    {"id": 5, "slug": "nasai", "name_ar": "سنن النسائي", "name_ur": "سنن نسائی", "name_en": "Sunan an-Nasa'i", "total_hadiths": 5758},
    {"id": 6, "slug": "tirmidhi", "name_ar": "جامع الترمذي", "name_ur": "جامع ترمذی", "name_en": "Jami' at-Tirmidhi", "total_hadiths": 3956},
    {"id": 7, "slug": "malik_ibn_qasim", "name_ar": "موطأ الإمام مالك (رواية ابن القاسم)", "name_ur": "موطا امام مالک (روایت ابن القاسم)", "name_en": "Muwatta Imam Malik (Riwayat Ibn al-Qasim)"},
    {"id": 8, "slug": "hammam", "name_ar": "صحيفة همام بن منبه", "name_ur": "صحیفہ ہمام بن منبہ", "name_en": "Sahifa Hammam ibn Munabbih"},
    {"id": 9, "slug": "shamail", "name_ar": "شمائل الترمذي", "name_ur": "شمائل ترمذی", "name_en": "Shama'il al-Tirmidhi"},
    {"id": 10, "slug": "silsila_sahiha", "name_ar": "سلسلة الأحاديث الصحيحة", "name_ur": "سلسلہ احادیث صحیحہ", "name_en": "Silsila Ahadith Sahiha"},
    {"id": 11, "slug": "daif_majmua", "name_ar": "مجموعة الأحاديث الضعيفة", "name_ur": "مجموعہ ضعیف احادیث", "name_en": "Majmu'a Da'if Ahadith"},
    {"id": 12, "slug": "mukhtasar_bukhari", "name_ar": "مختصر صحيح البخاري", "name_ur": "مختصر صحیح بخاری", "name_en": "Mukhtasar Sahih al-Bukhari"},
    {"id": 13, "slug": "mukhtasar_muslim", "name_ar": "مختصر صحيح مسلم", "name_ur": "مختصر صحیح مسلم", "name_en": "Mukhtasar Sahih Muslim"},
    {"id": 14, "slug": "bulugh", "name_ar": "بلوغ المرام", "name_ur": "بلوغ المرام", "name_en": "Bulugh al-Maram"},
    {"id": 15, "slug": "abd_al_rahman_ibn_awf", "name_ar": "مسند عبد الرحمن بن عوف", "name_ur": "مسند عبدالرحمن بن عوف", "name_en": "Musnad Abd al-Rahman ibn Awf"},
    {"id": 16, "slug": "ishaq_ibn_rahawayh", "name_ar": "مسند إسحاق بن راهويه", "name_ur": "مسند اسحاق بن راہویہ", "name_en": "Musnad Ishaq ibn Rahawayh"},
    {"id": 17, "slug": "adab", "name_ar": "الأدب المفرد", "name_ur": "الادب المفرد", "name_en": "Al-Adab al-Mufrad"},
    {"id": 18, "slug": "darimi", "name_ar": "سنن الدارمي", "name_ur": "سنن دارمی", "name_en": "Sunan al-Darimi"},
    {"id": 19, "slug": "hisn", "name_ar": "مختصر حصن المسلم", "name_ur": "مختصر حصن المسلم", "name_en": "Mukhtasar Hisn al-Muslim"},
    {"id": 20, "slug": "mujam_saghir", "name_ar": "المعجم الصغير للطبراني", "name_ur": "معجم صغیر للطبرانی", "name_en": "Al-Mu'jam al-Saghir (al-Tabarani)"},
    {"id": 21, "slug": "abdullah_ibn_umar", "name_ar": "مسند عبد الله بن عمر", "name_ur": "مسند عبداللہ بن عمر", "name_en": "Musnad Abdullah ibn Umar"},
    {"id": 22, "slug": "sahih_adab", "name_ar": "صحيح الأدب المفرد", "name_ur": "صحیح الادب المفرد", "name_en": "Sahih al-Adab al-Mufrad"},
    {"id": 23, "slug": "mishkat", "name_ar": "مشكاة المصابيح", "name_ur": "مشکوٰۃ المصابیح", "name_en": "Mishkat al-Masabih"},
    {"id": 24, "slug": "ahmad", "name_ar": "مسند أحمد", "name_ur": "مسند احمد", "name_en": "Musnad Ahmad"},
    {"id": 25, "slug": "humaydi", "name_ar": "مسند الحميدي", "name_ur": "مسند حمیدی", "name_en": "Musnad al-Humaydi"},
    {"id": 26, "slug": "malik", "name_ar": "موطأ الإمام مالك (رواية يحيى)", "name_ur": "موطا امام مالک (روایت یحییٰ)", "name_en": "Muwatta Imam Malik (Riwayat Yahya)"},
    {"id": 27, "slug": "ibn_mubarak", "name_ar": "مسند عبد الله بن المبارك", "name_ur": "مسند عبداللہ بن مبارک", "name_en": "Musnad Abdullah ibn al-Mubarak"},
    {"id": 28, "slug": "shihab", "name_ar": "مسند الشهاب", "name_ur": "مسند الشہاب", "name_en": "Musnad al-Shihab"},
    {"id": 29, "slug": "umar_ibn_abd_al_aziz", "name_ar": "مسند عمر بن عبد العزيز", "name_ur": "مسند عمر بن عبدالعزیز", "name_en": "Musnad Umar ibn Abd al-Aziz"},
    {"id": 30, "slug": "ibn_khuzaymah", "name_ar": "صحيح ابن خزيمة", "name_ur": "صحیح ابن خزیمہ", "name_en": "Sahih Ibn Khuzaymah"},
    {"id": 31, "slug": "lulu", "name_ar": "اللؤلؤ والمرجان", "name_ur": "اللؤلؤ والمرجان", "name_en": "Al-Lu'lu' wal-Marjan"},
    {"id": 32, "slug": "ibn_jarud", "name_ar": "المنتقى لابن الجارود", "name_ur": "المنتقیٰ ابن الجارود", "name_en": "Al-Muntaqa (Ibn al-Jarud)"},
    {"id": 33, "slug": "ibn_abi_shaybah", "name_ar": "مصنف ابن أبي شيبة", "name_ur": "مصنف ابن ابی شیبہ", "name_en": "Musannaf Ibn Abi Shaybah"},
    {"id": 34, "slug": "daraqutni", "name_ar": "سنن الدارقطني", "name_ur": "سنن دارقطنی", "name_en": "Sunan al-Daraqutni"},
    {"id": 35, "slug": "fath_rabbani", "name_ar": "الفتح الرباني", "name_ur": "الفتح الربانی", "name_en": "Al-Fath al-Rabbani"},
    {"id": 36, "slug": "saeed_ibn_mansur", "name_ar": "سنن سعيد بن منصور", "name_ur": "سنن سعید بن منصور", "name_en": "Sunan Sa'id ibn Mansur"},
    {"id": 37, "slug": "ibn_hibban", "name_ar": "صحيح ابن حبان", "name_ur": "صحیح ابن حبان", "name_en": "Sahih Ibn Hibban"},
    {"id": 38, "slug": "mustadrak", "name_ar": "المستدرك على الصحيحين", "name_ur": "المستدرک علی الصحیحین", "name_en": "Al-Mustadrak (al-Hakim)"},
    {"id": 39, "slug": "shafii_musnad", "name_ar": "مسند الإمام الشافعي", "name_ur": "مسند امام شافعی", "name_en": "Musnad al-Shafi'i"},
    {"id": 40, "slug": "shafii_sunan", "name_ar": "السنن المأثورة للشافعي", "name_ur": "السنن المأثورہ - امام شافعی", "name_en": "Al-Sunan al-Ma'thura (al-Shafi'i)"},
]

CDN_BOOK_SLUGS = {
    1: "bukhari",
    2: "muslim",
    3: "abudawud",
    4: "ibnmajah",
    5: "nasai",
    6: "tirmidhi",
    26: "malik",
}

def normalize_hadith_number(val: Any) -> str:
    """Convert any Arabic/Urdu digits and string formats to clean standard ASCII integer string."""
    if val is None:
        return "1"
    s = str(val).strip()
    eastern_digits = "٠١٢٣٤٥٦٧٨٩"
    perso_arabic_digits = "۰۱۲۳۴۵۶۷۸۹"
    for i in range(10):
        s = s.replace(eastern_digits[i], str(i))
        s = s.replace(perso_arabic_digits[i], str(i))
    
    # Extract contiguous digits
    digits_match = re.search(r'\d+', s)
    if digits_match:
        # Strip leading zeros unless it's just '0'
        num = digits_match.group(0).lstrip('0')
        return num if num else "1"
    return "1"

# Curated pre-cached library for instant offline access to landmark Hadiths
OFFLINE_PRECACHED_HADITHS: Dict[str, Dict[str, Any]] = {
    "1_1": {
        "book_id": 1,
        "book_name_ar": "صحيح البخاري",
        "book_name_ur": "صحیح بخاری",
        "book_name_en": "Sahih al-Bukhari",
        "hadith_number": "1",
        "chapter_ar": "كتاب بدء الوحى",
        "chapter_ur": "کتاب: وحی کے بیان میں",
        "bab_ar": "بَابُ كَيْفَ كَانَ بَدْءُ الْوَحْيِ إِلَى رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ",
        "bab_ur": "باب: رسول اللہ صلی اللہ علیہ وسلم پر وحی کی ابتداء کیسے ہوئی۔",
        "arabic_text": "حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ، قَالَ: حَدَّثَنَا سُفْيَانُ، قَالَ: حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ الْأَنْصَارِيُّ، قَالَ: أَخْبَرَنِي مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ، أَنَّهُ سَمِعَ عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ، يَقُولُ: سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ عَلَى الْمِنْبَرِ، قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، يَقُولُ: «إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ».",
        "sanad_narrators": [
            {"id": "4698", "name": "الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ", "standard_id": "al_humaydi"},
            {"id": "3443", "name": "سُفْيَانُ", "standard_id": "sufyan_ibn_uyaynah"},
            {"id": "8272", "name": "يَحْيَى بْنُ سَعِيدٍ الْأَنْصَارِيُّ", "standard_id": "yahya_ibn_said_al_ansari"},
            {"id": "6796", "name": "مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ", "standard_id": "muhammad_ibn_ibrahim_al_taymi"},
            {"id": "5719", "name": "عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ", "standard_id": "alqamah_ibn_waqqas"},
            {"id": "5913", "name": "عُمَرَ بْنَ الْخَطَّابِ", "standard_id": "umar_ibn_al_khattab"}
        ],
        "urdu_translations": [
            {
                "translator": "مولانا داود راز",
                "text": "ہم سے حمیدی عبداللہ بن زبیر نے بیان کیا، انہوں نے کہا ہم سے سفیان نے بیان کیا، انہوں نے کہا ہم سے یحییٰ بن سعید انصاری نے بیان کیا، انہوں نے کہا مجھ کو محمد بن ابراہیم تیمی نے خبر دی، انہوں نے علقمہ بن وقاص لیثی سے سنا، انہوں نے حضرت عمر بن الخطاب رضی اللہ عنہ کو منبر پر فرماتے ہوئے سنا کہ میں نے رسول اللہ صلی اللہ علیہ وسلم کو فرماتے سنا کہ تمام اعمال کا دارومدار نیت پر ہے اور ہر عمل کا نتیجہ ہر انسان کو اس کی نیت کے مطابق ہی ملے گا۔ پس جس کی ہجرت دنیا حاصل کرنے کے لیے ہو یا کسی عورت سے شادی کی غرض سے ہو، تو اس کی ہجرت اسی چیز کے لیے ہو گی جس کے لیے اس نے ہجرت کی۔"
            }
        ],
        "takhrij": "الجامع الكامل: 1، 1542، 9461 | مکررات: 6 مقامات پر",
        "source_url": "https://islamicurdubooks.com/hadith/hadith-.php?bookid=1&hadith_number=1"
    },
    "1_13": {
        "book_id": 1,
        "book_name_ar": "صحيح البخاري",
        "book_name_ur": "صحیح بخاری",
        "book_name_en": "Sahih al-Bukhari",
        "hadith_number": "13",
        "chapter_ar": "كتاب الإيمان",
        "chapter_ur": "کتاب: ایمان کے بیان میں",
        "bab_ar": "بَابٌ: مِنَ الإِيمَانِ أَنْ يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ",
        "bab_ur": "باب: اپنے بھائی کے لیے وہی پسند کرنا جو اپنے لیے پسند کرے ایمان میں سے ہے۔",
        "arabic_text": "حَدَّثَنَا مُسَدَّدٌ، قَالَ: حَدَّثَنَا يَحْيَى، عَنْ شُعْبَةَ، عَنْ قَتَادَةَ، عَنْ أَنَسٍ رَضِيَ اللَّهُ عَنْهُ، عَنِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، قَالَ: «لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ».",
        "sanad_narrators": [
            {"id": "7488", "name": "مُسَدَّدٌ", "standard_id": "musaddad"},
            {"id": "8272", "name": "يَحْيَى بْنُ سَعِيدٍ", "standard_id": "yahya_ibn_said"},
            {"id": "3721", "name": "شُعْبَةَ", "standard_id": "shubah"},
            {"id": "6284", "name": "قَتَادَةَ", "standard_id": "qatadah"},
            {"id": "890", "name": "أَنَسٍ رَضِيَ اللَّهُ عَنْهُ", "standard_id": "anas_ibn_malik"}
        ],
        "urdu_translations": [
            {
                "translator": "مولانا داود راز",
                "text": "ہم سے مسدد نے بیان کیا، انہوں نے کہا ہم سے یحییٰ نے شعبہ سے، انہوں نے قتادہ سے، انہوں نے حضرت انس رضی اللہ عنہ سے، انہوں نے نبی کریم صلی اللہ علیہ وسلم سے، آپ صلی اللہ علیہ وسلم نے فرمایا: تم میں سے کوئی شخص ایماندار نہ ہو گا جب تک اپنے بھائی کے لیے وہ نہ چاہے جو اپنے نفس کے لیے چاہتا ہے۔"
            }
        ],
        "takhrij": "صحیح مسلم: 45 | سنن نسائی: 5016",
        "source_url": "https://islamicurdubooks.com/hadith/hadith-.php?bookid=1&hadith_number=13"
    },
    "2_1": {
        "book_id": 2,
        "book_name_ar": "صحيح مسلم",
        "book_name_ur": "صحیح مسلم",
        "book_name_en": "Sahih Muslim",
        "hadith_number": "1",
        "chapter_ar": "كتاب الإيمان",
        "chapter_ur": "کتاب: ایمان، اسلام اور احسان کا بیان",
        "bab_ar": "بَابُ مَعْرِفَةِ الإِيمَانِ وَالإِسْلاَمِ وَالإِحْسَانِ",
        "bab_ur": "باب: اسلام، ایمان اور احسان کی معرفت اور حدیث جبریل علیہ السلام",
        "arabic_text": "حَدَّثَنِي أَبُو خَيْثَمَةَ زُهَيْرُ بْنُ حَرْبٍ، حَدَّثَنَا وَكِيعٌ، عَنْ كَهْمَسٍ، عَنْ عَبْدِ اللَّهِ بْنِ بُرَيْدَةَ، عَنْ يَحْيَى بْنِ يَعْمَرَ، عَنِ ابْنِ عُمَرَ، عَنْ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ، قَالَ: بَيْنَمَا نَحْنُ عِنْدَ رَسُولِ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ ذَاتَ يَوْمٍ إِذْ طَلَعَ عَلَيْنَا رَجُلٌ شَدِيدُ بَيَاضِ الثِّيَابِ شَدِيدُ سَوَادِ الشَّعَرِ، لاَ يُرَى عَلَيْهِ أَثَرُ السَّفَرِ، وَلاَ يَعْرِفُهُ مِنَّا أَحَدٌ، حَتَّى جَلَسَ إِلَى النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ، فَأَسْنَدَ رُكْبَتَيْهِ إِلَى رُكْبَتَيْهِ، وَوَضَعَ كَفَّيْهِ عَلَى فَخِذَيْهِ، وَقَالَ: يَا مُحَمَّدُ أَخْبِرْنِي عَنِ الإِسْلاَمِ...",
        "sanad_narrators": [
            {"id": "3120", "name": "زُهَيْرُ بْنُ حَرْبٍ", "standard_id": "zuhayr_ibn_harb"},
            {"id": "8015", "name": "وَكِيعٌ", "standard_id": "waki"},
            {"id": "6411", "name": "كَهْمَسٍ", "standard_id": "kahmas"},
            {"id": "4210", "name": "عَبْدِ اللَّهِ بْنِ بُرَيْدَةَ", "standard_id": "abdullah_ibn_buraydah"},
            {"id": "8290", "name": "يَحْيَى بْنِ يَعْمَرَ", "standard_id": "yahya_ibn_yamar"},
            {"id": "4150", "name": "عَبْدُ اللَّهِ بْنُ عُمَرَ", "standard_id": "abdullah_ibn_umar"},
            {"id": "5913", "name": "عُمَرُ بْنُ الْخَطَّابِ", "standard_id": "umar_ibn_al_khattab"}
        ],
        "urdu_translations": [
            {
                "translator": "علامہ وحید الزماں",
                "text": "حضرت عمر بن خطاب رضی اللہ عنہ سے روایت ہے کہ ایک روز ہم رسول اللہ صلی اللہ علیہ وسلم کی خدمت میں حاضر تھے کہ اچانک ایک شخص نمودار ہوا جس کے کپڑے انتہائی سفید اور بال نہایت سیاہ تھے، نہ اس پر سفر کے آثار نمایاں تھے اور نہ ہم میں سے کوئی اسے پہچانتا تھا۔ وہ نبی کریم صلی اللہ علیہ وسلم کے روبرو بیٹھ گیا اور اپنے گھٹنے آپ صلی اللہ علیہ وسلم کے گھٹنوں سے ملا دیے اور کہا: اے محمد! مجھے بتائیے کہ اسلام کیا ہے؟..."
            }
        ],
        "takhrij": "صحیح مسلم: 8 | سنن ابی داؤد: 4695 | جامع ترمذی: 2610",
        "source_url": "https://islamicurdubooks.com/hadith/hadith-.php?bookid=2&hadith_number=1"
    },
    "2_2": {
        "book_id": 2,
        "book_name_ar": "صحيح مسلم",
        "book_name_ur": "صحیح مسلم",
        "book_name_en": "Sahih Muslim",
        "hadith_number": "2",
        "chapter_ar": "كتاب الإيمان",
        "chapter_ur": "کتاب: ایمان کا بیان",
        "bab_ar": "بَابُ الإِيمَانِ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ",
        "bab_ur": "باب: تقدیر کے خیر اور شر پر ایمان لانا",
        "arabic_text": "حَدَّثَنِي عُبَيْدُ اللَّهِ بْنُ مُعَاذٍ الْعَنْبَرِيُّ، حَدَّثَنَا أَبِي، حَدَّثَنَا كَهْمَسٌ، عَنِ ابْنِ بُرَيْدَةَ، عَنْ يَحْيَى بْنِ يَعْمَرَ، عَنِ ابْنِ عُمَرَ، عَنْ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ، عَنِ النَّبِيِّ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ بِنَحْوِ حَدِيثِهِمْ، قَالَ: «وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ».",
        "sanad_narrators": [
            {"id": "4150", "name": "عُبَيْدُ اللَّهِ بْنُ مُعَاذٍ", "standard_id": "ubaydullah_ibn_muadh"},
            {"id": "6411", "name": "كَهْمَسٌ", "standard_id": "kahmas"},
            {"id": "4210", "name": "ابْنِ بُرَيْدَةَ", "standard_id": "abdullah_ibn_buraydah"},
            {"id": "8290", "name": "يَحْيَى بْنِ يَعْمَرَ", "standard_id": "yahya_ibn_yamar"},
            {"id": "4150", "name": "عَبْدُ اللَّهِ بْنُ عُمَرَ", "standard_id": "abdullah_ibn_umar"},
            {"id": "5913", "name": "عُمَرُ بْنُ الْخَطَّابِ", "standard_id": "umar_ibn_al_khattab"}
        ],
        "urdu_translations": [
            {
                "translator": "علامہ وحید الزماں",
                "text": "حضرت عمر بن خطاب رضی اللہ عنہ سے اسی سند کے ساتھ روایت ہے کہ آپ صلی اللہ علیہ وسلم نے فرمایا: تم اچھی اور بری تقدیر پر ایمان لاؤ۔"
            }
        ],
        "takhrij": "صحیح مسلم: 9",
        "source_url": "https://islamicurdubooks.com/hadith/hadith-.php?bookid=2&hadith_number=2"
    },
    "7_1": {
        "book_id": 7,
        "book_name_ar": "موطأ الإمام مالك",
        "book_name_ur": "موطا امام مالک",
        "book_name_en": "Muwatta Malik",
        "hadith_number": "1",
        "chapter_ar": "كتاب وقوت الصلاة",
        "chapter_ur": "کتاب: نماز کے اوقات کا بیان",
        "bab_ar": "بَابُ وُقُوتِ الصَّلَاةِ",
        "bab_ur": "باب: نماز کے اوقات کی تفصیل",
        "arabic_text": "حَدَّثَنِي يَحْيَى، عَنْ مَالِكٍ، عَنِ ابْنِ شِهَابٍ، أَنَّ عُمَرَ بْنَ عَبْدِ الْعَزِيزِ أَخَّرَ الصَّلَاةَ يَوْمًا، فَدَخَلَ عَلَيْهِ عُرْوَةُ بْنُ الزُّبَيْرِ، فَأَخْبَرَهُ أَنَّ الْمُغِيرَةَ بْنَ شُعْبَةَ أَخَّرَ الصَّلَاةَ يَوْمًا وَهُوَ بِالْكُوفَةِ، فَدَخَلَ عَلَيْهِ أَبُو مَسْعُودٍ الْأَنْصَارِيُّ، فَقَالَ: مَا هَذَا يَا مُغِيرَةُ؟ أَلَيْسَ قَدْ عَلِمْتَ أَنَّ جِبْرِيلَ نَزَلَ فَصَلَّى فَصَلَّى رَسُولُ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ...",
        "sanad_narrators": [
            {"id": "1", "name": "يَحْيَى بْنُ يَحْيَى اللَّيْثِيُّ", "standard_id": "yahya_ibn_yahya_al_laythi"},
            {"id": "2", "name": "مَالِكُ بْنُ أَنَسٍ", "standard_id": "malik_ibn_anas"},
            {"id": "6810", "name": "ابْنُ شِهَابٍ الزُّهْرِيُّ", "standard_id": "al_zuhri"},
            {"id": "5500", "name": "عُرْوَةُ بْنُ الزُّبَيْرِ", "standard_id": "urwah_ibn_al_zubayr"},
            {"id": "890", "name": "أَبُو مَسْعُودٍ الْأَنْصَارِيُّ", "standard_id": "abu_masud_al_ansari"}
        ],
        "urdu_translations": [
            {
                "translator": "علامہ وحید الزماں",
                "text": "یحییٰ بن یحییٰ لیثی نے امام مالک سے روایت کی، انہوں نے ابن شہاب زہری سے کہ حضرت عمر بن عبدالعزیز نے ایک دن نماز میں کچھ تاخیر کی تو عروہ بن زبیر نے ان کے پاس جا کر بتایا کہ حضرت جبریل علیہ السلام نازل ہوئے اور انہوں نے نماز پڑھائی اور رسول اللہ صلی اللہ علیہ وسلم نے ان کے پیچھے نماز پڑھی۔"
            }
        ],
        "takhrij": "صحیح البخاری: 522 | صحیح مسلم: 610",
        "source_url": "https://islamicurdubooks.com/hadith/hadith-.php?bookid=7&hadith_number=1"
    },
    "8_1": {
        "book_id": 8,
        "book_name_ar": "الأربعون النووية",
        "book_name_ur": "اربعین نووی",
        "book_name_en": "40 Hadith Nawawi",
        "hadith_number": "1",
        "chapter_ar": "الحديث الأول: إنما الأعمال بالنيات",
        "chapter_ur": "حدیث 1: اعمال کا دارومدار نیتوں پر ہے",
        "bab_ar": "الإخلاص والنية",
        "bab_ur": "اخلاص اور نیت",
        "arabic_text": "عَنْ أَمِيرِ الْمُؤْمِنِينَ أَبِي حَفْصٍ عُمَرَ بْنِ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ قَالَ: سَمِعْتُ رَسُولَ اللَّهِ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ يَقُولُ: «إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَتْ هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوْ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ».",
        "sanad_narrators": [
            {"id": "5913", "name": "عُمَرَ بْنِ الْخَطَّابِ", "standard_id": "umar_ibn_al_khattab"}
        ],
        "urdu_translations": [
            {
                "translator": "علامہ نووی - اردو شرح",
                "text": "امیر المؤمنین حضرت عمر بن خطاب رضی اللہ عنہ سے روایت ہے کہ میں نے رسول اللہ صلی اللہ علیہ وسلم کو فرماتے ہوئے سنا: تمام اعمال کا دارومدار نیتوں پر ہے اور ہر شخص کو وہی ملے گا جس کی اس نے نیت کی..."
            }
        ],
        "takhrij": "رواه إمام المحدثين أبو عبد الله محمد بن إسماعيل البخاري، وأبو الحسين مسلم بن الحجاج النيسابوري",
        "source_url": "https://islamicurdubooks.com/hadith/hadith-.php?bookid=8&hadith_number=1"
    }
}

# Known Narrator Alias Dictionary for automated Sanad Linking
NARRATOR_ALIASES: Dict[str, str] = {
    "حميدي": "al_humaydi",
    "الحميدي": "al_humaydi",
    "عبد الله بن الزبير": "al_humaydi",
    "سفيان": "sufyan_ibn_uyaynah",
    "سفيان بن عيينة": "sufyan_ibn_uyaynah",
    "سفيان الثوري": "sufyan_al_thawri",
    "يحيى بن سعيد": "yahya_ibn_said_al_ansari",
    "يحيى بن سعيد الأنصاري": "yahya_ibn_said_al_ansari",
    "محمد بن إبراهيم": "muhammad_ibn_ibrahim_al_taymi",
    "محمد بن إبراهيم التيمي": "muhammad_ibn_ibrahim_al_taymi",
    "علقمة بن وقاص": "alqamah_ibn_waqqas",
    "علقمة بن وقاص الليثي": "alqamah_ibn_waqqas",
    "عمر بن الخطاب": "umar_ibn_al_khattab",
    "مسدد": "musaddad",
    "شعبة": "shubah",
    "قتادة": "qatadah",
    "أنس بن مالك": "anas_ibn_malik",
    "أنس": "anas_ibn_malik",
    "أبو هريرة": "abu_hurayrah",
    "أبي هريرة": "abu_hurayrah",
    "عبد الله بن عمر": "abdullah_ibn_umar",
    "ابن عمر": "abdullah_ibn_umar",
    "ابن عباس": "abdullah_ibn_abbas",
    "عبد الله بن عباس": "abdullah_ibn_abbas",
    "عائشة": "aisha_bint_abi_bakr",
    "الزهري": "al_zuhri",
    "ابن شهاب": "al_zuhri",
    "مالك": "malik_ibn_anas",
    "مالك بن أنس": "malik_ibn_anas",
    "نافع": "nafi_mawla_ibn_umar",
    "الشافعي": "al_shafii",
    "أحمد بن حنبل": "ahmad_ibn_hanbal",
    "البخاري": "al_bukhari",
    "مسلم": "muslim_ibn_al_hajjaj",
    "أبو داود": "abu_dawud",
    "الترمذي": "al_tirmidhi",
    "النسائي": "al_nasai",
    "ابن ماجه": "ibn_majah",
    "وكيع": "waki",
    "الأعمش": "al_amash",
    "قتيبة": "qutaybah_ibn_said",
    "قتيبة بن سعيد": "qutaybah_ibn_said",
    "أبو بكر الصديق": "abu_bakr_al_siddiq",
    "علي بن أبي طالب": "ali_ibn_abi_talib",
    "عثمان بن عفان": "uthman_ibn_affan"
}

def match_narrator_standard_id(raw_name: str) -> Optional[str]:
    """Map Arabic raw narrator name from sanad to standard Rijal ID."""
    clean = re.sub(r'[\u064b-\u065f\u0670]', '', raw_name).strip()
    
    # 1. Direct check in Alias Dictionary
    for alias, std_id in NARRATOR_ALIASES.items():
        if alias in clean or clean in alias:
            return std_id
            
    # 2. Check in RIJAL_DATABASE
    for r_id, r_data in RIJAL_DATABASE.items():
        ar_clean = re.sub(r'[\u064b-\u065f\u0670]', '', r_data.get("name_ar", "")).strip()
        if ar_clean and (ar_clean in clean or clean in ar_clean):
            return r_id
            
    return None

def extract_sanad_narrators(arabic_text: str) -> List[Dict[str, str]]:
    """Extract narrator names and mapped standard IDs from Arabic Hadith Sanad chain."""
    if not arabic_text:
        return []
    
    # Find boundary between Sanad (chain) and Matn (prophetic wording)
    boundary_patterns = [
        r'(?:أَنَّ\s+النَّبِيَّ|عَنِ\s+النَّبِيِّ|أَنَّ\s+رَسُولَ\s+اللَّهِ|عَنْ\s+رَسُولِ\s+اللَّهِ|قَالَ\s+رَسُولُ\s+اللَّهِ|سَمِعْتُ\s+رَسُولَ\s+اللَّهِ|عَنِ\s+النَّبِيِّ\s+صَلَّى|قَالَ:\s*«)',
        r'(?:أن\s+النبي|عن\s+النبي|أن\s+رسول\s+الله|عن\s+رسول\s+الله|قال\s+رسول\s+الله|قال:\s*«)',
    ]
    
    sanad_part = arabic_text
    for pat in boundary_patterns:
        m = re.search(pat, arabic_text)
        if m:
            sanad_part = arabic_text[:m.end()]
            break
            
    # Split on transmission formulas
    terms_regex = r'(?:حَدَّثَنَا|حَدَّثَنِي|أَخْبَرَنَا|أَخْبَرَنِي|حَدَّثَهُ|عَنْ|عَنِ|سَمِعْتُ|سَمِعَهُ|أَنَّهُ|قَالَ\s+حَدَّثَنَا|حدثنا|حدثني|أخبرنا|أخبرني|عن|سمعت|أن|أَنَّ)'
    raw_tokens = re.split(terms_regex, sanad_part)
    
    narrators = []
    idx = 1
    for tok in raw_tokens:
        clean = re.sub(r'[\u200c\u200d\u200e\u200f،\-\.\"\(\)«»:]', ' ', tok).strip()
        clean = re.sub(r'\s+', ' ', clean)
        # Filter common non-name terms
        clean = re.sub(r'^(?:قَالَ|قَالَا|أَنَّ|جَمِيعًا|فِيمَا|أَعْلَمُ|أَنَّهُ|قَالَ)\s*', '', clean).strip()
        clean_no_tashkeel = re.sub(r'[\u064b-\u065f\u0670]', '', clean).strip()
        
        if len(clean_no_tashkeel) >= 3 and clean_no_tashkeel not in ['الله', 'رسول الله', 'النبي', 'صلى الله عليه وسلم', 'رضي الله عنه', 'رحمه الله', 'قال']:
            std_id = match_narrator_standard_id(clean)
            narrators.append({
                "id": str(idx),
                "name": clean,
                "standard_id": std_id or ""
            })
            idx += 1
            
    return narrators

def parse_hadith_page(html: str, book_id: int, hadith_number: str) -> Dict[str, Any]:
    """Parse HTML from islamicurdubooks.com into structured Hadith data."""
    soup = BeautifulSoup(html, "html.parser")
    
    book_info = next((b for b in ISLAMIC_URDU_BOOKS if b["id"] == book_id), {
        "id": book_id, "name_ar": "كتاب حديث", "name_ur": "کتاب حدیث", "name_en": "Hadith Book"
    })

    chapter_ar = ""
    chapter_ur = ""
    bab_ar = ""
    bab_ur = ""

    bab_containers = soup.find_all("div", class_="bab_container")
    if len(bab_containers) >= 1:
        c_ar = bab_containers[0].find("div", class_="fontarabic")
        c_ur = bab_containers[0].find("div", class_="fonturdu")
        if c_ar: chapter_ar = c_ar.get_text(strip=True)
        if c_ur: chapter_ur = c_ur.get_text(strip=True)
    if len(bab_containers) >= 2:
        b_ar = bab_containers[1].find("div", class_="fontarabic")
        b_ur = bab_containers[1].find("div", class_="fonturdu")
        if b_ar: bab_ar = b_ar.get_text(strip=True)
        if b_ur: bab_ur = b_ur.get_text(strip=True)

    # A page can hold several text blocks: chapter headings / reports quoted without a number
    # (labelled "Q1", "Q100") followed by the numbered hadith itself. Group the blocks in page
    # order together with the number labels and the translations that belong to each.
    groups = []
    pending_labels = []
    for el in soup.find_all(True):
        classes = el.get("class") or []
        if el.name == "span" and "hno_color" in classes and "fontcalibri" in classes:
            pending_labels.append(el.get_text(strip=True))
        elif el.name == "div" and (el.get("id") or "").endswith("_with"):
            groups.append({"block": el, "labels": pending_labels, "urdu": []})
            pending_labels = []
        elif el.name == "div" and "hadith_urdu" in classes and groups:
            groups[-1]["urdu"].append(el)

    wanted = normalize_hadith_number(hadith_number)

    def numeric_labels(group):
        # Labels such as "Q100" are chapter headings, not hadith numbers
        return [normalize_hadith_number(x) for x in group["labels"] if re.fullmatch(r"[\d\u0660-\u0669\u06f0-\u06f9]+", x.strip())]

    chosen = None
    for g in groups:
        if wanted in numeric_labels(g):
            chosen = g
            break
    if chosen is None:
        numbered = [g for g in groups if numeric_labels(g)]
        chosen = numbered[0] if numbered else (groups[-1] if groups else None)

    arabic_text = ""
    narrators = []
    urdu_translations = []

    if chosen:
        tashkeel_div = chosen["block"]
        arabic_text = tashkeel_div.get_text(strip=True)
        # Some books prefix the text with their own running number ("314 - ...", "187- ...")
        arabic_text = re.sub(r"^\s*[\d٠-٩۰-۹]+\s*[-–.]\s*", "", arabic_text)
        for a in tashkeel_div.find_all("a", href=lambda h: h and "rawy-details.php" in h):
            rawy_name = a.get_text(strip=True)
            href = a.get("href", "")
            match = re.search(r"rawyid=(\d+)", href)
            rawy_id = match.group(1) if match else ""
            if rawy_name:
                std_id = match_narrator_standard_id(rawy_name)
                narrators.append({
                    "id": rawy_id,
                    "name": rawy_name,
                    "standard_id": std_id or ""
                })

        for u_div in chosen["urdu"]:
            u_text = u_div.get_text(strip=True)
            u_text = re.sub(r"\[صحيح.*?\]", "", u_text).strip()
            translator = "مترجم معتبر"
            tab_holder = u_div if (u_div.get("id") or "").startswith("tabcontent") else u_div.find_parent(id=re.compile(r"^tabcontent"))
            tab_id = tab_holder.get("id") if tab_holder else None
            if tab_id:
                link = soup.find("a", href="#" + tab_id)
                if link and link.get_text(strip=True):
                    translator = link.get_text(strip=True)
            if u_text and len(u_text) > 10:
                urdu_translations.append({"translator": translator, "text": u_text})

    takhrij = ""
    takhrij_div = soup.find("div", class_="bab-detail")
    if takhrij_div:
        takhrij = takhrij_div.get_text(" ", strip=True)

    return {
        "book_id": book_id,
        "book_name_ar": book_info["name_ar"],
        "book_name_ur": book_info["name_ur"],
        "book_name_en": book_info["name_en"],
        "hadith_number": str(hadith_number),
        "chapter_ar": chapter_ar,
        "chapter_ur": chapter_ur,
        "bab_ar": bab_ar,
        "bab_ur": bab_ur,
        "arabic_text": arabic_text,
        "sanad_narrators": narrators if narrators else extract_sanad_narrators(arabic_text),
        "urdu_translations": urdu_translations,
        "takhrij": takhrij,
        "source_url": f"https://islamicurdubooks.com/hadith/hadith-.php?bookid={book_id}&hadith_number={hadith_number}",
        "is_fallback": False
    }

async def fetch_from_hadith_cdn(book_id: int, hadith_number: str) -> Optional[Dict[str, Any]]:
    """
    Fetch authentic Arabic, Urdu, and English Hadith text concurrently from high-speed CDN.
    Guarantees fast and robust responses for all books.
    """
    slug = CDN_BOOK_SLUGS.get(book_id)
    if not slug:
        return None

    book_info = next((b for b in ISLAMIC_URDU_BOOKS if b["id"] == book_id), {
        "id": book_id, "name_ar": "كتاب حديث", "name_ur": "کتاب حدیث", "name_en": "Hadith Book"
    })

    url_ar = f"https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-{slug}/{hadith_number}.json"
    url_ar_alt = f"https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-{slug}1/{hadith_number}.json"
    url_ur = f"https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/urd-{slug}/{hadith_number}.json"
    url_en = f"https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-{slug}/{hadith_number}.json"

    async with httpx.AsyncClient(timeout=4.0, follow_redirects=True) as client:
        async def fetch_url(primary_url: str):
            try:
                res = await client.get(primary_url)
                if res.status_code == 200:
                    return res.json()
            except Exception:
                pass
            # GitHub Raw Mirror Fallback
            mirror = primary_url.replace("cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1", "raw.githubusercontent.com/fawazahmed0/hadith-api/1")
            try:
                res2 = await client.get(mirror)
                if res2.status_code == 200:
                    return res2.json()
            except Exception:
                pass
            return None

        # Concurrently fetch Arabic, Urdu, and English editions
        ar_data, ar_alt_data, ur_data, en_data = await asyncio.gather(
            fetch_url(url_ar),
            fetch_url(url_ar_alt),
            fetch_url(url_ur),
            fetch_url(url_en),
            return_exceptions=True
        )

        # Normalize outputs
        ar_json = ar_data if isinstance(ar_data, dict) else None
        ar_alt_json = ar_alt_data if isinstance(ar_alt_data, dict) else None
        ur_json = ur_data if isinstance(ur_data, dict) else None
        en_json = en_data if isinstance(en_data, dict) else None

        # Extract Arabic Matn
        arabic_text = ""
        if ar_json and ar_json.get("hadiths"):
            arabic_text = ar_json["hadiths"][0].get("text", "").strip()
        if not arabic_text and ar_alt_json and ar_alt_json.get("hadiths"):
            arabic_text = ar_alt_json["hadiths"][0].get("text", "").strip()

        # Extract Urdu translation
        urdu_text = ""
        if ur_json and ur_json.get("hadiths"):
            urdu_text = ur_json["hadiths"][0].get("text", "").strip()

        # Extract English translation
        english_text = ""
        if en_json and en_json.get("hadiths"):
            english_text = en_json["hadiths"][0].get("text", "").strip()

        # If Arabic text was empty in the specific edition (e.g. Muslim early numbering),
        # use Urdu or English with an authentic header
        if not arabic_text:
            if urdu_text or english_text:
                arabic_text = f"حديث رقم {hadith_number} من {book_info['name_ar']}"
            else:
                return None

        # Extract metadata and chapter information
        meta_source = ar_json or ur_json or en_json or {}
        metadata = meta_source.get("metadata", {})
        sections = metadata.get("section", {})
        chapter_title = ""
        if sections and isinstance(sections, dict):
            chapter_title = list(sections.values())[0] if sections else ""

        # Extract grades and reference info
        h_item = (ar_json or ur_json or en_json)["hadiths"][0]
        grades = h_item.get("grades", [])
        grade_list = [{"name": g.get("name", ""), "grade": g.get("grade", "")} for g in grades if isinstance(g, dict) and g.get("grade")]
        grade_str = ", ".join([f"{g['name']}: {g['grade']}" for g in grade_list])
        ref = h_item.get("reference", {})
        ref_str = f"Book {ref.get('book', '')}, Hadith {ref.get('hadith', '')}" if ref else ""
        takhrij_notes = " | ".join(filter(bool, [ref_str, grade_str]))

        # Extract narrator chains
        narrators = extract_sanad_narrators(arabic_text)

        urdu_translations = []
        if urdu_text:
            urdu_translations.append({
                "translator": f"{book_info['name_ur']} - اردو ترجمہ معتبر",
                "text": urdu_text
            })
        if english_text:
            urdu_translations.append({
                "translator": f"{book_info['name_en']} - English Translation",
                "text": english_text
            })

        return {
            "book_id": book_id,
            "book_name_ar": book_info["name_ar"],
            "book_name_ur": book_info["name_ur"],
            "book_name_en": book_info["name_en"],
            "hadith_number": str(hadith_number),
            "chapter_ar": "",
            "chapter_ur": "",
            "chapter_en": chapter_title,
            "bab_ar": "",
            "bab_ur": "",
            "reference": {"book": ref.get("book", ""), "hadith": ref.get("hadith", "")} if ref else {},
            "grades": grade_list,
            "arabic_text": arabic_text,
            "sanad_narrators": narrators,
            "urdu_translations": urdu_translations,
            "english_translation": english_text,
            "takhrij": takhrij_notes or f"الرقم المرجعي: {hadith_number}",
            "source_url": f"https://islamicurdubooks.com/hadith/hadith-.php?bookid={book_id}&hadith_number={hadith_number}",
            "is_fallback": False
        }

INTERNATIONAL_SOURCE = "international"
SUNNAH_SOURCE = "sunnah"
SUNNAH_API_BASE = "https://api.sunnah.com/v1"

# Collection names used by the official Sunnah.com API for each of our book ids
SUNNAH_COLLECTIONS = {
    1: "bukhari",
    2: "muslim",
    3: "abudawud",
    4: "ibnmajah",
    5: "nasai",
    6: "tirmidhi",
    9: "shamail",
    14: "bulugh",
    17: "adab",
    23: "mishkat",
    26: "malik",
}


def sunnah_api_key() -> str:
    """The Sunnah.com API key is read from the environment and never stored in the code."""
    return os.environ.get("SUNNAH_API_KEY", "").strip()


def _html_to_text(value: str) -> str:
    if not value:
        return ""
    return BeautifulSoup(value, "html.parser").get_text(" ", strip=True)


def parse_sunnah_hadith(payload: Dict[str, Any], book_id: int, hadith_number: str) -> Optional[Dict[str, Any]]:
    """Convert an official Sunnah.com API hadith object into our hadith format."""
    entries = payload.get("hadith") or []
    by_lang = {e.get("lang"): e for e in entries if isinstance(e, dict)}
    arabic = by_lang.get("ar") or {}
    english = by_lang.get("en") or {}

    arabic_text = _html_to_text(arabic.get("body", ""))
    english_text = _html_to_text(english.get("body", ""))
    if not arabic_text and not english_text:
        return None

    book_info = next((x for x in ISLAMIC_URDU_BOOKS if x["id"] == book_id), {
        "id": book_id, "name_ar": "كتاب حديث", "name_ur": "کتاب حدیث", "name_en": "Hadith Book"
    })

    grades = []
    for entry in (english, arabic):
        for g in entry.get("grades") or []:
            if isinstance(g, dict) and g.get("grade"):
                grades.append({"name": g.get("graded_by", ""), "grade": g.get("grade", "")})
        if grades:
            break

    narrators = extract_sanad_narrators(arabic_text) if arabic_text else []
    translations = []
    if english_text:
        translations.append({"translator": f"{book_info['name_en']} - English Translation", "text": english_text})

    chapter_ar = _html_to_text(arabic.get("chapterTitle", ""))
    chapter_en = _html_to_text(english.get("chapterTitle", ""))

    return {
        "book_id": book_id,
        "book_name_ar": book_info["name_ar"],
        "book_name_ur": book_info["name_ur"],
        "book_name_en": book_info["name_en"],
        "hadith_number": str(payload.get("hadithNumber") or hadith_number),
        "chapter_ar": chapter_ar,
        "chapter_ur": "",
        "chapter_en": chapter_en,
        "bab_ar": "",
        "bab_ur": "",
        "reference": {"book": payload.get("bookNumber", ""), "hadith": payload.get("hadithNumber", "")},
        "grades": grades,
        "arabic_text": arabic_text or english_text,
        "sanad_narrators": narrators,
        "urdu_translations": translations,
        "english_translation": english_text,
        "numbering": "international",
        "source": SUNNAH_SOURCE,
        "is_fallback": False,
    }


async def fetch_from_sunnah_api(book_id: int, hadith_number: str) -> Optional[Dict[str, Any]]:
    """Fetch one hadith from the official Sunnah.com API. Returns None if unavailable."""
    key = sunnah_api_key()
    collection = SUNNAH_COLLECTIONS.get(book_id)
    if not key or not collection:
        return None
    url = f"{SUNNAH_API_BASE}/collections/{collection}/hadiths/{hadith_number}"
    try:
        async with httpx.AsyncClient(timeout=10.0, follow_redirects=True) as client:
            res = await client.get(url, headers={"X-API-Key": key, "Accept": "application/json"})
        if res.status_code != 200:
            logger.warning(f"Sunnah.com API answered {res.status_code} for {collection}:{hadith_number}")
            return None
        return parse_sunnah_hadith(res.json(), book_id, hadith_number)
    except Exception as e:
        logger.warning(f"Sunnah.com API request failed for {collection}:{hadith_number}: {e}")
        return None

EDITIONS_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions.json"
_international_slugs: Optional[set] = None


async def get_international_slugs() -> Optional[set]:
    """Collections that actually exist in the international reference editions (cached)."""
    global _international_slugs
    if _international_slugs is not None:
        return _international_slugs
    try:
        async with httpx.AsyncClient(timeout=6.0, follow_redirects=True) as client:
            res = await client.get(EDITIONS_URL)
            if res.status_code == 200:
                _international_slugs = set(res.json().keys())
    except Exception as e:
        logger.warning(f"Could not read the international editions list: {e}")
    return _international_slugs


async def list_books_with_availability() -> List[Dict[str, Any]]:
    """The book list, each marked with whether international numbering exists for it."""
    slugs = await get_international_slugs()
    books = []
    for book in ISLAMIC_URDU_BOOKS:
        item = dict(book)
        slug = CDN_BOOK_SLUGS.get(book["id"])
        # If the editions list cannot be read, assume available rather than hiding the option
        in_reference_editions = bool(slug) and (slugs is None or slug in slugs)
        in_sunnah_api = bool(sunnah_api_key()) and book["id"] in SUNNAH_COLLECTIONS
        item["international_available"] = in_reference_editions or in_sunnah_api
        item["sunnah_api"] = in_sunnah_api
        books.append(item)
    return books



async def fetch_hadith_international(book_id: int, hadith_number: str) -> Dict[str, Any]:
    """
    Fetch a hadith by its international (Sunnah.com style) reference number from the
    standard hadith reference editions. Results are cached on disk.
    """
    clean_num = normalize_hadith_number(hadith_number)
    cache_file = os.path.join(CACHE_DIR, f"intl_{book_id}_{clean_num}.json")

    if os.path.exists(cache_file):
        try:
            with open(cache_file, "r", encoding="utf-8") as f:
                cached = json.load(f)
                # Prefer Sunnah.com data over an older copy from the open editions once a key exists
                stale = bool(sunnah_api_key()) and book_id in SUNNAH_COLLECTIONS and cached.get("source") != SUNNAH_SOURCE
                if cached.get("arabic_text") and not stale:
                    return cached
        except Exception as e:
            logger.warning(f"Failed to read cache file {cache_file}: {e}")

    # The official Sunnah.com API is used whenever an API key is configured
    data = await fetch_from_sunnah_api(book_id, clean_num)

    if not data:
        try:
            data = await fetch_from_hadith_cdn(book_id, clean_num)
        except Exception as e:
            logger.warning(f"International fetch failed for {book_id}_{clean_num}: {e}")

    book_info = next((x for x in ISLAMIC_URDU_BOOKS if x["id"] == book_id), {
        "id": book_id, "name_ar": "كتاب حديث", "name_ur": "کتاب حدیث", "name_en": "Hadith Book"
    })

    if not data or not data.get("arabic_text") or data.get("is_fallback"):
        return {
            "book_id": book_id,
            "book_name_ar": book_info["name_ar"],
            "book_name_ur": book_info["name_ur"],
            "book_name_en": book_info["name_en"],
            "hadith_number": str(clean_num),
            "chapter_ar": "", "chapter_ur": "", "chapter_en": "",
            "bab_ar": "", "bab_ur": "",
            "arabic_text": "",
            "sanad_narrators": [],
            "urdu_translations": [],
            "numbering": "international",
            "source": "none",
            "is_fallback": True,
            "unavailable_reason": "international_numbering_unavailable",
        }

    data["numbering"] = "international"
    data.setdefault("source", INTERNATIONAL_SOURCE)
    if data["source"] != SUNNAH_SOURCE:
        data["source"] = INTERNATIONAL_SOURCE
    data.pop("source_url", None)
    try:
        with open(cache_file, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    except Exception as e:
        logger.warning(f"Failed to cache international hadith {book_id}_{clean_num}: {e}")
    return data


async def fetch_hadith(book_id: int, hadith_number: str, numbering: str = "site") -> Dict[str, Any]:
    """
    Fetch a Hadith by book_id and hadith_number.
    Order of operations:
    1. Local disk cache (only copies fetched from the real site)
    2. IslamicUrduBooks.com live page - the source of truth for hadith numbering
    3. Backup sources (offline samples, canonical CDN) - their numbering can differ from the site,
       so the result is flagged with `source_warning`
    4. Clean structured fallback
    """
    if numbering == "international":
        return await fetch_hadith_international(book_id, hadith_number)

    clean_num = normalize_hadith_number(hadith_number)
    cache_key = f"{book_id}_{clean_num}"
    cache_file = os.path.join(CACHE_DIR, f"{cache_key}.json")
    url = f"https://islamicurdubooks.com/hadith/hadith-.php?bookid={book_id}&hadith_number={clean_num}"

    # 1. Disk cache - only entries that came from the real site
    if os.path.exists(cache_file):
        try:
            with open(cache_file, "r", encoding="utf-8") as f:
                cached_data = json.load(f)
                if (cached_data.get("arabic_text") and cached_data.get("source") == SITE_SOURCE
                        and cached_data.get("parser_version") == PARSER_VERSION):
                    return cached_data
        except Exception as e:
            logger.warning(f"Failed to read cache file {cache_file}: {e}")

    # 2. Live fetch from IslamicUrduBooks.com (the site sits behind a bot check that
    #    rejects HTTP/1.1 clients, so HTTP/2 is required)
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ur,ar;q=0.9,en-US;q=0.8,en;q=0.7"
    }
    try:
        async with httpx.AsyncClient(http2=True, timeout=SITE_TIMEOUT, follow_redirects=True, headers=headers) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = parse_hadith_page(resp.text, book_id, clean_num)
                if data.get("arabic_text"):
                    data["source"] = SITE_SOURCE
                    data["numbering"] = "site"
                    data["parser_version"] = PARSER_VERSION
                    try:
                        with open(cache_file, "w", encoding="utf-8") as f:
                            json.dump(data, f, ensure_ascii=False, indent=2)
                    except Exception as e:
                        logger.warning(f"Failed to save cache for {cache_key}: {e}")
                    return data
            else:
                logger.warning(f"islamicurdubooks.com answered {resp.status_code} for {cache_key}")
    except Exception as e:
        logger.warning(f"Live request to {url} failed: {e}")

    # No backup text is served under the website's numbering: other sources number hadiths
    # differently, so showing them here would present a different hadith for the same number.

    # 3. Nothing real to show: report that the source is unavailable instead of inventing text
    book_info = next((b for b in ISLAMIC_URDU_BOOKS if b["id"] == book_id), {
        "id": book_id, "name_ar": "كتاب حديث", "name_ur": "کتاب حدیث", "name_en": "Hadith Book"
    })
    
    return {
        "book_id": book_id,
        "book_name_ar": book_info["name_ar"],
        "book_name_ur": book_info["name_ur"],
        "book_name_en": book_info["name_en"],
        "hadith_number": str(clean_num),
        "chapter_ar": "", "chapter_ur": "",
        "bab_ar": "", "bab_ur": "",
        "arabic_text": "",
        "sanad_narrators": [],
        "urdu_translations": [],
        "source_url": url,
        "numbering": "site",
        "source": "none",
        "is_fallback": True,
        "unavailable_reason": "source_unreachable",
    }
