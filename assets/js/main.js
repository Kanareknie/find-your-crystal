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


//Fetch daily insights from local JSON file
async function fetchDailyInsights() {
  const storageKey = "dailyInsights-" + getTodayKey();

  // Check if todays key already exists
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    const daily = JSON.parse(saved);
    dailyPlantEl.textContent = daily.plant;
    dailyHintEl.textContent = daily.hint;
    
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

    //Add submitted zodiac to the title of result

    const zodiacTitleEl = document.getElementById("selected-zodiac-title");

    if (zodiacTitleEl) {
      const formattedZodiac = selectedZodiac.charAt(0).toUpperCase() + selectedZodiac.slice(1);

      zodiacTitleEl.textContent = formattedZodiac;
    }

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
        closeMoreStones();

        // Link: “How To Create an Off-Canvas Menu” on W3Schools

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });
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

    //Picture of the crystal
    const imageEl = document.querySelector('[data-field="image"]');

    if (crystal.image) {
      imageEl.src = crystal.image;
      imageEl.alt = crystal.name;
      imageEl.style.display = "block";
    } else {
      imageEl.style.display = "none";
    }

    // Subpowers list of results
    const subPowersEl = document.querySelector('[data-field="subPowers"]');

    subPowersEl.innerHTML = "";
    (crystal.subPowers ?? []).forEach((p) => {
      const li = document.createElement("li");
      li.textContent = p;
      subPowersEl.appendChild(li);
    });

    // Chakra pictures mapping
    const CHAKRA_IMAGE_MAP = {
      "Root": "assets/images/chakras/chakra-red.png",
      "Sacral": "assets/images/chakras/chakra-orange.png",
      "Solar Plexus": "assets/images/chakras/chakra-yellow.png",
      "Heart": "assets/images/chakras/chakra-green.png",
      "Throat": "assets/images/chakras/chakra-lightblue.png",
      "Third Eye": "assets/images/chakras/chakra-darkblue.png",
      "Crown": "assets/images/chakras/chakra-purple.png",
      "All Chakras": "assets/images/chakras/chakras.png",
      "Varies by color": "assets/images/chakras/chakras.png",
    };


    const ALL_CHAKRAS_IMAGE = "assets/images/chakras/chakras.png";

    const chakraImgEl = document.querySelector('img[data-field="chakraImage"]');

    const chakraRaw = (crystal.chakra || "").trim();

    // Split "Heart, Throat" -> ["Heart", "Throat"]
    const chakraList = chakraRaw
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const isMulti = chakraList.length > 1;
    const isAll = chakraRaw === "All Chakras";
    const isVaries = chakraRaw === "Varies by color";

    let imgSrc = "";
    let altText = "";

    if (isAll || isVaries || isMulti) {
      imgSrc = ALL_CHAKRAS_IMAGE;
      altText = isMulti ? `Multiple chakras: ${chakraList.join(", ")}` : chakraRaw;
    } else {
      const single = chakraList[0];
      imgSrc = CHAKRA_IMAGE_MAP[single] || "";
      altText = single ? `${single} chakra symbol` : "";
    }

    if (chakraImgEl && imgSrc) {
      chakraImgEl.src = imgSrc;
      chakraImgEl.alt = altText;
      chakraImgEl.style.display = "block";
    } else if (chakraImgEl) {
      chakraImgEl.removeAttribute("src");
      chakraImgEl.alt = "";
      chakraImgEl.style.display = "none";
    }

  }

}


// Slide list on form-zodiac - more crystals list -- W3Schools tutorial

// Select elements
const openMoreStonesBtn =
  document.querySelector(".more-stone-btn, .more-stone-btn-num");
const closeMoreStonesBtn = document.querySelector(".more-stones-panel-close");
const moreStonesPanel = document.getElementById("more-stone-panel");
const moreStonesBackdrop = document.querySelector(".more-stones-backdrop");

// OPEN panel
function openMoreStones() {
  moreStonesPanel.hidden = false;
  moreStonesBackdrop.hidden = false;

  // allow browser to paint the CLOSED state first - the element is hidden
  requestAnimationFrame(() => {
    moreStonesPanel.classList.add("is-open");
    moreStonesBackdrop.classList.add("is-open");
    openMoreStonesBtn.setAttribute("aria-expanded", "true");
  });
}

// CLOSE panel
function closeMoreStones() {
  moreStonesPanel.classList.remove("is-open");
  moreStonesBackdrop.classList.remove("is-open");

  openMoreStonesBtn.setAttribute("aria-expanded", "false");

  // wait for slide-out animation to finish
  setTimeout(() => {
    moreStonesPanel.hidden = true;
    moreStonesBackdrop.hidden = true;
  }, 600);
}

