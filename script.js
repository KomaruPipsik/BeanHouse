// ===== Дані товарів =====
const products = [
  {
    id: 1,
    title: "Ефіопія Єрґачеффе",
    tag: "Легка обсмажка",
    desc: "Квіткові та цитрусові нотки з ноткою бергамоту. Ідеально для V60.",
    price: 320,
    img: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=500&q=80"
  },
  {
    id: 2,
    title: "Колумбія Супремо",
    tag: "Середня обсмажка",
    desc: "Збалансований смак з карамеллю та горіховим післясмаком.",
    price: 280,
    img: "https://images.unsplash.com/photo-1610632380989-680fe40816c6?w=500&q=80"
  },
  {
    id: 3,
    title: "Бразилія Сантос",
    tag: "Темна обсмажка",
    desc: "Насичений шоколадний смак з низькою кислотністю.",
    price: 260,
    img: "https://images.unsplash.com/photo-1559525839-29bf4b5e0f5d?w=500&q=80"
  },
  {
    id: 4,
    title: "Гватемала Антигуа",
    tag: "Середня обсмажка",
    desc: "Димні та пряні нотки з насиченим тілом.",
    price: 310,
    img: "https://images.unsplash.com/photo-1517663996469-2f5a1b6a9d56?w=500&q=80"
  },
  {
    id: 5,
    title: "Кенія АА",
    tag: "Легка обсмажка",
    desc: "Яскрава кислотність, ноти чорної смородини та винограду.",
    price: 350,
    img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&q=80"
  },
  {
    id: 6,
    title: "Еспресо Бленд",
    tag: "Для еспресо",
    desc: "Збалансований мікс з кремовою текстурою та солодким фіналом.",
    price: 290,
    img: "https://images.unsplash.com/photo-1514066558159-fc8c737ef259?w=500&q=80"
  },
  {
    id: 7,
    title: "Декаф Колумбія",
    tag: "Без кофеїну",
    desc: "Той самий смак без кофеїну. М'який та злегка солодкий.",
    price: 300,
    img: "https://images.unsplash.com/photo-1572119865084-43c285814d63?w=500&q=80"
  },
  {
    id: 8,
    title: "Індія Малабар",
    tag: "Темна обсмажка",
    desc: "Пряний, землистий смак із легкою гостринкою.",
    price: 270,
    img: "https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=500&q=80"
  }
];

// ===== Стан кошика =====
let cart = [];

// ===== DOM елементи =====
const productGrid = document.getElementById("productGrid");
const cartBtn = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const cart_ = document.getElementById("cart");
const cartBody = document.getElementById("cartBody");
const cartTotal = document.getElementById("cartTotal");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutModal = document.getElementById("checkoutModal");
const closeModal = document.getElementById("closeModal");
const checkoutForm = document.getElementById("checkoutForm");
const checkoutFormWrap = document.getElementById("checkoutFormWrap");
const successScreen = document.getElementById("successScreen");
const closeSuccess = document.getElementById("closeSuccess");
const modalTotal = document.getElementById("modalTotal");
const toast = document.getElementById("toast");

// ===== Рендер товарів =====
function renderProducts() {
  productGrid.innerHTML = products.map(p => `
    <div class="card">
      <div class="card__img-wrap">
        <img src="${p.img}" alt="${p.title}" loading="lazy">
      </div>
      <div class="card__body">
        <span class="card__tag">${p.tag}</span>
        <h3 class="card__title">${p.title}</h3>
        <p class="card__desc">${p.desc}</p>
        <div class="card__footer">
          <div class="card__price">${p.price} ₴ <span>/ 250г</span></div>
          <button class="add-btn" data-id="${p.id}">Купити</button>
        </div>
      </div>
    </div>
  `).join("");
}

// ===== Допоміжні функції =====
function formatPrice(num) {
  return num.toLocaleString("uk-UA") + " ₴";
}

function getTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("active");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("active"), 2200);
}

