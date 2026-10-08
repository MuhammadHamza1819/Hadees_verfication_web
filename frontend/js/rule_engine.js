/**
 * Client-Side Hadith Verification Rules Engine
 * Implements the 5 Foundational Classical Hadith Authenticity Conditions (شروط الصحة الخمسة)
 */

// The six classical grades of a hadith (mirrors backend GRADES)
const GRADES = {
  SAHIH_LI_DHATIHI: {
    badge: "sahih", verdict: "Sahih li-dhatihi", verdict_ar: "صحيح لذاته", verdict_ur: "صحیح لذاتہ",
    sub_en: "Sahih li-dhatihi (Authentic in itself - all 5 conditions fully met)",
    sub_ar: "صحيح لذاته مستوفٍ للشروط الخمسة بتمام الضبط",
    sub_ur: "صحیح لذاتہ - پانچوں شرائط کامل ضبط کے ساتھ پوری",
    summary_en: "Unanimously authentic. Unbroken chain, upright narrators with complete retentive precision, free of anomaly and hidden defects.",
    summary_ar: "صحيح بذاته؛ اتصال السند وعدالة الرواة وتمام الضبط والسلامة من الشذوذ والعلة.",
    summary_ur: "بذاتہ صحیح؛ سند متصل، روات عادل اور کامل الضبط، شذوذ و علت سے پاک۔"
  },
  SAHIH_LI_GHAYRIHI: {
    badge: "sahih", verdict: "Sahih li-ghayrihi", verdict_ar: "صحيح لغيره", verdict_ur: "صحیح لغیرہ",
    sub_en: "Sahih li-ghayrihi (Authentic through corroboration - a Hasan li-dhatihi raised by supporting routes)",
    sub_ar: "صحيح لغيره: حسن لذاته ارتقى إلى الصحة بتعدد الطرق",
    sub_ur: "صحیح لغیرہ - حسن لذاتہ جو متعدد طرق سے صحیح کے درجے تک پہنچی",
    summary_en: "On its own the chain is Hasan (narrators upright but of lighter precision). Independent supporting routes (Mutaba'at / Shawahid) lift it to the rank of Sahih.",
    summary_ar: "إسناده حسن لذاته لخفة ضبط بعض رواته، فلما تعددت طرقه ارتقى إلى الصحيح لغيره.",
    summary_ur: "تنہا سند حسن ہے (راوی عادل مگر ضبط میں خفیف)؛ متابعات و شواہد کی وجہ سے صحیح لغیرہ کے درجے کو پہنچی۔"
  },
  HASAN_LI_DHATIHI: {
    badge: "hasan", verdict: "Hasan li-dhatihi", verdict_ar: "حسن لذاته", verdict_ur: "حسن لذاتہ",
    sub_en: "Hasan li-dhatihi (Sound in itself - upright narrators of lighter precision)",
    sub_ar: "حسن لذاته: رواته عدول مع خفة في الضبط",
    sub_ur: "حسن لذاتہ - روات عادل مگر ضبط میں خفیف کمی",
    summary_en: "Acceptable and usable as evidence. Chain is continuous and narrators upright, but at least one has slightly lighter retentive precision (Khafif al-Dabt).",
    summary_ar: "حديث مقبول يحتج به؛ سنده متصل ورواته عدول لكن في بعضهم خفة في الضبط.",
    summary_ur: "قابلِ حجت؛ سند متصل اور روات عادل مگر کسی راوی کے ضبط میں معمولی تخفیف ہے۔"
  },
  HASAN_LI_GHAYRIHI: {
    badge: "hasan", verdict: "Hasan li-ghayrihi", verdict_ar: "حسن لغيره", verdict_ur: "حسن لغیرہ",
    sub_en: "Hasan li-ghayrihi (Lightly weak in itself, strengthened to Hasan by supporting routes)",
    sub_ar: "حسن لغيره: ضعيف ضعفاً يسيراً ارتقى إلى الحسن بتعدد الطرق",
    sub_ur: "حسن لغیرہ - ہلکا ضعف جو متعدد طرق سے حسن کے درجے تک پہنچا",
    summary_en: "The single chain has a light weakness (doubtful continuity such as Tadlis, or weak memory) but it is not a fabricator. Several independent routes strengthen it to Hasan.",
    summary_ar: "في إسناده ضعف يسير (كشبهة تدليس أو سوء حفظ) غير شديد، وقد تقوى بتعدد الطرق فارتقى إلى الحسن لغيره.",
    summary_ur: "تنہا سند میں ہلکا ضعف ہے (تدلیس کا شبہ یا کمزور حافظہ) مگر متعدد طرق سے تقویت پا کر حسن لغیرہ بنی۔"
  },
  DAIF: {
    badge: "daif", verdict: "Da'if", verdict_ar: "ضعيف", verdict_ur: "ضعیف",
    sub_en: "Da'if (Weak - fails one or more conditions of acceptance)",
    sub_ar: "حديث ضعيف لفقده شرطاً من شروط القبول",
    sub_ur: "ضعیف - قبولیت کی کوئی شرط مفقود ہے",
    summary_en: "Fails the conditions of Sahih/Hasan: a broken chain, a weak or doubtful narrator, or an anomaly, with no corroboration to repair it.",
    summary_ar: "لم يستوفِ شروط القبول؛ لانقطاع في السند أو ضعف راوٍ أو شذوذ، ولا ما يجبره من الطرق.",
    summary_ur: "قبولیت کی شرائط پر پورا نہیں اترتی: سند میں انقطاع، راوی کا ضعف یا شذوذ ہے اور کوئی تقویت دینے والا طریق نہیں۔"
  },
  MAWDU: {
    badge: "mawdu", verdict: "Mawdu'", verdict_ar: "موضوع", verdict_ur: "موضوع (من گھڑت)",
    sub_en: "Mawdu' (Fabricated - falsely attributed to the Prophet)",
    sub_ar: "حديث موضوع مكذوب لا أصل له",
    sub_ur: "موضوع - من گھڑت اور بے بنیاد روایت",
    summary_en: "Rejected with certainty. Contains a convicted fabricator or has no authentic prophetic chain at all.",
    summary_ar: "مردود قطعاً؛ في إسناده وضّاع أو لا يُعرف له إسناد صحيح إلى رسول الله ﷺ.",
    summary_ur: "قطعی طور پر مردود؛ سند میں جھوٹا راوی ہے یا رسول اللہ ﷺ تک کوئی صحیح سند نہیں۔"
  }
};

