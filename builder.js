const components = {
cpu:[
{name:"Intel i5 13600K",brand:"Intel",socket:"LGA1700",ram:"DDR5",price:290,watt:125,img:"img/Intel i5 13600K.jpg"},
{name:"Intel i7 13700K",brand:"Intel",socket:"LGA1700",ram:"DDR5",price:470,watt:125,img:"img/Intel i7 13700K.jpg"},
{name:"Ryzen 5 7600X",brand:"AMD",socket:"AM5",ram:"DDR5",price:280,watt:105,img:"img/Ryzen 5 7600X.jpg"},
{name:"Ryzen 5 5600",brand:"AMD",socket:"AM4",ram:"DDR4",price:150,watt:65,img:"img/Ryzen 5 5600.jpg"}],
motherboard:[
{name:"MSI B450 Tomahawk",socket:"AM4",ram:"DDR4",price:110,img:"img/MSI B450 Tomahawk.jpg"},
{name:"ASUS Z790",socket:"LGA1700",ram:"DDR5",price:250,img:"img/ASUS Z790.jpg"},
{name:"MSI B650",socket:"AM5",ram:"DDR5",price:210,img:"img/MSI B650.jpg"}],
ram:[
{name:"Corsair 16GB DDR4",type:"DDR4",price:60,watt:8,img:"img/Corsair 16GB DDR4.jpg"},
{name:"Corsair 16GB DDR5",type:"DDR5",price:304,watt:8,img:"img/Corsair 16GB DDR5.jpg"},
{name:"Kingston 32GB DDR5",type:"DDR5",price:520,watt:10,img:"img/Kingston 32GB DDR5.jpg"}],
gpu:[
{name:"RTX 4070",brand:"NVIDIA",price:650,watt:200,gpuSize:300,img:"img/RTX 4070.jpg"},
{name:"RTX 4060",brand:"NVIDIA",price:330,watt:115,gpuSize:250,img:"img/RTX 4060.jpg"},
{name:"RX 6500 XT",brand:"AMD",price:190,watt:107,gpuSize:240,img:"img/RX 6500 XT.jpg"},
{name:"RX 7800XT",brand:"AMD",price:520,watt:263,gpuSize:310,img:"img/RX 7800XT.jpg"}],
storage:[
{name:"Samsung 980 1TB",price:110,watt:5,img:"img/Samsung 980 1TB.jpg"},
{name:"WD Black 2TB",price:180,watt:6,img:"img/WD Black 2TB.jpg"}],
case:[
{name:"NZXT H510",maxGpu:300,price:99,img:"img/NZXT H510.jpg"},
{name:"Corsair 4000D",maxGpu:360,price:249,img:"img/Corsair 4000D.jpg"}],
psu:[
{name:"Corsair 750W",power:750,price:139,img:"img/Corsair 750W.jpg"},
{name:"EVGA 650W",power:650,price:90,img:"img/EVGA 650W.png"}]
};

const categories=["cpu","motherboard","ram","gpu","storage","case","psu"];
let selected={};
const grid=document.getElementById("builderGrid");

function renderBuilder(){
  grid.innerHTML="";
  categories.forEach(cat=>{
    let div=document.createElement("div");
    div.className="component-card";
    let name=cat.toUpperCase();
    
    // Controlliamo se il componente è selezionato
    let isSelected = !!selected[cat];
    let selectedName = isSelected ? selected[cat].name : "Nessun componente";

    div.innerHTML = `
      <div class="component-info">
        <strong>${name}</strong>
        <span>${selectedName}</span>
      </div>
      <div style="display:flex; gap:10px;">
        <button class="choose-btn" onclick="openModal('${cat}')">
          ${isSelected ? 'Cambia' : 'Scegli'}
        </button>
        ${isSelected ? `<button class="remove-btn" onclick="removeComponent('${cat}')">Rimuovi</button>` : ''}
      </div>
    `;
    grid.appendChild(div);
  });
  checkCompatibility();
  updatePrice();
  updatePower();
}

// Nuova funzione per rimuovere il componente
function removeComponent(category) {
  delete selected[category];
  renderBuilder();
}

