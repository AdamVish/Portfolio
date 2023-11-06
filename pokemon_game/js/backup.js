const url= "https://pokeapi.co/api/v2/pokemon";
const AbilityUrl= "https://pokeapi.co/api/v2/ability";

//fetch pokemon data
function fetchPokedata(pokemonID){
    const apiUrl = `${url}/${pokemonID}`;
    return fetch(apiUrl)
    .then(response =>{
        if(!response.ok){
            throw new Error('Failed to fetch datawith id ${pokemonID}')
        }
        return response.json();
    }
        )
}
// fetch abilities of pokemons 
function fetchAbilityData(pokemonID){
    const urlAbilities = `${AbilityUrl}/${pokemonID}`;
    return fetch(urlAbilities)
    .then(response =>{
        if(!response.ok){
            throw new Error('Failed to fetch ability data ${AbilityUrl}')
        }
        return response.json();
    }
        )
}

//pokemon card content

async function updatePokemonCard(cardElement,pokemonData){
    if(pokemonData){
        cardElement.querySelector('h2').textContent = pokemonData.species.name;
        cardElement.querySelector('img').src = pokemonData.sprites.front_default;
        const pokemonType = pokemonData.types[0].type.name;
        cardElement.querySelector('.pokemon').classList.add(pokemonType);
        //cardElement.querySelector('.attacks').textContent = pokemonData.ability.abilities;
    
        const abilitiesList = cardElement.querySelector('.abilities');
        abilitiesList.innerHTML = '';

        for (const ability of pokemonData.abilities){
            try {
                const abilityData = await urlAbilities(ability.ability.url);
                const abilityItem = document.createElement(li);
                abilityItem.textContent = abilityData.name;
                abilitiesList.appendChild(abilityItem);
        } catch (error){
            console.error(error.message);
        }
    }
}
}

//fetch data and update it for 2 random pokemon. 
function displayRandomPokemon(){
    const cardElements = document.querySelectorAll('.pokecard');
    for(let i=0;i<cardElements.length; i++){
        const randomPokemonID = Math.floor(Math.random() * 151)+1;

        fetchPokedata(randomPokemonID)
        .then(pokemonData => {
            updatePokemonCard(cardElements[i],pokemonData);
        })
        .catch(error =>{
            console.log(error.message);
        })
        
    }
}
// When page loads, show random pokemon
window.addEventListener('load', displayRandomPokemon);