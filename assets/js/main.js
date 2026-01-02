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
  // If not, fetch new quote from API
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    // JSON response
    const data = await response.json();

    // Prepare daily quote object
    const daily = {
      quote: data.quote,
      author: data.author
    };

    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(daily));

    // Update DOM
    quoteEl.textContent = daily.quote;
    authorEl.textContent = daily.author;

  } catch (error) {
    console.error("Error fetching the quote:", error);
    quoteEl.textContent = "Could not load quote.";
    authorEl.textContent = "";
    return;
  }
}

// Call the function to load the quote
localDailyQuote();


// API Moon Phase Fetch

//API URL
const MOON_API_URL = "https://api.farmsense.net/v1/moonphases/?d=UNIX_TIMESTAMP";

//uNIX_TIMESTAMP replacement -source:  Mozilla.org - Global Objects - Date 
 function getTodayMiddayUnix() {
  const now = new Date();
  const midday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    12, 0, 0
  );
  return Math.floor(midday.getTime() / 1000);
}

//Elements where the API will go
const moonPhase = document.getElementById("moon-quote");

// Main moon phase function
async function moonPhaseDaily() {

  const MoonStorageKey = "moon-quote-" + getTodayKey();

  // Check if todays key already exists
  const savedMoon = localStorage.getItem(MoonStorageKey);
  if (savedMoon) {
    const data = JSON.parse(savedMoon);
    moonPhase.textContent = data.Phase;
    return;
  }
  // If not, fetch new moon phase from API
  try {

    // Replace UNIX_TIMESTAMP in URL
    const unix = getTodayMiddayUnix();
    const url = "http://api.farmsense.net/v1/moonphases/?d=59666674651";
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const moonDaily = {
      phase: data.Phase
    };

    localStorage.setItem(MoonStorageKey, JSON.stringify(moonDaily));

    moonPhase.textContent = moonDaily.phase;

  } catch (error) {
    console.error("Error fetching the moon phase:", error);
    moonPhase.textContent = "Could not load moon phase.";
    return;
  }
}

moonPhaseDaily();


