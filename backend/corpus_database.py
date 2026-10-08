"""
Corpus Database of Representative Hadiths across All Authenticity Categories.
Each entry contains full Arabic text, English translation, Urdu translation,
full chain structure, narrator sequence, and classical scholars' gradings.
"""
from typing import Dict, Any

CORPUS_DATABASE: Dict[str, Dict[str, Any]] = {
    "hadith_niyyah": {
        "id": "hadith_niyyah",
        "title_en": "Hadith of Intentions (Innama al-A'malu bin-Niyyat)",
        "title_ar": "حديث الأعمال بالنيات",
        "title_ur": "حدیث نیت (اعمال کا دارومدار نیتوں پر ہے)",
        "book": "Sahih al-Bukhari & Sahih Muslim",
        "hadith_number": "Bukhari #1 / Muslim #1907",
        "chapter_ar": "كتاب بدء الوحي - باب كيف كان بدء الوحي",
        "chapter_en": "Book of Revelation - Chapter 1",
        "chapter_ur": "کتاب آغاز وحی",
        "sanad_ar": "حَدَّثَنَا الْحُمَيْدِيُّ عَبْدُ اللَّهِ بْنُ الزُّبَيْرِ، قَالَ: حَدَّثَنَا سُفْيَانُ، قَالَ: حَدَّثَنَا يَحْيَى بْنُ سَعِيدٍ الأَنْصَارِيُّ، قَالَ: أَخْبَرَنِي مُحَمَّدُ بْنُ إِبْرَاهِيمَ التَّيْمِيُّ، أَنَّهُ سَمِعَ عَلْقَمَةَ بْنَ وَقَّاصٍ اللَّيْثِيَّ، يَقُولُ: سَمِعْتُ عُمَرَ بْنَ الْخَطَّابِ رَضِيَ اللَّهُ عَنْهُ عَلَى الْمِنْبَرِ يَقُولُ: سَمِعْتُ رَسُولَ اللَّهِ ﷺ",
        "sanad_en": "Al-Humaydi told us from Sufyan from Yahya ibn Sa'id al-Ansari from Muhammad ibn Ibrahim al-Taymi from Alqamah ibn Waqqas al-Laythi from Umar ibn al-Khattab from the Messenger of Allah ﷺ.",
        "sanad_ur": "ہم سے حمیدی عبداللہ بن زبیر نے بیان کیا، انہوں نے کہا ہم سے سفیان نے بیان کیا، انہوں نے کہا ہم سے یحییٰ بن سعید انصاری نے بیان کیا، انہوں نے کہا مجھے محمد بن ابراہیم تیمی نے خبر دی، انہوں نے علقمہ بن وقاص لیثی سے سنا، انہوں نے حضرت عمر بن الخطاب رضی اللہ عنہ کو منبر پر فرماتے ہوئے سنا کہ میں نے رسول اللہ ﷺ کو فرماتے سنا۔",
        "matn_ar": "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى دُنْيَا يُصِيبُهَا أَوْ إِلَى امْرَأَةٍ يَنْكِحُهَا، فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.",
        "matn_en": "Actions are but by intentions, and every man shall have only that which he intended. Thus he whose migration was for the world or for a woman he might marry, his migration was for that which he migrated.",
        "matn_ur": "اعمال کا دارومدار نیتوں پر ہے اور ہر انسان کے لیے وہی ہے جس کی اس نے نیت کی۔ پس جس کی ہجرت دنیا کے لیے ہو جو وہ حاصل کرنا چاہے، یا کسی عورت کے لیے جس سے وہ نکاح کرنا چاہے، تو اس کی ہجرت اسی کے لیے ہے جس کی طرف اس نے ہجرت کی۔",
        "narrator_ids": [
            "al_bukhari",
            "al_humaydi",
            "sufyan_ibn_uyaynah",
            "yahya_ibn_said_al_ansari",
            "muhammad_ibn_ibrahim_al_taymi",
            "alqamah_ibn_waqqas",
            "umar_ibn_al_khattab",
            "prophet_muhammad"
        ],
        "transmission_formulas": [
            "haddathana",
            "haddathana",
            "haddathana",
            "akhbarana",
            "sami'tu",
            "sami'tu",
            "sami'tu"
        ],
        "known_verdict": "SAHIH_LI_DHATIHI",
        "corroborated": False,
        "known_sub_verdict": "Sahih li-dhatihi (Muttafaq 'Alayh)",
        "ruling_summary_en": "Meets all five conditions of authenticity unconditionally. Unbroken chain of eminent trustworthy memorizers with explicit direct audition terms ('sami'tu', 'haddathana').",
        "ruling_summary_ar": "مستوفٍ لشروط الصحة الخمسة بالإجماع: اتصال سليم، رواة ثقات أثبات، ضبط تام، خلو تام من الشذوذ والعلة القادحة.",
        "ruling_summary_ur": "صحت کی پانچوں شرائط پر مکمل اترتی ہے۔ متصل سند، اعلیٰ درجے کے ثقہ روات، کامل حفظ اور شذوذ و علت سے پاک۔",
        "classical_scholars": [
            {"scholar": "Imam al-Bukhari", "verdict": "Sahih (Placed at the opening of Sahih al-Bukhari)"},
            {"scholar": "Imam Muslim", "verdict": "Sahih (Authentic)"},
            {"scholar": "Al-Shafi'i", "verdict": "This Hadith constitutes one third of all Islamic knowledge."}
        ]
    },
    "hadith_golden_chain": {
        "id": "hadith_golden_chain",
        "title_en": "The Golden Chain (Silsilat al-Dhahab) - Brotherly Love",
        "title_ar": "سلسلة الذهب: حديث محبة الخير للأخ المسلم",
        "title_ur": "سلسلۃ الذہب: مسلمان بھائی کے لیے خیر خواہی کی حدیث",
        "book": "Al-Muwatta & Sahih al-Bukhari",
        "hadith_number": "Bukhari #13 / Muslim #45",
        "chapter_ar": "كتاب الإيمان - باب من الإيمان أن يحب لأخيه ما يحب لنفسه",
        "chapter_en": "Book of Faith - Chapter on Loving for One's Brother",
        "chapter_ur": "کتاب الایمان - اپنے بھائی کے لیے پسند کرنے کا بیان",
        "sanad_ar": "رَوَاهُ مَالِكٌ، عَنْ نَافِعٍ، عَنْ عَبْدِ اللَّهِ بْنِ عُمَرَ، عَنِ النَّبِيِّ ﷺ",
        "sanad_en": "Narrated by Malik, from Nafi', from Abdullah ibn Umar, from the Prophet ﷺ.",
        "sanad_ur": "امام مالک نے نافع سے، انہوں نے عبداللہ بن عمر سے، انہوں نے نبی کریم ﷺ سے روایت کیا۔",
        "matn_ar": "لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ مِنَ الْخَيْرِ.",
        "matn_en": "None of you truly believes until he loves for his brother what he loves for himself of good.",
        "matn_ur": "تم میں سے کوئی شخص اس وقت تک کامل مومن نہیں ہو سکتا جب تک وہ اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے پسند کرتا ہے۔",
        "narrator_ids": [
            "al_bukhari",
            "malik_ibn_anas",
            "nafi_mawla_ibn_umar",
            "abdullah_ibn_umar",
            "prophet_muhammad"
        ],
        "transmission_formulas": [
            "haddathana",
            "an",
            "an",
            "an"
        ],
        "known_verdict": "SAHIH_LI_DHATIHI",
        "corroborated": False,
        "known_sub_verdict": "Sahih li-dhatihi (Golden Chain / Silsilat al-Dhahab)",
        "ruling_summary_en": "The pinnacle of Isnads in Hadith literature: Imam Malik from Nafi' from Ibn Umar. Fully authentic and sound.",
        "ruling_summary_ar": "أصح الأسانيد قاطبة كما نص عليه البخاري والنسائي (مالك عن نافع عن ابن عمر).",
        "ruling_summary_ur": "محدثین کے نزدیک سب سے معتبر ترین سند (سلسلہ الذہب)۔ مکمل طور پر صحیح لذاتہ۔",
        "classical_scholars": [
            {"scholar": "Imam al-Bukhari", "verdict": "Asahh al-Asanid (The soundest chain of all)"},
            {"scholar": "Al-Nawawi", "verdict": "Sahih Muttafaq 'Alayh"}
        ]
    },
    "hadith_talab_ilm": {
        "id": "hadith_talab_ilm",
        "title_en": "Seeking Knowledge is an Obligation (Talab al-Ilm Faridah)",
        "title_ar": "حديث طلب العلم فريضة على كل مسلم",
        "title_ur": "حدیث طلبِ علم (علم حاصل کرنا ہر مسلمان پر فرض ہے)",
        "book": "Sunan Ibn Majah & Sunan al-Bayhaqi",
        "hadith_number": "Ibn Majah #224",
        "chapter_ar": "المقدمة - باب فضل العلماء والحث على طلب العلم",
        "chapter_en": "Introduction - Chapter on Virtue of Scholars",
        "chapter_ur": "مقدمہ سنن ابن ماجہ - فضیلت علم",
        "sanad_ar": "رُوِيَ مِنْ طُرُقٍ عَنْ أَنَسِ بْنِ مَالِكٍ وَابْنِ عُمَرَ وَابْنِ عَبَّاسٍ، مِنْهَا طَرِيقُ ابْنِ بُرَيْدَةَ عَنْ أَبِيهِ",
        "sanad_en": "Narrated through multiple pathways from Anas ibn Malik, Ibn Umar, and Ibn Abbas.",
        "sanad_ur": "حضرت انس بن مالک اور متعدد صحابہ سے مختلف سندوں کے ساتھ مروی ہے۔",
        "matn_ar": "طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ.",
        "matn_en": "Seeking knowledge is an obligation upon every Muslim.",
        "matn_ur": "علم دین حاصل کرنا ہر مسلمان پر فرض ہے۔",
        "narrator_ids": [
            "al_tirmidhi",
            "al_zuhri",
            "anas_ibn_malik",
            "prophet_muhammad"
        ],
        "transmission_formulas": [
            "haddathana",
            "an",
            "an"
        ],
        "known_verdict": "HASAN_LI_GHAYRIHI",
        "corroborated": True,
        "known_sub_verdict": "Hasan li-ghayrihi (Strengthened through multiple routes)",
        "ruling_summary_en": "Individually, each individual single chain contains minor weakness in retentive memory, but when combined across its multiple independent routes (Turuq and Shawahid), it ascends to Hasan li-ghayrihi (Sound through corroboration).",
        "ruling_summary_ar": "حسن لغيره؛ طرقه مفردة لا تخلو من مقال لكنها تتقوى باجتماع الشواهد المتعددة كما قرره المزي والذهبي والألباني.",
        "ruling_summary_ur": "حسن لغیرہ؛ انفرادی طور پر اسناد میں معمولی ضعف ہے مگر متعدد شواہد و طرق کی وجہ سے یہ حسن کے درجے تک پہنچ جاتی ہے۔",
        "classical_scholars": [
            {"scholar": "Al-Mizzi", "verdict": "Has several routes that strengthen each other."},
            {"scholar": "Al-Albani", "verdict": "Hasan Sahih li-ghayrihi (Sahih al-Jami' #3913)"},
            {"scholar": "Al-Suyuti", "verdict": "Sahih through corroboration (Mutawatir al-Ma'na)"}
        ]
    },
    "hadith_seek_china": {
        "id": "hadith_seek_china",
        "title_en": "Seek Knowledge Even Unto China (Utlubul-Ilma wa law bis-Sin)",
        "title_ar": "حديث: اطلبوا العلم ولو بالصين",
        "title_ur": "روایت: علم حاصل کرو خواہ چین جانا پڑے",
        "book": "Al-Uqayli (Al-Du'afa) & Ibn Abd al-Barr",
        "hadith_number": "Ibn Adi in Al-Kamil",
        "chapter_ar": "كتاب الضعفاء والمتروكين",
        "chapter_en": "Compilations of Weak & Discarded Reports",
        "chapter_ur": "ضعیف اور متروک روایات کا مجموعہ",
        "sanad_ar": "رَوَاهُ أَبُو عَاتِكَةَ طَرِيفُ بْنُ سَلْمَانَ، عَنْ أَنَسِ بْنِ مَالِكٍ رَضِيَ اللَّهُ عَنْهُ، عَنِ النَّبِيِّ ﷺ",
        "sanad_en": "Narrated by Abu Atikah Tarif ibn Salman from Anas ibn Malik from the Prophet ﷺ.",
        "sanad_ur": "اسے ابو عاتکہ طریف بن سلمان نے حضرت انس بن مالک سے، انہوں نے نبی کریم ﷺ سے روایت کیا۔",
        "matn_ar": "اطْلُبُوا الْعِلْمَ وَلَوْ بِالصِّينِ، فَإِنَّ طَلَبَ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ.",
        "matn_en": "Seek knowledge even if it be in China, for the seeking of knowledge is an obligation upon every Muslim.",
        "matn_ur": "علم حاصل کرو خواہ تمہیں چین جانا پڑے، کیونکہ علم حاصل کرنا ہر مسلمان پر فرض ہے۔",
        "narrator_ids": [
            "abu_atikah",
            "anas_ibn_malik",
            "prophet_muhammad"
        ],
        "transmission_formulas": [
            "an",
            "an"
        ],
        "known_verdict": "DAIF",
        "corroborated": False,
        "known_sub_verdict": "Da'if Jiddan / Batil (Severely Weak / Void Chain)",
        "ruling_summary_en": "Fails the rule of 'Adalah and Dabt due to the presence of Abu Atikah Tarif ibn Salman, who was abandoned (Matruk) and accused of fabricating reports. The phrase 'even unto China' is deemed baseless.",
        "ruling_summary_ar": "ضعيف جداً أو باطل السند؛ مداره على أبي عاتكة طريف بن سلمان وهو متروك الحديث ومنكر الرواية، لا يصح عنه.",
        "ruling_summary_ur": "شدید ضعیف یا باطل؛ اس کی سند کا دارومدار ابو عاتکہ طریف بن سلمان پر ہے جو تمام ائمہ کے نزدیک متروک اور ناقابل اعتبار ہے۔",
        "classical_scholars": [
            {"scholar": "Ibn Hibban", "verdict": "Batil (Void, no origin)"},
            {"scholar": "Ibn al-Jawzi", "verdict": "Mawdu' (Included in Al-Mawdu'at)"},
            {"scholar": "Al-Dhahabi", "verdict": "Abu Atikah is discarded and weak."},
            {"scholar": "Al-Albani", "verdict": "Batil / Da'if Jiddan (Da'if al-Jami' #906)"}
        ]
    },
    "hadith_hubb_al_watan": {
        "id": "hadith_hubb_al_watan",
        "title_en": "Love of the Homeland is Part of Faith (Hubb al-Watan min al-Iman)",
        "title_ar": "حديث: حب الوطن من الإيمان",
        "title_ur": "روایت: وطن کی محبت ایمان کا حصہ ہے",
        "book": "Popular Saying / Books of Fabrications (Al-Mawdu'at)",
        "hadith_number": "Al-Sakhawi in Al-Maqasid al-Hasanah #386",
        "chapter_ar": "أحاديث مشتهرة لا أصل لها في السنة",
        "chapter_en": "Famous Sayings with No Chain of Transmission",
        "chapter_ur": "مشہور اقوال جن کی کوئی سند موجود نہیں",
        "sanad_ar": "لَا أَصْلَ لَهُ وَلَا يُعْرَفُ لَهُ إِسْنَادٌ مُتَّصِلٌ عَنِ النَّبِيِّ ﷺ",
        "sanad_en": "No authentic chain exists (La Asla Lahu). Fabricated attribution to the Prophet ﷺ.",
        "sanad_ur": "اس کی کوئی سند رسول اللہ ﷺ تک سرے سے موجود ہی نہیں ہے (لا اصل لہ)۔",
        "matn_ar": "حُبُّ الْوَطَنِ مِنَ الإِيمَانِ.",
        "matn_en": "Love of one's homeland is from faith.",
        "matn_ur": "وطن سے محبت کرنا ایمان میں سے ہے۔",
        "narrator_ids": [
            "habib_ibn_abi_habib",
            "malik_ibn_anas",
            "nafi_mawla_ibn_umar",
            "abdullah_ibn_umar",
            "prophet_muhammad"
        ],
        "transmission_formulas": [
            "an",
            "an",
            "an",
            "an"
        ],
        "known_verdict": "MAWDU",
        "corroborated": False,
        "known_sub_verdict": "Mawdu' / La Asla Lahu (Fabricated / Baseless)",
        "ruling_summary_en": "Completely lacks any authentic Sanad. Classified as fabricated or baseless by classical Hadith masters. While loving one's home is a natural human sentiment, attributing this phrase to the Prophet ﷺ as revelation is false.",
        "ruling_summary_ar": "موضوع لا أصل له مرفوعاً إلى النبي ﷺ. نص على وضعه الصغاني والسخاوي والألباني.",
        "ruling_summary_ur": "موضوع (من گھڑت) اور بے اصل۔ کسی بھی معتبر کتابِ حدیث میں اس کی کوئی سند موجود نہیں۔",
        "classical_scholars": [
            {"scholar": "Al-Sakhawi", "verdict": "Lam aqif 'alayhi (I found no basis for it as a Hadith)"},
            {"scholar": "Al-San'ani", "verdict": "Mawdu' (Fabricated)"},
            {"scholar": "Al-Albani", "verdict": "Mawdu' (Silsilat al-Ahadith al-Da'ifah #36)"}
        ]
    },
    "hadith_siwak": {
        "id": "hadith_siwak",
        "title_en": "Siwak Before Every Prayer (Law la an ashuqqa)",
        "title_ar": "حديث: لولا أن أشق على أمتي لأمرتهم بالسواك",
        "title_ur": "حدیث: اگر امت پر مشقت کا اندیشہ نہ ہوتا تو مسواک کا حکم دیتا",
        "book": "Sunan al-Tirmidhi #22 / Sahih al-Bukhari #887",
        "hadith_number": "Tirmidhi #22",
        "chapter_ar": "أبواب الطهارة - باب ما جاء في السواك",
        "chapter_en": "Book of Purification - Chapter on the Siwak",
        "chapter_ur": "کتاب الطہارۃ - مسواک کا بیان",
        "sanad_ar": "حَدَّثَنَا أَبُو كُرَيْبٍ، عَنْ مُحَمَّدِ بْنِ عَمْرٍو، عَنْ أَبِي سَلَمَةَ، عَنْ أَبِي هُرَيْرَةَ",
        "sanad_en": "Via Muhammad ibn Amr, from Abu Salamah, from Abu Hurayrah, from the Prophet (simplified for the benchmark).",
        "sanad_ur": "محمد بن عمرو سے، انہوں نے ابو سلمہ سے، انہوں نے ابوہریرہ سے (بینچ مارک کے لیے مختصر)۔",
        "matn_ar": "لَوْلَا أَنْ أَشُقَّ عَلَى أُمَّتِي لَأَمَرْتُهُمْ بِالسِّوَاكِ مَعَ كُلِّ صَلَاةٍ.",
        "matn_en": "Were it not that I would burden my nation, I would have commanded them to use the siwak with every prayer.",
        "matn_ur": "اگر مجھے اپنی امت پر مشقت کا اندیشہ نہ ہوتا تو میں انہیں ہر نماز کے ساتھ مسواک کا حکم دیتا۔",
        "narrator_ids": [
                "al_tirmidhi",
                "muhammad_ibn_amr_ibn_alqamah",
                "abu_salamah_ibn_abd_al_rahman",
                "abu_hurayrah",
                "prophet_muhammad"
        ],
        "transmission_formulas": [
                "haddathana",
                "an",
                "an",
                "an"
        ],
        "known_verdict": "SAHIH_LI_GHAYRIHI",
        "corroborated": True,
        "known_sub_verdict": "Sahih li-ghayrihi (Hasan chain raised by supporting routes)",
        "ruling_summary_en": "The chain of Muhammad ibn Amr is only Hasan because of his slightly lighter precision, but it is corroborated by other authentic routes of Abu Hurayrah, raising it to Sahih li-ghayrihi - the textbook example given by Ibn al-Salah.",
        "ruling_summary_ar": "إسناد محمد بن عمرو حسن لخفة ضبطه، لكنه توبع من طرق صحيحة عن أبي هريرة فارتقى إلى الصحيح لغيره، وهو المثال الذي ذكره ابن الصلاح.",
        "ruling_summary_ur": "محمد بن عمرو کی سند ضبط میں خفت کی وجہ سے حسن ہے، مگر ابوہریرہ کے دیگر صحیح طرق سے تائید ملنے پر صحیح لغیرہ ہے؛ ابن الصلاح نے یہی مثال ذکر کی۔",
        "classical_scholars": [
                {
                        "scholar": "Ibn al-Salah",
                        "verdict": "Hasan li-dhatihi in itself, Sahih li-ghayrihi through corroboration"
                },
                {
                        "scholar": "Imam al-Bukhari",
                        "verdict": "Narrated it in Sahih al-Bukhari through another route"
                }
        ]
    },
    "hadith_mother_first": {
        "id": "hadith_mother_first",
        "title_en": "Your Mother, then Your Mother (Man abarru?)",
        "title_ar": "حديث: من أبر؟ قال: أمك",
        "title_ur": "حدیث: میں کس سے نیکی کروں؟ فرمایا: اپنی ماں سے",
        "book": "Sunan Abi Dawud #5139 / Sunan al-Tirmidhi #1897",
        "hadith_number": "Abu Dawud #5139",
        "chapter_ar": "كتاب الأدب - باب في بر الوالدين",
        "chapter_en": "Book of Manners - Chapter on Kindness to Parents",
        "chapter_ur": "کتاب الادب - والدین کے ساتھ حسن سلوک",
        "sanad_ar": "حَدَّثَنَا مُسَدَّدٌ، عَنْ بَهْزِ بْنِ حَكِيمٍ، عَنْ أَبِيهِ، عَنْ جَدِّهِ مُعَاوِيَةَ بْنِ حَيْدَةَ",
        "sanad_en": "Musaddad, from Bahz ibn Hakim, from his father, from his grandfather Mu'awiyah ibn Haydah (simplified for the benchmark).",
        "sanad_ur": "مسدد، بہز بن حکیم سے، اپنے والد سے، اپنے دادا معاویہ بن حیدہ سے (بینچ مارک کے لیے مختصر)۔",
        "matn_ar": "قُلْتُ: يَا رَسُولَ اللَّهِ، مَنْ أَبَرُّ؟ قَالَ: أُمَّكَ، ثُمَّ أُمَّكَ، ثُمَّ أُمَّكَ، ثُمَّ أَبَاكَ، ثُمَّ الْأَقْرَبَ فَالْأَقْرَبَ.",
        "matn_en": "I said: O Messenger of Allah, to whom should I show kindness? He said: Your mother, then your mother, then your mother, then your father, then the nearest and the next nearest.",
        "matn_ur": "میں نے پوچھا: اے اللہ کے رسول! میں کس کے ساتھ نیکی کروں؟ فرمایا: اپنی ماں کے ساتھ، پھر ماں کے ساتھ، پھر ماں کے ساتھ، پھر باپ کے ساتھ، پھر قریب ترین رشتہ داروں کے ساتھ۔",
        "narrator_ids": [
                "abu_dawud",
                "musaddad",
                "bahz_ibn_hakim",
                "muawiyah_ibn_haydah",
                "prophet_muhammad"
        ],
        "transmission_formulas": [
                "haddathana",
                "an",
                "an",
                "an"
        ],
        "known_verdict": "HASAN_LI_DHATIHI",
        "corroborated": False,
        "known_sub_verdict": "Hasan li-dhatihi (Sound chain with a lighter-precision narrator)",
        "ruling_summary_en": "The chain is continuous and every narrator is upright, but Bahz ibn Hakim is only truthful (Saduq) with lighter precision, so the report is Hasan in itself without needing outside support.",
        "ruling_summary_ar": "السند متصل ورواته عدول، غير أن بهز بن حكيم صدوق خفيف الضبط، فالحديث حسن لذاته.",
        "ruling_summary_ur": "سند متصل اور تمام روات عادل ہیں مگر بہز بن حکیم صدوق اور ہلکے ضبط والے ہیں، اس لیے یہ بذاتہ حسن ہے۔",
        "classical_scholars": [
                {
                        "scholar": "Al-Tirmidhi",
                        "verdict": "Hasan"
                },
                {
                        "scholar": "Al-Albani",
                        "verdict": "Hasan (Sahih Abi Dawud)"
                }
        ]
    },
}
