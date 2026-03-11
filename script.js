const BASE_URL = "https://nitish.sawanpoint0000.workers.dev/";

const SERVICE = "swr";
const COUNTRY = "22";
const MAX_PRICE = "80";

let isOn = false;

const toggleBtn = document.getElementById('toggleBtn');
const statusDiv = document.getElementById('status');
const numbersDiv = document.getElementById('numbers');

let interval = null;

function updateUI(){

toggleBtn.textContent = isOn ? "OFF Karo" : "ON Karo";

statusDiv.textContent = isOn
? "Auto buy fast mode..."
: "Off hai → ON dabao";

}

toggleBtn.onclick = ()=>{

isOn = !isOn;

updateUI();

if(isOn){
startFetching();
}else{
stopFetching();
}

};


function createNumberBox(num,id,startTime){

const box = document.createElement("div");

box.className="numbox";

box.dataset.id=id;

box.innerHTML=`

<div class="top-row">

<div class="phone10">${num}</div>

<button class="copy-number-btn">Copy No.</button>

</div>

<div class="otp-area rotating">

<div class="otp waiting">

Waiting for OTP...

</div>

<button class="copy-otp-btn">Copy OTP</button>

</div>

<div class="timer">05:00</div>

`;

const phoneEl = box.querySelector(".phone10");

const copyBtn = box.querySelector(".copy-number-btn");

const otpBtn = box.querySelector(".copy-otp-btn");

const otpEl = box.querySelector(".otp");

const otpArea = box.querySelector(".otp-area");


function copyNumber(){

navigator.clipboard.writeText(num);

box.classList.remove("green","red");

box.classList.add("yellow");

}

phoneEl.onclick = copyNumber;

copyBtn.onclick = copyNumber;


otpBtn.onclick = ()=>{

const otp = otpEl.textContent.trim();

if(!otp.includes("Waiting")){

navigator.clipboard.writeText(otp);

}

};


startTimer(box,startTime);

startPolling(box,id);

return box;

}



function startTimer(box,startTime){

const timer = box.querySelector(".timer");

const timerLoop = setInterval(()=>{

const elapsed = Math.floor((Date.now()-startTime)/1000);

const remain = 300-elapsed;

if(remain<=0){

box.classList.remove("yellow","green");

box.classList.add("red");

clearInterval(timerLoop);

setTimeout(()=>{

box.remove();

},2000);

return;

}

const m = String(Math.floor(remain/60)).padStart(2,"0");

const s = String(remain%60).padStart(2,"0");

timer.textContent=`${m}:${s}`;

},1000);

}



function startPolling(box,id){

const otpEl = box.querySelector(".otp");

const otpArea = box.querySelector(".otp-area");

const poll = setInterval(async ()=>{

try{

const params = new URLSearchParams({

action:"getStatus",

id

});

const res = await fetch(BASE_URL+"?"+params);

const text = (await res.text()).trim();

if(text.startsWith("STATUS_OK")){

const code = text.split(":")[1];

otpEl.textContent = code;

otpEl.classList.remove("waiting");

otpEl.classList.add("success");

otpArea.classList.remove("rotating");

box.classList.remove("yellow");

box.classList.add("green");

clearInterval(poll);

}

}catch{}

},1800);

}



async function fetchNumber(){

if(!isOn) return;

const params = new URLSearchParams({

action:"getNumber",

service:SERVICE,

country:COUNTRY,

maxPrice:MAX_PRICE

});

try{

const res = await fetch(BASE_URL+"?"+params);

const text = (await res.text()).trim();

if(text.startsWith("ACCESS_NUMBER")){

const [,id,full] = text.split(":");

const num = full.slice(2);

const startTime = Date.now();

const box = createNumberBox(num,id,startTime);

numbersDiv.prepend(box);

window.scrollTo({top:0,behavior:"smooth"});

}

}catch{}

}



function startFetching(){

fetchNumber();

interval=setInterval(fetchNumber,1200);

}

function stopFetching(){

clearInterval(interval);

interval=null;

}

updateUI();
