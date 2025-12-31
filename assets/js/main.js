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
// Close button inside sidebar
const closeButton = document.getElementById("sidebar-close");
closeButton.addEventListener("click", closeSidebar);

// API Quote Fetch

//API URL
const API_URL = "https://quoteslate.vercel.app/api/quotes/random";

//Elements where the API will go
const quoteEl = document.getElementById("daily-quote");
const authorEl = document.getElementById("author-daily-quote");

//Create today key
function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}
// Main today function
async function localDailyQuote() {
  const storageKey = "dailyQuote-" + getTodayKey();

  // Check if todays key already exists
const saved = localStorage.getItem(storageKey);
if (saved) {
  const data = JSON.parse(saved);
  quoteEl.textContent = data.quote;
  authorEl.textContent = data.author;
  return;

}



fetch("https://quoteslate.vercel.app/api/quotes/random")
.then(response => response.json())
.then(data => {
  console.log("This is API:", data);
})
.catch(error => {
  console.error("Error is:", error);
})
