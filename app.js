import { createRecipe, DEFAULT_CATALOG, DEFAULT_RECEIPT_MAP, DEFAULT_RECIPES, ROADMAP, STORAGE_KEY } from "./src/data/demo-data.js";
import { parseReceipt as parseReceiptText } from "./src/services/receipts.js";
import { getRecipeMatches as matchRecipes } from "./src/services/recipes.js";
import { normalize, titleize } from "./src/utils/text.js";

let state = null;
let activeCategory = "tum";

function initialState() {
  const previousState = state;
  const baseState = {
    score: 35,
    usedCount: 0,
    savedMoney: 0,
    cookedRecipes: [],
    premium: false,
    receiptMap: [...DEFAULT_RECEIPT_MAP],
    catalog: [...DEFAULT_CATALOG],
    recipes: [...DEFAULT_RECIPES],
    shoppingList: [],
    weeklyPlan: ["Domatesli Peynirli Omlet", "Sebzeli Makarna"],
    community: [
      { id: "c-1", title: "Yoğurtlu hızlı kase", ingredients: ["yogurt", "salatalik", "limon"], approved: true },
      { id: "c-2", title: "Kalan makarna salatası", ingredients: ["makarna", "domates", "peynir"], approved: true },
    ],
    pantry: [],
  };
  state = baseState;
  baseState.pantry = ["domates", "yumurta", "peynir", "makarna", "biber"].map(makeIngredient);
  state = previousState || baseState;
  return baseState;
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return initialState();
  try {
    state = { ...initialState(), ...JSON.parse(saved) };
    return state;
  } catch {
    return initialState();
  }
}

state = loadState();

const els = {
  userModeButton: document.querySelector("#userModeButton"),
  adminModeButton: document.querySelector("#adminModeButton"),
  userView: document.querySelector("#userView"),
  adminView: document.querySelector("#adminView"),
  scoreButton: document.querySelector("#scoreButton"),
  scoreValue: document.querySelector("#scoreValue"),
  scanButton: document.querySelector("#scanButton"),
  dinnerButton: document.querySelector("#dinnerButton"),
  shoppingButton: document.querySelector("#shoppingButton"),
  plannerButton: document.querySelector("#plannerButton"),
  addButton: document.querySelector("#addButton"),
  ingredientInput: document.querySelector("#ingredientInput"),
  seedButton: document.querySelector("#seedButton"),
  categoryTabs: document.querySelector("#categoryTabs"),
  pantryGrid: document.querySelector("#pantryGrid"),
  pantrySection: document.querySelector("#pantrySection"),
  recipesSection: document.querySelector("#recipesSection"),
  recipeList: document.querySelector("#recipeList"),
  backToPantryButton: document.querySelector("#backToPantryButton"),
  walletSection: document.querySelector("#walletSection"),
  walletContent: document.querySelector("#walletContent"),
  backFromWalletButton: document.querySelector("#backFromWalletButton"),
  shoppingSection: document.querySelector("#shoppingSection"),
  shoppingList: document.querySelector("#shoppingList"),
  backFromShoppingButton: document.querySelector("#backFromShoppingButton"),
  plannerSection: document.querySelector("#plannerSection"),
  plannerList: document.querySelector("#plannerList"),
  backFromPlannerButton: document.querySelector("#backFromPlannerButton"),
  communitySection: document.querySelector("#communitySection"),
  communityButton: document.querySelector("#communityButton"),
  communityForm: document.querySelector("#communityForm"),
  communityTitle: document.querySelector("#communityTitle"),
  communityIngredients: document.querySelector("#communityIngredients"),
  communityList: document.querySelector("#communityList"),
  communityPreview: document.querySelector("#communityPreview"),
  backFromCommunityButton: document.querySelector("#backFromCommunityButton"),
  userMetrics: document.querySelector("#userMetrics"),
  riskList: document.querySelector("#riskList"),
  badgeList: document.querySelector("#badgeList"),
  notifyButton: document.querySelector("#notifyButton"),
  receiptSheet: document.querySelector("#receiptSheet"),
  receiptText: document.querySelector("#receiptText"),
  receiptImage: document.querySelector("#receiptImage"),
  receiptPreview: document.querySelector("#receiptPreview"),
  parseReceiptButton: document.querySelector("#parseReceiptButton"),
  adminMetrics: document.querySelector("#adminMetrics"),
  catalogForm: document.querySelector("#catalogForm"),
  catalogName: document.querySelector("#catalogName"),
  catalogCategory: document.querySelector("#catalogCategory"),
  catalogShelf: document.querySelector("#catalogShelf"),
  catalogList: document.querySelector("#catalogList"),
  recipeForm: document.querySelector("#recipeForm"),
  recipeName: document.querySelector("#recipeName"),
  recipeIngredients: document.querySelector("#recipeIngredients"),
  recipeTime: document.querySelector("#recipeTime"),
  recipeCalories: document.querySelector("#recipeCalories"),
  recipeSteps: document.querySelector("#recipeSteps"),
  adminRecipeList: document.querySelector("#adminRecipeList"),
  adminReceiptText: document.querySelector("#adminReceiptText"),
  adminParseButton: document.querySelector("#adminParseButton"),
  adminReceiptResult: document.querySelector("#adminReceiptResult"),
  ocrRuleForm: document.querySelector("#ocrRuleForm"),
  ocrNeedle: document.querySelector("#ocrNeedle"),
  ocrIngredient: document.querySelector("#ocrIngredient"),
  ocrRuleList: document.querySelector("#ocrRuleList"),
  premiumToggle: document.querySelector("#premiumToggle"),
  growthList: document.querySelector("#growthList"),
  roadmapList: document.querySelector("#roadmapList"),
  adminCommunityList: document.querySelector("#adminCommunityList"),
  resetDemoButton: document.querySelector("#resetDemoButton"),
  exportButton: document.querySelector("#exportButton"),
  toast: document.querySelector("#toast"),
  confettiLayer: document.querySelector("#confettiLayer"),
};

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function saveAndRender() {
  saveState();
  render();
}

