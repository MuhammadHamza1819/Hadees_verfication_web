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