// ===== Рендер кошика =====
function renderCart() {
  cartCount.textContent = getCount();
  cartCount.classList.add("bump");
  setTimeout(() => cartCount.classList.remove("bump"), 200);

  if (cart.length === 0) {
    cartBody.innerHTML = `
      <div class="cart__empty">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="9" cy="21" r="1"></circle>
          <circle cx="20" cy="21" r="1"></circle>
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
        </svg>
        <p>Ваш кошик порожній</p>
        <p style="font-size: 13px;">Додайте каву з каталогу, щоб почати замовлення</p>
      </div>
    `;
    checkoutBtn.disabled = true;
    checkoutBtn.style.opacity = "0.5";
    checkoutBtn.style.cursor = "not-allowed";
  } else {
    cartBody.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <div class="cart-item__img">
          <img src="${item.img}" alt="${item.title}">
        </div>
        <div class="cart-item__info">
          <span class="cart-item__title">${item.title}</span>
          <span class="cart-item__price">${formatPrice(item.price)}</span>
          <div class="qty">
            <button class="qty-minus" data-id="${item.id}">−</button>
            <span>${item.qty}</span>
            <button class="qty-plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <div class="cart-item__remove">
          <span class="cart-item__total">${formatPrice(item.price * item.qty)}</span>
          <button class="remove-btn" data-id="${item.id}">Видалити</button>
        </div>
      </div>
    `).join("");

    checkoutBtn.disabled = false;
    checkoutBtn.style.opacity = "1";
    checkoutBtn.style.cursor = "pointer";
  }

  const total = getTotal();
  cartTotal.textContent = formatPrice(total);
  modalTotal.textContent = formatPrice(total);
}

// ===== Дії з кошиком =====
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  renderCart();
  showToast(`«${product.title}» додано до кошика`);
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;

  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }

  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

// ===== Відкриття / закриття кошика =====
function openCart() {
  cart_.classList.add("active");
  overlay.classList.add("active");
}

function closeCartFn() {
  cart_.classList.remove("active");
  overlay.classList.remove("active");
}

// ===== Модалка оформлення =====
function openModal() {
  checkoutModal.classList.add("active");
  modalTotal.textContent = formatPrice(getTotal());
}

function closeModalFn() {
  checkoutModal.classList.remove("active");
}

// ===== Валідація форми =====
function validateForm(data) {
  let valid = true;

  const nameError = document.getElementById("nameError");
  const phoneError = document.getElementById("phoneError");
  const cityError = document.getElementById("cityError");

  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const cityInput = document.getElementById("city");

  [nameInput, phoneInput, cityInput].forEach(el => el.classList.remove("invalid"));
  [nameError, phoneError, cityError].forEach(el => el.textContent = "");

  if (data.name.trim().length < 3) {
    nameError.textContent = "Введіть ім'я та прізвище (мінімум 3 символи)";
    nameInput.classList.add("invalid");
    valid = false;
  }

  const phoneDigits = data.phone.replace(/\D/g, "");
  if (phoneDigits.length < 10) {
    phoneError.textContent = "Введіть коректний номер телефону";
    phoneInput.classList.add("invalid");
    valid = false;
  }

  if (data.city.trim().length < 2) {
    cityError.textContent = "Вкажіть місто доставки";
    cityInput.classList.add("invalid");
    valid = false;
  }

  return valid;
}

// ===== Обробники подій =====
productGrid.addEventListener("click", e => {
  const btn = e.target.closest(".add-btn");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  addToCart(id);

  btn.classList.add("added");
  const original = btn.textContent;
  btn.textContent = "Додано ✓";
  setTimeout(() => {
    btn.classList.remove("added");
    btn.textContent = original;
  }, 1000);
});

cartBody.addEventListener("click", e => {
  const id = Number(e.target.dataset.id);
  if (!id) return;

  if (e.target.classList.contains("qty-plus")) changeQty(id, 1);
  if (e.target.classList.contains("qty-minus")) changeQty(id, -1);
  if (e.target.classList.contains("remove-btn")) removeFromCart(id);
});

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartFn);
overlay.addEventListener("click", () => {
  closeCartFn();
  closeModalFn();
});

checkoutBtn.addEventListener("click", () => {
  if (cart.length === 0) return;
  closeCartFn();
  openModal();
});

closeModal.addEventListener("click", closeModalFn);

checkoutForm.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    city: document.getElementById("city").value,
    delivery: document.getElementById("delivery").value,
    comment: document.getElementById("comment").value
  };

  if (!validateForm(data)) return;

  // Показуємо екран успіху та очищаємо кошик
  checkoutFormWrap.style.display = "none";
  successScreen.classList.add("active");

  cart = [];
  renderCart();
});

closeSuccess.addEventListener("click", () => {
  closeModalFn();
  checkoutFormWrap.style.display = "block";
  successScreen.classList.remove("active");
  checkoutForm.reset();
});

// ===== Ініціалізація =====
renderProducts();
renderCart();