function openModal(category){
document.getElementById("modal").style.display="flex";
document.getElementById("modalTitle").innerText="Scegli "+category;
let items=document.getElementById("items");
items.innerHTML="";
components[category].forEach(comp=>{
let compatible=isCompatible(category,comp);
let div=document.createElement("div");
div.className="item";
if(!compatible){div.style.opacity="0.4";div.style.pointerEvents="none";}
div.innerHTML=`<img src="${comp.img}"><h4>${comp.name}</h4><p>${comp.price}€</p>`;
div.onclick=()=>{
selected[category]=comp;
closeModal();
renderBuilder();
};
items.appendChild(div);
});
}

function closeModal(){document.getElementById("modal").style.display="none";}

function updatePrice(){
let total=0;
Object.values(selected).forEach(c=>{total+=c.price;});
document.getElementById("price").innerText=total+"€";
}

function updatePower(){
let total=0;
Object.values(selected).forEach(c=>{if(c.watt) total+=c.watt;});
total+=40;
let psuPower = selected.psu?.power || 650;
document.getElementById("powerValue").innerText = total+"W";
let percent = (total/psuPower)*100;
let bar=document.getElementById("powerFill");
bar.style.width=percent+"%";
if(percent<60) bar.style.background="green";
else if(percent<85) bar.style.background="orange";
else bar.style.background="red";
}

function isCompatible(category, component){
if(category==="motherboard" && selected.cpu) return component.socket===selected.cpu.socket;
if(category==="cpu" && selected.motherboard) return component.socket===selected.motherboard.socket;
if(category==="ram" && selected.cpu) return component.type===selected.cpu.ram;
if(category==="case" && selected.gpu) return component.maxGpu >= selected.gpu.gpuSize;
if(category==="gpu" && selected.case) return component.gpuSize <= selected.case.maxGpu;
return true;
}

function checkCompatibility(){
let bar=document.getElementById("compatibility");
if(selected.cpu && selected.motherboard){
if(selected.cpu.socket!==selected.motherboard.socket){
bar.innerText="❌ CPU e Motherboard non compatibili";
bar.classList.add("error");
return;
}}
bar.innerText="✔ Compatibilità: Nessun problema";
bar.classList.remove("error");
}

function buildBudget(){
selected.cpu=components.cpu.find(c=>c.name==="Ryzen 5 5600");
selected.gpu=components.gpu.find(c=>c.name==="RX 6500 XT");
selected.case=components.case[0];
selected.psu=components.psu[1];
renderBuilder();
}

function buildPerformance(){
selected.cpu=components.cpu.find(c=>c.name==="Ryzen 5 7600X");
selected.gpu=components.gpu.find(c=>c.name==="RX 7800XT");
selected.case=components.case[1];
selected.psu=components.psu[0];
renderBuilder();
}

function buildExpensive(){
selected.cpu=components.cpu.find(c=>c.name==="Intel i7 13700K");
selected.gpu=components.gpu.find(c=>c.name==="RTX 4070");
selected.case=components.case[1];
selected.psu=components.psu[0];
renderBuilder();
}

renderBuilder();

document.getElementById("buyBtn").onclick = function(){
  const purchaseModal = document.getElementById("purchaseModal");
  const itemsDiv = document.getElementById("purchaseItems");
  const totalDiv = document.getElementById("purchaseTotal");
  itemsDiv.innerHTML="";
  Object.keys(selected).forEach(cat=>{
    if(selected[cat]){
      itemsDiv.innerHTML += `<p>${cat.toUpperCase()}: ${selected[cat].name} - ${selected[cat].price}€</p>`;
    }
  });
  let total = Object.values(selected).reduce((sum,c)=>c?sum+c.price:sum,0);
  totalDiv.innerHTML = `Totale: ${total}€`;
  document.getElementById("loading").style.display="none";
  document.getElementById("success").style.display="none";
  purchaseModal.style.display="flex";
}

function closePurchaseModal(){
  document.getElementById("purchaseModal").style.display="none";
}

document.getElementById("confirmPurchase").onclick = function(){
  document.getElementById("loading").style.display="block";
  document.getElementById("loadingText").innerText="Acquisto in corso...";
  document.getElementById("success").style.display="none";
  let randomTime = Math.floor(Math.random()*8000)+2000;
  setTimeout(()=>{
    document.getElementById("loading").style.display="none";
    document.getElementById("success").style.display="block";
  }, randomTime);
}