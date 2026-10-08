/**
 * Main Application Controller for Hadith Verification Web Application
 */

let currentHadithId = "hadith_niyyah";
let customChainNarrators = [
  "al_bukhari",
  "al_humaydi",
  "sufyan_ibn_uyaynah",
  "yahya_ibn_said_al_ansari",
  "muhammad_ibn_ibrahim_al_taymi",
  "alqamah_ibn_waqqas",
  "umar_ibn_al_khattab",
  "prophet_muhammad"
];
let customChainFormulas = [
  "haddathana",
  "haddathana",
  "haddathana",
  "akhbarana",
  "sami'tu",
  "sami'tu",
  "sami'tu"
];

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initTabs();
  loadIubBooksList();
  initPresets();
  renderChainBuilder();
  renderCorpusLibrary();
  renderRijalDirectory();
  renderAuditorWizard();
  
  // Run initial verification on Hadith Niyyah
  runVerification();
});

// Theme Management
function initTheme() {
  const savedTheme = localStorage.getItem("hadith_theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);

  const themeBtn = document.getElementById("themeToggleBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme") || "dark";
      const nextTheme = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", nextTheme);
      localStorage.setItem("hadith_theme", nextTheme);
      updateThemeIcon(nextTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const btn = document.getElementById("themeToggleBtn");
  if (btn) {
    btn.textContent = theme === "dark" ? "☀️" : "🌙";
  }
}

// Navigation Tabs
function initTabs() {
  const tabButtons = document.querySelectorAll(".nav-tab-btn");
  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const targetTab = btn.getAttribute("data-tab");
      document.querySelectorAll(".tab-panel").forEach(panel => {
        panel.classList.remove("active");
      });
      const activePanel = document.getElementById(targetTab);
      if (activePanel) {
        activePanel.classList.add("active");
        if (targetTab === "tabGraph") {
          renderDedicatedGraph();
        }
      }
    });
  });
}

// Quick Preset Selectors
function initPresets() {
  const container = document.getElementById("presetButtonsContainer");
  if (!container) return;

  container.innerHTML = "";
  CORPUS_DATA.forEach(item => {
    const btn = document.createElement("button");
    btn.className = `preset-btn ${item.id === currentHadithId ? 'active' : ''}`;
    btn.setAttribute("data-preset-id", item.id);
    btn.onclick = () => selectPreset(item.id);

    const title = currentLang === "ar" ? item.title_ar : (currentLang === "ur" ? item.title_ur : item.title_en);

    btn.innerHTML = `
      <span class="preset-badge ${item.badge_class}">${gradeLabel(item.known_verdict)}</span>
      <span style="font-size: 0.85rem; font-weight: 600; line-height: 1.3;">${title}</span>
    `;
    container.appendChild(btn);
  });
}

function selectPreset(presetId) {
  currentHadithId = presetId;
  const item = CORPUS_DATA.find(c => c.id === presetId);
  if (!item) return;

  document.querySelectorAll(".preset-btn").forEach(btn => {
    btn.classList.toggle("active", btn.getAttribute("data-preset-id") === presetId);
  });

  customChainNarrators = [...item.narrator_ids];
  customChainFormulas = [...item.transmission_formulas];
  chainDisplayNames = null;
  fetchedMatn = null;

  const textInput = document.getElementById("hadithCustomTextInput");
  if (textInput) {
    textInput.value = item.matn_ar;
  }
  chainSourceText = item.matn_ar;

  const corroBox = document.getElementById("corroboratedCheck");
  if (corroBox) corroBox.checked = !!item.corroborated;

  renderChainBuilder();
  runVerification();
}

// Text matching against the benchmark hadiths
let chainSourceText = "";

