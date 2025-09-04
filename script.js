// Cart functionality
let cart = JSON.parse(localStorage.getItem("brewhaven-cart")) || []

// Initialize cart on page load
document.addEventListener("DOMContentLoaded", () => {
  updateCartUI()
  updateCartCount()
})

// Add item to cart
function addToCart(id, name, price, image) {
  const existingItem = cart.find((item) => item.id === id)

  if (existingItem) {
    existingItem.quantity += 1
  } else {
    cart.push({
      id: id,
      name: name,
      price: price,
      image: image,
      quantity: 1,
    })
  }

  localStorage.setItem("brewhaven-cart", JSON.stringify(cart))
  updateCartUI()
  updateCartCount()

  // Show success feedback
  showNotification(`${name} added to cart!`)
}

// Remove item from cart
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id)
  localStorage.setItem("brewhaven-cart", JSON.stringify(cart))
  updateCartUI()
  updateCartCount()
}

// Update item quantity
function updateQuantity(id, change) {
  const item = cart.find((item) => item.id === id)
  if (item) {
    item.quantity += change
    if (item.quantity <= 0) {
      removeFromCart(id)
    } else {
      localStorage.setItem("brewhaven-cart", JSON.stringify(cart))
      updateCartUI()
      updateCartCount()
    }
  }
}

// Update cart UI
function updateCartUI() {
  const cartItems = document.getElementById("cartItems")
  const cartTotal = document.getElementById("cartTotal")

  if (!cartItems || !cartTotal) return

  if (cart.length === 0) {
    cartItems.innerHTML = `
            <div class="empty-cart text-center py-5">
                <i class="fas fa-shopping-cart fa-3x text-coffee-medium mb-3"></i>
                <p class="text-coffee-medium">Your cart is empty</p>
            </div>
        `
    cartTotal.textContent = "0.00"
    return
  }

  let total = 0
  cartItems.innerHTML = cart
    .map((item) => {
      total += item.price * item.quantity
      return `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity('${item.id}', 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                        <button class="remove-btn ms-3" onclick="removeFromCart('${item.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `
    })
    .join("")

  cartTotal.textContent = total.toFixed(2)
}

// Update cart count badge
function updateCartCount() {
  const cartCount = document.getElementById("cart-count")
  if (cartCount) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)
    cartCount.textContent = totalItems
    cartCount.style.display = totalItems > 0 ? "inline" : "none"
  }
}

// Toggle cart sidebar
function toggleCart() {
  const cartSidebar = document.getElementById("cartSidebar")
  const cartOverlay = document.getElementById("cartOverlay")

  if (cartSidebar && cartOverlay) {
    cartSidebar.classList.toggle("open")
    cartOverlay.classList.toggle("show")

    // Prevent body scroll when cart is open
    document.body.style.overflow = cartSidebar.classList.contains("open") ? "hidden" : ""
  }
}

// Go to checkout
function goToCheckout() {
  if (cart.length === 0) {
    showNotification("Your cart is empty!", "error")
    return
  }
  window.location.href = "checkout.html"
}

// Show notification
function showNotification(message, type = "success") {
  const notification = document.createElement("div")
  notification.className = `alert alert-${type === "success" ? "success" : "danger"} position-fixed`
  notification.style.cssText = `
        top: 100px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideIn 0.3s ease;
    `
  notification.innerHTML = `
        <i class="fas fa-${type === "success" ? "check-circle" : "exclamation-circle"} me-2"></i>
        ${message}
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease"
    setTimeout(() => notification.remove(), 300)
  }, 3000)
}

// Form validation
function validateForm(formId) {
  const form = document.getElementById(formId)
  if (!form) return false

  const inputs = form.querySelectorAll("input[required], select[required], textarea[required]")
  let isValid = true

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("is-invalid")
      isValid = false
    } else {
      input.classList.remove("is-invalid")
    }

    // Email validation
    if (input.type === "email" && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(input.value)) {
        input.classList.add("is-invalid")
        isValid = false
      }
    }

    // Phone validation
    if (input.type === "tel" && input.value) {
      const phoneRegex = /^$$\d{3}$$ \d{3}-\d{4}$/
      if (!phoneRegex.test(input.value)) {
        input.classList.add("is-invalid")
        isValid = false
      }
    }
  })

  return isValid
}

// Phone number formatting
function formatPhone(input) {
  let value = input.value.replace(/\D/g, "")
  if (value.length >= 6) {
    value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`
  } else if (value.length >= 3) {
    value = `(${value.slice(0, 3)}) ${value.slice(3)}`
  }
  input.value = value
}

// Smooth scrolling for anchor links
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href^="#"]')
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
})

// Add CSS animations
const style = document.createElement("style")
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`
document.head.appendChild(style)
