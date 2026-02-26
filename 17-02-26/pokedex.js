const limit = 50;
let currentPage = 1;
let totalPokemon = 1302; 
let totalPages = Math.ceil(totalPokemon / limit);
const params = new URLSearchParams(window.location.search);
const pageFromURL = parseInt(params.get("page"));

if (pageFromURL && pageFromURL > 0) {
    currentPage = pageFromURL;
}

function updateURL(page){
    const url = `${window.location.pathname}?page=${page}`;
    window.history.pushState({}, "", url);
}

function createCard(data) {

    const types = data.types.map(t =>
        `<span class="px-2 py-0.5 text-xs font-semibold rounded-full bg-yellow-200">
            ${t.type.name}
        </span>`
    ).join("");

    return `
    <div onclick="goToDetails('${data.name}')" class="bg-yellow-50 rounded-2xl w-full max-w-[220px] 
                shadow-xl p-4 flex flex-col items-center hover:bg-yellow-200">

        <img src="${data.sprites.other["official-artwork"].front_default}" 
             class="w-24 h-24 object-contain mb-2">

        <h2 class="font-bold capitalize">${data.name}</h2>
        <p class="text-sm text-gray-500 mb-2">#${data.id}</p>

        <div class="flex gap-1 flex-wrap justify-center">
            ${types}
        </div>
    </div>
    `;
}

function goToDetails(name) {
    window.location.href = `details.html?name=${name}`;
}



async function loadPage(page) {
    

    const container = document.getElementById("container");
    container.innerHTML = `
    <div class="flex flex-col justify-center items-center h-full w-full gap-4">
        <div class="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        <p class="text-white font-semibold ">Loading...</p>
    </div>
`;

    const offset = (page - 1) * limit;

    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );

    const data = await response.json();

    container.innerHTML = "";

    for (let pokemon of data.results) {
        const res = await fetch(pokemon.url);
        const pokeData = await res.json();
        container.innerHTML += createCard(pokeData);
    }
    renderPagination();
}



function renderPagination() {

    const pagination = document.getElementById("pagination");
    pagination.innerHTML = "";

    const maxVisible = 5;

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (currentPage > 1) {
        pagination.innerHTML += `
            <button onclick="changePage(${currentPage - 1})"
                class="w-10 h-10 rounded-full bg-white shadow">
                &lt;
            </button>
        `;
    }

    for (let i = start; i <= end; i++) {
        pagination.innerHTML += `
            <button onclick="changePage(${i})"
                class="w-10 h-10 rounded-full shadow 
                ${i === currentPage ? "bg-blue-800 text-white" : "bg-white"}">
                ${i}
            </button>
        `;
    }

    if (currentPage < totalPages) {
        pagination.innerHTML += `
            <button onclick="changePage(${currentPage + 1})"
                class="w-10 h-10 rounded-full bg-white shadow">
                &gt;
            </button>
        `;
    }
}


function changePage(page) {
    
    currentPage = page;
    updateURL(currentPage);
    loadPage(page);
}

async function pokemon() {

    const inputVal = document.querySelector("input").value.toLowerCase();
    const container = document.getElementById("container");
    const pagination = document.getElementById("pagination");

    if (!inputVal) {
        return;
    }

    try {
        const response = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${inputVal}`
        );

        if (!response.ok) {
            throw new Error("Not found");
        }

        const data = await response.json();

        container.innerHTML = createCard(data);
        pagination.innerHTML = "";

    } catch {
        container.innerHTML = `
            <div class="flex justify-center items-center h-full w-full">
                <p class="text-white text-xl font-semibold">
                    Pokemon not found!
                </p>
            </div>
        `;

        pagination.innerHTML = "";
    }
}

let allPokemonNames = [];
async function loadAllPokemonNames() {
    const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=1302"
    );
    const data = await response.json();
    allPokemonNames = data.results.map(p => p.name);
}

document.addEventListener("DOMContentLoaded", () => {

    loadAllPokemonNames();

    const input = document.getElementById("searchInput");
    const suggestionBox = document.getElementById("suggestions");

    input.addEventListener("input", () => {

        const value = input.value.toLowerCase();

        if (!value) {
            suggestionBox.classList.add("hidden");
            return;
        }

        const matches = allPokemonNames
            .filter(name => name.startsWith(value))
            .slice(0, 5);

        if (matches.length === 0) {
            suggestionBox.classList.add("hidden");
            return;
        }

        suggestionBox.innerHTML = matches.map(name => `
            <div onclick="selectSuggestion('${name}')"
                class="px-3 py-2 hover:bg-gray-100 cursor-pointer capitalize">
                ${name}
            </div>
        `).join("");

        suggestionBox.classList.remove("hidden");
    });``

    input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        pokemon();
    }
});

});

function selectSuggestion(name) {
    document.getElementById("searchInput").value = name;
    document.getElementById("suggestions").classList.add("hidden");
}

window.onload = () =>{ loadPage(currentPage)
};