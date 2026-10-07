/**
 * Interactive Step-by-Step Hadith Rule Auditor Wizard
 * Walk users through evaluating the 5 conditions of Hadith authenticity.
 */

let auditorState = {
  currentStep: 1,
  answers: {
    ittisal: "pass",
    adalah: "pass",
    dabt: "pass",
    shudhudh: "pass",
    illah: "pass"
  }
};

const AUDITOR_QUESTIONS = {
  1: {
    rule_id: "ittisal",
    title_en: "Step 1: Check Chain Continuity (Ittisal al-Sanad)",
    title_ar: "المرحلة الأولى: التحقق من اتصال السند",
    title_ur: "پہلا مرحلہ: اتصالِ سند کی جانچ",
    desc_en: "Did every narrator in the chain hear directly from their immediate teacher from the collector down to the Prophet ﷺ?",
    desc_ar: "هل ثبت سماع كل راوٍ في السلسلة من شيخه المباشر دون سقط أو انقطاع؟",
    desc_ur: "کیا سند کے ہر راوی نے اپنے استاد سے براہ راست سنا ہے اور درمیان میں کوئی راوی چھوٹا تو نہیں؟",
    options: [
      { id: "pass", label_en: "Yes, fully continuous with verified direct hearing (Muttasil)", label_ar: "نعم، إسناد متصل بالسماع المباشر المتيقن", label_ur: "جی ہاں، ہر راوی کا استاد سے براہ راست سماع ثابت ہے", score: 100 },
      { id: "warn", label_en: "Ambiguous formula ('An'anah) by a Mudallis narrator", label_ar: "عنعنة من راوٍ موصوف بالتدليس", label_ur: "مدلس راوی سے عنعنہ کے ساتھ روایت ہے", score: 65 },
      { id: "fail", label_en: "Broken link (Mursal, Mu'allaq, or Munqati' omission)", label_ar: "انقطاع صريح (مرسل أو معلق أو منقطع)", label_ur: "سند میں واضح انقطاع (مرسل، معلق یا منقطع)", score: 20 }
    ]
  },
  2: {
    rule_id: "adalah",
    title_en: "Step 2: Evaluate Moral Integrity ('Adalat ar-Ruwat)",
    title_ar: "المرحلة الثانية: تقييم عدالة الرواة",
    title_ur: "دوسرا مرحلہ: روات کی عدالت و تقویٰ کی پرکھ",
    desc_en: "Are all transmitters known for righteousness, adherence to the Sunnah, and honesty?",
    desc_ar: "هل جميع رواة السند عدول متصفون بالتقوى والمروءة والصدق؟",
    desc_ur: "کیا سند کے تمام راوی متقی، عادل اور سچے ہیں؟",
    options: [
      { id: "pass", label_en: "All are upright Companions or trustworthy scholars ('Adl / Thiqah)", label_ar: "جميعهم عدول ثقات من الصحابة والتابعين", label_ur: "تمام روات صحابہ یا ثقہ و عادل ائمہ ہیں", score: 100 },
      { id: "warn", label_en: "One narrator has unknown status (Majhul al-Hal)", label_ar: "وجود راوٍ مجهول الحال لم يوثق صراحة", label_ur: "ایک راوی مجہول الحال ہے جس کی توثیق نہیں", score: 50 },
      { id: "fail", label_en: "Contains an accused liar or fabricator (Kadhdhab / Wadda')", label_ar: "اشتمال السند على متهم بالكذب أو وضاع", label_ur: "سند میں جھوٹا یا حدیث گھڑنے والا راوی شامل ہے", score: 0 }
    ]
  },
  3: {
    rule_id: "dabt",
    title_en: "Step 3: Test Accuracy & Memory Precision (Dabt ar-Ruwat)",
    title_ar: "المرحلة الثالثة: فحص ضبط الرواة وإتقانهم",
    title_ur: "تیسرا مرحلہ: حفظ و یادداشت (ضبط) کی جانچ",
    desc_en: "Did the narrators possess strong retentive memory (oral or written) free from gross errors?",
    desc_ar: "هل كان الرواة على جانب عالٍ من الحفظ والتثبت وسلامة الكتب؟",
    desc_ur: "کیا روات کا حافظہ اور کتابیں غلطیوں اور وہم سے محفوظ ہیں؟",
    options: [
      { id: "pass", label_en: "Highest level of precision and retentive mastery (Tamam al-Dabt)", label_ar: "تمام الضبط والإتقان التام في الصدر والكتاب", label_ur: "اعلیٰ ترین حفظ اور کامل یادداشت (تمام الضبط)", score: 100 },
      { id: "warn", label_en: "Fair retentive memory with slight errors (Khafif al-Dabt / Saduq)", label_ar: "خفة ضبط يسيرة تنزل به إلى رتبة الصدوق", label_ur: "معتدل حفظ، معمولی تخفیف کے ساتھ (درجہ صدوق)", score: 75 },
      { id: "fail", label_en: "Frequent memory delusions or gross errors (Su' al-Hifz)", label_ar: "فاحش الغلط وسوء الحفظ وكثرة الأوهام", label_ur: "حافظے کی خرابی اور کثرت سے اغلاط (سوء الحفظ)", score: 25 }
    ]
  },
  4: {
    rule_id: "shudhudh",
    title_en: "Step 4: Screen for Irregularity & Anomaly ('Adam al-Shudhudh)",
    title_ar: "المرحلة الرابعة: التأكد من السلامة من الشذوذ",
    title_ur: "چوتھا مرحلہ: شذوذ اور مخالفت سے سلامتی",
    desc_en: "Does this narration contradict reports from more trustworthy authorities (Awthaq)?",
    desc_ar: "هل يخالف هذا الحديث رواية من هم أوثق منه أو أكثر عدداً من الثقات؟",
    desc_ur: "کیا یہ روایت اپنے سے زیادہ معتبر یا کثیر ائمہ کی روایات کے خلاف ہے؟",
    options: [
      { id: "pass", label_en: "No contradiction; corroborates or agrees with the established Sunnah (Mahfuz)", label_ar: "سالم تماماً وموافق لما رواه الثقات (محفوظ)", label_ur: "کوئی مخالفت نہیں، معتبر احادیث کے بالکل مطابق ہے", score: 100 },
      { id: "fail", label_en: "Contradicts stronger reliable narrators (Shadhdh / Munkar)", label_ar: "مخالف لمن هو أوثق منه وأرجح (شاذ أو منكر)", label_ur: "زیادہ ثقہ ائمہ کی روایات کے صریح مخالف ہے", score: 20 }
    ]
  },
  5: {
    rule_id: "illah",
    title_en: "Step 5: Inspect Subtle Hidden Defects ('Adam al-'Illah)",
    title_ar: "المرحلة الخامسة: الفحص الدقيق عن العلل القادحة",
    title_ur: "پانچواں مرحلہ: پوشیدہ علتوں (علتِ قادحہ) کی تحقیق",
    desc_en: "Are there any obscure, hidden flaws such as inserted words (Idraj) or concealed gaps (Irsal Khafi)?",
    desc_ar: "هل ثبتت سلامة الحديث من العلل الخفية الغامضة كالإدراج والوقف والقلب؟",
    desc_ur: "کیا حدیث میں ادراج یا ارسالِ خفی جیسا کوئی پوشیدہ عیب تو نہیں؟",
    options: [
      { id: "pass", label_en: "Completely free of hidden flaws upon scholarly cross-examination", label_ar: "خالٍ تماماً من العلل القادحة بعد سبر طرقه", label_ur: "گہری جانچ کے بعد کسی بھی پوشیدہ عیب سے بالکل پاک ہے", score: 100 },
      { id: "warn", label_en: "Divergence between scholars on whether it is Mawquf vs Marfu'", label_ar: "اختلاف في رفعه ووقفه يحتاج إلى ترجيح", label_ur: "مرفوع یا موقوف ہونے میں ائمہ کا اختلاف ہے", score: 65 },
      { id: "fail", label_en: "Fatal hidden defect uncovered ('Illah Qadihah)", label_ar: "ثبوت علة قادحة تسقط صحة الحديث", label_ur: "مہلک علت ثابت ہو چکی ہے جو حدیث کو باطل کرتی ہے", score: 15 }
    ]
  }
};