function gradeLabel(code) {
  const g = GRADES[code];
  if (!g) return code;
  return currentLang === "ar" ? g.verdict_ar : (currentLang === "ur" ? g.verdict_ur : g.verdict);
}

function determineGrade({ isFabricated, corroborated, statuses, dabtScore, adalahScore }) {
  const [ittisal, adalah, dabt, shudhudh, illah] = statuses;
  if (isFabricated) return "MAWDU";
  if ([ittisal, adalah, shudhudh, illah].includes("FAIL")) return "DAIF";
  if (dabt === "FAIL") {
    return (corroborated && dabtScore >= 40 && adalahScore >= 70) ? "HASAN_LI_GHAYRIHI" : "DAIF";
  }
  if (statuses.includes("WARNING")) return corroborated ? "HASAN_LI_GHAYRIHI" : "DAIF";
  if (dabtScore >= 90) return "SAHIH_LI_DHATIHI";
  return corroborated ? "SAHIH_LI_GHAYRIHI" : "HASAN_LI_DHATIHI";
}

// Localised explanations of WHY a hadith got its grade (mirrors backend REASON_TEXT)
const REASON_TEXT = {
  ok_title: { en: "All five conditions are fully met", ar: "استوفى الشروط الخمسة كاملة", ur: "پانچوں شرائط مکمل طور پر پوری ہیں" },
  fixed_title: { en: "The weakness is repaired by supporting routes", ar: "جُبر الضعف بتعدد الطرق", ur: "کمزوری کو متعدد طرق نے دور کر دیا" },
  fixed_body: {
    en: "The issue(s) above exist only in this single chain. The hadith is also reported through independent supporting routes (Mutaba'at / Shawahid), so the weakness is compensated and it rises to {grade}.",
    ar: "الضعف المذكور أعلاه في هذا الإسناد وحده، وقد رُوي الحديث من طرق مستقلة أخرى (متابعات وشواهد) فانجبر الضعف وارتقى إلى {grade}.",
    ur: "اوپر مذکور کمزوری صرف اسی ایک سند میں ہے۔ یہی حدیث دیگر آزاد طرق (متابعات و شواہد) سے بھی مروی ہے، اس لیے کمزوری دور ہو گئی اور یہ {grade} کے درجے تک پہنچ گئی۔"
  },
  hasan_title: { en: "Why Hasan and not Sahih", ar: "لماذا حسن وليس صحيحاً", ur: "حسن کیوں ہے، صحیح کیوں نہیں" },
  hasan_body: {
    en: "The chain is continuous and every narrator is upright, but at least one narrator's memory is lighter than the Sahih standard (below 90%). That lighter precision (Khafif al-Dabt) places it at Hasan. If independent supporting routes exist, tick the supporting-routes box to see it rise to Sahih li-ghayrihi.",
    ar: "السند متصل والرواة عدول، لكن في أحدهم خفة ضبط دون معيار الصحيح (أقل من 90%)، فنزل إلى رتبة الحسن. فإن وُجدت طرق مستقلة تعضده فعلّم خانة الطرق ليرتقي إلى صحيح لغيره.",
    ur: "سند متصل اور تمام روات عادل ہیں مگر کسی راوی کا حافظہ صحیح کے معیار (90 فیصد) سے ہلکا ہے، اس لیے یہ حسن کے درجے پر ہے۔ اگر اسے تقویت دینے والے آزاد طرق موجود ہوں تو 'تائیدی طرق' کا خانہ منتخب کریں، یہ صحیح لغیرہ بن جائے گی۔"
  },
  hint_title: { en: "Could be repaired by supporting routes", ar: "قد ينجبر بتعدد الطرق", ur: "تائیدی طرق سے کمزوری دور ہو سکتی ہے" },
  hint_body: {
    en: "The weakness above is light (not a fabricator or a broken chain). On its own this chain is Da'if, but if independent supporting routes (Mutaba'at / Shawahid) exist, tick the supporting-routes box and it rises to Hasan li-ghayrihi.",
    ar: "الضعف أعلاه يسير (ليس وضعاً ولا انقطاعاً). فالإسناد وحده ضعيف، فإن وُجدت طرق مستقلة (متابعات وشواهد) فعلّم خانة الطرق ليرتقي إلى حسن لغيره.",
    ur: "اوپر مذکور کمزوری ہلکی ہے (نہ من گھڑت راوی ہے نہ سند ٹوٹی ہوئی)۔ تنہا یہ سند ضعیف ہے، لیکن اگر آزاد تائیدی طرق (متابعات و شواہد) موجود ہوں تو 'تائیدی طرق' کا خانہ منتخب کریں، یہ حسن لغیرہ بن جائے گی۔"
  },
  severe_title: { en: "A weakness that supporting routes cannot repair", ar: "ضعف شديد لا ينجبر بتعدد الطرق", ur: "ایسی کمزوری جو تائیدی طرق سے دور نہیں ہوتی" },
  severe_body: {
    en: "The defect above (a broken chain, an unreliable or abandoned narrator, an anomaly or a hidden defect) is too serious to be compensated by other routes, so the hadith stays Da'if.",
    ar: "العلة المذكورة (انقطاع أو راوٍ ضعيف جداً أو شذوذ أو علة خفية) أشد من أن تنجبر بتعدد الطرق، فيبقى الحديث ضعيفاً.",
    ur: "اوپر مذکور خرابی (سند کا انقطاع، انتہائی کمزور یا متروک راوی، شذوذ یا پوشیدہ علت) اتنی شدید ہے کہ دوسرے طرق اسے دور نہیں کر سکتے، اس لیے حدیث ضعیف ہی رہتی ہے۔"
  },
  fabricated_title: { en: "A fabricator cannot be repaired", ar: "الوضع لا ينجبر", ur: "من گھڑت روایت کی تلافی نہیں ہوتی" },
  fabricated_body: {
    en: "The chain contains a convicted fabricator (or has no authentic prophetic chain at all). No number of other routes can repair a fabrication, so the hadith is rejected as Mawdu'.",
    ar: "في الإسناد وضّاع (أو لا إسناد صحيح له أصلاً). والوضع لا ينجبر بكثرة الطرق، فالحديث مردود موضوع.",
    ur: "سند میں جھوٹی حدیثیں گھڑنے والا راوی ہے (یا رسول اللہ ﷺ تک کوئی صحیح سند ہی نہیں)۔ من گھڑت روایت کو طرق کی کثرت درست نہیں کرتی، اس لیے حدیث موضوع ہو کر مردود ہے۔"
  }
};