// Event listeners
if (
  openMoreStonesBtn &&
  closeMoreStonesBtn &&
  moreStonesPanel &&
  moreStonesBackdrop
) {
  openMoreStonesBtn.addEventListener("click", openMoreStones);
  closeMoreStonesBtn.addEventListener("click", closeMoreStones);
  moreStonesBackdrop.addEventListener("click", closeMoreStones);
}


// --------------------------------------Numerology page -------------------------------

// Select numerology elements 
const numerologyFormEl = document.getElementById("numerology-form");
const numerologyDobEl = document.getElementById("dob");

const numerologyListEl = document.getElementById("zodiac-crystal-list");
const numerologyQuestionSection = document.querySelector(".form-question-container");
const numerologyAnswerSection =
  document.querySelector(".form-answer-container-numerology") ||
  document.querySelector(".form-answer-container");


const VALID_NUMEROLOGY_NUMBERS = [1,2,3,4,5,6,7,8,9,11,22,33,44];

// Guard: only run on numerology page
if (
  numerologyFormEl &&
  numerologyDobEl &&
  numerologyListEl &&
  numerologyQuestionSection &&
  numerologyAnswerSection
) {
  numerologyFormEl.addEventListener("submit", async function (event) {
    event.preventDefault();

    // 1) Read input
    const dobValue = numerologyDobEl.value;

    // 2) Validate
    if (!dobValue) {
      alert("Please select your date of birth.");
      return;
    }

    // 3) Calculate numerology number
    const numerologyNumber = calculateNumerologyFromDate_NUM(dobValue);

    // Optional validation 
    if (!VALID_NUMEROLOGY_NUMBERS.includes(numerologyNumber)) {
      alert("Your date of birth does not resolve to a supported numerology number.");
      return;
    }

    // 4) Set title 
    const numerologyTitleEl =
      document.getElementById("selected-numerology-title") ||
      document.getElementById("selected-zodiac-title");

    if (numerologyTitleEl) {
      numerologyTitleEl.textContent = numerologyNumber;
    }

    // 5) Fetch crystals
    const crystals = await fetchCrystals_NUM();

    // 6) Match by numerology
    const matches = findCrystalsByNumerology_NUM(crystals, numerologyNumber);

    if (matches.length === 0) {
      numerologyListEl.innerHTML = "<li>No matches found.</li>";
      return;
    }

    // 7) Render list + first result
    renderCrystalList_NUM(matches);
    renderCrystalDetails_NUM(matches[0]);


    // 8) UI switching
    numerologyQuestionSection.style.display = "none";
    numerologyAnswerSection.style.display = "block";
  });
}


// ---------- NUMEROLOGY HELPERS ----------

function calculateNumerologyFromDate_NUM(dateString) {
  const digits = dateString.replace(/\D/g, "");

  let sum = digits.split("").reduce((acc, d) => acc + Number(d), 0);

  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33 && sum !== 44) {
    sum = sum.toString().split("").reduce((acc, d) => acc + Number(d), 0);
  }

  return sum;
}

async function fetchCrystals_NUM() {
  const response = await fetch("assets/data/crystals_master.json");
  if (!response.ok) throw new Error("Failed to load crystals_master.json");
  return await response.json();
}

function findCrystalsByNumerology_NUM(crystals, numerologyNumber) {
  return crystals.filter((crystal) =>
    Array.isArray(crystal.numerology) &&
    crystal.numerology.includes(numerologyNumber)
  );
}


// ---------- RENDERING (unique names, same layout) ----------

