// ── Aamrutham Local Cart ──
var CART_KEY = 'aamrutham_cart';

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
  catch(e) { return []; }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id, name, packLabel, price, zohoUrl) {
  var cart = getCart();
  var key  = id + '||' + packLabel;
  var existing = cart.find(function(i) { return i.key === key; });
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ key: key, id: id, name: name, packLabel: packLabel, price: price, zohoUrl: zohoUrl, qty: 1 });
  }
  saveCart(cart);
  updateCartBubble();
  openCartDrawer();
  flashCartIcon();
}

function removeFromCart(key) {
  saveCart(getCart().filter(function(i) { return i.key !== key; }));
  updateCartBubble();
  renderCartItems();
}

function changeQty(key, delta) {
  var cart = getCart();
  var item = cart.find(function(i) { return i.key === key; });
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  saveCart(cart);
  updateCartBubble();
  renderCartItems();
}

function updateCartBubble() {
  var count = getCart().reduce(function(s, i) { return s + i.qty; }, 0);
  document.querySelectorAll('.cart-bubble').forEach(function(el) {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

function flashCartIcon() {
  var wrap = document.querySelector('.cart-icon-wrap');
  if (!wrap) return;
  wrap.classList.add('cart-pop');
  setTimeout(function() { wrap.classList.remove('cart-pop'); }, 400);
}

function openCartDrawer() {
  var drawer  = document.getElementById('cart-drawer');
  var overlay = document.getElementById('cart-overlay');
  if (!drawer || !overlay) return;
  renderCartItems();
  drawer.classList.add('open');
  overlay.classList.add('open');
  // NOTE: no body overflow lock — keeps the page scrollable at all times
}

function closeCartDrawer() {
  var drawer  = document.getElementById('cart-drawer');
  var overlay = document.getElementById('cart-overlay');
  if (!drawer || !overlay) return;
  drawer.classList.remove('open');
  overlay.classList.remove('open');
}

function renderCartItems() {
  var cart   = getCart();
  var body   = document.getElementById('cart-items');
  var footer = document.getElementById('cart-footer');
  if (!body || !footer) return;

  if (cart.length === 0) {
    body.innerHTML =
      '<div class="cart-empty">' +
        '<i class="fa-solid fa-basket-shopping"></i>' +
        '<p>Your cart is empty</p>' +
        '<a href="shop.html">Browse mangoes →</a>' +
      '</div>';
    footer.style.display = 'none';
    return;
  }

  var total = 0;
  var html  = cart.map(function(item) {
    var lineTotal = item.price * item.qty;
    total += lineTotal;
    // Escape key for use in onclick attribute
    var safeKey = item.key.replace(/'/g, "\\'");
    return (
      '<div class="cart-item">' +
        '<div class="cart-item-info">' +
          '<div class="cart-item-name">' + item.name + '</div>' +
          '<div class="cart-item-pack">' + item.packLabel + ' &middot; &#8377;' + item.price.toLocaleString('en-IN') + ' each</div>' +
          '<div class="cart-qty-row">' +
            '<button class="cart-qty-btn" onclick="changeQty(\'' + safeKey + '\', -1)">&#8722;</button>' +
            '<span class="cart-qty-val">' + item.qty + '</span>' +
            '<button class="cart-qty-btn" onclick="changeQty(\'' + safeKey + '\', 1)">&#43;</button>' +
          '</div>' +
        '</div>' +
        '<div class="cart-item-right">' +
          '<div class="cart-item-price">&#8377;' + lineTotal.toLocaleString('en-IN') + '</div>' +
          '<button class="cart-remove-btn" onclick="removeFromCart(\'' + safeKey + '\')" title="Remove">' +
            '<i class="fa-solid fa-xmark"></i>' +
          '</button>' +
        '</div>' +
      '</div>'
    );
  }).join('');

  body.innerHTML = html;
  document.getElementById('cart-total-amt').textContent = '\u20B9' + total.toLocaleString('en-IN');
  footer.style.display = 'block';
}

function cartCheckout() {
  window.open('https://shop.aamrutham.com/products/bobbili-peechu/3610986000000044089', '_blank', 'noopener');
}

// ── Shop page: reads selected pack from the card DOM ──
function shopAddToCart(btn) {
  var card        = btn.closest('.product-card');
  var productId   = card.dataset.productId;
  var productName = card.dataset.productName;
  var zohoUrl     = card.dataset.zohoUrl;
  var selectedPack = card.querySelector('.pack-btn.selected');
  var packLabel   = selectedPack ? selectedPack.textContent.trim() : '';
  var priceEl     = card.querySelector('.price');
  var price       = priceEl ? parseInt(priceEl.textContent.replace(/[^\d]/g, '')) || 0 : 0;
  addToCart(productId, productName, packLabel, price, zohoUrl);
}

// ── Product page: reads current pack + price from the detail page ──
function productAddToCartFromPage() {
  var selectedPack = document.querySelector('#pack-options .pack-btn.selected');
  var packLabel    = selectedPack ? selectedPack.textContent.trim() : '';
  var priceText    = document.getElementById('price-display').textContent;
  var price        = parseInt(priceText.replace(/[^\d]/g, '')) || 0;
  addToCart(window._currentProduct.id, window._currentProduct.name, packLabel, price, window._currentProduct.zohoUrl);
}

// ── Init ──
document.addEventListener('DOMContentLoaded', function() {
  updateCartBubble();

  // Cart icon opens drawer
  document.querySelectorAll('.cart-icon-wrap').forEach(function(el) {
    el.addEventListener('click', openCartDrawer);
  });

  // Close drawer when clicking the overlay
  var overlay = document.getElementById('cart-overlay');
  if (overlay) {
    overlay.addEventListener('click', closeCartDrawer);
  }

  // Close drawer with Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeCartDrawer();
  });
});
