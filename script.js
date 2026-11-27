"use strict";

// ---------- Menu : met en évidence la section visible ----------
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-list a");

function setActive(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
  });
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  },
  { rootMargin: "-40% 0px -55% 0px" }
);

sections.forEach((section) => observer.observe(section));

// En bas de page, la section « contact » est trop courte pour être détectée
window.addEventListener("scroll", () => {
  const bottom = window.innerHeight + window.scrollY;
  if (bottom >= document.documentElement.scrollHeight - 2) setActive("contact");
});

// ---------- Catalogue : filtre par catégorie ----------
const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".product-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((b) => b.classList.toggle("is-active", b === button));
    cards.forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

// ---------- Panier ----------
// Numéro WhatsApp : indicatif du pays + numéro, sans « + » ni espaces
const WHATSAPP_NUMBER = "237600000000";
const STORAGE_KEY = "afrishop-panier";

const cartBar = document.getElementById("cart-bar");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const cartItems = document.getElementById("cart-items");
const orderLink = document.getElementById("order-link");
const clearButton = document.getElementById("clear-cart");

let cart = loadCart();

function loadCart() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch (error) {
    return {};
  }
}

function saveCart() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    // Stockage indisponible : le panier reste simplement en mémoire
  }
}

function formatPrice(value) {
  return value.toLocaleString("fr-FR") + " FCFA";
}

function renderCart() {
  const lines = Object.values(cart);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);
  const total = lines.reduce((sum, line) => sum + line.qty * line.price, 0);

  cartBar.hidden = count === 0;
  document.body.classList.toggle("cart-open", count > 0);
  cartCount.textContent = count;
  cartTotal.textContent = formatPrice(total);

  cartItems.innerHTML = "";
  lines.forEach((line) => {
    const item = document.createElement("li");
    item.textContent = line.qty + " x " + line.name;
    cartItems.appendChild(item);
  });

  const message =
    "Bonjour AfriShop, je souhaite commander :\n" +
    lines.map((line) => "- " + line.qty + " x " + line.name).join("\n") +
    "\nTotal : " + formatPrice(total);

  orderLink.href =
    "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}

document.querySelectorAll(".add-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const card = button.closest(".product-card");
    const id = card.dataset.id;

    if (!cart[id]) {
      cart[id] = { name: card.dataset.name, price: Number(card.dataset.price), qty: 0 };
    }
    cart[id].qty += 1;

    saveCart();
    renderCart();
  });
});

clearButton.addEventListener("click", () => {
  cart = {};
  saveCart();
  renderCart();
});

renderCart();

// ---------- Contact : lien WhatsApp ----------
const contactLink = document.getElementById("contact-whatsapp");

if (contactLink) {
  const text = "Bonjour AfriShop, j'ai une question.";
  contactLink.href =
    "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
}