function findCatalog(name) {
  const clean = normalize(name);
  return (
    state.catalog.find((item) => item.name === clean) ||
    DEFAULT_CATALOG.find((item) => item.name === clean) || { name: clean, category: "diger", shelfDays: 10, price: 20 }
  );
}

function makeIngredient(name) {
  const clean = normalize(name);
  const catalogItem = findCatalog(clean);
  return {
    id: crypto.randomUUID(),
    name: clean,
    category: catalogItem.category,
    addedAt: Date.now(),
    shelfDays: catalogItem.shelfDays,
    price: catalogItem.price,
  };
}

function daysLeft(item) {
  const elapsed = Math.floor((Date.now() - item.addedAt) / 86400000);
  return Math.max(0, item.shelfDays - elapsed);
}

function addIngredient(rawName, silent = false) {
  const name = normalize(rawName);
  if (!name) return false;
  if (state.pantry.some((item) => item.name === name)) {
    if (!silent) showToast(`${titleize(name)} zaten kilerde.`);
    return false;
  }
  state.pantry.unshift(makeIngredient(name));
  state.shoppingList = state.shoppingList.filter((item) => item !== name);
  state.score += 2;
  saveAndRender();
  if (!silent) showToast(`${titleize(name)} kilere eklendi.`);
  return true;
}

function removeIngredient(id, used = false) {
  const item = state.pantry.find((entry) => entry.id === id);
  state.pantry = state.pantry.filter((entry) => entry.id !== id);
  if (used && item) {
    state.score += 10;
    state.usedCount += 1;
    state.savedMoney += item.price || 20;
    burstConfetti();
    showToast(`${titleize(item.name)} kurtarıldı. +10 yeşil puan`);
  }
  saveAndRender();
}

function parseReceipt(text) {
  return parseReceiptText(text, state.receiptMap);
}

function getRecipeMatches() {
  return matchRecipes(state.pantry, state.recipes);
}

function getMetrics() {
  const expiring = state.pantry.filter((item) => daysLeft(item) <= 2).length;
  const avgMatch = Math.round(getRecipeMatches().reduce((sum, item) => sum + item.match, 0) / state.recipes.length);
  return {
    pantry: state.pantry.length,
    recipes: state.recipes.length,
    expiring,
    savedMoney: state.savedMoney,
    avgMatch,
    usedCount: state.usedCount,
  };
}

function getBadges() {
  return [
    { name: "Kiler Muhafızı", active: state.usedCount >= 1, detail: "İlk malzemeyi kurtar" },
    { name: "Tavuk Şefi", active: state.cookedRecipes.some((name) => normalize(name).includes("tavuk")), detail: "Tavuklu tarif yap" },
    { name: "Bütçe Dostu", active: state.savedMoney >= 100, detail: "100 TL tasarruf et" },
    { name: "Topluluk Aşçısı", active: state.community.length > 2, detail: "Kendi tarifini paylaş" },
    { name: "Atıksız Hafta", active: state.usedCount >= 5, detail: "5 malzeme kullan" },
  ];
}

