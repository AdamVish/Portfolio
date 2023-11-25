const url= "https://anapioficeandfire.com/api/characters"

//fetching data from API

function fetchData(data){
    const apiURL = `${url}/${data}`;
    return fetch(apiURL)
    .then((response)=>{
        if (!response.ok){
            throw new Error ('Failed to fetch data with id ${data}');
        }
        return response.json();
    });
}

//Connecting APIs with coresponding sections in html

const updateData = async (GOT,data)=>{
    if (data){
        GOT.querySelector(".name").textContent = data.name;
        GOT.querySelector(".culture").textContent = data.culture;
       // const culture = data.types[]
    }
}

//Generating random number and picking it for generated Character / House / Book

function displayPlease() {
    const GOT = document.querySelectorAll(".cardInfo");
    for (let i = 0; i< GOT.length;i++){
        const randomHouseID = Math.floor(Math.random() *151) +1;

        fetchData(randomHouseID)
            .then ((data)=>{
                updateData(GOT[i], data);
            })
            .catch((error) => {
                console.log(error.message);
            })
    }
}
window.addEventListener('load',displayPlease);