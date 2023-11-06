const url = "https://pokeapi.co/api/v2/pokemon";

// Fetch pokemon data
function fetchPokedata(pokemonID) {
  const apiUrl = `${url}/${pokemonID}`;
  return fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch data with id ${pokemonID}`);
      }
      return response.json();
    });
}

// Fetch abilities of pokemons
function fetchAbilityData(abilityURL) {
  return fetch(abilityURL)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ability data from URL ${abilityURL}`);
      }
      return response.json();
    });
}

// Pokemon card content

const updatePokemonCard = async (cardElement, pokemonData) => {
  if (pokemonData) {
    cardElement.querySelector('h2').textContent = pokemonData.species.name;
    cardElement.querySelector('img').src = pokemonData.sprites.front_default;
    const pokemonType = pokemonData.types[0].type.name;
    cardElement.querySelector('.pokemon').classList.add(pokemonType);

    const abilitiesList = cardElement.querySelector('.abilities');
    abilitiesList.innerHTML = '';

//fetch and display abilities for each pokemon

    for (const ability of pokemonData.abilities) {
      try {
        const abilityData = await fetchAbilityData(ability.ability.url);
        const abilityItem = document.createElement('li');
        abilityItem.textContent = abilityData.name;
        abilitiesList.appendChild(abilityItem);
      } catch (error) {
        console.error(error.message);
      }
    }
  }
}

// Fetch data and update it for 2 random pokemon
function displayRandomPokemon() {
  const cardElements = document.querySelectorAll('.pokecard');
  for (let i = 0; i < cardElements.length; i++) {
    const randomPokemonID = Math.floor(Math.random() * 151) + 1;

    fetchPokedata(randomPokemonID)
      .then((pokemonData) => {
        updatePokemonCard(cardElements[i], pokemonData);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }
}

// When the page loads, show random pokemon
window.addEventListener('load', displayRandomPokemon);