const url= "https://anapioficeandfire.com/api/houses"

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

const updateData = async (GOT,data)=>{
    if (data){
        GOT.querySelector(".name").textContent = data.name;
        GOT.querySelector(".region").textContent = data.region;
        GOT.querySelector(".coatOfArms").textContent = data.coatOfArms;
        GOT.querySelector(".lord").textContent = data.currentLord;
        GOT.querySelector(".heir").textContent = data.heir;
        GOT.querySelector(".titles").textContent = data.titles;
       // const culture = data.types[]
    }
}

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