function render() {
  els.scoreValue.textContent = state.score;
  renderTabs();
  renderPantry();
  renderUserInsights();
  renderRecipes();
  renderWallet();
  renderShopping();
  renderPlanner();
  renderCommunity();
  renderAdmin();
}

function renderTabs() {
  const tabs = ["tum", ...new Set(state.pantry.map((item) => item.category))];
  els.categoryTabs.innerHTML = tabs
    .map((tab) => `<button class="tab ${tab === activeCategory ? "active" : ""}" type="button" data-tab="${tab}">${tabLabel(tab)}</button>`)
    .join("");
}

function renderPantry() {
  const list = activeCategory === "tum" ? state.pantry : state.pantry.filter((item) => item.category === activeCategory);
  if (!list.length) {
    els.pantryGrid.innerHTML = `<div class="empty-state">Kiler boş. Bir malzeme ekle veya fiş metniyle başla.</div>`;
    return;
  }
  els.pantryGrid.innerHTML = list
    .map(
      (item) => `
        <article class="ingredient-card ${daysLeft(item) <= 2 ? "urgent" : ""}">
          <header>
            <div>
              <h3>${titleize(item.name)}</h3>
              <p>${tabLabel(item.category)} · ${daysLeft(item)} gün kaldı</p>
            </div>
            <button class="remove-button" type="button" data-remove="${item.id}" aria-label="${item.name} sil">×</button>
          </header>
          <div class="card-actions">
            <button class="mini-button" type="button" data-used="${item.id}">Yemekte kullandım</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderRecipes() {
  els.recipeList.innerHTML = getRecipeMatches()
    .map((item) => {
      const locked = item.premium && !state.premium;
      return `
        <article class="recipe-card ${locked ? "locked" : ""}">
          <div class="recipe-head">
            <div>
              <h3>${item.name}</h3>
              <p class="recipe-meta">${item.time} dk · ${item.calories} kcal ${item.premium ? "· Premium" : ""}</p>
            </div>
            <div class="match-badge">%${item.match}</div>
          </div>
          <ul class="ingredient-list">
            ${item.ingredients
              .map((ingredient) => `<li class="${item.matched.includes(ingredient) ? "available" : ""}"><span>${titleize(ingredient)}</span><span class="status-mark">${item.matched.includes(ingredient) ? "var" : "eksik"}</span></li>`)
              .join("")}
          </ul>
          <p class="recipe-meta">${locked ? "Bu tarif premium filtrelerin arkasında. Admin panelinden premiumu açıp deneyebilirsin." : item.steps}</p>
          <button class="cook-button" type="button" data-cook="${item.id}" ${locked ? "disabled" : ""}>${locked ? "Premium gerekli" : "Bu tarifi yap"}</button>
          <button class="link-button" type="button" data-plan="${item.name}">Haftaya ekle</button>
          ${item.missing.length ? `<button class="link-button" type="button" data-buy="${item.missing.join(",")}">Eksikleri listeye ekle</button>` : ""}
        </article>
      `;
    })
    .join("");
}

function renderUserInsights() {
  const metrics = getMetrics();
  els.userMetrics.innerHTML = metricCard("Kiler", metrics.pantry) + metricCard("Riskli", metrics.expiring) + metricCard("Tasarruf", `${metrics.savedMoney} TL`);
  const risks = state.pantry
    .filter((item) => daysLeft(item) <= 2)
    .slice(0, 4)
    .map((item) => `<div class="list-row"><strong>${titleize(item.name)}</strong><span>${daysLeft(item)} gün</span></div>`)
    .join("");
  els.riskList.innerHTML = risks || `<div class="empty-state">Yakın risk yok. Kiler iyi durumda.</div>`;
  els.badgeList.innerHTML = getBadges()
    .map((badge) => `<div class="badge ${badge.active ? "active" : ""}"><strong>${badge.name}</strong><span>${badge.detail}</span></div>`)
    .join("");
  const approved = state.community.filter((item) => item.approved).slice(0, 2);
  els.communityPreview.innerHTML = approved.map((item) => `<div class="list-row"><strong>${item.title}</strong><span>${item.ingredients.map(titleize).join(", ")}</span></div>`).join("");
}

function renderWallet() {
  const metrics = getMetrics();
  els.walletContent.innerHTML = `
    <div class="summary-card"><h3>Haftalık özet</h3><p>Bu hafta ${metrics.usedCount} malzemeyi çöpe gitmeden kullandın ve yaklaşık ${metrics.savedMoney} TL tasarruf ettin.</p></div>
    <div class="summary-card"><h3>Sürdürülebilirlik skoru</h3><p>${state.score} yeşil puan · Ortalama tarif uyumu %${metrics.avgMatch}</p></div>
  `;
}

function renderShopping() {
  els.shoppingList.innerHTML = state.shoppingList.length
    ? state.shoppingList
        .map((item) => `<div class="list-row"><strong>${titleize(item)}</strong><span><button class="mini-button" type="button" data-add-shopping="${item}">Kilere al</button><button class="remove-button" type="button" data-remove-shopping="${item}" aria-label="${item} sil">×</button></span></div>`)
        .join("")
    : `<div class="empty-state">Liste boş. Tariflerdeki eksikleri buraya ekleyebilirsin.</div>`;
}

function renderPlanner() {
  const suggestions = getRecipeMatches().slice(0, 3);
  els.plannerList.innerHTML = `
    ${state.weeklyPlan.map((name, index) => `<div class="list-row"><strong>${["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"][index] || "Plan"}</strong><span>${name}</span></div>`).join("")}
    <div class="summary-card"><h3>Akıllı öneriler</h3><p>${suggestions.map((item) => `${item.name} (%${item.match})`).join(" · ")}</p></div>
  `;
}

function renderCommunity() {
  const approved = state.community.filter((item) => item.approved);
  els.communityList.innerHTML = approved.length
    ? approved.map((item) => `<div class="list-row"><strong>${item.title}</strong><span>${item.ingredients.map(titleize).join(", ")}</span></div>`).join("")
    : `<div class="empty-state">İlk topluluk tarifini sen paylaş.</div>`;
}

function renderAdmin() {
  const metrics = getMetrics();
  els.adminMetrics.innerHTML = metricCard("Malzeme", state.catalog.length) + metricCard("Tarif", metrics.recipes) + metricCard("Kiler", metrics.pantry) + metricCard("Ortalama uyum", `%${metrics.avgMatch}`);
  els.catalogList.innerHTML = state.catalog.map((item) => `<div class="list-row"><strong>${titleize(item.name)}</strong><span>${tabLabel(item.category)} · ${item.shelfDays} gün</span></div>`).join("");
  els.adminRecipeList.innerHTML = state.recipes.map((item) => `<div class="list-row"><strong>${item.name}</strong><span>${item.ingredients.length} malzeme · ${item.time} dk</span></div>`).join("");
  els.ocrRuleList.innerHTML = state.receiptMap
    .slice(-14)
    .reverse()
    .map(([needle, ingredient]) => `<div class="list-row"><strong>${needle}</strong><span>${titleize(ingredient)}</span></div>`)
    .join("");
  els.premiumToggle.textContent = state.premium ? "Açık" : "Kapalı";
  els.premiumToggle.classList.toggle("active", state.premium);
  els.growthList.innerHTML = `
    <div class="list-row"><strong>Affiliate</strong><span>Eksik malzemede satın alma linki simüle</span></div>
    <div class="list-row"><strong>Premium</strong><span>Diyet/makro tarifleri kilitlenebilir</span></div>
    <div class="list-row"><strong>Retention</strong><span>Rozet + haftalık rapor hazır</span></div>
  `;
  els.roadmapList.innerHTML = ROADMAP.map((item) => `<label><input type="checkbox" checked /> ${item}</label>`).join("");
  els.adminCommunityList.innerHTML = state.community.map((item) => `<div class="list-row"><strong>${item.title}</strong><span>${item.approved ? "yayında" : "bekliyor"}</span></div>`).join("");
}

function metricCard(label, value) {
  return `<div class="metric-card"><strong>${value}</strong><span>${label}</span></div>`;
}

function tabLabel(tab) {
  return { tum: "Tüm", sebze: "Sebze", protein: "Protein", sut: "Süt ürünleri", tahil: "Tahıl", meyve: "Meyve", diger: "Diğer" }[tab] || tab;
}

function showSection(section) {
  [els.pantrySection, els.recipesSection, els.walletSection, els.shoppingSection, els.plannerSection, els.communitySection].forEach((item) => item.classList.add("hidden"));
  section.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function switchMode(mode) {
  const admin = mode === "admin";
  els.adminView.classList.toggle("hidden", !admin);
  els.userView.classList.toggle("hidden", admin);
  els.adminModeButton.classList.toggle("active", admin);
  els.userModeButton.classList.toggle("active", !admin);
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => els.toast.classList.remove("show"), 2400);
}

function burstConfetti() {
  const colors = ["#5f8f51", "#f4a259", "#f7d154", "#dc5f57", "#79b4a9"];
  els.confettiLayer.innerHTML = Array.from({ length: 34 })
    .map((_, index) => `<span class="confetti" style="left:${Math.random() * 100}%; --x-drift:${(Math.random() * 160 - 80).toFixed(0)}px; background:${colors[index % colors.length]}; animation-delay:${(Math.random() * 180).toFixed(0)}ms"></span>`)
    .join("");
  setTimeout(() => {
    els.confettiLayer.innerHTML = "";
  }, 1350);
}

function addMissingToShopping(rawItems) {
  rawItems
    .split(",")
    .map(normalize)
    .filter(Boolean)
    .forEach((item) => {
      if (!state.shoppingList.includes(item)) state.shoppingList.push(item);
    });
  saveAndRender();
  showToast("Eksikler alışveriş listesine eklendi.");
}

function wireEvents() {
  els.userModeButton.addEventListener("click", () => switchMode("user"));
  els.adminModeButton.addEventListener("click", () => switchMode("admin"));
  els.scoreButton.addEventListener("click", () => showSection(els.walletSection));
  els.backFromWalletButton.addEventListener("click", () => showSection(els.pantrySection));
  els.shoppingButton.addEventListener("click", () => showSection(els.shoppingSection));
  els.plannerButton.addEventListener("click", () => showSection(els.plannerSection));
  els.communityButton.addEventListener("click", () => showSection(els.communitySection));
  els.backFromShoppingButton.addEventListener("click", () => showSection(els.pantrySection));
  els.backFromPlannerButton.addEventListener("click", () => showSection(els.pantrySection));
  els.backFromCommunityButton.addEventListener("click", () => showSection(els.pantrySection));

  els.addButton.addEventListener("click", () => {
    addIngredient(els.ingredientInput.value);
    els.ingredientInput.value = "";
    els.ingredientInput.focus();
  });
  els.ingredientInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      addIngredient(els.ingredientInput.value);
      els.ingredientInput.value = "";
    }
  });
  els.scanButton.addEventListener("click", () => {
    els.receiptSheet.showModal();
    els.receiptText.focus();
  });
  els.receiptImage.addEventListener("change", () => {
    const file = els.receiptImage.files?.[0];
    if (!file) return;
    els.receiptPreview.src = URL.createObjectURL(file);
    els.receiptPreview.classList.remove("hidden");
    showToast("Fiş görseli alındı. OCR için metin simülasyonunu kullan.");
  });
  els.parseReceiptButton.addEventListener("click", () => {
    const parsed = parseReceipt(els.receiptText.value);
    const added = parsed.filter((item) => addIngredient(item.ingredient, true));
    saveAndRender();
    els.receiptSheet.close();
    showToast(`${added.length} malzeme ayıklandı.`);
  });
  els.dinnerButton.addEventListener("click", () => showSection(els.recipesSection));
  els.backToPantryButton.addEventListener("click", () => showSection(els.pantrySection));
  els.seedButton.addEventListener("click", () => {
    ["tavuk", "bulgur", "yogurt", "sogan", "limon", "ekmek", "kasar", "marul"].forEach((item) => addIngredient(item, true));
    saveAndRender();
    showToast("Örnek kiler dolduruldu.");
  });
  els.categoryTabs.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-tab]");
    if (!tab) return;
    activeCategory = tab.dataset.tab;
    render();
  });
  els.pantryGrid.addEventListener("click", (event) => {
    const used = event.target.closest("[data-used]");
    const remove = event.target.closest("[data-remove]");
    if (used) removeIngredient(used.dataset.used, true);
    if (remove) removeIngredient(remove.dataset.remove);
  });
  els.recipeList.addEventListener("click", (event) => {
    const cookButton = event.target.closest("[data-cook]");
    const buyButton = event.target.closest("[data-buy]");
    const planButton = event.target.closest("[data-plan]");
    if (buyButton) return addMissingToShopping(buyButton.dataset.buy);
    if (planButton) {
      state.weeklyPlan.push(planButton.dataset.plan);
      saveAndRender();
      return showToast("Tarif haftalık plana eklendi.");
    }
    if (!cookButton) return;
    const item = state.recipes.find((entry) => entry.id === cookButton.dataset.cook);
    if (!item) return;
    const pantryByName = new Map(state.pantry.map((entry) => [entry.name, entry.id]));
    item.ingredients.forEach((ingredient) => {
      const id = pantryByName.get(normalize(ingredient));
      if (id) removeIngredient(id, true);
    });
    state.cookedRecipes.push(item.name);
    saveAndRender();
    showSection(els.pantrySection);
  });
  els.shoppingList.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add-shopping]");
    const remove = event.target.closest("[data-remove-shopping]");
    if (add) addIngredient(add.dataset.addShopping);
    if (remove) {
      state.shoppingList = state.shoppingList.filter((item) => item !== remove.dataset.removeShopping);
      saveAndRender();
    }
  });
  els.notifyButton.addEventListener("click", () => {
    const risk = state.pantry.find((item) => daysLeft(item) <= 2);
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
    showToast(risk ? `${titleize(risk.name)} yakında bozulabilir. Bu akşam tarif öner.` : "Bugün kritik bildirim yok.");
  });
  els.communityForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const title = els.communityTitle.value.trim();
    const ingredients = els.communityIngredients.value.split(",").map(normalize).filter(Boolean);
    if (!title || !ingredients.length) return;
    state.community.unshift({ id: crypto.randomUUID(), title, ingredients, approved: true });
    state.score += 15;
    els.communityForm.reset();
    saveAndRender();
    showToast("Topluluk tarifi paylaşıldı. +15 puan");
  });
  els.catalogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = normalize(els.catalogName.value);
    if (!name) return;
    const existing = state.catalog.find((item) => item.name === name);
    if (existing) {
      existing.category = els.catalogCategory.value;
      existing.shelfDays = Number(els.catalogShelf.value);
    } else {
      state.catalog.push({ name, category: els.catalogCategory.value, shelfDays: Number(els.catalogShelf.value), price: 20 });
    }
    els.catalogForm.reset();
    els.catalogShelf.value = 5;
    saveAndRender();
    showToast("Malzeme kataloğu güncellendi.");
  });
  els.recipeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.recipes.push(createRecipe(crypto.randomUUID(), els.recipeName.value.trim(), Number(els.recipeTime.value), Number(els.recipeCalories.value), els.recipeIngredients.value.split(",").map(normalize).filter(Boolean), els.recipeSteps.value.trim() || "Malzemeleri hazırlayıp pratik şekilde pişir."));
    els.recipeForm.reset();
    els.recipeTime.value = 15;
    els.recipeCalories.value = 420;
    saveAndRender();
    showToast("Tarif veritabanına eklendi.");
  });
  els.adminParseButton.addEventListener("click", () => {
    const parsed = parseReceipt(els.adminReceiptText.value);
    els.adminReceiptResult.innerHTML = parsed.length
      ? parsed.map((item) => `<div class="list-row"><strong>${titleize(item.ingredient)}</strong><span>${item.line}</span></div>`).join("")
      : `<div class="empty-state">Gıda malzemesi bulunamadı.</div>`;
  });
  els.ocrRuleForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const needle = normalize(els.ocrNeedle.value);
    const ingredient = normalize(els.ocrIngredient.value);
    if (!needle || !ingredient) return;
    state.receiptMap.push([needle, ingredient]);
    els.ocrRuleForm.reset();
    saveAndRender();
    showToast("OCR sözlüğüne kural eklendi.");
  });
  els.premiumToggle.addEventListener("click", () => {
    state.premium = !state.premium;
    saveAndRender();
    showToast(state.premium ? "Premium açık." : "Premium kapalı.");
  });
  els.resetDemoButton.addEventListener("click", () => {
    const fresh = initialState();
    Object.keys(state).forEach((key) => delete state[key]);
    Object.assign(state, fresh);
    activeCategory = "tum";
    saveAndRender();
    showToast("Demo verisi sıfırlandı.");
  });
  els.exportButton.addEventListener("click", async () => {
    const payload = JSON.stringify(state, null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      showToast("Veri panoya kopyalandı.");
    } catch {
      showToast("Veri dışa aktarma hazır; tarayıcı pano izni vermedi.");
    }
  });
}

wireEvents();
render();