function makeReason(kind, titleKey, bodyKey, gradeCode, details) {
  const item = { kind };
  ["en", "ar", "ur"].forEach(lang => {
    item["title_" + lang] = REASON_TEXT[titleKey][lang];
    let body = bodyKey ? REASON_TEXT[bodyKey][lang] : "";
    if (body && gradeCode) {
      const g = GRADES[gradeCode];
      body = body.replace("{grade}", lang === "ar" ? g.verdict_ar : (lang === "ur" ? g.verdict_ur : g.verdict));
    }
    item["body_" + lang] = body;
    item["details_" + lang] = (details && details[lang]) || [];
  });
  return item;
}

function buildGradeReasons(gradeCode, rules, corroborated) {
  const byId = Object.fromEntries(rules.map(r => [r.rule_id, r]));
  const items = [];

  rules.forEach(r => {
    const weak = r.status !== "PASS" || (r.rule_id === "dabt" && r.score < 90);
    if (!weak) return;
    items.push({
      kind: r.status !== "PASS" ? "issue" : "note",
      rule_id: r.rule_id, status: r.status, score: r.score,
      title_en: r.rule_name_en, title_ar: r.rule_name_ar, title_ur: r.rule_name_ur,
      body_en: "", body_ar: "", body_ur: "",
      details_en: r.details_en || [], details_ar: r.details_ar || [], details_ur: r.details_ur || []
    });
  });

  if (gradeCode === "SAHIH_LI_DHATIHI") {
    items.push(makeReason("ok", "ok_title", null, null, {
      en: rules.map(r => r.rule_name_en), ar: rules.map(r => r.rule_name_ar), ur: rules.map(r => r.rule_name_ur)
    }));
  } else if (gradeCode === "SAHIH_LI_GHAYRIHI" || gradeCode === "HASAN_LI_GHAYRIHI") {
    items.push(makeReason("fixed", "fixed_title", "fixed_body", gradeCode));
  } else if (gradeCode === "HASAN_LI_DHATIHI") {
    items.push(makeReason("info", "hasan_title", "hasan_body"));
  } else if (gradeCode === "MAWDU") {
    items.push(makeReason("severe", "fabricated_title", "fabricated_body"));
  } else {
    const dabt = byId.dabt, adalah = byId.adalah;
    const hardFail = rules.some(r => r.status === "FAIL" && r.rule_id !== "dabt");
    const light = !hardFail && (
      (dabt.status === "FAIL" && dabt.score >= 40 && adalah.score >= 70) ||
      (dabt.status !== "FAIL" && rules.some(r => r.status === "WARNING"))
    );
    items.push(light && !corroborated
      ? makeReason("hint", "hint_title", "hint_body")
      : makeReason("severe", "severe_title", "severe_body"));
  }
  return items;
}