function renderAuditorWizard() {
  const container = document.getElementById("auditorWizardContainer");
  if (!container) return;

  const currentQ = AUDITOR_QUESTIONS[auditorState.currentStep];
  if (!currentQ) return;

  const title = currentLang === "ar" ? currentQ.title_ar : (currentLang === "ur" ? currentQ.title_ur : currentQ.title_en);
  const desc = currentLang === "ar" ? currentQ.desc_ar : (currentLang === "ur" ? currentQ.desc_ur : currentQ.desc_en);

  let optionsHtml = currentQ.options.map(opt => {
    const optLabel = currentLang === "ar" ? opt.label_ar : (currentLang === "ur" ? opt.label_ur : opt.label_en);
    const isChecked = auditorState.answers[currentQ.rule_id] === opt.id;
    return `
      <label style="display: flex; align-items: center; gap: 0.85rem; padding: 1rem; background: var(--bg-tertiary); border: 1px solid ${isChecked ? 'var(--accent-gold)' : 'var(--border-subtle)'}; border-radius: var(--radius-md); cursor: pointer; transition: var(--transition);">
        <input type="radio" name="auditor_opt_${currentQ.rule_id}" value="${opt.id}" ${isChecked ? 'checked' : ''} onchange="selectAuditorAnswer('${currentQ.rule_id}', '${opt.id}')" style="accent-color: var(--accent-gold); width: 18px; height: 18px;">
        <span style="font-size: 0.95rem; font-weight: 500;">${optLabel}</span>
      </label>
    `;
  }).join("");

  container.innerHTML = `
    <div class="glass-card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem;">
        <span class="rule-score-badge pass" style="font-size: 0.85rem;">Rule ${auditorState.currentStep} of 5</span>
        <div style="display: flex; gap: 0.5rem;">
          ${[1, 2, 3, 4, 5].map(step => `
            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${step === auditorState.currentStep ? 'var(--accent-gold)' : (step < auditorState.currentStep ? 'var(--accent-emerald)' : 'var(--border-subtle)')};"></div>
          `).join('')}
        </div>
      </div>
      <h3 style="font-size: 1.35rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);">${title}</h3>
      <p style="color: var(--text-secondary); margin-bottom: 1.5rem; font-size: 1rem;">${desc}</p>
      
      <div style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 2rem;">
        ${optionsHtml}
      </div>

      <div style="display: flex; justify-content: space-between; gap: 1rem;">
        <button class="nav-tab-btn" style="border: 1px solid var(--border-subtle);" onclick="prevAuditorStep()" ${auditorState.currentStep === 1 ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>
          ← ${I18N[currentLang].auditor_prev}
        </button>

        ${auditorState.currentStep < 5 ? `
          <button class="btn-primary" style="width: auto; padding: 0.65rem 1.5rem;" onclick="nextAuditorStep()">
            ${I18N[currentLang].auditor_next} →
          </button>
        ` : `
          <button class="btn-primary" style="width: auto; padding: 0.65rem 1.5rem; background: linear-gradient(135deg, var(--accent-gold), #B48214);" onclick="calculateAuditorVerdict()">
            ✨ ${I18N[currentLang].auditor_finalize}
          </button>
        `}
      </div>
    </div>

    <div id="auditorVerdictResult" style="margin-top: 2rem;"></div>
  `;
}

