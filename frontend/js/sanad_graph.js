/**
 * Interactive Sanad (Chain of Narrators) Graph Visualizer
 * Renders node sequences, transmission formula arrows, and inspector popups.
 */

function renderSanadGraph(containerId, chainNodes, chainEdges) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  const flowWrapper = document.createElement("div");
  flowWrapper.className = "sanad-chain-flow";

  if (!chainNodes || chainNodes.length === 0) {
    flowWrapper.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem;">No chain data available to render.</p>`;
    container.appendChild(flowWrapper);
    return;
  }

  chainNodes.forEach((node, idx) => {
    // Determine badge class & color based on reliability tier
    let tierClass = "thiqah";
    let tierLabelEn = "Thiqah (Trustworthy)";
    let tierLabelAr = "ثقة ثبت";
    let tierLabelUr = "ثقہ و معتبر";

    if (node.generation === "Prophet") {
      tierClass = "sahabi";
      tierLabelEn = "Prophet ﷺ";
      tierLabelAr = "النبي المصطفى ﷺ";
      tierLabelUr = "رسول اللہ ﷺ";
    } else if (node.reliability_tier === "sahabi_adl") {
      tierClass = "sahabi";
      tierLabelEn = "Sahabi ('Adl)";
      tierLabelAr = "صحابي جليل";
      tierLabelUr = "جلیل القدر صحابی";
    } else if (node.reliability_tier === "saduq") {
      tierClass = "saduq";
      tierLabelEn = "Saduq (Fair)";
      tierLabelAr = "صدوق حسن الحديث";
      tierLabelUr = "صدوق";
    } else if (node.reliability_tier === "daif") {
      tierClass = "daif";
      tierLabelEn = "Da'if (Weak)";
      tierLabelAr = "ضعيف الحديث";
      tierLabelUr = "ضعیف راوی";
    } else if (node.reliability_tier === "matruk") {
      tierClass = "kadhdhab";
      tierLabelEn = "Matruk (Abandoned)";
      tierLabelAr = "متروك الحديث";
      tierLabelUr = "متروک الحدیث";
    } else if (node.reliability_tier === "kadhdhab") {
      tierClass = "kadhdhab";
      tierLabelEn = "Kadhdhab (Fabricator)";
      tierLabelAr = "كذاب وضاع";
      tierLabelUr = "کذاب و وضاع";
    }

    // Localized name & tier
    const displayName = currentLang === "ar" ? (node.name_ar || node.name_en) : 
                        (currentLang === "ur" ? (node.name_ur || node.name_en) : node.name_en);
    const displayTier = currentLang === "ar" ? tierLabelAr : 
                        (currentLang === "ur" ? tierLabelUr : tierLabelEn);

    // Rawi Node Card
    const nodeEl = document.createElement("div");
    nodeEl.className = `rawi-node ${tierClass}`;
    nodeEl.setAttribute("data-rawi-id", node.id || node.name_en);
    nodeEl.onclick = () => showNarratorDetailModal(node.id || node.name_en);

    nodeEl.innerHTML = `
      <div class="rawi-node-step">Stage ${node.step || idx + 1}</div>
      <div class="rawi-node-name">${displayName}</div>
      <div class="rawi-node-tier ${tierClass}">${displayTier}</div>
    `;

    flowWrapper.appendChild(nodeEl);

    // Render edge arrow if not last node
    if (idx < chainNodes.length - 1) {
      const edge = chainEdges && chainEdges[idx] ? chainEdges[idx] : { formula: "an", has_warning: false };
      const arrowEl = document.createElement("div");
      arrowEl.className = "chain-link-arrow";

      const formulaName = edge.formula || "an";
      const isWarn = edge.has_warning;

      arrowEl.innerHTML = `
        <span class="formula-tag" style="color: ${isWarn ? 'var(--color-daif)' : 'var(--text-gold)'}">${formulaName}</span>
        <div class="link-line ${isWarn ? 'warning' : ''}"></div>
      `;
      flowWrapper.appendChild(arrowEl);
    }
  });

  container.appendChild(flowWrapper);
}

function showNarratorDetailModal(rawiId) {
  const rawi = NARRATORS_DATA[rawiId];
  if (!rawi) return;

  const modal = document.getElementById("narratorModal");
  if (!modal) return;

  const nameEl = document.getElementById("modalRawiName");
  const metaEl = document.getElementById("modalRawiMeta");
  const notesEl = document.getElementById("modalRawiNotes");
  const metricsEl = document.getElementById("modalRawiMetrics");

  const name = currentLang === "ar" ? (rawi.name_ar || rawi.name_en) :
               (currentLang === "ur" ? (rawi.name_ur || rawi.name_en) : rawi.name_en);
  const gen = currentLang === "ar" ? (rawi.generation_ar || rawi.generation) :
              (currentLang === "ur" ? (rawi.generation_ur || rawi.generation) : rawi.generation);
  const notes = currentLang === "ar" ? (rawi.notes_ar || rawi.notes_en) :
                (currentLang === "ur" ? (rawi.notes_ur || rawi.notes_en) : rawi.notes_en);

  if (nameEl) nameEl.textContent = name;
  if (metaEl) {
    metaEl.innerHTML = `
      <span>🏛️ ${gen}</span> • 
      <span>📅 ${rawi.death_hijri ? rawi.death_hijri + ' AH' : 'N/A'}</span> • 
      <span>📍 ${rawi.city || 'Hijaz'}</span>
    `;
  }
  if (notesEl) notesEl.textContent = notes;
  if (metricsEl) {
    metricsEl.innerHTML = `
      <div style="display: flex; gap: 1rem; margin-top: 1rem; background: var(--bg-tertiary); padding: 0.85rem; border-radius: var(--radius-sm);">
        <div style="flex: 1; text-align: center;">
          <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">'Adalah (Integrity)</div>
          <div style="font-size: 1.3rem; font-weight: 800; color: var(--text-emerald);">${rawi.integrity_score || 100}%</div>
        </div>
        <div style="flex: 1; text-align: center; border-left: 1px solid var(--border-subtle);">
          <div style="font-size: 0.75rem; color: var(--text-secondary); text-transform: uppercase;">Dabt (Precision)</div>
          <div style="font-size: 1.3rem; font-weight: 800; color: var(--text-gold);">${rawi.memory_score || 95}%</div>
        </div>
      </div>
    `;
  }

  modal.classList.add("active");
}

function closeNarratorModal() {
  const modal = document.getElementById("narratorModal");
  if (modal) modal.classList.remove("active");
}
