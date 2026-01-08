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




// ZODIAC FORM - main function to show zodiac sign based on date input

// Select elements
const zodiacFormSelect = document.getElementById("zodiac-form");
const zodiacSelect = document.getElementById("zodiac-select");
const crystalListEl = document.getElementById("zodiac-crystal-list");
const questionSection = document.querySelector(".form-question-container");
const answerSection = document.querySelector(".form-answer-container");



console.log(zodiacSelect);
console.log(zodiacFormSelect);
console.log(answerSection);
console.log(crystalListEl);

//Add a guard around the zodiac block

if (zodiacFormSelect && zodiacSelect && crystalListEl && questionSection && answerSection) {

  // Add event listener to form submit - call the zodiac
  zodiacFormSelect.addEventListener("submit", async function (event) {
    event.preventDefault();

    const selectedZodiac = zodiacSelect.value;
    console.log("Selected zodiac:", selectedZodiac);

    //fetch data from JSON file and match with zodiac sign
    const crystals = await fetchZodiacCrystal();
    const matches = findCrystalsByZodiac(crystals, selectedZodiac);

    if (matches.length === 0) {
      crystalListEl.innerHTML = "<li>No matches found.</li>";
      return;
    }

    renderCrystalList(matches);
    renderCrystalDetails(matches[0]);

    console.log("Matching crystals:", matches);
    console.log("First match:", matches[0]);

    // UI switching
    questionSection.style.display = "none";
    answerSection.style.display = "block";

  });


  // Function to fetch zodiac data from JSON file and display based on selection
  async function fetchZodiacCrystal() {
    const response = await fetch("assets/data/crystals_master.json");
    const zodiacCrystal = await response.json();
    return zodiacCrystal;
  }

  //Match zodiac with crystal function 
  function findCrystalsByZodiac(crystals, selectedZodiac) {

    const target = selectedZodiac.toLowerCase();

    return crystals.filter((crystal) => crystal.zodiac.some(
      // Normalization toLowerse() at comparison time
      (zodiac) => zodiac.toLowerCase() === target
    ));
  }

  // Function to create a list of matches results

  function renderCrystalList(matches) {
    crystalListEl.innerHTML = "";

    matches.forEach((crystal) => {
      const li = document.createElement("li");

      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = crystal.name;

      btn.addEventListener("click", () => {
        renderCrystalDetails(crystal);
      });

      li.appendChild(btn);
      crystalListEl.appendChild(li);
    });
  }

  // Details of each stone - test
  function renderCrystalDetails(crystal) {
    document.querySelector('[data-field="name"]').textContent = crystal.name ?? "";
    document.querySelector('[data-field="meaning"]').textContent = crystal.meaning ?? "";
    document.querySelector('[data-field="chakra"]').textContent = crystal.chakra ?? "";
    document.querySelector('[data-field="mainPower"]').textContent = crystal.mainPower ?? "";
    document.querySelector('[data-field="bodyPlacement"]').textContent = crystal.bodyPlacement ?? "";
    document.querySelector('[data-field="ancientBelief"]').textContent = crystal.ancientBelief ?? "";

    // Subpowers list of results
    const subPowersEl = document.querySelector('[data-field="subPowers"]');

    subPowersEl.innerHTML = "";
    (crystal.subPowers ?? []).forEach((p) => {
      const li = document.createElement("li");
      li.textContent = p;
      subPowersEl.appendChild(li);
    });

  }

}

//Add submitted zodiac to the title of result

const zodiacTitleEl = document.getElementById("selected-zodiac-title");

if (zodiacTitleEl) {
  const formattedZodiac = selectedZodiac.charAt(0).toUpperCase() + selectedZodiac.slice(1);

  zodiacTitleEl.textContent = formattedZodiac;
}