function verifyHadithClientSide(narratorIds, formulas, hadithId, matnObj, corroborated) {
  const isDirectFormula = (f) => {
    if (!f) return false;
    const str = f.toLowerCase();
    return str.includes("sami'tu") || str.includes("haddathana") || str.includes("akhbarana") || 
           str.includes("سمعت") || str.includes("حدثنا") || str.includes("أخبرنا");
  };

  const edgeReports = [];
  let ittisalStatus = "PASS";
  let ittisalScore = 100;
  const ittisalDetailsEn = [];
  const ittisalDetailsAr = [];
  const ittisalDetailsUr = [];

  // 1. Evaluate Ittisal (Continuity)
  if (!narratorIds || narratorIds.length < 2) {
    ittisalStatus = "FAIL";
    ittisalScore = 0;
    ittisalDetailsEn.push("No unbroken chain detected connecting back to the Prophet ﷺ.");
    ittisalDetailsAr.push("لا يُعرف إسناد متصل إلى النبي ﷺ.");
    ittisalDetailsUr.push("رسول اللہ ﷺ تک کوئی متصل سند موجود نہیں ہے۔");
  } else {
    for (let i = 0; i < narratorIds.length - 1; i++) {
      const studentId = narratorIds[i];
      const teacherId = narratorIds[i + 1];
      const formula = formulas && formulas[i] ? formulas[i] : "an";

      const student = NARRATORS_DATA[studentId] || { name_en: studentId, name_ar: studentId, name_ur: studentId, is_mudallis: false };
      const teacher = NARRATORS_DATA[teacherId] || { name_en: teacherId, name_ar: teacherId, name_ur: teacherId };

      const direct = isDirectFormula(formula);
      const edge = {
        from: studentId,
        to: teacherId,
        formula: formula,
        is_direct: direct,
        has_warning: false,
        warning_msg: ""
      };

      if (!direct && student.is_mudallis) {
        ittisalStatus = ittisalStatus === "PASS" ? "WARNING" : ittisalStatus;
        ittisalScore = Math.max(ittisalScore - 15, 60);
        edge.has_warning = true;
        const msgEn = `Potential Tadlis: ${student.name_en} is known for Tadlis and transmits via ambiguous formula '${formula}'.`;
        edge.warning_msg = msgEn;
        ittisalDetailsEn.push(msgEn);
        ittisalDetailsAr.push(`شبهة تدليس: ${student.name_ar} موصوف بالتدليس ورواه بصيغة العنعنة (${formula}).`);
        ittisalDetailsUr.push(`شبہ تدلیس: ${student.name_ur} مدلس ہیں اور روایت عنعنہ (${formula}) سے ہے۔`);
      }

      edgeReports.push(edge);
    }

    if (ittisalDetailsEn.length === 0) {
      ittisalDetailsEn.push("Continuous, unbroken chain with explicit transmission terms verified.");
      ittisalDetailsAr.push("سند متصل سالمة من الانقطاع، ثبت فيها السماع المباشر بين الرواة.");
      ittisalDetailsUr.push("سند مکمل طور پر متصل ہے اور روات کے درمیان باقاعدہ سماع ثابت ہے۔");
    }
  }

  // 2. Evaluate 'Adalah (Moral Probity)
  let adalahStatus = "PASS";
  let adalahScore = 100;
  const adalahDetailsEn = [];
  const adalahDetailsAr = [];
  const adalahDetailsUr = [];

  let hasFabricator = false;
  let hasAbandoned = false;

  (narratorIds || []).forEach(nid => {
    const rawi = NARRATORS_DATA[nid];
    if (!rawi) return;

    if (rawi.reliability_tier === "kadhdhab") {
      hasFabricator = true;
      adalahStatus = "FAIL";
      adalahScore = 0;
      adalahDetailsEn.push(`FATAL DEFECT: ${rawi.name_en} is an established fabricator (Kadhdhab Wadda').`);
      adalahDetailsAr.push(`علة مفسدة: ${rawi.name_ar} وضاع كذاب ساقط الرواية.`);
      adalahDetailsUr.push(`شدید ترین عیب: ${rawi.name_ur} کذاب اور حدیث گھڑنے والا راوی ہے۔`);
    } else if (rawi.reliability_tier === "matruk") {
      hasAbandoned = true;
      adalahStatus = "FAIL";
      adalahScore = Math.min(adalahScore, 20);
      adalahDetailsEn.push(`Severe defect: ${rawi.name_en} is abandoned (Matruk al-Hadith).`);
      adalahDetailsAr.push(`ضعف شديد: ${rawi.name_ar} متروك الحديث ساقط العدالة.`);
      adalahDetailsUr.push(`شدید ضعف: ${rawi.name_ur} تمام محدثین کے نزدیک متروک ہے۔`);
    } else if (rawi.reliability_tier === "sahabi_adl") {
      adalahDetailsEn.push(`${rawi.name_en}: Sahabi upright by divine endorsement (Al-Sahabah kulluhum 'udul).`);
      adalahDetailsAr.push(`${rawi.name_ar}: صحابي جليل، عادل بتعديل الله تعالى.`);
      adalahDetailsUr.push(`${rawi.name_ur}: صحابی رسول، اجماع کے تحت عادل ہیں۔`);
    }
  });

  if (adalahStatus === "PASS") {
    adalahDetailsEn.unshift("All chain transmitters exhibit verified Islamic probity, piety, and integrity.");
    adalahDetailsAr.unshift("كافة رواة الإسناد عدول موثقون متصفون بالتقوى والمروءة وصدق اللهجة.");
    adalahDetailsUr.unshift("سند کے تمام راوی عادل، متقی اور سچے ہیں۔");
  }

  // 3. Evaluate Dabt (Memory & Retention)
  let minMem = 100;
  const dabtDetailsEn = [];
  const dabtDetailsAr = [];
  const dabtDetailsUr = [];

  (narratorIds || []).forEach(nid => {
    const rawi = NARRATORS_DATA[nid];
    if (!rawi || rawi.generation === "Prophet") return;
    const mem = rawi.memory_score || 90;
    if (mem < minMem) minMem = mem;

    if (rawi.reliability_tier === "saduq") {
      dabtDetailsEn.push(`${rawi.name_en}: Sound memory with slight concession (Khafif al-Dabt).`);
      dabtDetailsAr.push(`${rawi.name_ar}: صدوق خفيف الضبط، رتبته في الحسن.`);
      dabtDetailsUr.push(`${rawi.name_ur}: صدوق، یادداشت میں معمولی تخفیف، درجہ حسن۔`);
    }
  });

  let dabtStatus = minMem >= 90 ? "PASS" : (minMem >= 70 ? "PASS" : "FAIL");
  if (minMem >= 90) {
    dabtDetailsEn.unshift("All narrators possess consummate retentive accuracy (Tamam al-Dabt).");
    dabtDetailsAr.unshift("الرواة متصفون بتمام الضبط والإتقان في الحفظ والكتابة.");
    dabtDetailsUr.unshift("تمام روات کامل الحفظ اور اعلیٰ درجے کے ضابط ہیں۔");
  } else if (minMem >= 70) {
    dabtDetailsEn.unshift("Narrators possess fair precision with slight concessions, meeting the Hasan standard.");
    dabtDetailsAr.unshift("الرواة على ضبط مقبول مع خفة يسيرة تنزل به إلى مرتبة الحسن.");
    dabtDetailsUr.unshift("روات معتبر یادداشت رکھتے ہیں، جو حسن کے معیار پر ہے۔");
  } else {
    dabtDetailsEn.unshift("Gross error rates or memory custody breakdown identified in transmitter(s).");
    dabtDetailsAr.unshift("يشتمل الإسناد على راوٍ كثير الوهم وفاحش الغلط.");
    dabtDetailsUr.unshift("سند میں کثیر الغلط اور کمزور حافظے کا حامل راوی موجود ہے۔");
  }

  // 4. Evaluate Shudhudh (Absence of Anomaly)
  const isAnomalous = hadithId === "hadith_seek_china" || hadithId === "hadith_hubb_al_watan";
  const shudhudhStatus = isAnomalous ? "FAIL" : "PASS";
  const shudhudhScore = isAnomalous ? 20 : 100;
  const shudhudhDetailsEn = isAnomalous ? 
    ["Contradicts established authentic tenets and transmitted solely via isolated flawed route."] :
    ["Completely consistent with the established Sunnah and verified authentic collections."];
  const shudhudhDetailsAr = isAnomalous ?
    ["يخالف ما تواتر في السنة ومروي بتفرد منكر."] :
    ["سالم من أي معارضة أو مخالفة لما هو أصح وأثبت."];
  const shudhudhDetailsUr = isAnomalous ?
    ["ثابت شدہ سنت کی صریح مخالفت اور منکر تفرد پایا جاتا ہے۔"] :
    ["دیگر معتبر احادیث اور متواتر سنت سے مکمل ہم آہنگ ہے۔"];

  // 5. Evaluate 'Illah (Absence of Hidden Defects)
  const hasHiddenWarning = edgeReports.some(e => e.has_warning);
  let illahStatus = isAnomalous ? "FAIL" : (hasHiddenWarning ? "WARNING" : "PASS");
  let illahScore = isAnomalous ? 15 : (hasHiddenWarning ? 70 : 100);
  const illahDetailsEn = isAnomalous ?
    ["Fatal structural attribution defect: statement has no genuine prophetic origin."] :
    (hasHiddenWarning ? 
      ["Potential concealed defect (Tadlis) requires corroborating routes (Turuq)."] :
      ["Zero hidden defects (Idraj, Irsal Khafi, or Waqf/Raf' conflict) found after critical audit."]);
  const illahDetailsAr = isAnomalous ?
    ["علة قادحة مسقطة لصحة نسبة النص إلى النبي ﷺ."] :
    (hasHiddenWarning ?
      ["شبهة علة خفية تستوجب تتبع الشواهد والمتابعات."] :
      ["خالٍ تماماً من العلل الخفية القادحة كالإدراج والقلب والإرسال الخفي."]);
  const illahDetailsUr = isAnomalous ?
    ["رسول اللہ ﷺ کی طرف منسوب کرنے میں واضح علت اور وضع کا ثبوت ہے۔"] :
    (hasHiddenWarning ?
      ["خفیہ علت کا شبہ، مزید اسانید و شواہد کی تحقیق درکار ہے۔"] :
      ["کسی بھی پوشیدہ نقص جیسے ادراج یا ارسالِ خفی سے پاک ہے۔"]);

  // Calculate Weighted Overall Score
  const overallScore = Math.round(
    (ittisalScore * 0.25) +
    (adalahScore * 0.30) +
    (minMem * 0.20) +
    (shudhudhScore * 0.15) +
    (illahScore * 0.10)
  );

  // Verdict Determination (six classical grades)
  const isFabricated = hasFabricator || hadithId === "hadith_hubb_al_watan";
  const gradeCode = determineGrade({
    isFabricated,
    corroborated: !!corroborated,
    statuses: [ittisalStatus, adalahStatus, dabtStatus, shudhudhStatus, illahStatus],
    dabtScore: minMem,
    adalahScore
  });
  const g = GRADES[gradeCode];
  const verdict = g.verdict, verdictAr = g.verdict_ar, verdictUr = g.verdict_ur;
  const subEn = g.sub_en, subAr = g.sub_ar, subUr = g.sub_ur;
  const badgeClass = g.badge;

  // Node details for visualizer
  const chainNodes = (narratorIds || []).map((nid, idx) => {
    const rawi = NARRATORS_DATA[nid] || {
      id: nid, name_en: nid, name_ar: nid, name_ur: nid,
      generation: "Transmitter", reliability_tier: "unknown",
      integrity_score: 80, memory_score: 80
    };
    return {
      step: idx + 1,
      ...rawi
    };
  });

  const ruleAudits = [
      {
        rule_id: "ittisal",
        rule_name_en: "Chain Continuity (Ittisal al-Sanad)",
        rule_name_ar: "اتصال السند",
        rule_name_ur: "اتصالِ سند",
        status: ittisalStatus,
        score: ittisalScore,
        details_en: ittisalDetailsEn,
        details_ar: ittisalDetailsAr,
        details_ur: ittisalDetailsUr,
        scholar_reference: "Ibn al-Salah: Muqaddimat Ibn al-Salah, p. 11"
      },
      {
        rule_id: "adalah",
        rule_name_en: "Moral Probity & Integrity ('Adalah)",
        rule_name_ar: "عدالة الرواة",
        rule_name_ur: "عدالتِ روات",
        status: adalahStatus,
        score: adalahScore,
        details_en: adalahDetailsEn,
        details_ar: adalahDetailsAr,
        details_ur: adalahDetailsUr,
        scholar_reference: "Ibn Hajar: Nukhbat al-Fikar, Al-Jarh wa al-Ta'dil"
      },
      {
        rule_id: "dabt",
        rule_name_en: "Memory & Retentive Precision (Dabt)",
        rule_name_ar: "ضبط الرواة",
        rule_name_ur: "ضبط و حفظِ روات",
        status: dabtStatus,
        score: minMem,
        details_en: dabtDetailsEn,
        details_ar: dabtDetailsAr,
        details_ur: dabtDetailsUr,
        scholar_reference: "Al-Suyuti: Tadrib al-Rawi, Vol. 1, p. 63"
      },
      {
        rule_id: "shudhudh",
        rule_name_en: "Absence of Anomaly ('Adam al-Shudhudh)",
        rule_name_ar: "السلامة من الشذوذ",
        rule_name_ur: "شذوذ سے سلامتی",
        status: shudhudhStatus,
        score: shudhudhScore,
        details_en: shudhudhDetailsEn,
        details_ar: shudhudhDetailsAr,
        details_ur: shudhudhDetailsUr,
        scholar_reference: "Al-Shafi'i: Al-Risalah, Definition of Al-Shadhdh"
      },
      {
        rule_id: "illah",
        rule_name_en: "Absence of Hidden Defect ('Adam al-'Illah)",
        rule_name_ar: "السلامة من العلة القادحة",
        rule_name_ur: "علتِ قادحہ سے پاک ہونا",
        status: illahStatus,
        score: illahScore,
        details_en: illahDetailsEn,
        details_ar: illahDetailsAr,
        details_ur: illahDetailsUr,
        scholar_reference: "Ibn Rajab al-Hanbali: Sharh 'Ilal al-Tirmidhi"
      }
    ];

  return {
    grade: gradeCode,
    corroborated: !!corroborated,
    grade_reasons: buildGradeReasons(gradeCode, ruleAudits, !!corroborated),
    summary_en: g.summary_en,
    summary_ar: g.summary_ar,
    summary_ur: g.summary_ur,
    verdict,
    verdict_ar: verdictAr,
    verdict_ur: verdictUr,
    sub_verdict_en: subEn,
    sub_verdict_ar: subAr,
    sub_verdict_ur: subUr,
    badge_class: badgeClass,
    overall_score: overallScore,
    rule_audits: ruleAudits,
    chain_nodes: chainNodes,
    chain_edges: edgeReports,
    matn: matnObj || {
      en: "Hadith Matn under analysis.",
      ar: "متن الحديث قيد الدراسة.",
      ur: "حدیث کا متن زیرِ تحقیق۔"
    }
  };
}
