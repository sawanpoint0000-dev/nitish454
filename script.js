// ------------------ Instance अलग करने के लिए नाम ------------------
let INSTANCE_NAME = localStorage.getItem('hp_instance_name');
if (!INSTANCE_NAME) {
  let nameInput = prompt(
    "इस टैब/इंस्टेंस का नाम डालो (उदाहरण: tab1, phoneA, mypanel2, insta1 आदि)\n" +
    "अलग-अलग टैब में अलग नाम डालना जरूरी है वरना conflict होगा!\n" +
    "(खाली छोड़ने पर रैंडम नाम बन जाएगा)",
    ""
  );
  if (!nameInput || nameInput.trim() === "") {
    nameInput = "default_" + Math.random().toString(36).substring(2, 9);
  } else {
    nameInput = nameInput.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  }
  INSTANCE_NAME = nameInput;
  localStorage.setItem('hp_instance_name', INSTANCE_NAME);
  alert("इस इंस्टेंस का नाम सेट हो गया: " + INSTANCE_NAME + "\nअब अलग टैब में दूसरा नाम डालकर चलाओ");
}
const getKey = (base) => `hp_${base}_${INSTANCE_NAME}`;
const STATE_KEY = getKey('isOn');
const USED_KEY = getKey('used_numbers');
const ACTIVE_KEY = getKey('active_numbers');
// ----------------------------------------------------
const API_KEY = "1a781664f51ec5c8c82722d31d3c91e4";   // ← यहाँ नया API key डाल दिया गया
const BASE_URL = "https://api.grizzlysms.com/stubs/handler_api.php";
const SERVICE = "swr";
const COUNTRY = "22";
const MAX_PRICE = "80";
let isOn = localStorage.getItem(STATE_KEY) === 'true';
let usedNumbers = JSON.parse(localStorage.getItem(USED_KEY) || '[]');
let activeNumbers = JSON.parse(localStorage.getItem(ACTIVE_KEY) || '[]');
const toggleBtn = document.getElementById('toggleBtn');
const statusDiv = document.getElementById('status');
const numbersDiv = document.getElementById('numbers');
let interval = null;

// बाकी कोड वही रहेगा (updateUI, toggleBtn.onclick, saveActive, isValid, cleanStorage, renderSaved, आदि)

function updateUI() {
  toggleBtn.textContent = isOn ? 'OFF Karo' : 'ON Karo';
  toggleBtn.classList.toggle('off', !isOn);
  statusDiv.textContent = isOn ? 'Auto buy fast mode...' : 'Off hai → ON dabao';
}

toggleBtn.onclick = () => {
  isOn = !isOn;
  localStorage.setItem(STATE_KEY, isOn ? 'true' : 'false');
  updateUI();
  if (isOn) startFetching();
  else stopFetching();
};

// ... बाकी सारे फंक्शन वैसे ही रहेंगे (flashBoxRed, createNumberBox, startTimer, startPolling, fetchNumber, startFetching, stopFetching)

// Initialize
updateUI();
renderSaved();
if (isOn) startFetching();