function renderCrystalList_NUM(matches) {
  numerologyListEl.innerHTML = "";

  matches.forEach((crystal) => {
    const li = document.createElement("li");
    const btn = document.createElement("button");

    btn.type = "button";
    btn.textContent = crystal.name;

    btn.addEventListener("click", () => {
      renderCrystalDetails_NUM(crystal);

      // close panel if it exists
      if (typeof closeMoreStones === "function") closeMoreStones();

      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    li.appendChild(btn);
    numerologyListEl.appendChild(li);
  });
}

function renderCrystalDetails_NUM(crystal) {
  document.querySelector('[data-field="name"]').textContent = crystal.name ?? "";
  document.querySelector('[data-field="meaning"]').textContent = crystal.meaning ?? "";
  document.querySelector('[data-field="chakra"]').textContent = crystal.chakra ?? "";
  document.querySelector('[data-field="mainPower"]').textContent = crystal.mainPower ?? "";
  document.querySelector('[data-field="bodyPlacement"]').textContent = crystal.bodyPlacement ?? "";
  document.querySelector('[data-field="ancientBelief"]').textContent = crystal.ancientBelief ?? "";

  // Crystal image
  const imageEl = document.querySelector('[data-field="image"]');
  if (imageEl) {
    if (crystal.image) {
      imageEl.src = crystal.image;
      imageEl.alt = crystal.name ?? "Crystal image";
      imageEl.style.display = "block";
    } else {
      imageEl.style.display = "none";
    }
  }

  // Subpowers list
  const subPowersEl = document.querySelector('[data-field="subPowers"]');
  if (subPowersEl) {
    subPowersEl.innerHTML = "";
    (crystal.subPowers ?? []).forEach((p) => {
      const li = document.createElement("li");
      li.textContent = p;
      subPowersEl.appendChild(li);
    });
  }

  
      // Chakra pictures mapping (same logic as zodiac)
  const CHAKRA_IMAGE_MAP = {
    "Root": "assets/images/chakras/chakra-red.png",
    "Sacral": "assets/images/chakras/chakra-orange.png",
    "Solar Plexus": "assets/images/chakras/chakra-yellow.png",
    "Heart": "assets/images/chakras/chakra-green.png",
    "Throat": "assets/images/chakras/chakra-lightblue.png",
    "Third Eye": "assets/images/chakras/chakra-darkblue.png",
    "Crown": "assets/images/chakras/chakra-purple.png",
    "All Chakras": "assets/images/chakras/chakras.png",
    "Varies by color": "assets/images/chakras/chakras.png",
  };

  const ALL_CHAKRAS_IMAGE = "assets/images/chakras/chakras.png";
  const chakraImgEl = document.querySelector('img[data-field="chakraImage"]');
  const chakraRaw = (crystal.chakra || "").trim();

  const chakraList = chakraRaw
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  const isMulti = chakraList.length > 1;
  const isAll = chakraRaw === "All Chakras";
  const isVaries = chakraRaw === "Varies by color";

  let imgSrc = "";
  let altText = "";

  if (isAll || isVaries || isMulti) {
    imgSrc = ALL_CHAKRAS_IMAGE;
    altText = isMulti ? `Multiple chakras: ${chakraList.join(", ")}` : chakraRaw;
  } else {
    const single = chakraList[0];
    imgSrc = CHAKRA_IMAGE_MAP[single] || "";
    altText = single ? `${single} chakra symbol` : "";
  }

  if (chakraImgEl && imgSrc) {
    chakraImgEl.src = imgSrc;
    chakraImgEl.alt = altText;
    chakraImgEl.style.display = "block";
  } else if (chakraImgEl) {
    chakraImgEl.removeAttribute("src");
    chakraImgEl.alt = "";
    chakraImgEl.style.display = "none";
  }

}


// -------------------------------------- Day page -------------------------------

// -------------------------------------- Day page -------------------------------

// Select DAY elements (unique names)
const dayFormEl = document.getElementById("daily-stone-form");
const dayEmotionEl = document.getElementById("emotion-select");       // your dropdown
const dayZodiacEl = document.getElementById("daily-zodiac-select");   // optional zodiac

const dayListEl = document.getElementById("zodiac-crystal-list");     // you reuse this id
const dayQuestionSection = document.querySelector(".form-question-container");
const dayAnswerSection =
  document.querySelector(".form-answer-container-day") ||  // on day page you likely use this class
  document.querySelector(".form-answer-container");

// Debug prints - text
console.log("DAY init:", {
  dayFormEl,
  dayEmotionEl,
  dayZodiacEl,
  dayListEl,
  dayQuestionSection,
  dayAnswerSection
});

// Guard: only run on day page
if (dayFormEl && dayEmotionEl && dayListEl && dayQuestionSection && dayAnswerSection) {
  dayFormEl.addEventListener("submit", async function (event) {
    event.preventDefault();

    const selectedEmotion = dayEmotionEl.value;
    const selectedZodiac = dayZodiacEl ? dayZodiacEl.value : "";

    if (!selectedEmotion) {
      alert("Please choose an intention / emotion.");
      return;
    }

    console.log("Selected emotion:", selectedEmotion);
    console.log("Selected zodiac:", selectedZodiac);

    // For now: just show result section to prove it works
    dayQuestionSection.style.display = "none";
    dayAnswerSection.style.display = "block";
  });
}
