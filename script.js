// SAFARI SHOP — catalogue, recherche, panier et commande WhatsApp.
const WHATSAPP_NUMBER = "243981203927";

const products = [
  {id:1,name:"Casque Nova Pro",category:"Audio",price:21,oldPrice:40,tag:"POPULAIRE",images:"images/casque.jpg",description:"Un son immersif et un confort longue durée."},
  {id:2,name:"Montre Pulse X",category:"Accessoires",price:60,oldPrice:79,tag:"NOUVEAU",images:"images/montre.jpg",description:"Suivez votre quotidien avec élégance."},
  {id:3,name:"Écouteurs AirBeat",category:"Audio",price:15,oldPrice:null,tag:"TENDANCE",images:"images/noir.jpg",description:"Liberté sans fil, son clair et puissant."},
  {id:4,name:"Enceinte Boom 360",category:"Audio",price:25,oldPrice:48,tag:"PROMO",images:"images/enceinte.jpg",description:"Une ambiance sonore qui vous accompagne."},
  {id:5,name:"Sac Urban Tech",category:"Accessoires",price:10,oldPrice:null,tag:"POPULAIRE",images:"images/sac .jpg",description:"Pratique, moderne et prêt pour vos journées."},
  {id:6,name:"Clavier Mecha RGB",category:"Informatique",price:7.5,oldPrice:10,tag:"TENDANCE",images:"images/clavier.jpg",description:"Une expérience de frappe précise et lumineuse."},
  {id:7,name:"Airpod Pro 2",category:"Audio",price:20,oldPrice:null,tag:"POPULAIRE",color:"cyan",images:"images/airpod.jpg",description:"Une expérience de frappe du son puissant. Black couleur de male alpha"},
  {id:8,name:"Airpod Pro 2 Blanc",category:"Audio",price:32,oldPrice:40,tag:"TENDANCE",color:"cyan",images:"images/ipod.jpg",description:"Une expérience de frappe de son précise et lumineuse. couleur de la clarte"},
  {id:9,name:"UBL",category:"Audio",price:10,oldPrice:15,tag:"NOUVEAU",color:"cyan",images:"images/bluetooth.jpg",description:"Ecouter de la music, tes chansons preférés avec élegance"}
];

let cart = [];
let selectedCategory = "Tout";
const money = value => `$${value.toFixed(2)}`;

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const cartOverlay = document.getElementById("cartOverlay");

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(product =>
    (selectedCategory === "Tout" || product.category === selectedCategory) &&
    product.name.toLowerCase().includes(query)
  );

  productGrid.innerHTML = filtered.length ? filtered.map(product => `
    <article class="product-card">
      <div class="product-visual ${product.color}">
        ${product.tag ? `<span class="tag">${product.tag}</span>` : ""}
        <img src="${product.images}" alt="${product.name}" class="product-image">
        <span class="visual-code">SS / 0${product.id}</span>
      </div>
      <div class="product-info">
        <div class="category">${product.category}</div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <div class="prices"><strong>${money(product.price)}</strong>${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ""}</div>
          <button class="add-button" data-add="${product.id}" aria-label="Ajouter ${product.name}">+</button>
        </div>
      </div>
    </article>
  `).join("") : `<div class="no-results">Aucun produit trouvé. Essayez une autre recherche.</div>`;
}

function addToCart(id) {
  const existing = cart.find(item => item.id === id);
  if (existing) existing.quantity++;
  else {
    const product = products.find(item => item.id === id);
    cart.push({...product, quantity:1});
  }
  renderCart();
  openCart();
}

function updateQuantity(id, change) {
  const item = cart.find(product => product.id === id);
  if (!item) return;
  item.quantity += change;
  cart = cart.filter(product => product.quantity > 0);
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  renderCart();
}

function renderCart() {
  const count = cart.reduce((sum,item) => sum + item.quantity, 0);
  const total = cart.reduce((sum,item) => sum + item.price * item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
  document.getElementById("cartTitleCount").textContent = `(${count})`;
  document.getElementById("cartTotal").textContent = money(total);
  document.getElementById("cartEmpty").hidden = cart.length > 0;
  document.getElementById("cartSummary").hidden = cart.length === 0;

  document.getElementById("cartItems").innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-thumb ${item.color}">
      <img src="${item.images}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: inherit;">
      </div>
      <div class="cart-item-info">
        <b>${item.name}</b><strong>${money(item.price)}</strong>
        <div class="quantity">
          <button data-minus="${item.id}" aria-label="Diminuer">−</button>
          <span>${item.quantity}</span>
          <button data-plus="${item.id}" aria-label="Augmenter">+</button>
        </div>
      </div>
      <button class="remove" data-remove="${item.id}" aria-label="Supprimer">✕</button>
    </div>
  `).join("");
}

function openCart() {
  cartOverlay.classList.add("visible");
  cartOverlay.setAttribute("aria-hidden","false");
}
function closeCart() {
  cartOverlay.classList.remove("visible");
  cartOverlay.setAttribute("aria-hidden","true");
}

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addToCart(Number(button.dataset.add));
});

document.getElementById("filters").addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  selectedCategory = button.dataset.category;
  document.querySelectorAll(".filter").forEach(filter => filter.classList.toggle("active", filter === button));
  renderProducts();
});

searchInput.addEventListener("input", renderProducts);
document.getElementById("openCart").addEventListener("click", openCart);
document.getElementById("closeCart").addEventListener("click", closeCart);
document.getElementById("continueShopping").addEventListener("click", closeCart);
cartOverlay.addEventListener("click", event => { if (event.target === cartOverlay) closeCart(); });

document.getElementById("cartItems").addEventListener("click", event => {
  const minus = event.target.closest("[data-minus]");
  const plus = event.target.closest("[data-plus]");
  const remove = event.target.closest("[data-remove]");
  if (minus) updateQuantity(Number(minus.dataset.minus), -1);
  if (plus) updateQuantity(Number(plus.dataset.plus), 1);
  if (remove) removeFromCart(Number(remove.dataset.remove));
});

document.getElementById("checkout").addEventListener("click", () => {
  if (!cart.length) return;
 
  const lines = cart.map(item => `${item.name} x${item.quantity} — ${money(item.price * item.quantity)}`);
  const total = cart.reduce((sum,item) => sum + item.price * item.quantity, 0);
  const message = `Bonjour SAFARI SHOP, je souhaite commander :\n${lines.join("\n")}\nTotal : ${money(total)}`;
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank");
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("nav").classList.toggle("open");
});
document.querySelectorAll("#nav a").forEach(link => link.addEventListener("click", () => {
  document.getElementById("nav").classList.remove("open");
}));
document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
renderCart();
