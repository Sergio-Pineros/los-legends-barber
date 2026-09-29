/**
 * Legends Apparel — Theme Interactivity (Vanilla JS)
 * Shopify-native AJAX Cart, Scroll Reveals, Variant Selector & Drawer
 */

(() => {
  "use strict";

  // --- REVEAL ON SCROLL ---
  function initReveals() {
    const reveals = document.querySelectorAll(".reveal:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      reveals.forEach(el => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.05 });

    reveals.forEach(el => io.observe(el));
  }

  // --- HEADER SCROLL & MOBILE MENU ---
  function initHeader() {
    const header = document.querySelector(".site-header");
    const menuBtn = document.querySelector(".mobile-menu-btn");
    const mobileNav = document.querySelector(".mobile-nav-panel");

    if (header) {
      const onScroll = () => {
        if (window.scrollY > 8) {
          header.classList.add("scrolled");
        } else {
          header.classList.remove("scrolled");
        }
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    if (menuBtn && mobileNav) {
      menuBtn.addEventListener("click", () => {
        const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
        menuBtn.setAttribute("aria-expanded", String(!isOpen));
        mobileNav.classList.toggle("is-open", !isOpen);
        document.body.style.overflow = !isOpen ? "hidden" : "";
      });

      mobileNav.querySelectorAll("a").forEach(a => {
        a.addEventListener("click", () => {
          menuBtn.setAttribute("aria-expanded", "false");
          mobileNav.classList.remove("is-open");
          document.body.style.overflow = "";
        });
      });
    }
  }

  // --- NATIVE SHOPIFY AJAX CART ---
  const Cart = {
    root: null,
    badge: null,
    itemsList: null,
    emptyView: null,
    footerView: null,
    subtotalEl: null,
    checkoutBtn: null,

    init() {
      this.root = document.querySelector(".cart-drawer-root");
      this.badge = document.querySelector(".cart-count-badge");
      this.itemsList = document.querySelector(".drawer-items-list");
      this.emptyView = document.querySelector(".drawer-empty-state");
      this.footerView = document.querySelector(".drawer-footer");
      this.subtotalEl = document.querySelector(".drawer-subtotal-val");
      this.checkoutBtn = document.querySelector(".drawer-checkout-btn");

      // Drawer trigger buttons
      document.querySelectorAll("[data-cart-open]").forEach(btn => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this.open();
        });
      });

      document.querySelectorAll("[data-cart-close]").forEach(btn => {
        btn.addEventListener("click", () => this.close());
      });

      // Escape key to close
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen()) this.close();
      });

      // Intercept native product forms for AJAX add
      document.addEventListener("submit", (e) => {
        const form = e.target;
        if (form && form.matches("form[action*='/cart/add']")) {
          e.preventDefault();
          this.handleAddSubmit(form);
        }
      });
    },

    isOpen() {
      return this.root && this.root.classList.contains("is-open");
    },

    open() {
      if (!this.root) return;
      this.root.classList.add("is-open");
      document.body.style.overflow = "hidden";
      this.refresh();
    },

    close() {
      if (!this.root) return;
      this.root.classList.remove("is-open");
      document.body.style.overflow = "";
    },

    formatMoney(cents) {
      if (typeof window.Shopify !== "undefined" && window.Shopify.formatMoney) {
        return window.Shopify.formatMoney(cents);
      }
      return "$" + (cents / 100).toFixed(2);
    },

    async fetchCart() {
      try {
        const res = await fetch("/cart.js", { headers: { Accept: "application/json" } });
        return await res.json();
      } catch (err) {
        console.error("Cart fetch error:", err);
        return null;
      }
    },

    async refresh() {
      const data = await this.fetchCart();
      if (!data) return;
      this.render(data);
    },

    render(cart) {
      // Update count badges across page
      document.querySelectorAll(".cart-count-badge").forEach(badge => {
        badge.textContent = cart.item_count;
        badge.classList.remove("scale-125");
        void badge.offsetWidth;
        badge.classList.add("scale-125");
        setTimeout(() => badge.classList.remove("scale-125"), 300);
      });

      if (!this.itemsList) return;

      if (cart.item_count === 0) {
        if (this.emptyView) this.emptyView.style.display = "flex";
        if (this.itemsList) this.itemsList.style.display = "none";
        if (this.footerView) this.footerView.style.display = "none";
        return;
      }

      if (this.emptyView) this.emptyView.style.display = "none";
      if (this.itemsList) this.itemsList.style.display = "block";
      if (this.footerView) this.footerView.style.display = "block";

      if (this.subtotalEl) {
        this.subtotalEl.textContent = this.formatMoney(cart.total_price);
      }

      // Render line items
      this.itemsList.innerHTML = cart.items.map((item, idx) => `
        <li class="cart-line-item" data-line-key="${item.key}">
          <a href="${item.url}" class="cart-line-thumb">
            ${item.image ? `<img src="${item.image}" alt="${item.title}" />` : ""}
          </a>
          <div class="cart-line-content">
            <div class="cart-line-top">
              <a href="${item.url}" class="cart-line-title truncate">${item.product_title}</a>
              <span class="cart-line-price tabular-nums">${this.formatMoney(item.final_line_price)}</span>
            </div>
            ${item.variant_title ? `<p class="cart-line-variant text-mute">${item.variant_title}</p>` : ""}
            <div class="cart-line-bottom">
              <div class="qty-pill">
                <button type="button" class="qty-btn" data-change="-1" data-key="${item.key}" data-qty="${item.quantity - 1}">−</button>
                <span class="qty-num">${item.quantity}</span>
                <button type="button" class="qty-btn" data-change="1" data-key="${item.key}" data-qty="${item.quantity + 1}">+</button>
              </div>
              <button type="button" class="remove-btn" data-remove="${item.key}">Remove</button>
            </div>
          </div>
        </li>
      `).join("");

      // Bind quantity events
      this.itemsList.querySelectorAll("[data-qty]").forEach(btn => {
        btn.addEventListener("click", () => {
          const key = btn.getAttribute("data-key");
          const nextQty = parseInt(btn.getAttribute("data-qty"), 10);
          this.changeQuantity(key, nextQty);
        });
      });

      this.itemsList.querySelectorAll("[data-remove]").forEach(btn => {
        btn.addEventListener("click", () => {
          const key = btn.getAttribute("data-remove");
          this.changeQuantity(key, 0);
        });
      });
    },

    async changeQuantity(key, quantity) {
      if (this.itemsList) this.itemsList.style.opacity = "0.5";
      try {
        const res = await fetch("/cart/change.js", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ id: key, quantity })
        });
        const cart = await res.json();
        this.render(cart);
      } catch (err) {
        console.error("Cart update error:", err);
      } finally {
        if (this.itemsList) this.itemsList.style.opacity = "1";
      }
    },

    async handleAddSubmit(form) {
      const submitBtn = form.querySelector("[type='submit']");
      const origText = submitBtn ? submitBtn.textContent : "";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Adding…";
      }

      const formData = new FormData(form);
      try {
        const res = await fetch("/cart/add.js", {
          method: "POST",
          headers: { Accept: "application/json" },
          body: formData
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.description || "Could not add to bag");
        }
        if (submitBtn) {
          submitBtn.textContent = "Added to bag ✓";
          setTimeout(() => {
            submitBtn.textContent = origText;
            submitBtn.disabled = false;
          }, 1500);
        }
        this.open();
      } catch (err) {
        alert(err.message || "Failed to add to bag.");
        if (submitBtn) {
          submitBtn.textContent = origText;
          submitBtn.disabled = false;
        }
      }
    }
  };

  window.LegendsCart = Cart;

  // --- PRODUCT VIEW VARIANT & SWATCH PICKER ---
  function initProductVariants() {
    const section = document.querySelector("[data-section-type='product']");
    if (!section) return;

    const dataEl = section.querySelector("[data-product-json]");
    if (!dataEl) return;

    let product;
    try {
      product = JSON.parse(dataEl.textContent);
    } catch (e) {
      return;
    }

    const idInput = section.querySelector("input[name='id']");
    const priceEl = section.querySelector(".product-current-price");
    const submitBtn = section.querySelector(".product-add-btn");
    const colorLabel = section.querySelector(".active-color-label");
    const colorSwatches = section.querySelectorAll("[data-color-swatch]");
    const sizeButtons = section.querySelectorAll("[data-size-btn]");
    const galleryImages = section.querySelectorAll("[data-gallery-img]");
    const galleryThumbs = section.querySelectorAll("[data-thumb-img]");
    const tabBtns = section.querySelectorAll("[data-tab-target]");
    const tabPanels = section.querySelectorAll("[data-tab-panel]");

    let selectedColor = colorSwatches[0]?.getAttribute("data-color-swatch") || null;
    let selectedSize = null;

    function update() {
      // Find matching variant
      const matchingVariant = product.variants.find(v => {
        const colorMatch = !selectedColor || v.options.includes(selectedColor);
        const sizeMatch = !selectedSize || v.options.includes(selectedSize);
        return colorMatch && sizeMatch;
      });

      if (matchingVariant) {
        if (idInput) idInput.value = matchingVariant.id;
        if (priceEl) priceEl.textContent = Cart.formatMoney(matchingVariant.price);
        if (submitBtn) {
          if (matchingVariant.available) {
            submitBtn.disabled = false;
            submitBtn.textContent = selectedSize ? `Add to bag · ${Cart.formatMoney(matchingVariant.price)}` : "Select a size";
          } else {
            submitBtn.disabled = true;
            submitBtn.textContent = "Sold out";
          }
        }
      } else {
        if (submitBtn) {
          submitBtn.disabled = !selectedSize;
          submitBtn.textContent = selectedSize ? "Unavailable" : "Select a size";
        }
      }

      // Filter gallery images by color
      let matchCount = 0;
      galleryImages.forEach(img => {
        const imgColor = img.getAttribute("data-img-color");
        if (!selectedColor || !imgColor || imgColor === selectedColor) {
          img.style.display = matchCount === 0 ? "block" : "none";
          matchCount++;
        } else {
          img.style.display = "none";
        }
      });

      // Filter thumbnails
      galleryThumbs.forEach((thumb, idx) => {
        const thumbColor = thumb.getAttribute("data-img-color");
        const visible = !selectedColor || !thumbColor || thumbColor === selectedColor;
        thumb.style.display = visible ? "block" : "none";
        if (visible && idx === 0) {
          galleryThumbs.forEach(t => t.classList.remove("active"));
          thumb.classList.add("active");
        }
      });
    }

    // Color swatches click
    colorSwatches.forEach(btn => {
      btn.addEventListener("click", () => {
        colorSwatches.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedColor = btn.getAttribute("data-color-swatch");
        if (colorLabel) colorLabel.textContent = selectedColor;
        update();
      });
    });

    // Size buttons click
    sizeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        sizeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        selectedSize = btn.getAttribute("data-size-btn");
        update();
      });
    });

    // Thumbnail click
    galleryThumbs.forEach(thumb => {
      thumb.addEventListener("click", () => {
        const idx = thumb.getAttribute("data-thumb-index");
        galleryThumbs.forEach(t => t.classList.remove("active"));
        thumb.classList.add("active");
        galleryImages.forEach((img, i) => {
          img.style.display = String(i) === idx ? "block" : "none";
        });
      });
    });

    // Tab switching (Details, Size guide, Fabric & care)
    tabBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        const target = btn.getAttribute("data-tab-target");
        tabBtns.forEach(b => b.classList.remove("active"));
        tabPanels.forEach(p => p.style.display = "none");
        btn.classList.add("active");
        const activePanel = section.querySelector(`[data-tab-panel="${target}"]`);
        if (activePanel) activePanel.style.display = "block";
      });
    });

    update();
  }

  // --- BOOTSTRAP ---
  document.addEventListener("DOMContentLoaded", () => {
    initReveals();
    initHeader();
    Cart.init();
    initProductVariants();
  });
})();
