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


// API Daily Insight Fetch from JSON daily-hints.json file

//Get elements
const dailyPlantEl = document.getElementById("daily-plant");
const dailyHintEl = document.getElementById("daily-hint");
const appreciationEl = document.getElementById("daily-appreciation");

//Fetch daily insights from local JSON file
async function fetchDailyInsights() {
const storageKey = "dailyInsights-" + getTodayKey();

// Check if todays key already exists
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    const daily = JSON.parse(saved);
    dailyPlantEl.textContent = daily.plant;
    dailyHintEl.textContent = daily.hint;
    appreciationEl.textContent = daily.appreciation;
    return;
  }
  // If not, fetch new insights from local JSON file
  try {
    const response = await fetch("assets/data/daily-hints.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const insights = await response.json();
    // Pick random insight per day
    const daily = 
    insights[Math.floor(Math.random() * insights.length)];

    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(daily));

    // Update DOM
    dailyPlantEl.textContent = daily.plant;
    dailyHintEl.textContent = daily.hint;
    appreciationEl.textContent = daily.appreciation;
  }
  catch (error) {
    console.error("Error fetching daily insights:", error);
  } 
}

// Call the function to fetch daily insights
fetchDailyInsights();


// Form zodiac functionality

//Unhide answer section when form is submitted
const zodiacForm = document.getElementById("zodiac-form");
const answerSection = document.querySelector(".form-answer-container");

zodiacForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!zodiacForm.checkValidity()) {
    return;
  }
  answerSection.style.display = "block";
});


// ZODIAC FORM - main function to show zodiac sign based on date input

// Select elements
const zodiacFormSelect = document.getElementById("zodiac-form");
const zodiacSelect = document.getElementById("zodiac-select");
console.log(zodiacSelect);
console.log(zodiacFormSelect);