function normalizeText(t) {
  return (t || "").toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findBenchmarkMatch(text) {
  const n = normalizeText(text);
  if (n.length < 10) return null;
  for (const item of CORPUS_DATA) {
    const fields = [item.matn_ar, item.matn_en, item.matn_ur, item.title_en, item.title_ar, item.title_ur];
    for (const field of fields) {
      const f = normalizeText(field);
      if (f.length >= 10 && (n.includes(f) || f.includes(n))) return item;
    }
  }
  return null;
}

function showNoBenchmarkMatch() {
  const msgs = {
    en: ["No matching benchmark hadith found", "This text does not match any benchmark hadith, so its chain and grade cannot be determined. Pick a benchmark hadith above, or fetch it by Book & Hadith Number."],
    ar: ["لا يوجد حديث مطابق في الحديث المرجعي", "هذا النص لا يطابق أي حديث مرجعي، فلا يمكن تحديد سنده ودرجته. اختر حديثاً مرجعياً أو اجلبه باسم الكتاب ورقم الحديث."],
    ur: ["کوئی مطابق بینچ مارک حدیث نہیں ملی", "یہ متن کسی بینچ مارک حدیث سے نہیں ملتا، اس لیے اس کی سند اور درجہ معلوم نہیں کیا جا سکتا۔ کوئی بینچ مارک حدیث منتخب کریں یا کتاب اور حدیث نمبر سے حاصل کریں۔"]
  };
  const [title, body] = msgs[currentLang] || msgs.en;
  const heroEl = document.getElementById("verdictHeroContainer");
  if (heroEl) {
    heroEl.className = "verdict-hero daif";
    heroEl.innerHTML = `<div class="verdict-badge-large"><div class="verdict-title"><span>${title}</span></div><div class="verdict-subtitle">${body}</div></div>`;
  }
  ["matnDisplayContainer", "rulesAuditListContainer", "sanadGraphContainer"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = "";
  });
}

// Execute button: match typed text to a benchmark, then verify
function executeVerification() {
  const textInput = document.getElementById("hadithCustomTextInput");
  const typed = textInput ? textInput.value.trim() : "";

  if (typed && normalizeText(typed) !== normalizeText(chainSourceText)) {
    const match = findBenchmarkMatch(typed);
    if (match) {
      selectPreset(match.id);
    } else {
      showNoBenchmarkMatch();
    }
    return;
  }
  runVerification();
}

// Chain display (read-only): shows the sanad of the selected hadith
let chainDisplayNames = null;
// Matn + translations of the hadith fetched by book & number (so language switches keep them)
let fetchedMatn = null;

const FORMULA_LABELS = {
  "haddathana": "حَدَّثَنَا (Haddathana)",
  "akhbarana": "أَخْبَرَنَا (Akhbarana)",
  "sami'tu": "سَمِعْتُ (Sami'tu)",
  "an": "عَنْ ('An - Mu'an'an)",
  "qala": "قَالَ (Qala)"
};

function renderChainBuilder() {
  const container = document.getElementById("chainStepsList");
  if (!container) return;

  container.innerHTML = "";

  customChainNarrators.forEach((rawiId, index) => {
    const row = document.createElement("div");
    row.className = "chain-step-row";

    const rawi = NARRATORS_DATA[rawiId];
    let name = rawiId;
    let generation = "";
    if (rawi) {
      name = currentLang === "ar" ? rawi.name_ar : (currentLang === "ur" ? rawi.name_ur : rawi.name_en);
      generation = rawi.generation;
    }
    if (chainDisplayNames && chainDisplayNames[index]) {
      name = chainDisplayNames[index];
    }

    let formulaHtml = "";
    if (index < customChainNarrators.length - 1) {
      const f = customChainFormulas[index] || "haddathana";
      formulaHtml = `<span class="formula-label">${FORMULA_LABELS[f] || f}</span>`;
    }

    row.innerHTML = `
      <span class="step-index-badge">${index + 1}</span>
      <span class="step-name">${name}${generation ? ` <span class="step-generation">(${generation})</span>` : ""}</span>
      ${formulaHtml}
    `;

    container.appendChild(row);
  });
}

// Master Verification Trigger
async function runVerification() {
  const resultCard = document.getElementById("verificationResultsCard");
  if (!resultCard) return;

  // Prepare custom or preset payload
  const activeHadith = CORPUS_DATA.find(c => c.id === currentHadithId) || (currentHadithId === "custom" ? fetchedMatn : null);
  const textInput = document.getElementById("hadithCustomTextInput");
  const customMatn = textInput && textInput.value.trim() ? textInput.value.trim() : (activeHadith ? activeHadith.matn_ar : "حديث شريف");

  const corroBox = document.getElementById("corroboratedCheck");
  const corroborated = corroBox ? corroBox.checked : false;

  let verificationResult = null;

  // Try API first, fallback seamlessly to client-side rule engine
  try {
    const res = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hadith_id: currentHadithId !== "custom" ? currentHadithId : null,
        chain_narrators: customChainNarrators,
        chain_formulas: customChainFormulas,
        matn_text: customMatn,
        corroborated,
        language: currentLang
      })
    });
    if (res.ok) {
      verificationResult = await res.json();
    }
  } catch (e) {
    // API server not reachable; fall back directly to client-side rules engine
  }

  if (!verificationResult) {
    const matnObj = activeHadith ? {
      ar: activeHadith.matn_ar,
      en: activeHadith.matn_en,
      ur: activeHadith.matn_ur
    } : {
      ar: customMatn,
      en: customMatn,
      ur: customMatn
    };
    verificationResult = verifyHadithClientSide(customChainNarrators, customChainFormulas, currentHadithId, matnObj, corroborated);
  }

  renderVerificationResults(verificationResult, activeHadith);
}

