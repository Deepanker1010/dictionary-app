
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
        const currentDate = new Date();
        const dayIndex = currentDate.getDate() % wordsArray.length;
        const wordOfTheDay = wordsArray[dayIndex];

        const dictionaryApiBaseUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${wordOfTheDay}`;
        const dictionaryResponse = await fetch(dictionaryApiBaseUrl);
        const wordData = await dictionaryResponse.json();

        displayWordOfTheDay(wordData, wordOfTheDay);
        getimage(wordOfTheDay);
        imgwordtag.innerHTML = '';

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

    // const audioSrc = result[0]?.phonetics[0]?.audio || null;
    // prepareAudio(audioSrc);
    
    //changes do for audio;
    let audioSrc='';
    for (let i = 0; i < result[0].phonetics.length; i++) {
        if (result[0].phonetics[i]?.audio) {
            audioSrc=result[0]?.phonetics[i]?.audio;
            break;
        }
    }
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
        .then((result) => {
            imgwordtag.innerHTML = '';
            displayWordData(result, word);
            inputwordimg(word);
        })
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
        wordElement.textContent = data.word || "N/A";
        phoneticsElement.textContent = data.phonetics[0]?.text || "N/A";
        meaningElement.textContent = data.meanings[0]?.definitions[0]?.definition || "N/A";
        exampleElement.textContent = data.meanings[0]?.definitions[0]?.example || "No example available";
        synonymsElement.textContent = data.meanings[0]?.synonyms?.join(", ") || "No synonyms available";
        antonymsElement.textContent = data.meanings[0]?.antonyms?.join(", ") || "No antonyms available";
        // console.log(result);
        // audio = new Audio(data.phonetics[0]?.audio || null);

        //changes do for audio
        for (let i = 0; i < data.phonetics.length; i++) {
            if (data.phonetics[i]?.audio) {
                audio = new Audio(data.phonetics[i]?.audio);
                break;
            }
        }
    }
}

// Play pronunciation audio
volume.addEventListener("click", () => {
    if (audio) audio.play();
    else alert("No pronunciation audio available.");
});

searchBtn.addEventListener("click", () => {
    const word = searchInput.value.trim();
    if (word) fetchWordData(word);
});

searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const word = searchInput.value.trim();
        if (word) fetchWordData(word);
    }
});
let imgparenttag = document.getElementById("wordofday-img");
let imgwordtag = document.getElementById("word-img");
let img = document.createElement('img');
let img1 = document.createElement('img');
//seting image for word of day;
function getimage(imgname) {
    const apiKey = '95W7bB2ThGyLIRIg1QgXfhCv9Ll7dCxvb2QqYTOzVPx506bJhjqKCYbL';
    fetch(`https://api.pexels.com/v1/search?query=${imgname}`, {
        method: 'GET',
        headers: {
            'Authorization': apiKey
        }
    })
        .then(response => response.json())
        .then(data => {
            img.src = data.photos[0].src.medium;
            img.alt = data.photos[0].alt;
            img.style.height=200 + "px";
            img.style.width = 350 + "px"; 
            imgparenttag.appendChild(img);
        })
        .catch(error => {
            console.log('Error:', error);
            alert('Error:', error);
        });
}

//setting image for inputword;
function inputwordimg(imgname) {
    const apiKey = '95W7bB2ThGyLIRIg1QgXfhCv9Ll7dCxvb2QqYTOzVPx506bJhjqKCYbL';
    fetch(`https://api.pexels.com/v1/search?query=${imgname}`, {
        method: 'GET',
        headers: {
            'Authorization': apiKey
        }
    })
        .then(response => response.json())
        .then(data => {
            img1.src = data.photos[0].src.medium;
            img1.alt = data.photos[0].alt;
            img1.style.height=200 + "px";
            img1.style.width = 350 + "px"; 
            imgwordtag.appendChild(img1);
        })
        .catch(error => {
            console.log('Error:', error);
            alert('Error:', error);
        });
}
function openTab(tabName) {
    let tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';

    let buttons = document.querySelectorAll('.tab-links button');
    buttons.forEach(button => button.classList.remove('active'));
    event.target.classList.add('active');
  }

  // Set default active tab
  openTab('Tab1');