const SPLASH_DURATION_MS = 2800;
const SPLASH_SESSION_KEY = "funbaristaSplashShown";

window.addEventListener("load", () => {
  initSplashScreen();
});

function initSplashScreen() {
  const splash = document.getElementById("splashScreen");

  if (!splash) {
    return;
  }

  let hasShownSplash = false;

  try {
    hasShownSplash = sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
  } catch (error) {
    hasShownSplash = false;
  }

  if (hasShownSplash) {
    splash.classList.add("is-hidden");

    if (splash.parentNode) {
      splash.parentNode.removeChild(splash);
    }

    document.body.classList.remove("splash-active");
    return;
  }

  try {
    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
  } catch (error) {
    // Ignore storage failures and continue with splash behavior.
  }

  document.body.classList.add("splash-active");

  window.setTimeout(() => {
    splash.classList.add("is-hidden");
    document.body.classList.remove("splash-active");

    window.setTimeout(() => {
      if (splash.parentNode) {
        splash.parentNode.removeChild(splash);
      }
    }, 500);
  }, SPLASH_DURATION_MS);
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menuButton = document.querySelector(".menuButton");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const navLinks = document.querySelectorAll(".desktopmenu a[href^='#']");
  const statCards = document.querySelectorAll(".numbers");
  const infoCards = document.querySelectorAll(".card");

  if (menuButton && dropdownMenu) {
    menuButton.addEventListener("click", (event) => {
      event.stopPropagation();
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      dropdownMenu.style.display = isExpanded ? "none" : "block";
    });

    dropdownMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        dropdownMenu.style.display = "none";
        menuButton.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (event) => {
      if (!menuButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
        dropdownMenu.style.display = "none";
        menuButton.setAttribute("aria-expanded", "false");
      }
    });
  }

  const onScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  onScroll();
  window.addEventListener("scroll", onScroll);

  const observerOptions = {
    root: null,
    threshold: 0.35,
    rootMargin: "-20% 0px -45% 0px"
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      navLinks.forEach((link) => {
        const isTarget = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active-link", isTarget);
      });
    });
  }, observerOptions);

  ["cards", "courses1", "contact"].forEach((id) => {
    const section = document.getElementById(id);
    if (section) {
      sectionObserver.observe(section);
    }
  });

  const statsObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      const card = entry.target;
      const valueNode = card.querySelector("h3");
      const targetValue = Number(card.dataset.count || 0);

      if (valueNode && targetValue > 0) {
        animateCount(valueNode, targetValue);
      }

      obs.unobserve(card);
    });
  }, { threshold: 0.5 });

  statCards.forEach((card) => statsObserver.observe(card));

  infoCards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const rotateY = ((x / rect.width) - 0.5) * 9;
      const rotateX = ((y / rect.height) - 0.5) * -9;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
    });
  });
});

function animateCount(node, targetValue) {
  const suffix = node.textContent.includes("%") ? "%" : (targetValue >= 1000 ? "+" : "");
  const duration = 1200;
  const start = performance.now();

  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const current = Math.floor(targetValue * easeOutCubic(progress));

    node.textContent = `${current}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else if (targetValue === 4) {
      node.textContent = "4 Levels";
    }
  };

  requestAnimationFrame(step);
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}