// Render Results View
function renderVerificationResults(res, activeHadith) {
  const badgeClass = res.badge_class || (res.verdict ? res.verdict.toLowerCase() : "sahih");
  const verdictText = currentLang === "ar" ? res.verdict_ar : (currentLang === "ur" ? res.verdict_ur : res.verdict);
  const subVerdictText = currentLang === "ar" ? res.sub_verdict_ar : (currentLang === "ur" ? res.sub_verdict_ur : res.sub_verdict_en);

  // 1. Verdict Hero
  const heroEl = document.getElementById("verdictHeroContainer");
  if (heroEl) {
    heroEl.className = `verdict-hero ${badgeClass}`;
    heroEl.innerHTML = `
      <div class="verdict-badge-large">
        <span class="verdict-tag">${I18N[currentLang].verdict_label}</span>
        <div class="verdict-title">
          <span>${verdictText}</span>
          ${verdictText !== res.verdict ? `<span style="font-size: 1.1rem; opacity: 0.85;">(${res.verdict})</span>` : ""}
        </div>
        <div class="verdict-subtitle">${subVerdictText}</div>
      </div>
      <div class="verdict-score-ring">
        <svg class="score-circle-svg" viewBox="0 0 82 82">
          <circle class="score-circle-bg" cx="41" cy="41" r="36" />
          <circle class="score-circle-fill" cx="41" cy="41" r="36" 
            style="stroke: var(--color-${badgeClass}); stroke-dashoffset: ${226 - (226 * res.overall_score / 100)};" />
        </svg>
        <div class="score-number">${res.overall_score}%</div>
      </div>
    `;
  }

  // 2. The 5 Rules Audit List
  const rulesListEl = document.getElementById("rulesAuditListContainer");
  if (rulesListEl && res.rule_audits) {
    rulesListEl.innerHTML = "";
    res.rule_audits.forEach((rule, idx) => {
      const card = document.createElement("div");
      card.className = "rule-audit-card";

      const ruleName = currentLang === "ar" ? rule.rule_name_ar : (currentLang === "ur" ? rule.rule_name_ur : rule.rule_name_en);
      const statusClass = rule.status.toLowerCase();
      const statusIcon = statusClass === "pass" ? "✓" : (statusClass === "warning" ? "!" : "✕");

      const details = currentLang === "ar" ? (rule.details_ar || rule.details_en) :
                      (currentLang === "ur" ? (rule.details_ur || rule.details_en) : rule.details_en);

      const detailsHtml = (details || []).map(d => `<li>${d}</li>`).join("");

      card.innerHTML = `
        <div class="rule-header-row">
          <div class="rule-name-group">
            <div class="rule-status-icon ${statusClass}">${statusIcon}</div>
            <span class="rule-label-title">${idx + 1}. ${ruleName}</span>
          </div>
          <span class="rule-score-badge ${statusClass}">${rule.score}%</span>
        </div>
        <div class="rule-progress-bar-bg">
          <div class="rule-progress-bar-fill" style="width: ${rule.score}%; background: var(--color-${statusClass === 'pass' ? 'sahih' : (statusClass === 'warning' ? 'daif' : 'mawdu')});"></div>
        </div>
        <ul class="rule-details-list">
          ${detailsHtml}
        </ul>
        ${rule.scholar_reference ? `<div class="rule-scholar-footnote">📖 ${rule.scholar_reference}</div>` : ''}
      `;
      rulesListEl.appendChild(card);
    });
  }

  // 3. Render Sanad Graph
  renderSanadGraph("sanadGraphContainer", res.chain_nodes, res.chain_edges);

  // 4. Render Matn Display Box
  const matnContainer = document.getElementById("matnDisplayContainer");
  if (matnContainer) {
    const matnAr = activeHadith ? activeHadith.matn_ar : (res.matn ? res.matn.ar : "");
    const matnTrans = currentLang === "ur" ?
      (activeHadith ? activeHadith.matn_ur : (res.matn ? res.matn.ur : "")) :
      (activeHadith ? activeHadith.matn_en : (res.matn ? res.matn.en : ""));

    matnContainer.innerHTML = `
      <div class="matn-display-box">
        <div class="matn-quote-text">${matnAr}</div>
        <div class="matn-translation-text">
          <strong>${currentLang === 'ur' ? 'اردو ترجمہ:' : 'Translation:'}</strong> ${matnTrans}
        </div>
      </div>
    `;
  }
}

