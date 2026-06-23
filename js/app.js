// 注文状態の管理
let currentOrder = {
  size: "",
  spice: "",
  topping: [],
  side: []
};

document.addEventListener('DOMContentLoaded', () => {
  // 0. タイトル・ロゴの反映
  const logoContainer = document.getElementById('store-logo');
  if (MENU_DATA.logoImage) {
    const img = document.createElement('img');
    img.src = MENU_DATA.logoImage;
    img.alt = MENU_DATA.logoText;
    img.className = 'logo-img';
    logoContainer.appendChild(img);
  } else {
    logoContainer.textContent = MENU_DATA.logoText;
  }

  // 1. 画面の動的生成
  renderSingleChoiceMenu('container-size', MENU_DATA.sizes, 'size', 'screen-size', 'screen-spice');
  renderSingleChoiceMenu('container-spice', MENU_DATA.spices, 'spice', 'screen-spice', 'screen-topping');
  renderMultiChoiceMenu('container-topping', MENU_DATA.toppings, 'topping');
  renderMultiChoiceMenu('container-side', MENU_DATA.sides, 'side');

  // 2. イベントリスナーの設定
  setupEventListeners();
});

// 単一選択ボタン（サイズ・辛さ）の生成
function renderSingleChoiceMenu(containerId, dataArray, orderKey, currentScreen, nextScreen) {
  const container = document.getElementById(containerId);
  if (!container) return;

  dataArray.forEach(item => {
    const button = document.createElement('button');
    button.className = item.image ? 'choice-btn with-image-btn' : 'choice-btn';
    
    if (item.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      button.appendChild(img);
    }

    const textSpan = document.createElement('span');
    textSpan.textContent = item.name;
    button.appendChild(textSpan);

    button.addEventListener('click', () => {
      currentOrder[orderKey] = item.name;
      switchScreen(currentScreen, nextScreen);
    });
    container.appendChild(button);
  });
}

// 複数選択ボタン（トッピング・サイド）の生成
function renderMultiChoiceMenu(containerId, dataArray, nameAttribute) {
  const container = document.getElementById(containerId);
  if (!container) return;

  dataArray.forEach(item => {
    const label = document.createElement('label');
    label.className = 'topping-item with-image-topping';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = nameAttribute;
    input.value = item.name;

    if (item.alertMessage) {
      input.addEventListener('change', (e) => {
        if (e.target.checked) {
          showPopup(item.alertMessage);
        }
      });
    }

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.name;

    const span = document.createElement('span');
    span.textContent = item.name;

    label.appendChild(input);
    label.appendChild(img);
    label.appendChild(span);
    container.appendChild(label);
  });
}

// ボタンなどのイベント設定
function setupEventListeners() {
  document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const currentScreen = btn.closest('.screen').id;
      const targetScreen = btn.getAttribute('data-back-to');
      switchScreen(currentScreen, targetScreen);
    });
  });

  document.getElementById('btn-save-topping').addEventListener('click', () => {
    const checked = document.querySelectorAll('input[name="topping"]:checked');
    currentOrder.topping = Array.from(checked).map(box => box.value);
    updateConfirmScreen();
    switchScreen('screen-topping', 'screen-side');
  });

  document.getElementById('btn-save-side').addEventListener('click', () => {
    const checked = document.querySelectorAll('input[name="side"]:checked');
    currentOrder.side = Array.from(checked).map(box => box.value);
    updateConfirmScreen();
    switchScreen('screen-side', 'screen-confirm');
  });

  document.getElementById('btn-send-order').addEventListener('click', sendOrder);
  document.getElementById('popup-close-btn').addEventListener('click', closePopup);
}

function switchScreen(fromId, toId) {
  document.getElementById(fromId).classList.remove('active');
  document.getElementById(toId).classList.add('active');
}

function updateConfirmScreen() {
  document.getElementById('summary-size').textContent = currentOrder.size || "未選択";
  document.getElementById('summary-spice').textContent = currentOrder.spice || "未選択";
  document.getElementById('summary-topping').textContent = currentOrder.topping.length > 0 ? currentOrder.topping.join('、') : "なし";
  document.getElementById('summary-side').textContent = currentOrder.side.length > 0 ? currentOrder.side.join('、') : "なし";
}

function sendOrder() {
  alert("ご注文ありがとうございました！厨房へ送信しました。");
  switchScreen('screen-confirm', 'screen-size');
  document.querySelectorAll('input[type="checkbox"]').forEach(box => box.checked = false);
  currentOrder = { size: "", spice: "", topping: [], side: [] };
  updateConfirmScreen();
}

function showPopup(message) {
  document.getElementById('popup-text').textContent = message;
  document.getElementById('custom-popup').style.display = 'flex';
}

function closePopup() {
  document.getElementById('custom-popup').style.display = 'none';
}