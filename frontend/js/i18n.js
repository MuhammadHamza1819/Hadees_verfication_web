/**
 * Trilingual Translation System (English, العربية, اردو)
 */

const I18N = {
  en: {
    app_title: "Hadith Verification Engine",
    app_subtitle: "Rule-Based Islamic Hadith Verification System (Usul al-Hadith)",
    tab_verifier: "🔍 Smart Verifier",
    tab_islamicurdubooks: "📥 Online Hadith Books",
    tab_graph: "📜 Sanad Diagram",
    tab_auditor: "⚖️ Guided Auditor",
    tab_corpus: "📚 Hadith Library",
    tab_rijal: "👤 Biographical Directory",
    tab_rules: "📖 Usul Rules Guide",

    iub_panel_title: "Online Hadith Books: Fetch & Verify",
    iub_panel_desc: "Fetch authentic Hadiths directly from the online library with complete Arabic text, Urdu translations, chapters, and narrator chains, then instantly verify them using the 5 classical Hadith rules.",
    iub_fetch_heading: "Fetch by Book & Hadith Number",
    iub_select_book: "Select Hadith Collection:",
    iub_hadith_num: "Hadith Number:",
    iub_fetch_btn: "Fetch Hadith",
    iub_quick_samples: "Quick Benchmarks:",
    iub_placeholder_title: "No Hadith Selected Yet",
    iub_placeholder_desc: "Select a book and Hadith number on the left and click 'Fetch Hadith' to view the Arabic text, Urdu translation, and narrators.",
    iub_verify_action_btn: "Verify This Hadith with 5 Classical Rules",

    hero_title: "Scientific Hadith Verification by Classical Rules",
    hero_desc: "Verifying prophetic reports using the foundational 5 criteria of Mustalah al-Hadith: Continuity (اتصال), Moral Integrity (عدالة), Memory Precision (ضبط), Absence of Anomaly (عدم الشذوذ), and Absence of Hidden Defects (عدم العلة).",

    rule_1_badge: "1. Chain Continuity (Ittisal)",
    rule_2_badge: "2. Moral Integrity ('Adalah)",
    rule_3_badge: "3. Retentive Precision (Dabt)",
    rule_4_badge: "4. Non-Anomaly (Shudhudh)",
    rule_5_badge: "5. Defect-Free ('Illah)",

    presets_label: "Select a Classical Benchmark Hadith:",
    custom_input_label: "Or Enter / Select Hadith Chain & Text:",
    textarea_placeholder: "Paste Arabic text, English translation, or narrator chain here...",
    verify_btn: "Execute Scientific Verification",
    why_grade_heading: "Why this grade?",
    rules_title: "أصول وقواعد مصطلح الحديث (The 5 Golden Criteria of Sahih Hadith)",
    rules_intro: "As defined by Ibn al-Salah (d. 643H) in his famous <em>Muqaddimah</em> and adopted by Al-Nawawi, Ibn Hajar, and the consensus of Hadith masters:",
    rule1_title: "1. اتصال السند (Chain Continuity)",
    rule1_desc: "Every narrator in the isnad must have received the Hadith directly from their teacher without any missing link from the compiler up to the Prophet ﷺ.",
    rule1_note: "<strong>Chain Breaks:</strong> Mu'allaq (beginning missing), Mursal (companion missing), Mu'dal (2+ consecutive missing), Munqati' (1 missing in middle).",
    rule2_title: "2. عدالة الرواة (Moral Probity of Narrators)",
    rule2_desc: "Each narrator must be a sane, adult Muslim, free from major sins (Fisq), innovations (Bid'ah), or any reputation of falsehood. All Companions (Sahabah) are upright by divine endorsement.",
    rule2_note: "<strong>Jarh Deficiencies:</strong> Kadhdhab (fabricator - causes Mawdu'), Matruk (abandoned), Majhul (unknown narrator).",
    rule3_title: "3. ضبط الرواة (Retentive Memory Precision)",
    rule3_desc: "Narrators must possess precision, either through flawless oral memory (Dabt al-Sadr) or preserved written manuscripts (Dabt al-Kitab).",
    rule3_note: "<strong>Distinction:</strong> Tamam al-Dabt (perfect memory -> Sahih) vs. Khafif al-Dabt (sound with slight deficit -> Hasan).",
    rule4_title: "4. السلامة من الشذوذ (Non-Anomaly)",
    rule4_desc: "A reliable narrator's report must not contradict reports from narrators who are more trustworthy (Awthaq) or greater in number.",
    rule4_note: "<strong>Classifications:</strong> Shadhdh (anomalous report) vs. Mahfuz (sound preserved report); Munkar (weak contradicting sound).",
    rule5_title: "5. السلامة من العلة القادحة (Absence of Hidden Defect)",
    rule5_desc: "The report must be free from subtle, hidden defects ('Illah Qadihah) that invalidate authenticity despite an apparently sound exterior.",
    rule5_note: "<strong>Subtle Flaws:</strong> Idraj (inserted text into Matn), Irsal Khafi (concealed drop), and subtle Tadlis.",
    footer_attribution: "— Muhammad ibn Sirin (رحمه الله), Sahih Muslim Muqaddimah",
    theme_toggle_title: "Toggle Dark/Light Mode",
    export_title: "Print / Export Tahqiq Certificate",
    no_chain_data: "No chain data available to render.",
    audited_via: "Audited via Classical Usul al-Hadith Methodology",
    stage_word: "Stage",
    rule_n_of_5: "Rule {n} of 5",
    verify_chain: "Verify Chain →",
    translation_label: "Translation:",
    adalah_metric: "'Adalah (Integrity)",
    dabt_metric: "Dabt (Precision)",
    year_ah: "AH",
    not_available: "N/A",
    diagram_title: "Interactive Sanad (Isnad) Transmission Diagram",
    diagram_hint: "Click on any narrator to inspect biographical data & Jarh wa Ta'dil",
    numbering_label: "Hadith numbering:",
    numbering_site: "Website numbering",
    numbering_intl: "International numbering (Sunnah.com style)",
    numbering_hint_site: "Numbers follow the original source's own system.",
    numbering_hint_intl: "Numbers follow the standard international reference editions, as used on Sunnah.com. They can differ from the website's numbers.",
    corroborated_label: "This hadith has supporting routes (Mutaba'at / Shawahid)",
    reset_btn: "Reset Form",
    export_btn_title: "Print or Export Tahqiq Certificate",

    chain_builder_title: "Sanad (Chain of Narrators) Flow:",
    add_narrator_btn: "+ Add Transmitter to Chain",
    chain_collector: "Compiler / Collector",
    chain_prophet: "Prophet Muhammad ﷺ",

    verdict_label: "SCIENTIFIC TAHQIQ VERDICT",
    score_label: "Purity Score",
    rules_audit_heading: "The 5 Pillar Rules Evaluation",
    matn_heading: "Matn (Hadith Text) & Translations",
    sources_heading: "Canonical References & Scholars' Sayings",

    status_pass: "Compliant",
    status_warning: "Scrutinized",
    status_fail: "Violated",

    verdict_sahih: "Sahih (Authentic)",
    verdict_hasan: "Hasan (Sound)",
    verdict_daif: "Da'if (Weak)",
    verdict_mawdu: "Mawdu' (Fabricated)",

    auditor_title: "Interactive Hadith Rule Auditor",
    auditor_subtitle: "Step-by-step diagnostic questionnaire to evaluate any Hadith following classical scholarly methodology.",
    auditor_prev: "Previous Rule",
    auditor_next: "Next Rule",
    auditor_finalize: "Calculate Final Scientific Verdict",

    search_placeholder: "Search Hadiths, keywords, narrators...",
    filter_all: "All Classifications",
    filter_sahih: "Sahih Only",
    filter_hasan: "Hasan Only",
    filter_daif: "Da'if Only",
    filter_mawdu: "Mawdu' Only",

    rijal_search_placeholder: "Search narrators by name, city, or era...",
    footer_text: "Built with scholarly devotion to Ilm al-Hadith. Adhering to the methodologies of Bukhari, Muslim, Ibn al-Salah, and Ibn Hajar."
  },

  ar: {
    app_title: "محرك تحقيق الأحاديث النبوية",
    app_subtitle: "المنظومة العلمية لتحقيق الأحاديث وفق قواعد علم المصطلح وأصول الحديث",
    tab_verifier: "🔍 المحقق الذكي",
    tab_islamicurdubooks: "📥 كتب الحديث الإلكترونية",
    tab_graph: "📜 شجرة السند",
    tab_auditor: "⚖️ المُدقِّق التفاعلي",
    tab_corpus: "📚 مكتبة الأحاديث",
    tab_rijal: "👤 موسوعة الرواة",
    tab_rules: "📖 دليل قواعد المصطلح",

    iub_panel_title: "كتب الحديث الإلكترونية: الجلب والتحقيق",
    iub_panel_desc: "استيراد الأحاديث النبوية مباشرة من المكتبة الإلكترونية مع السند والمتن والترجمة الأردية وتطبيق قواعد المصطلح الخمسة فوراً.",
    iub_fetch_heading: "البحث باسم الكتاب ورقم الحديث",
    iub_select_book: "اختر كتاب الحديث:",
    iub_hadith_num: "رقم الحديث:",
    iub_fetch_btn: "جلب الحديث",
    iub_quick_samples: "نماذج سريعة:",
    iub_placeholder_title: "لم يتم اختيار حديث بعد",
    iub_placeholder_desc: "اختر الكتاب ورقم الحديث ثم انقر 'جلب الحديث' لعرض المتن العربي والترجمة الأردية والرواة.",
    iub_verify_action_btn: "تحقيق هذه الحديث وفق القواعد الخمسة",

    hero_title: "تحقيق الأحاديث النبوية وفق قواعد أئمة الحديث",
    hero_desc: "تطبيق معايير الصحة الخمسة المعتمدة لدى جهابذة المحدثين: اتصال السند، عدالة الرواة، تمام الضبط، السلامة من الشذوذ، والسلامة من العلة القادحة.",

    rule_1_badge: "١. اتصال السند",
    rule_2_badge: "٢. عدالة الرواة",
    rule_3_badge: "٣. تمام الضبط",
    rule_4_badge: "٤. السلامة من الشذوذ",
    rule_5_badge: "٥. الخلو من العلة",

    presets_label: "اختر حديثاً نموذجياً للفحص الفوري:",
    custom_input_label: "أو أدخل متن الحديث وسلسلة رواته:",
    textarea_placeholder: "ضع نص الحديث الشريف، أو متنه، أو أسماء رواته هنا...",
    verify_btn: "إجراء التحقيق العلمي الدقيق",
    why_grade_heading: "لماذا هذه الدرجة؟",
    rules_title: "أصول وقواعد مصطلح الحديث: الشروط الخمسة للحديث الصحيح",
    rules_intro: "كما عرّفها ابن الصلاح (ت 643هـ) في <em>مقدمته</em> المشهورة، وتبنّاها النووي وابن حجر وإجماع أئمة الحديث:",
    rule1_title: "1. اتصال السند",
    rule1_desc: "يجب أن يتلقى كل راوٍ في الإسناد الحديث مباشرة من شيخه دون أي حلقة مفقودة، من المصنِّف حتى النبي ﷺ.",
    rule1_note: "<strong>أنواع الانقطاع:</strong> المعلَّق (سقط من أوله)، المرسل (سقط الصحابي)، المعضل (سقوط راويين فأكثر متتالين)، المنقطع (سقوط راوٍ واحد من الوسط).",
    rule2_title: "2. عدالة الرواة",
    rule2_desc: "يُشترط في كل راوٍ أن يكون مسلماً بالغاً عاقلاً، سالماً من أسباب الفسق والبدعة ومن التهمة بالكذب. والصحابة كلهم عدول بتعديل الله لهم.",
    rule2_note: "<strong>أسباب الجرح:</strong> الكذاب (الوضّاع - يوجب الحكم بالوضع)، المتروك، المجهول.",
    rule3_title: "3. ضبط الرواة",
    rule3_desc: "يجب أن يتصف الراوي بالضبط، إما بحفظ صدره حفظاً تاماً (ضبط الصدر) أو بكتابه المصون (ضبط الكتاب).",
    rule3_note: "<strong>التفريق:</strong> تامّ الضبط (يُنتج الصحيح) وخفيف الضبط (يُنتج الحسن).",
    rule4_title: "4. السلامة من الشذوذ",
    rule4_desc: "يجب ألا تخالف رواية الراوي الثقة رواية من هو أوثق منه أو أكثر عدداً.",
    rule4_note: "<strong>التصنيف:</strong> الشاذ (الرواية المخالِفة) مقابل المحفوظ (الرواية الراجحة)، والمنكر (ضعيف خالف ثقة).",
    rule5_title: "5. السلامة من العلة القادحة",
    rule5_desc: "يجب أن يخلو الحديث من العلل الخفية القادحة التي تُبطل صحته مع أن ظاهره السلامة.",
    rule5_note: "<strong>العلل الخفية:</strong> الإدراج (زيادة نص في المتن)، الإرسال الخفي (سقوط خفي)، والتدليس الخفي.",
    footer_attribution: "— محمد بن سيرين رحمه الله، مقدمة صحيح مسلم",
    theme_toggle_title: "تبديل الوضع الداكن / الفاتح",
    export_title: "طباعة / تصدير شهادة التحقيق",
    no_chain_data: "لا تتوفر بيانات إسناد لعرضها.",
    audited_via: "تم التدقيق وفق منهج أصول الحديث الكلاسيكي",
    stage_word: "المرحلة",
    rule_n_of_5: "القاعدة {n} من 5",
    verify_chain: "تحقق من السند ←",
    translation_label: "",
    adalah_metric: "العدالة",
    dabt_metric: "الضبط",
    year_ah: "هـ",
    not_available: "غير متوفر",
    diagram_title: "مخطط الإسناد التفاعلي لسلسلة الرواة",
    diagram_hint: "انقر على أي راوٍ للاطلاع على سيرته وأحكام الجرح والتعديل فيه",
    numbering_label: "ترقيم الأحاديث:",
    numbering_site: "ترقيم الموقع",
    numbering_intl: "الترقيم الدولي (المعتمد عالمياً)",
    numbering_hint_site: "الأرقام وفق نظام المصدر الأصلي نفسه.",
    numbering_hint_intl: "الأرقام وفق الطبعات المرجعية الدولية المعتمدة في المواقع الحديثية، وقد تختلف عن أرقام الموقع.",
    corroborated_label: "لهذا الحديث طرق أخرى تعضده (متابعات / شواهد)",
    reset_btn: "إعادة ضبط",
    export_btn_title: "طباعة أو تصدير وثيقة التحقيق",

    chain_builder_title: "سلسلة السند وطرق الرواية:",
    add_narrator_btn: "+ إضافة راوٍ إلى الإسناد",
    chain_collector: "المخرج / المصنف",
    chain_prophet: "رسول الله ﷺ",

    verdict_label: "حكم الحديث الإجمالي",
    score_label: "نسبة الثبوت",
    rules_audit_heading: "تقرير فحص الشروط الخمسة",
    matn_heading: "متن الحديث الشريف والترجمة",
    sources_heading: "المصادر المعتمدة وأقوال أئمة الجرح والتعديل",

    status_pass: "مستوفٍ للشرط",
    status_warning: "محل نظر وتوقف",
    status_fail: "مخالف للشرط",

    verdict_sahih: "صحيح",
    verdict_hasan: "حسن",
    verdict_daif: "ضعيف",
    verdict_mawdu: "موضوع",

    auditor_title: "المُدقِّق المنهجي التفاعلي",
    auditor_subtitle: "فحص تدريجي يقودك خطوة بخطوة للتحقق من أي حديث وفق موازين علم الحديث.",
    auditor_prev: "الشرط السابق",
    auditor_next: "الشرط التالي",
    auditor_finalize: "استخراج الحكم العلمي النهائي",

    search_placeholder: "ابحث في نصوص الأحاديث والكتب والرواة...",
    filter_all: "جميع المراتب",
    filter_sahih: "صحيح فقط",
    filter_hasan: "حسن فقط",
    filter_daif: "ضعيف فقط",
    filter_mawdu: "موضوع فقط",

    rijal_search_placeholder: "ابحث عن راوٍ بالاسم، البلد، أو الطبقة...",
    footer_text: "أُنجز هذا العمل خدمة للسنة النبوية الشريفة واقتداءً بمنهج أئمة الحديث: البخاري ومسلم وابن الصلاح وابن حجر."
  },

  ur: {
    app_title: "حدیث تصدیق و تحقیق سسٹم",
    app_subtitle: "اصولِ حدیث اور قواعدِ مصطلح کی روشنی میں احادیث نبوی کی سائنسی تحقیق",
    tab_verifier: "🔍 اسمارٹ محقق",
    tab_islamicurdubooks: "📥 آن لائن کتبِ حدیث",
    tab_graph: "📜 شجرۂ سند",
    tab_auditor: "⚖️ انٹرایکٹو آڈیٹر",
    tab_corpus: "📚 کتب و احادیث لائبریری",
    tab_rijal: "👤 اسماء الرجال ڈائریکٹری",
    tab_rules: "📖 اصولِ حدیث گائیڈ",

    iub_panel_title: "آن لائن کتبِ حدیث: حاصل کریں اور تصدیق کریں",
    iub_panel_desc: "آن لائن لائبریری سے براہ راست مستند احادیث، سند، متن اور اردو ترجمہ حاصل کریں اور 5 سنہری اصولوں سے فوراً تحقیق کریں۔",
    iub_fetch_heading: "کتاب اور حدیث نمبر کے ذریعے تلاش",
    iub_select_book: "کتابِ حدیث منتخب کریں:",
    iub_hadith_num: "حدیث نمبر:",
    iub_fetch_btn: "حدیث حاصل کریں",
    iub_quick_samples: "نمونہ احادیث:",
    iub_placeholder_title: "ابھی کوئی حدیث منتخب نہیں کی گئی",
    iub_placeholder_desc: "بائیں جانب سے کتاب اور حدیث نمبر منتخب کر کے 'حدیث حاصل کریں' پر کلک کریں۔",
    iub_verify_action_btn: "اس حدیث کی پانچ اصولوں کے تحت تصدیق کریں",

    hero_title: "اصولِ حدیث کے سنہری قواعد کے تحت احادیث کی تحقیق",
    hero_desc: "ائمہ حدیث کے وضع کردہ صحت کے پانچ بنیادی اصولوں پر جانچ: اتصالِ سند، عدالتِ روات، ضبط و حفظ، شذوذ سے سلامتی، اور علتِ قادحہ سے پاکیزگی۔",

    rule_1_badge: "۱. اتصالِ سند",
    rule_2_badge: "۲. عدالتِ روات",
    rule_3_badge: "۳. ضبط و حفظ",
    rule_4_badge: "۴. عدمِ شذوذ",
    rule_5_badge: "۵. عدمِ علت",

    presets_label: "جانچ کے لیے معروف احادیث میں سے منتخب کریں:",
    custom_input_label: "یا حدیث کا متن اور سند درج کریں:",
    textarea_placeholder: "حدیث کا عربی متن، اردو ترجمہ یا روات کی سند یہاں درج کریں...",
    verify_btn: "سائنسی و شرعی تحقیق کا آغاز کریں",
    why_grade_heading: "یہ درجہ کیوں؟",
    rules_title: "اصولِ حدیث: صحیح حدیث کی پانچ سنہری شرائط",
    rules_intro: "جیسا کہ ابن الصلاح (م 643ھ) نے اپنے مشہور <em>مقدمہ</em> میں بیان کیا اور امام نووی، ابن حجر اور ائمۂ حدیث کے اجماع نے اسے اختیار کیا:",
    rule1_title: "1. اتصالِ سند (سند کا متصل ہونا)",
    rule1_desc: "سند کے ہر راوی کو لازم ہے کہ اس نے حدیث براہِ راست اپنے استاد سے سنی ہو، مصنف سے لے کر نبی کریم ﷺ تک کوئی کڑی گم نہ ہو۔",
    rule1_note: "<strong>سند کے انقطاع کی اقسام:</strong> معلّق (ابتدا سے راوی غائب)، مرسل (صحابی غائب)، معضل (دو یا زیادہ مسلسل راوی غائب)، منقطع (درمیان سے ایک راوی غائب)۔",
    rule2_title: "2. راویوں کی عدالت",
    rule2_desc: "ہر راوی کا مسلمان، بالغ اور عاقل ہونا، فسق و بدعت اور جھوٹ کی تہمت سے پاک ہونا ضروری ہے۔ تمام صحابہ کرام اللہ تعالیٰ کی تعدیل کی بنا پر عادل ہیں۔",
    rule2_note: "<strong>جرح کے اسباب:</strong> کذاب (من گھڑت روایت کرنے والا - موضوع ہونے کا سبب)، متروک، مجہول (نامعلوم راوی)۔",
    rule3_title: "3. راویوں کا ضبط (قوتِ حافظہ)",
    rule3_desc: "راوی کا ضابط ہونا لازم ہے، خواہ مکمل حافظے کے ذریعے (ضبطِ صدر) یا محفوظ تحریری نسخے کے ذریعے (ضبطِ کتاب)۔",
    rule3_note: "<strong>فرق:</strong> تامّ الضبط (صحیح) اور خفیف الضبط (حسن)۔",
    rule4_title: "4. شذوذ سے سلامتی",
    rule4_desc: "ثقہ راوی کی روایت اپنے سے زیادہ معتبر یا تعداد میں زیادہ راویوں کی روایت کے خلاف نہ ہو۔",
    rule4_note: "<strong>اقسام:</strong> شاذ (مخالف روایت) بمقابلہ محفوظ (راجح روایت)؛ منکر (ضعیف راوی کی ثقہ کے خلاف روایت)۔",
    rule5_title: "5. علتِ قادحہ سے سلامتی",
    rule5_desc: "حدیث ان پوشیدہ قادح علتوں سے پاک ہو جو بظاہر درست نظر آنے کے باوجود اس کی صحت کو باطل کر دیتی ہیں۔",
    rule5_note: "<strong>پوشیدہ نقائص:</strong> ادراج (متن میں اضافہ)، ارسالِ خفی (پوشیدہ سقوط)، اور باریک تدلیس۔",
    footer_attribution: "— محمد بن سیرین رحمہ اللہ، مقدمہ صحیح مسلم",
    theme_toggle_title: "ڈارک / لائٹ موڈ تبدیل کریں",
    export_title: "تحقیق کا سرٹیفکیٹ پرنٹ / ایکسپورٹ کریں",
    no_chain_data: "دکھانے کے لیے سند کا کوئی ڈیٹا موجود نہیں۔",
    audited_via: "اصولِ حدیث کے کلاسیکی منہج کے مطابق جانچا گیا",
    stage_word: "مرحلہ",
    rule_n_of_5: "قاعدہ {n} از 5",
    verify_chain: "سند کی تصدیق ←",
    translation_label: "اردو ترجمہ:",
    adalah_metric: "عدالت",
    dabt_metric: "ضبط",
    year_ah: "ھ",
    not_available: "دستیاب نہیں",
    diagram_title: "روات کی سند کا انٹرایکٹو خاکہ",
    diagram_hint: "کسی بھی راوی پر کلک کریں تاکہ اس کے حالات اور جرح و تعدیل دیکھ سکیں",
    numbering_label: "احادیث کی نمبرنگ:",
    numbering_site: "ویب سائٹ کی نمبرنگ",
    numbering_intl: "بین الاقوامی نمبرنگ (عالمی معیار)",
    numbering_hint_site: "نمبر اصل ماخذ کے اپنے نظام کے مطابق ہیں۔",
    numbering_hint_intl: "نمبر معیاری بین الاقوامی مرجع ایڈیشنز کے مطابق ہیں جو حدیثی ویب سائٹس پر مستعمل ہیں، اور ماخذ کے نمبروں سے مختلف ہو سکتے ہیں۔",
    corroborated_label: "اس حدیث کے دیگر تائیدی طرق موجود ہیں (متابعات / شواہد)",
    reset_btn: "دوبارہ ترتیب دیں",
    export_btn_title: "تحقیق سرٹیفکیٹ پرنٹ یا ایکسپورٹ کریں",

    chain_builder_title: "سلسلۂ سند کی ترتیب:",
    add_narrator_btn: "+ سند میں راوی شامل کریں",
    chain_collector: "مصنف / جامع کتاب",
    chain_prophet: "رسول اللہ ﷺ",

    verdict_label: "حدیث پر حتمی حکم",
    score_label: "صحت کا اسکور",
    rules_audit_heading: "پانچ شرائط کی تفصیلی جانچ رپورٹ",
    matn_heading: "متنِ حدیث اور اردو / انگلش ترجمہ",
    sources_heading: "معتبر کتب کے حوالے اور ائمہ کے اقوال",

    status_pass: "شرط پر پورا",
    status_warning: "قابلِ غور و تامل",
    status_fail: "شرط کے خلاف",

    verdict_sahih: "صحیح",
    verdict_hasan: "حسن",
    verdict_daif: "ضعیف",
    verdict_mawdu: "موضوع (من گھڑت)",

    auditor_title: "انٹرایکٹو حدیث آڈیٹر وزرڈ",
    auditor_subtitle: "اصولِ حدیث کے مطابق مرحلہ وار سوالنامے کی مدد سے کسی بھی حدیث کی صحت جانچیں۔",
    auditor_prev: "پچھلا اصول",
    auditor_next: "اگلا اصول",
    auditor_finalize: "حتمی شرعی فیصلہ حاصل کریں",

    search_placeholder: "احادیث، کلمات یا راویوں میں تلاش کریں...",
    filter_all: "تمام درجات",
    filter_sahih: "صرف صحیح",
    filter_hasan: "صرف حسن",
    filter_daif: "صرف ضعیف",
    filter_mawdu: "صرف موضوع",

    rijal_search_placeholder: "راوی کا نام، شہر یا طبقہ تلاش کریں...",
    footer_text: "سنتِ نبویہ کی خدمت اور ائمہ فن بخاری، مسلم، ابن الصلاح اور ابن حجر عسقلانی کے منہج پر مبنی۔"
  }
};

let currentLang = 'en';

function setLanguage(lang) {
  if (!I18N[lang]) return;
  currentLang = lang;
  
  // Set HTML attributes for RTL/LTR and font binding
  const html = document.documentElement;
  html.setAttribute('data-lang', lang);
  if (lang === 'ar' || lang === 'ur') {
    html.setAttribute('dir', 'rtl');
  } else {
    html.setAttribute('dir', 'ltr');
  }

  // Update active button state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === lang);
  });

  // Translate all DOM elements with data-i18n
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (I18N[lang][key]) {
      el.textContent = I18N[lang][key];
    }
  });

  // Translate elements whose text contains markup
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (I18N[lang][key]) {
      el.innerHTML = I18N[lang][key];
    }
  });

  // Translate tooltips
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    if (I18N[lang][key]) {
      el.title = I18N[lang][key];
    }
  });

  // Translate input placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (I18N[lang][key]) {
      el.placeholder = I18N[lang][key];
    }
  });

  // Re-render dynamic active views if needed
  if (typeof updateActiveViewTranslations === 'function') {
    updateActiveViewTranslations();
  }
}
