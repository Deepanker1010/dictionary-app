// Selecting DOM elements for interaction
const searchInput = document.getElementById("searchinput"), // Input field for word search
  searchButton = document.querySelector(".searchbar button"), // Search button
  wordDisplay = document.querySelector(".text h2 span"), // Word display in the results section
  meaningDisplay = document.querySelector(".text p:nth-of-type(2) span"), // Meaning display
  exampleDisplay = document.querySelector(".text p:nth-of-type(3) span"), // Example display
  synonymsDisplay = document.querySelector(".text p:nth-of-type(4) span"); // Synonyms display
let audio; // For storing the pronunciation audio

/**
 * Updates the UI with the word's details or displays an error message.
 * @param {Object} result - API response containing word data.
 * @param {String} word - Word that was searched.
 */
function data(result, word) {
  if (result.title) {
    // If the word is not found, display an error message
    wordDisplay.innerText = "Not Found";
    meaningDisplay.innerText = `Can't find the meaning of "${word}". Please, try another word.`;
    exampleDisplay.innerText = "";
    synonymsDisplay.innerText = "";
  } else {
    // If the word is found, update the UI with its details
    let definitions = result[0].meanings[0].definitions[0],
      phonetics = result[0].phonetics[0] ? result[0].phonetics[0].text : "No phonetics available";

    wordDisplay.innerText = `${result[0].word} (${phonetics})`; // Display word and phonetics
    meaningDisplay.innerText = definitions.definition || "No definition available."; // Display definition
    exampleDisplay.innerText = definitions.example || "No example available."; // Display example or fallback text

    audio = new Audio(result[0].phonetics[0]?.audio || ""); // Load pronunciation audio if available

    // Handle synonyms
    if (!definitions.synonyms || definitions.synonyms.length === 0) {
      synonymsDisplay.innerText = "No synonyms available.";
    } else {
      synonymsDisplay.innerHTML = ""; // Clear previous synonyms
      definitions.synonyms.slice(0, 5).forEach((synonym, index) => {
        // Limit to 5 synonyms
        synonymsDisplay.innerHTML += `${synonym}${index < 4 ? ", " : ""}`; // Display synonyms as a list
      });
    }
  }
}

/**
 * Fetches word data from the Dictionary API and updates the UI.
 * @param {String} word - Word to search.
 */
function fetchApi(word) {
  wordDisplay.innerText = "Loading..."; // Display loading state
  meaningDisplay.innerText = "";
  exampleDisplay.innerText = "";
  synonymsDisplay.innerText = "";

  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`; // API endpoint

  // Fetch data and handle response or errors
  fetch(url)
    .then((response) => response.json())
    .then((result) => data(result, word))
    .catch(() => {
      wordDisplay.innerText = "Error";
      meaningDisplay.innerText = `Unable to fetch the meaning of "${word}". Please try again later.`;
    });
}

// Event listener for the search button
searchButton.addEventListener("click", () => {
  let word = searchInput.value.trim(); // Get input value and trim spaces
  if (word) {
    fetchApi(word); // Fetch word data
  }
});

// Event listener for the Enter key in the search input
searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    let word = searchInput.value.trim(); // Get input value and trim spaces
    if (word) {
      fetchApi(word); // Fetch word data
    }
  }
});
