/* W3Schools “Sidebar” / “Off-canvas menu” */

  const button = document.getElementById("sidebar-button");
  const sidebar = document.getElementById("daily-sidebar");
  const backdrop = document.querySelector(".sidebar-backdrop");

  function openSidebar() {
    sidebar.classList.add("is-open");
    backdrop.classList.add("is-open");
    backdrop.hidden = false;
    button.setAttribute("aria-expanded", "true");
  }

  function closeSidebar() {
    sidebar.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    button.setAttribute("aria-expanded", "false");
    // wait for transition then hide backdrop
    setTimeout(() => { backdrop.hidden = true; }, 250);
  }

  button.addEventListener("click", () => {
    const isOpen = sidebar.classList.contains("is-open");
    isOpen ? closeSidebar() : openSidebar();
  });

  backdrop.addEventListener("click", closeSidebar);

  // Escape key closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("is-open")) {
      closeSidebar();
    }
  });