// Render Dedicated Graph Tab
function renderDedicatedGraph() {
  const container = document.getElementById("dedicatedSanadGraph");
  if (!container) return;

  const chainNodes = customChainNarrators.map((nid, idx) => {
    const rawi = NARRATORS_DATA[nid] || { id: nid, name_en: nid, name_ar: nid, name_ur: nid, generation: "Narrator" };
    return { step: idx + 1, ...rawi };
  });

  const chainEdges = customChainFormulas.map(f => ({ formula: f, has_warning: f === 'an' }));
  renderSanadGraph("dedicatedSanadGraph", chainNodes, chainEdges);
}

// Corpus Library Tab
function renderCorpusLibrary(query = "") {
  const grid = document.getElementById("hadithCorpusGrid");
  if (!grid) return;

  grid.innerHTML = "";
  const filtered = CORPUS_DATA.filter(item => {
    if (!query) return true;
    const q = query.toLowerCase();
    return item.title_en.toLowerCase().includes(q) ||
           item.title_ar.toLowerCase().includes(q) ||
           item.title_ur.toLowerCase().includes(q) ||
           item.matn_en.toLowerCase().includes(q) ||
           item.matn_ar.toLowerCase().includes(q) ||
           item.matn_ur.toLowerCase().includes(q) ||
           item.book.toLowerCase().includes(q);
  });

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "hadith-corpus-card";
    card.onclick = () => {
      // Switch to verifier and load this preset
      document.querySelector('[data-tab="tabVerifier"]').click();
      selectPreset(item.id);
    };

    const title = currentLang === "ar" ? item.title_ar : (currentLang === "ur" ? item.title_ur : item.title_en);
    const trans = currentLang === "ur" ? item.matn_ur : item.matn_en;

    card.innerHTML = `
      <div>
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <span class="preset-badge ${item.badge_class}">${gradeLabel(item.known_verdict)}</span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">${item.book}</span>
        </div>
        <h4 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--text-primary);">${title}</h4>
        <div class="arabic-text" style="font-size: 1.1rem; line-height: 1.9; margin-bottom: 0.65rem; color: var(--text-primary);">${item.matn_ar.slice(0, 140)}...</div>
        <div style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">${trans.slice(0, 160)}...</div>
      </div>
      <div style="margin-top: 1rem; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.78rem; color: var(--text-gold); font-weight: 600;">${item.known_sub_verdict}</span>
        <span style="font-size: 0.82rem; color: var(--text-emerald); font-weight: 600;">Verify Chain →</span>
      </div>
    `;
    grid.appendChild(card);
  });
}

function filterCorpus(query) {
  renderCorpusLibrary(query);
}

