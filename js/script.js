/* ==========================================================================
   Bubble Truck Window Cleaning — interactions
   Vanilla JS, no dependencies. Progressive enhancement: everything below
   only adds convenience on top of working links and native anchors.
   ========================================================================== */
(function () {
  "use strict";

  var docEl = document.documentElement;
  var body = document.body;
  var header = document.getElementById("siteHeader");
  var menuToggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");
  var floatingBar = document.getElementById("floatingBar");
  var toTop = document.getElementById("toTop");
  var floatCta = document.getElementById("floatCta");
  var dropdowns = Array.prototype.slice.call(document.querySelectorAll(".has-dropdown"));
  var desktopQuery = window.matchMedia("(min-width: 1180px)");
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------- header height -> anchor offset ---------- */
  function syncHeaderHeight() {
    if (!header) return;
    var h = Math.round(header.getBoundingClientRect().height);
    if (h > 0) docEl.style.setProperty("--header-h", h + "px");
  }
  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight, { passive: true });

  /* ---------- scroll state: header shadow, floating bar, back to top ---------- */
  var lastY = window.pageYOffset;
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset;
    if (header) header.classList.toggle("is-scrolled", y > 12);
    if (floatingBar) floatingBar.classList.toggle("is-visible", y > 220);
    if (toTop) toTop.classList.toggle("is-visible", y > 700);
    if (floatCta) floatCta.classList.toggle("is-visible", y > 900);
    lastY = y;
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  onScroll();

  /* ---------- smooth anchor scrolling with sticky-header offset ---------- */
  function scrollToEl(el) {
    if (!el) return;
    var headerH = header ? header.getBoundingClientRect().height : 0;
    var top = el.getBoundingClientRect().top + window.pageYOffset - headerH - 18;
    window.scrollTo({ top: Math.max(top, 0), behavior: reduceMotion.matches ? "auto" : "smooth" });
  }

  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (link) {
    link.addEventListener("click", function (e) {
      var id = link.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();

      if (mobileNav && mobileNav.classList.contains("is-open")) {
        closeMenu(false);
        window.setTimeout(function () { scrollToEl(target); }, 120);
      } else {
        scrollToEl(target);
      }
      if (history.replaceState) history.replaceState(null, "", id);
    });
  });

  /* ---------- mobile menu ---------- */
  var lastFocused = null;

  function openMenu() {
    if (!mobileNav || !menuToggle) return;
    lastFocused = document.activeElement;
    mobileNav.classList.add("is-open");
    mobileNav.setAttribute("aria-hidden", "false");
    mobileNav.inert = false;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    body.classList.add("is-locked");
    if (floatingBar) floatingBar.classList.remove("is-visible");

    var first = mobileNav.querySelector("a, button");
    if (first) window.setTimeout(function () { first.focus({ preventScroll: true }); }, 240);
    if (header) header.classList.add("is-menu-open");
  }

  function closeMenu(returnFocus) {
    if (!mobileNav || !menuToggle) return;
    mobileNav.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    body.classList.remove("is-locked");
    if (header) header.classList.remove("is-menu-open");
    window.setTimeout(function () {
      if (mobileNav.getAttribute("aria-hidden") === "true") mobileNav.inert = true;
      onScroll();
    }, 320);
    if (returnFocus !== false && lastFocused) lastFocused.focus({ preventScroll: true });
  }

  if (mobileNav && !("inert" in mobileNav)) mobileNav.inert = false;
  if (mobileNav) mobileNav.inert = true;

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      if (mobileNav.classList.contains("is-open")) closeMenu();
      else openMenu();
    });

    /* keep focus inside the open drawer */
    mobileNav.addEventListener("keydown", function (e) {
      if (e.key !== "Tab" || !mobileNav.classList.contains("is-open")) return;
      var focusables = mobileNav.querySelectorAll("a[href], button:not([disabled])");
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ---------- services dropdown (desktop) ---------- */
  function closeDropdowns(except) {
    dropdowns.forEach(function (item) {
      if (item === except) return;
      item.classList.remove("is-open");
      var btn = item.querySelector(".nav-link");
      if (btn) btn.setAttribute("aria-expanded", "false");
    });
  }

  dropdowns.forEach(function (item) {
    var btn = item.querySelector(".nav-link");
    var menu = item.querySelector(".dropdown");
    if (!btn || !menu) return;
    var hoverTimer;

    btn.addEventListener("click", function (e) {
      e.preventDefault();
      var isOpen = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      closeDropdowns(item);
    });

    if (desktopQuery.matches) {
      item.addEventListener("mouseenter", function () {
        window.clearTimeout(hoverTimer);
        closeDropdowns(item);
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      });
      item.addEventListener("mouseleave", function () {
        hoverTimer = window.setTimeout(function () {
          item.classList.remove("is-open");
          btn.setAttribute("aria-expanded", "false");
        }, 140);
      });
    }

    item.addEventListener("focusout", function (e) {
      if (!item.contains(e.relatedTarget)) {
        item.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  });

  document.addEventListener("click", function (e) {
    if (!e.target.closest(".has-dropdown")) closeDropdowns(null);
  });

  /* ---------- escape closes everything ---------- */
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (mobileNav && mobileNav.classList.contains("is-open")) {
      closeMenu();
    }
    closeDropdowns(null);
  });

  /* ---------- reset menu state when growing to desktop ---------- */
  function handleDesktopChange(e) {
    if (e.matches) {
      closeMenu(false);
      closeDropdowns(null);
    }
  }
  if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", handleDesktopChange);
  else if (desktopQuery.addListener) desktopQuery.addListener(handleDesktopChange);

  /* ---------- FAQ accordion ---------- */
  var triggers = Array.prototype.slice.call(document.querySelectorAll(".acc-trigger"));

  function openPanel(panel) {
    if (!panel) return;
    window.clearTimeout(panel._heightTimer);
    panel.hidden = false;
    var target = panel.scrollHeight;
    panel.style.maxHeight = "0px";
    window.requestAnimationFrame(function () {
      panel.style.maxHeight = target + "px";
    });
    panel._heightTimer = window.setTimeout(function () {
      if (!panel.hidden) panel.style.maxHeight = "none";
    }, 400);
  }

  function closePanel(panel) {
    if (!panel) return;
    window.clearTimeout(panel._heightTimer);
    panel.style.maxHeight = panel.scrollHeight + "px";
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(function () {
        panel.style.maxHeight = "0px";
      });
    });
    panel._heightTimer = window.setTimeout(function () {
      panel.hidden = true;
      panel.style.maxHeight = "";
    }, 380);
  }

  triggers.forEach(function (trigger) {
    var panel = document.getElementById(trigger.getAttribute("aria-controls"));
    trigger.addEventListener("click", function () {
      var isOpen = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", isOpen ? "false" : "true");
      if (isOpen) closePanel(panel);
      else openPanel(panel);
    });
  });

  /* ---------- back to top ---------- */
  if (toTop) {
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduceMotion.matches ? "auto" : "smooth" });
    });
  }

  /* ---------- footer year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
