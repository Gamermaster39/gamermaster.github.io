const questions={

smartphone:[
{q:"Marca del telefono",options:["Apple","Samsung","Xiaomi","Huawei"]},
{q:"Memoria",options:["64GB","128GB","256GB","512GB"]},
{q:"Condizione",options:["Come nuovo","Buone condizioni","Usato","Rotto"]},
{q:"Accessori inclusi",options:["Caricatore","Scatola originale","Cuffie"]}
],

laptop:[
{q:"Marca",options:["Apple","Lenovo","HP","Asus","Dell"]},
{q:"RAM",options:["8GB","16GB","32GB"]},
{q:"Storage",options:["256GB SSD","512GB SSD","1TB SSD"]},
{q:"Condizione",options:["Come nuovo","Buone condizioni","Usato"]}
],

console:[
{q:"Console",options:["PlayStation","Xbox","Nintendo"]},
{q:"Modello",options:["Ultima generazione","Generazione precedente","Retro"]},
{q:"Controller",options:["1","2","3+"]},
{q:"Condizione",options:["Perfetta","Usata","Molto usata"]}
],

vintage:[
{q:"Tipo dispositivo",options:["Telefono vintage","Console retro","Computer anni 90"]},
{q:"Funzionante",options:["Si","No"]},
{q:"Condizione estetica",options:["Perfetta","Usata","Rovinata"]}
]

};


let deviceType="";
let step=0;
let answers=[];


function startQuestions(type){

deviceType=type;
step=0;
answers=[];

document.querySelector(".device-grid").style.display="none";

renderQuestion();

updateProgress();

}


function renderQuestion(){

let q=questions[deviceType][step];

let box=document.getElementById("questionBox");

box.innerHTML=`

<h2>${q.q}</h2>

<div class="options">

${q.options.map(o=>`
<div class="option" onclick="selectAnswer('${o}')">
${o}
</div>
`).join("")}

</div>

<div class="nav-buttons">

${step>0?'<button class="btn" onclick="prevStep()">Indietro</button>':""}

</div>

`;

}



function selectAnswer(ans){

answers[step]=ans;

if(step<questions[deviceType].length-1){

step++;
renderQuestion();
updateProgress();

}
else{

showSummary();

}

}


function prevStep(){

step--;
renderQuestion();
updateProgress();

}


function updateProgress(){

let percent=(step/questions[deviceType].length)*100;

document.getElementById("progress").style.width=percent+"%";

}


function calculatePrice(){

let price=200;

if(deviceType==="smartphone") price=400;
if(deviceType==="laptop") price=600;
if(deviceType==="console") price=350;
if(deviceType==="vintage") price=150;

answers.forEach(a=>{

if(a.includes("256")||a.includes("512")) price+=50;
if(a==="Come nuovo") price+=80;
if(a==="Rotto") price-=120;

});

return price;

}


function showSummary(){

let items=document.getElementById("purchaseItems");

items.innerHTML="";

answers.forEach((a,i)=>{

items.innerHTML+=`
<p>
<span>${questions[deviceType][i].q}</span>
<strong>${a}</strong>
</p>
`;

});

document.getElementById("purchaseTotal").innerHTML=
"Valore stimato: <strong>"+calculatePrice()+"€</strong>";

document.getElementById("purchaseModal").style.display="flex";

}



function closeModal(){

document.getElementById("purchaseModal").style.display="none";

}


document.getElementById("confirmSale").onclick=function(){

let overlay=document.getElementById("loadingOverlay");

overlay.style.display="flex";

let randomTime = Math.floor(Math.random()*8000)+2000;

setTimeout(()=>{

overlay.style.display="none";

document.getElementById("successMessage").style.display="block";

},randomTime);

}



