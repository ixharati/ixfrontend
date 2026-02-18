

async function pokemon(){
    const inputVal = document.querySelector("input").value.toLowerCase();
    if(!inputVal){
        alert("Enter Pokemon name!");
        return;
    }
    try{
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputVal}`) 
        const data =await response.json();

        const con = document.getElementById("container");
        con.innerHTML =  `<div class="bg-white/20 rounded-2xl w-[200px] h-[300px] flex flex-col justify-center p-3">
            <img src="${data.sprites.other["official-artwork"].front_default}"  ></img>
            <h2>
                Name: ${data.name}<br>
                ID: ${data.id}
            </h2>
        </div>`

        ;
    }
    catch(error){
        alert("Pokemon not found!")
    }
}