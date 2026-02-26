async function loadDetails() {

    const params = new URLSearchParams(window.location.search);
    const name = params.get("name");

    if (!name) return;

    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${name}`
    );

    const data = await response.json();

    const container = document.getElementById("detailsContainer");
    const types = data.types.map(t => 
        `<span class="px-3 py-1 text-sm font-semibold rounded-full 
                 bg-yellow-200 text-gray-800 capitalize">
        ${t.type.name}
        </span>     `
    ).join("");

    const stats = data.stats.map(stat => `
    <div class="flex justify-between items-center 
                px-3 py-2 rounded-lg text-white font-semibold
                ${getStatColor(stat.stat.name)}">

        <span class="uppercase">
            ${formatStatName(stat.stat.name)}
        </span>

        <span>
            ${stat.base_stat}
        </span>
    </div>
`).join("");

    container.innerHTML = `
        <div class="flex justify-evenly gap-10">

            <img src="${data.sprites.other["official-artwork"].front_default}"
                 class="w-65 h-65 object-contain">

        <div>
            <p class="mb-2"> #${data.id}</p>
        <div class="flex items-center gap-4 mb-4">
                <h1 class="text-4xl font-bold capitalize">
                ${data.name}
                </h1>

                <button onclick="playCry('${data.cries.latest}')"
                    class="bg-yellow-400 px-3 py-2 rounded-lg shadow hover:bg-yellow-500">
                <img src="./audio.png" alt="Search" class="w-8 h-8 object-contain">
                </button>
        </div>

        <div class="flex gap-2 mb-4">
                ${types}
        </div>
        
        <div class="flex flew-row gap-4">
                <p class="mb-2 bg-red-400 rounded-sm px-3 py-1 ">Height: ${data.height}</p>
                <p class="mb-2 bg-red-400 rounded-sm px-3 py-1 ">Weight: ${data.weight}</p>
        </div>

        <h2 class="text-xl font-semibold mt-6 mb-3">Stats</h2>
        <div class="grid grid-cols-2 gap-3">
            ${stats}
        </div>

            <h2 class="text-xl font-semibold mt-4 mb-2">Abilities</h2>
                ${data.abilities.map(a => `
                    <span class="bg-yellow-400 px-3 py-1 rounded mr-2">
                        ${a.ability.name}
                    </span>
                `).join("")}
        </div>

        </div>
    `;
}
function playCry(url) {
    const audio = new Audio(url);
    audio.play();
}

function getStatColor(stat) {
    const colors = {
        hp: "bg-red-500",
        attack: "bg-orange-400",
        defense: "bg-yellow-400",
        "special-attack": "bg-blue-400",
        "special-defense": "bg-green-400",
        speed: "bg-pink-400"
    };

    return colors[stat] || "bg-gray-400";
}

function formatStatName(name) {
    const names = {
        hp: "HP",
        attack: "ATK",
        defense: "DEF",
        "special-attack": "SpA",
        "special-defense": "SpD",
        speed: "SPD"
    };

    return names[name] || name.toUpperCase();
}

window.onload = loadDetails;