// Biographical Rijal Directory Tab
function renderRijalDirectory(query = "") {
  const grid = document.getElementById("rijalDirectoryGrid");
  if (!grid) return;

  grid.innerHTML = "";
  const narrators = Object.values(NARRATORS_DATA);
  const filtered = narrators.filter(rawi => {
    if (!query) return true;
    const q = query.toLowerCase();
    return rawi.name_en.toLowerCase().includes(q) ||
           rawi.name_ar.toLowerCase().includes(q) ||
           rawi.name_ur.toLowerCase().includes(q) ||
           rawi.generation.toLowerCase().includes(q);
  });

  filtered.forEach(rawi => {
    const card = document.createElement("div");
    card.className = "glass-card";
    card.style.cursor = "pointer";
    card.onclick = () => showNarratorDetailModal(rawi.id);

    const name = currentLang === "ar" ? rawi.name_ar : (currentLang === "ur" ? rawi.name_ur : rawi.name_en);
    const gen = currentLang === "ar" ? (rawi.generation_ar || rawi.generation) : (currentLang === "ur" ? (rawi.generation_ur || rawi.generation) : rawi.generation);
    const notes = currentLang === "ar" ? rawi.notes_ar : (currentLang === "ur" ? rawi.notes_ur : rawi.notes_en);

    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.65rem;">
        <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--text-primary);">${name}</h4>
        <span class="rawi-node-tier ${rawi.reliability_tier}">${rawi.reliability_tier}</span>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-gold); margin-bottom: 0.5rem;">
        <span>${gen}</span> • <span>${rawi.death_hijri ? rawi.death_hijri + ' AH' : 'N/A'}</span> • <span>${rawi.city || 'Hijaz'}</span>
      </div>
      <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5;">${notes}</p>
    `;
    grid.appendChild(card);
  });
}

// Print / Export Certificate
function exportTahqiqReport() {
  window.print();
}

// Re-render elements on language change
function updateActiveViewTranslations() {
  loadIubBooksList();
  initPresets();
  renderChainBuilder();
  renderCorpusLibrary();
  renderRijalDirectory();
  renderAuditorWizard();
  runVerification();
  if (lastFetchedIubData) {
    renderIubHadithCard(lastFetchedIubData);
  }
}

// =========================================================
// =========================================================
// ISLAMICURDUBOOKS.COM REST API INTEGRATION
// =========================================================

let lastFetchedIubData = null;
let iubCollectionsList = [];

// Dynamically fetch and populate collections from GET /api/islamicurdubooks/books
async function loadIubBooksList() {
  const bookSelect = document.getElementById("iubBookSelect");
  if (!bookSelect) return;

  try {
    const res = await fetch("/api/islamicurdubooks/books");
    if (res.ok) {
      iubCollectionsList = await res.json();
    }
  } catch (e) {
    // Fail-safe default collections
  }

  if (!iubCollectionsList || iubCollectionsList.length === 0) {
    iubCollectionsList = [
      { id: 1, name_ar: "صحيح البخاري", name_ur: "صحیح بخاری", name_en: "Sahih al-Bukhari", total_hadiths: 7563 },
      { id: 2, name_ar: "صحيح مسلم", name_ur: "صحیح مسلم", name_en: "Sahih Muslim", total_hadiths: 7563 },
      { id: 3, name_ar: "سنن أبي داود", name_ur: "سنن ابی داؤد", name_en: "Sunan Abi Dawud", total_hadiths: 5274 },
      { id: 4, name_ar: "سنن ابن ماجه", name_ur: "سنن ابن ماجہ", name_en: "Sunan Ibn Majah", total_hadiths: 4341 },
      { id: 5, name_ar: "سنن النسائي", name_ur: "سنن نسائی", name_en: "Sunan an-Nasa'i", total_hadiths: 5758 },
      { id: 6, name_ar: "جامع الترمذي", name_ur: "جامع ترمذی", name_en: "Jami' at-Tirmidhi", total_hadiths: 3956 },
      { id: 7, name_ar: "مشكاة المصابيح", name_ur: "مشکوٰۃ المصابیح", name_en: "Mishkat al-Masabih", total_hadiths: 6294 },
      { id: 8, name_ar: "مسند أحمد بن حنبل", name_ur: "مسند احمد بن حنبل", name_en: "Musnad Ahmad", total_hadiths: 27647 }
    ];
  }

  const selectedVal = bookSelect.value || "1";
  bookSelect.innerHTML = iubCollectionsList.map(b => {
    const bookName = currentLang === 'ar' ? b.name_ar : (currentLang === 'ur' ? b.name_ur : b.name_en);
    const countStr = b.total_hadiths ? ` (${b.total_hadiths.toLocaleString()} ${currentLang === 'ur' ? 'احادیث' : (currentLang === 'ar' ? 'حديثاً' : 'Hadiths')})` : '';
    return `<option value="${b.id}" ${b.id.toString() === selectedVal.toString() ? 'selected' : ''}>${b.id}. ${bookName}${countStr}</option>`;
  }).join('');
}

// Fetch from GET /api/islamicurdubooks/fetch?book_id={id}&hadith_number={no}
async function fetchFromIslamicUrduBooks() {
  const bookSelect = document.getElementById("iubBookSelect");
  const numInput = document.getElementById("iubHadithNumInput");
  const spinner = document.getElementById("iubFetchSpinner");
  const btn = document.getElementById("iubFetchBtn");

  if (!bookSelect || !numInput) return;
  const bookId = parseInt(bookSelect.value, 10);
  const hadithNumber = numInput.value.trim() || "1";

  if (spinner) spinner.style.display = "inline";
  if (btn) btn.disabled = true;

  try {
    const res = await fetch(`/api/islamicurdubooks/fetch?book_id=${bookId}&hadith_number=${encodeURIComponent(hadithNumber)}`);
    if (!res.ok) {
      throw new Error(`API returned status ${res.status}`);
    }
    const data = await res.json();
    lastFetchedIubData = data;
    renderIubHadithCard(data);
    await verifyFetchedIubHadith();
  } catch (err) {
    console.error("Error fetching from API:", err);
    // Display error feedback gracefully
    const placeholder = document.getElementById("iubPlaceholder");
    if (placeholder) {
      placeholder.style.display = "block";
      placeholder.innerHTML = `
        <div style="font-size: 2.5rem; margin-bottom: 0.75rem; color: var(--color-daif);">⚠️</div>
        <h4 style="font-size: 1.1rem; color: var(--text-primary); margin-bottom: 0.5rem;">
          ${currentLang === 'ur' ? 'حدیث حاصل کرنے میں خرابی' : 'Error Fetching Hadith'}
        </h4>
        <p style="font-size: 0.88rem; max-width: 380px; margin: 0 auto; color: var(--text-muted);">
          ${currentLang === 'ur' ? 'براہ کرم کتاب کا انتخاب اور حدیث نمبر دوبارہ چیک کریں۔' : 'Please check your connection and verify the book and Hadith number.'}
        </p>
      `;
    }
  } finally {
    if (spinner) spinner.style.display = "none";
    if (btn) btn.disabled = false;
  }
}

function setIubQuick(bookId, hadithNumber) {
  const bookSelect = document.getElementById("iubBookSelect");
  const numInput = document.getElementById("iubHadithNumInput");
  if (bookSelect) bookSelect.value = bookId;
  if (numInput) numInput.value = hadithNumber;
  fetchFromIslamicUrduBooks();
}

function renderIubHadithCard(data) {
  const placeholder = document.getElementById("iubPlaceholder");
  const card = document.getElementById("iubContentCard");
  if (!card) return;

  if (placeholder) placeholder.style.display = "none";
  card.style.display = "block";

  const bookBadge = document.getElementById("iubBookBadge");
  const hadithBadge = document.getElementById("iubHadithNoBadge");
  const chapterInfo = document.getElementById("iubChapterInfo");
  const arabicText = document.getElementById("iubArabicText");
  const urduText = document.getElementById("iubUrduText");
  const translatorName = document.getElementById("iubTranslatorName");
  const narratorsSection = document.getElementById("iubNarratorsSection");
  const narratorsList = document.getElementById("iubNarratorsList");

  const bookName = currentLang === 'ar' ? data.book_name_ar : (currentLang === 'ur' ? data.book_name_ur : data.book_name_en);
  if (bookBadge) bookBadge.textContent = bookName;
  if (hadithBadge) hadithBadge.textContent = `${currentLang === 'ur' ? 'حدیث نمبر: ' : (currentLang === 'ar' ? 'حديث رقم: ' : 'Hadith #')}${data.hadith_number}`;

  const chap = currentLang === 'ur' ? (data.chapter_ur || data.chapter_ar) : (data.chapter_ar || data.chapter_ur);
  const bab = currentLang === 'ur' ? (data.bab_ur || data.bab_ar) : (data.bab_ar || data.bab_ur);
  if (chapterInfo) chapterInfo.innerHTML = `<strong>${chap || ''}</strong> ${bab ? '• ' + bab : ''}`;

  if (arabicText) arabicText.textContent = data.arabic_text || "";

  if (urduText) {
    const firstTrans = data.urdu_translations && data.urdu_translations.length > 0 ? data.urdu_translations[0].text : (currentLang === 'ur' ? "ترجمہ دستیاب نہیں۔" : "Translation not available.");
    urduText.textContent = firstTrans;
  }
  if (translatorName) {
    const transName = data.urdu_translations && data.urdu_translations.length > 0 ? data.urdu_translations[0].translator : (currentLang === 'ur' ? "مترجم" : "Translator");
    translatorName.textContent = transName;
  }

  if (narratorsSection && narratorsList) {
    if (data.sanad_narrators && data.sanad_narrators.length > 0) {
      narratorsSection.style.display = "block";
      narratorsList.innerHTML = data.sanad_narrators.map(n => `
        <span class="rawi-node-tier thiqah" style="font-size: 0.8rem; padding: 0.25rem 0.6rem;">${n.name}</span>
      `).join('');
    } else {
      narratorsSection.style.display = "none";
    }
  }
}

// Call POST /api/islamicurdubooks/import-and-verify
async function verifyFetchedIubHadith() {
  if (!lastFetchedIubData) return;

  const bookId = lastFetchedIubData.book_id || 1;
  const hadithNumber = lastFetchedIubData.hadith_number || "1";

  // Switch to Smart Verifier tab
  const verifierTabBtn = document.querySelector('[data-tab="tabVerifier"]');
  if (verifierTabBtn) verifierTabBtn.click();

  // Populate Custom Text Input with Arabic Matn
  const textInput = document.getElementById("hadithCustomTextInput");
  if (textInput) {
    textInput.value = lastFetchedIubData.arabic_text || "";
  }
  chainSourceText = lastFetchedIubData.arabic_text || "";

  const translations = lastFetchedIubData.urdu_translations || [];
  const urduTrans = translations.find(t => /[\u0600-\u06FF]/.test(t.text)) || null;
  const englishTrans = translations.find(t => !/[\u0600-\u06FF]/.test(t.text)) || null;
  fetchedMatn = {
    matn_ar: lastFetchedIubData.arabic_text || "",
    matn_en: englishTrans ? englishTrans.text : "",
    matn_ur: urduTrans ? urduTrans.text : ""
  };
  if (!fetchedMatn.matn_en) fetchedMatn.matn_en = currentLang === "en" ? "English translation is not available for this hadith." : fetchedMatn.matn_ar;
  if (!fetchedMatn.matn_ur) fetchedMatn.matn_ur = "اس حدیث کا اردو ترجمہ دستیاب نہیں۔";

  try {
    const res = await fetch("/api/islamicurdubooks/import-and-verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        book_id: bookId,
        hadith_number: hadithNumber,
        corroborated: !!(document.getElementById("corroboratedCheck") || {}).checked
      })
    });

    if (res.ok) {
      const result = await res.json();
      currentHadithId = "custom";
      document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
      
      // Update custom narrators from server response
      if (result.verification && result.verification.chain_nodes) {
        customChainNarrators = result.verification.chain_nodes.map(n => n.id || n.name_en);
        chainDisplayNames = result.verification.chain_nodes.map(n => currentLang === 'ar' ? n.name_ar : (currentLang === 'ur' ? n.name_ur : n.name_en));
        customChainFormulas = Array(Math.max(customChainNarrators.length - 1, 1)).fill("haddathana");
        renderChainBuilder();
      }
      
      renderVerificationResults(result.verification, fetchedMatn);
      return;
    }
  } catch (e) {
    console.error("Direct import-and-verify failed, running client verification:", e);
  }

  // Fallback to local verification
  if (lastFetchedIubData.sanad_narrators && lastFetchedIubData.sanad_narrators.length > 0) {
    const mapped = [];
    const names = [];
    lastFetchedIubData.sanad_narrators.forEach(n => {
      names.push(n.name);
      let foundKey = NARRATORS_DATA[n.standard_id] ? n.standard_id : null;
      for (const [key, rawi] of Object.entries(NARRATORS_DATA)) {
        if (foundKey) break;
        if (rawi.name_ar.includes(n.name) || n.name.includes(rawi.name_ar)) {
          foundKey = key;
          break;
        }
      }
      mapped.push(foundKey || "al_zuhri");
    });
    if (!mapped.includes("prophet_muhammad")) {
      mapped.push("prophet_muhammad");
    }
    chainDisplayNames = names;
    customChainNarrators = mapped;
    customChainFormulas = Array(Math.max(mapped.length - 1, 1)).fill("haddathana");
  }

  currentHadithId = "custom";
  document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
  renderChainBuilder();
  runVerification();
}

