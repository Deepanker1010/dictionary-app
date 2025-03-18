// List of predefined words to be used for "Word of the Day"
const wordsArray = [
    "serendipity", "ephemeral", "luminous", "exuberant", "melancholy",
    "tranquil", "ethereal", "ineffable", "sagacious", "halcyon",
    "ambivalence", "quintessential", "elusive", "solitude", "euphoria",
    "dichotomy", "nostalgia", "vivacious", "labyrinth", "panacea",
    "resilience", "tenacity", "wanderlust", "zenith", "cryptic",
    "idyllic", "jubilant", "pristine", "reverie", "whimsical"
];

// Function to fetch and display the "Word of the Day"
async function fetchWordOfTheDay() {
    try {
        // Get the current Word of the Day based on the date
        const wordOfTheDay = getWordOfTheDay();

        // Fetch word data from the dictionary API
        const wordData = await fetchDictionaryData(wordOfTheDay);

        // Display the Word of the Day on the page
        displayWordOfTheDay(wordData, wordOfTheDay);

        // Fetch and display an image related to the Word of the Day
        fetchWordImage(wordOfTheDay, "wordofday-img");
    } catch (error) {
        // Handle any errors that occur during the fetch
        console.error("Error fetching Word of the Day:", error);
        alert("An error occurred while fetching the Word of the Day.");
    }
}

// Function to determine the Word of the Day based on the date
function getWordOfTheDay() {
    const currentDate = new Date();
    // Use the date to pick a word index from the array
    const dayIndex = currentDate.getDate() % wordsArray.length;
    return wordsArray[dayIndex];
}

// Fetch data for a given word from the dictionary API
async function fetchDictionaryData(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const response = await fetch(url);

    // Check if the API call was successful
    if (!response.ok) throw new Error(`Failed to fetch data for "${word}"`);

    return await response.json();
}

// Function to display the Word of the Day data on the page
function displayWordOfTheDay(result, word) {
    const currentDate = new Date().toDateString();
    document.getElementById("currentDate").innerText = `Today: ${currentDate}`;
    document.getElementById("dayWord").innerText = word || "N/A";
    document.getElementById("dayWordphonetics").innerText = result[0]?.phonetics[0]?.text || "N/A";
    document.getElementById("dayWordmeaning").innerText = result[0]?.meanings[0]?.definitions[0]?.definition || "N/A";
    document.getElementById("dayWordexample").innerText = result[0]?.meanings[0]?.definitions[0]?.example || "No example available";

    // Prepare the pronunciation audio for the word
    prepareAudio(result[0]?.phonetics[0]?.audio);
}

// Function to handle pronunciation audio
function prepareAudio(audioSrc) {
    const dayWordVolume = document.getElementById("dayWordvolume");
    if (audioSrc) {
        const audio = new Audio(audioSrc); // Create a new audio object
        dayWordVolume.onclick = () => audio.play(); // Play audio on click
    } else {
        dayWordVolume.onclick = () => alert("No pronunciation audio available for this word.");
    }
}

// Function to fetch and display data for a searched word
async function fetchWordData(word) {
    try {
        // Fetch word data from the dictionary API
        const wordData = await fetchDictionaryData(word);

        // Display the word data on the page
        displayWordData(wordData, word);

        // Fetch and display an image related to the searched word
        fetchWordImage(word, "word-img");
    } catch (error) {
        console.error("Error fetching word data:", error);
        alert(`Cannot find the word "${word}". Please try another.`);
    }
}

// Function to display data for a searched word
function displayWordData(result, word) {
    if (result.title) {
        alert(`Cannot find the meaning of "${word}".`);
    } else {
        const data = result[0];
        document.getElementById("word").textContent = data.word || "N/A";
        document.getElementById("phonetics").textContent = data.phonetics[0]?.text || "N/A";
        document.getElementById("meaning").textContent = data.meanings[0]?.definitions[0]?.definition || "N/A";
        document.getElementById("example").textContent = data.meanings[0]?.definitions[0]?.example || "No example available";
        document.getElementById("synonyms").textContent = data.meanings[0]?.synonyms?.join(", ") || "No synonyms available";
        document.getElementById("antonyms").textContent = data.meanings[0]?.antonyms?.join(", ") || "No antonyms available";

        // Prepare the pronunciation audio for the word
        prepareAudio(data.phonetics[0]?.audio);
    }
}

// Function to fetch and display an image related to a word
async function fetchWordImage(word, elementId) {
    const apiKey = '95W7bB2ThGyLIRIg1QgXfhCv9Ll7dCxvb2QqYTOzVPx506bJhjqKCYbL'; // Replace with your Pexels API key
    const url = `https://api.pexels.com/v1/search?query=${word}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: { 'Authorization': apiKey }
        });

        if (!response.ok) throw new Error("Failed to fetch image");

        const data = await response.json();
        const imageContainer = document.getElementById(elementId);
        imageContainer.innerHTML = ''; // Clear previous images

        // Create and display the image
        const img = document.createElement('img');
        img.src = data.photos[0]?.src.medium || '';
        img.alt = data.photos[0]?.alt || 'Image unavailable';
        img.style.height = "200px";
        img.style.width = "350px";

        imageContainer.appendChild(img);
    } catch (error) {
        console.error("Error fetching image:", error);
        alert("Unable to fetch image.");
    }
}

// Function to switch between tabs
function openTab(tabName) {
    const tabs = document.querySelectorAll('.tab'); // Select all tab elements
    tabs.forEach(tab => tab.style.display = 'none'); // Hide all tabs
    document.getElementById(tabName).style.display = 'block'; // Show the selected tab

    const buttons = document.querySelectorAll('.tab-links button'); // Select all tab buttons
    buttons.forEach(button => button.classList.remove('active')); // Remove active class from all buttons
    event.target.classList.add('active'); // Add active class to the clicked button
}

// Initialize the default tab and fetch Word of the Day on page load
document.addEventListener("DOMContentLoaded", () => {
    fetchWordOfTheDay(); // Fetch and display Word of the Day
    openTab('Tab1'); // Set default tab to "Tab1"
});

// Search functionality for fetching word data
document.getElementById("searchBtn").addEventListener("click", () => {
    const word = document.getElementById("searchInput").value.trim();
    if (word) fetchWordData(word);
});

// Trigger search when the Enter key is pressed
document.getElementById("searchInput").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const word = event.target.value.trim();
        if (word) fetchWordData(word);
    }
});