function selectAuditorAnswer(ruleId, optId) {
  auditorState.answers[ruleId] = optId;
  renderAuditorWizard();
}

function nextAuditorStep() {
  if (auditorState.currentStep < 5) {
    auditorState.currentStep++;
    renderAuditorWizard();
  }
}

function prevAuditorStep() {
  if (auditorState.currentStep > 1) {
    auditorState.currentStep--;
    renderAuditorWizard();
  }
}

function calculateAuditorVerdict() {
  const ans = auditorState.answers;
  let verdict = "SAHIH";
  let verdictAr = "صحيح";
  let verdictUr = "صحیح";
  let badgeClass = "sahih";
  let score = 95;

  if (ans.adalah === "fail") {
    verdict = "MAWDU";
    verdictAr = "موضوع";
    verdictUr = "موضوع (من گھڑت)";
    badgeClass = "mawdu";
    score = 10;
  } else if (ans.ittisal === "fail" || ans.adalah === "warn" || ans.dabt === "fail" || ans.shudhudh === "fail" || ans.illah === "fail") {
    verdict = "DAIF";
    verdictAr = "ضعيف";
    verdictUr = "ضعیف";
    badgeClass = "daif";
    score = 45;
  } else if (ans.dabt === "warn" || ans.ittisal === "warn" || ans.illah === "warn") {
    verdict = "HASAN";
    verdictAr = "حسن";
    verdictUr = "حسن";
    badgeClass = "hasan";
    score = 78;
  }

  const resultContainer = document.getElementById("auditorVerdictResult");
  if (!resultContainer) return;

  const title = currentLang === "ar" ? verdictAr : (currentLang === "ur" ? verdictUr : verdict);

  resultContainer.innerHTML = `
    <div class="verdict-hero ${badgeClass}">
      <div class="verdict-badge-large">
        <span class="verdict-tag">${I18N[currentLang].verdict_label}</span>
        <div class="verdict-title">${title}</div>
        <div class="verdict-subtitle">Audited via Classical Usul al-Hadith Methodology</div>
      </div>
      <div class="verdict-score-ring">
        <div class="score-number">${score}%</div>
      </div>
    </div>
  `;
}
