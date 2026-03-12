const devices = {

    phones: [

        { id: 1, name: "iPhone 15 Pro", brand: "Apple", price: 1129, images: ["img/iphone.jpg"], desc: "Titanio di grado aerospaziale, chip A17 Pro e sistema di fotocamere evoluto." },

        { id: 2, name: "Samsung Galaxy S24 Ultra", brand: "Samsung", price: 1299, images: ["https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=800"], desc: "Esperienza AI rivoluzionaria, display QHD+ e S Pen integrata." },

        { id: 3, name: "Google Pixel 8", brand: "Google", price: 799, images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?q=80&w=800"], desc: "La migliore fotocamera AI su uno smartphone Android puro." },

        { id: 4, name: "Xiaomi 14", brand: "Xiaomi", price: 899, images: ["img/xiaomi.jpg"], desc: "Ottiche Leica di nuova generazione e ricarica ultra rapida." }

    ],

    laptops: [

        { id: 5, name: "MacBook Air M3", brand: "Apple", price: 1349, images: ["img/mac.jpg"], desc: "Sottile, leggero e incredibilmente veloce con il nuovo chip M3." },

        { id: 6, name: "HP Pavilion 15", brand: "HP", price: 749, images: ["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=800"], desc: "Perfetto per lo studio e il lavoro quotidiano." },

        { id: 7, name: "Asus ROG Zephyrus", brand: "Asus", price: 1899, images: ["img/rog.jpg"], desc: "Potenza estrema per il gaming in un corpo compatto." },

        { id: 8, name: "Microsoft Surface Laptop 5", brand: "Microsoft", price: 1099, images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=800"], desc: "Eleganza e touch screen per la massima produttività." }

    ],

    tablets: [

        { id: 9, name: "iPad Air M2", brand: "Apple", price: 719, images: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=800"], desc: "Performance da urlo e supporto per Apple Pencil Pro." },

        { id: 10, name: "Samsung Galaxy Tab S9", brand: "Samsung", price: 849, images: ["https://images.unsplash.com/photo-1561154464-82e9adf32764?q=80&w=800"], desc: "Display Dynamic AMOLED 2X e resistenza all'acqua." },

        { id: 11, name: "Lenovo Tab P12", brand: "Lenovo", price: 399, images: ["https://images.unsplash.com/photo-1527698266440-12104e498b76?q=80&w=800"], desc: "Schermo gigante per l'intrattenimento e il multitasking." },

        { id: 12, name: "Xiaomi Pad 6", brand: "Xiaomi", price: 350, images: ["img/xx.jpg"], desc: "Rapporto qualità/prezzo imbattibile con display 144Hz." }

    ],

    ereaders: [

        { id: 13, name: "Kindle Paperwhite", brand: "Amazon", price: 169, images: ["img/kk.jpg"], desc: "Schermo da 6.8 pollici, tonalità della luce regolabile." },

        { id: 14, name: "Kobo Libra 2", brand: "Kobo", price: 199, images: ["img/hh.jpg"], desc: "Completamente impermeabile con tasti volta-pagina fisici." },

        { id: 15, name: "PocketBook InkPad 4", brand: "PocketBook", price: 289, images: ["img/ink.jpg"], desc: "Grande schermo da 7.8 pollici e altoparlante integrato." },

        { id: 16, name: "Kindle Scribe", brand: "Amazon", price: 369, images: ["img/ff.jpg"], desc: "Il primo Kindle per leggere e scrivere come sulla carta." }

    ]

};

let currentCategory = 'all';
let cart = [];
let selectedDevice = null; // Variabile per tracciare cosa stiamo guardando nel modal

// Rendering Prodotti
function renderProducts(data) {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;
    grid.innerHTML = "";
    
    data.forEach(item => {
        const card = document.createElement("div");
        card.className = "product-card";
        card.onclick = () => openDevice(item);
        card.innerHTML = `
            <img src="${item.images[0]}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p class="price">${item.price}€</p>
            <small>Dettagli</small>
        `;
        grid.appendChild(card);
    });
}

// Filtri
function applyFilters() {
    const maxPrice = Number(document.getElementById("priceFilter").value);
    const brand = document.getElementById("brandFilter").value;
    const sort = document.getElementById("sortFilter").value;
    document.getElementById("priceVal").innerText = maxPrice;

    let allItems = [];
    if (currentCategory === 'all') {
        Object.values(devices).forEach(cat => allItems.push(...cat));
    } else {
        allItems = [...devices[currentCategory]];
    }

    let filtered = allItems.filter(item => {
        return item.price <= maxPrice && (brand === "all" || item.brand === brand);
    });

    if (sort === "low") filtered.sort((a,b) => a.price - b.price);
    if (sort === "high") filtered.sort((a,b) => b.price - a.price);

    renderProducts(filtered);
}

function filterByCategory(cat) {
    currentCategory = cat;
    applyFilters();
}

// Modal
function openDevice(item) {
    selectedDevice = item; // Salviamo il riferimento
    const modal = document.getElementById("deviceModal");
    document.getElementById("modalTitle").innerText = item.name;
    document.getElementById("modalPrice").innerText = item.price + "€";
    document.getElementById("modalDesc").innerText = item.desc;
    document.getElementById("modalBrand").innerText = "Marca: " + item.brand;
    
    const mainImg = document.getElementById("mainModalImage");
    mainImg.src = item.images[0];

    const thumbContainer = document.getElementById("modalThumbs");
    thumbContainer.innerHTML = "";
    item.images.forEach(imgSrc => {
        const img = document.createElement("img");
        img.src = imgSrc;
        img.onclick = (e) => { e.stopPropagation(); mainImg.src = imgSrc; };
        thumbContainer.appendChild(img);
    });

    modal.style.display = "flex";
}

function closeDevice() {
    document.getElementById("deviceModal").style.display = "none";
}

// --- LOGICA CARRELLO ---

function toggleCart(isOpen) {
    const sidebar = document.getElementById("cartSidebar");
    if (isOpen) sidebar.classList.add("open");
    else sidebar.classList.remove("open");
}

function addToCart() {
    if (selectedDevice) {
        cart.push({...selectedDevice});
        updateCartUI();
        closeDevice();
        toggleCart(true); // Apre il carrello automaticamente
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById("cartItems");
    const countSpan = document.getElementById("cartCount");
    const totalSpan = document.getElementById("cartTotal");
    
    container.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
            <img src="${item.images[0]}">
            <div class="cart-item-info">
                <p>${item.name}</p>
                <span>${item.price}€</span>
            </div>
            <button class="btn-remove" onclick="removeFromCart(${index})">&times;</button>
        `;
        container.appendChild(itemDiv);
    });

    countSpan.innerText = cart.length;
    totalSpan.innerText = total + "€";
}

function checkout() {
    if (cart.length === 0) return alert("Il carrello è vuoto!");
    alert("Ordine effettuato con successo!");
    cart = [];
    updateCartUI();
    toggleCart(false);
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    filterByCategory('all');
});