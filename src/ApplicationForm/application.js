document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const menuButton = document.querySelector(".menuButton");
  const dropdownMenu = document.getElementById("dropdownMenu");
  const form = document.getElementById("admissionForm");
  const formStatus = document.getElementById("formStatus");

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

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const firstName = (formData.get("firstName") || "").toString().trim();
      const email = (formData.get("email") || "").toString().trim();

      if (!firstName || !email) {
        formStatus.textContent = "Please complete all required fields before submitting.";
        return;
      }

      formStatus.textContent = `Thanks ${firstName}, your application has been submitted. We will contact you soon.`;
      form.reset();
    });
  }
});
