const wordsArray = [
    "serendipity", "ephemeral", "luminous", "exuberant", "melancholy", 
    "tranquil", "ethereal", "ineffable", "sagacious", "halcyon",
    "ambivalence", "quintessential", "elusive", "solitude", "euphoria",
    "dichotomy", "nostalgia", "vivacious", "labyrinth", "panacea",
    "resilience", "tenacity", "wanderlust", "zenith", "cryptic",
    "idyllic", "jubilant", "pristine", "reverie", "whimsical"
];
// Fetch Word of the Day
async function fetchWordOfTheDay() {
    try {
        // Get the current date
        const currentDate = new Date();
        const dayIndex = currentDate.getDate() % wordsArray.length; // Cycle through the array
        const wordOfTheDay = wordsArray[dayIndex];

        // Simulate fetching details from the dictionary API
        const dictionaryApiBaseUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordOfTheDay}`;
        const dictionaryResponse = await fetch(dictionaryApiBaseUrl);
        const wordData = await dictionaryResponse.json();

        // Display the word details
        displayWordOfTheDay(wordData, wordOfTheDay);
    } catch (error) {
        alert("An error occurred while fetching the Word of the Day.");
    }
}

// Display Word of the Day
function displayWordOfTheDay(result, word) {
    const currentDate = new Date().toDateString();
    document.getElementById("currentDate").innerText = `Today: ${currentDate}`;
    document.getElementById("dayWord").innerText = word || "N/A";
    document.getElementById("dayWordphonetics").innerText = result[0]?.phonetics[0]?.text || "N/A";
    document.getElementById("dayWordmeaning").innerText = result[0]?.meanings[0]?.definitions[0]?.definition || "N/A";
    document.getElementById("dayWordexample").innerText = result[0]?.meanings[0]?.definitions[0]?.example || "No example available";

    // Prepare audio pronunciation
const audioSrc = result[0]?.phonetics[0]?.audio || null;
prepareAudio(audioSrc);
}

// Handle word pronunciation audio
function prepareAudio(audioSrc) {
const dayWordVolume = document.getElementById("dayWordvolume");

if (audioSrc) {
    const audio = new Audio(audioSrc);
    dayWordVolume.onclick = () => audio.play();
} else {
    dayWordVolume.onclick = () => alert("No pronunciation audio available for this word.");
}
}

// Trigger Word of the Day Fetch
document.addEventListener("DOMContentLoaded", fetchWordOfTheDay);

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const volume = document.getElementById("volume");
const wordElement = document.getElementById("word");
const phoneticsElement = document.getElementById("phonetics");
const meaningElement = document.getElementById("meaning");
const exampleElement = document.getElementById("example");
const synonymsElement = document.getElementById("synonyms");
const antonymsElement = document.getElementById("antonyms");
const dayWordElement = document.getElementById("dayWord");
let audio;

// Fetch and display word data
function fetchWordData(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url)
        .then(response => response.json())
        .then(result => displayWordData(result, word))
        .catch(() => {
            alert(`Cannot find the word "${word}". Please try another.`);
        });
}

// Display word data in the UI
function displayWordData(result, word) {
    if (result.title) {
        alert(`Cannot find the meaning of "${word}".`);
    } else {
        const data = result[0];
        wordElement.innerText = data.word || "N/A";
        phoneticsElement.innerText = data.phonetics[0]?.text || "N/A";
        meaningElement.innerText = data.meanings[0]?.definitions[0]?.definition || "N/A";
        exampleElement.innerText = data.meanings[0]?.definitions[0]?.example || "No example available";
        synonymsElement.innerText = data.meanings[0]?.synonyms?.join(", ") || "No synonyms available";
        antonymsElement.innerText = data.meanings[0]?.antonyms?.join(", ") || "No antonyms available";
        console.log(result);
        audio = new Audio(data.phonetics[0]?.audio || null);
    }
}

// Play pronunciation audio
volume.addEventListener("click", () => {
    if (audio) audio.play();
    else alert("No pronunciation audio available.");
});

// Handle search button click
searchBtn.addEventListener("click", () => {
    const word = searchInput.value.trim();
    if (word) fetchWordData(word);
});
// Handle search on Enter key press
searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const word = searchInput.value.trim();
        if (word) fetchWordData(word);
    }
});