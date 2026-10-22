(function () {
  const navLinks = document.querySelectorAll(".sidebar nav a");
  const toggle = document.querySelector(".menu-toggle");
  const mobileOpen = document.querySelector(".mobile-guide-bar__open");
  const sidebar = document.querySelector(".sidebar");
  const backdrop = document.querySelector(".sidebar-backdrop");
  const sections = Array.from(document.querySelectorAll(".guide-section[id]"));
  const progressBar = document.querySelector(".scroll-progress__bar");
  const mobileStep = document.getElementById("mobile-step");
  const mobileLabel = document.getElementById("mobile-label");

  const rootStyles = getComputedStyle(document.documentElement);
  const SCROLL_MARK =
    parseInt(rootStyles.getPropertyValue("--header-h"), 10) +
    parseInt(rootStyles.getPropertyValue("--progress-h"), 10) +
    24;

  const stepLabels = {};
  navLinks.forEach(function (link, index) {
    var id = (link.getAttribute("href") || "").replace("#", "");
    if (!id) {
      return;
    }
    var isAppendix = link.closest(".toc-item--appendix");
    stepLabels[id] = {
      num: isAppendix ? "★" : String(index + 1),
      text: link.textContent.trim(),
    };
  });

  let scrollLockUntil = 0;
  let pageScrollY = 0;
  let scrollLockCount = 0;

  function lockPageScroll() {
    if (scrollLockCount === 0) {
      pageScrollY = window.scrollY || window.pageYOffset || 0;
      document.body.style.top = "-" + pageScrollY + "px";
      document.body.classList.add("scroll-locked");
    }
    scrollLockCount += 1;
  }

  function unlockPageScroll() {
    if (scrollLockCount === 0) {
      return;
    }
    scrollLockCount -= 1;
    if (scrollLockCount > 0) {
      return;
    }
    document.body.classList.remove("scroll-locked");
    document.body.style.top = "";
    window.scrollTo(0, pageScrollY);
  }

  function setActiveLink(id) {
    navLinks.forEach(function (link) {
      var isActive = Boolean(id) && link.getAttribute("href") === "#" + id;
      link.classList.toggle("is-active", isActive);
      var item = link.closest(".toc-item");
      if (item) {
        item.classList.toggle("is-active", isActive);
      }
    });
    updateMobileBar(id);
  }

  function updateMobileBar(id) {
    if (!mobileStep || !mobileLabel) {
      return;
    }
    if (!id || !stepLabels[id]) {
      mobileStep.textContent = "-";
      mobileLabel.textContent = "Scroll to begin";
      return;
    }
    mobileStep.textContent = stepLabels[id].num;
    mobileLabel.textContent = stepLabels[id].text;
  }

  function scrollToSection(section) {
    var heading = section?.querySelector("h2") || section;
    if (!heading) {
      return;
    }
    var top = heading.getBoundingClientRect().top + window.scrollY - SCROLL_MARK;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }

  function headingTop(section) {
    var heading = section.querySelector("h2");
    if (!heading) {
      return section.getBoundingClientRect().top;
    }
    return heading.getBoundingClientRect().top;
  }

  function getActiveSectionId() {
    var active = null;
    sections.forEach(function (section) {
      if (headingTop(section) <= SCROLL_MARK) {
        active = section.id;
      }
    });
    return active;
  }

  function updateScrollProgress() {
    if (!progressBar) {
      return;
    }
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    progressBar.style.width = pct + "%";
  }

  function updateActiveFromScroll() {
    if (Date.now() < scrollLockUntil) {
      updateScrollProgress();
      return;
    }
    setActiveLink(getActiveSectionId());
    updateScrollProgress();
  }

  function openSidebar() {
    sidebar?.classList.add("is-open");
    backdrop?.classList.add("is-visible");
    sidebar?.setAttribute("aria-hidden", "false");
    backdrop?.setAttribute("aria-hidden", "false");
    lockPageScroll();
    toggle?.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    sidebar?.classList.remove("is-open");
    backdrop?.classList.remove("is-visible");
    sidebar?.setAttribute("aria-hidden", "true");
    backdrop?.setAttribute("aria-hidden", "true");
    unlockPageScroll();
    toggle?.setAttribute("aria-expanded", "false");
  }

  function toggleSidebar() {
    if (sidebar?.classList.contains("is-open")) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }

  toggle?.addEventListener("click", toggleSidebar);
  mobileOpen?.addEventListener("click", openSidebar);
  backdrop?.addEventListener("click", closeSidebar);
  backdrop?.addEventListener(
    "touchend",
    function (event) {
      if (!sidebar?.classList.contains("is-open")) {
        return;
      }
      event.preventDefault();
      closeSidebar();
    },
    { passive: false }
  );

  var mobileViewportMq = window.matchMedia("(max-width: 1023px)");

  function syncSidebarForViewport() {
    if (!sidebar) {
      return;
    }
    if (!mobileViewportMq.matches) {
      sidebar.removeAttribute("aria-hidden");
      if (sidebar.classList.contains("is-open")) {
        closeSidebar();
      }
      return;
    }
    if (!sidebar.classList.contains("is-open")) {
      sidebar.setAttribute("aria-hidden", "true");
    }
  }

  if (typeof mobileViewportMq.addEventListener === "function") {
    mobileViewportMq.addEventListener("change", syncSidebarForViewport);
  } else if (typeof mobileViewportMq.addListener === "function") {
    mobileViewportMq.addListener(syncSidebarForViewport);
  }
  syncSidebarForViewport();

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var hash = link.getAttribute("href");
      if (!hash || hash.charAt(0) !== "#") {
        closeSidebar();
        return;
      }

      event.preventDefault();
      var id = hash.slice(1);
      var section = document.getElementById(id);

      setActiveLink(id);
      scrollLockUntil = Date.now() + 900;

      if (section) {
        scrollToSection(section);
      }

      closeSidebar();
    });
  });

  var scrollTicking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (!scrollTicking) {
        scrollTicking = true;
        requestAnimationFrame(function () {
          updateActiveFromScroll();
          scrollTicking = false;
        });
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", updateScrollProgress, { passive: true });
  window.addEventListener("hashchange", updateActiveFromScroll);
  updateActiveFromScroll();

  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightbox-img");
  var lightboxCaption = document.getElementById("lightbox-caption");
  var lightboxLastFocus = null;

  function openLightbox(img, captionText) {
    if (!lightbox || !lightboxImg) {
      return;
    }
    lightboxLastFocus = document.activeElement;
    lightboxImg.src = img.currentSrc || img.src;
    lightboxImg.alt = img.alt || "";
    if (lightboxCaption) {
      lightboxCaption.textContent = captionText || "";
    }
    lightbox.hidden = false;
    lockPageScroll();
    lightbox.querySelector(".lightbox__close")?.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) {
      return;
    }
    lightbox.hidden = true;
    lightboxImg.removeAttribute("src");
    unlockPageScroll();
    if (lightboxLastFocus && typeof lightboxLastFocus.focus === "function") {
      lightboxLastFocus.focus();
    }
  }

  document.querySelectorAll(".guide-figure--expandable .guide-figure__trigger").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      var img = trigger.querySelector("img");
      var caption = trigger.closest(".guide-figure")?.querySelector("figcaption");
      if (img) {
        openLightbox(img, caption ? caption.textContent.trim() : "");
      }
    });
  });

  lightbox?.querySelectorAll("[data-lightbox-close]").forEach(function (el) {
    el.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") {
      return;
    }
    if (lightbox && !lightbox.hidden) {
      closeLightbox();
      return;
    }
    if (sidebar?.classList.contains("is-open")) {
      closeSidebar();
    }
  });


  document.querySelectorAll(".code-block").forEach(function (block) {
    var button = block.querySelector(".code-block__copy");
    var code = block.querySelector("pre code");
    if (!button || !code) {
      return;
    }

    button.addEventListener("click", function () {
      var text = code.textContent || "";
      navigator.clipboard.writeText(text).then(function () {
        var label = button.textContent;
        button.textContent = "Copied";
        button.classList.add("is-copied");
        window.setTimeout(function () {
          button.textContent = label;
          button.classList.remove("is-copied");
        }, 1600);
      });
    });
  });
})();
