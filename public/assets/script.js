 
const submitPromise = new Promise(function(resolve, reject){
    document.getElementById("city_form").addEventListener('submit', function(evt){
        evt.preventDefault();//empecher l'action du formulaire
        const data = document.querySelector("#city_input").value;
        resolve(data);
    });
});

submitPromise.then(function(result){
    return qualite(result);
}).then(function(result)
{
    return meteo(result)
});

let monStockage = localStorage;

function qualite(city)
{
    const httpPromise = new Promise(function(resolve, reject){

        const req = new XMLHttpRequest();

        req.onreadystatechange = function(event) {
            const result = document.querySelector("#return");
            result.innerHTML = "";
            // XMLHttpRequest.DONE === 4
            if (this.readyState === XMLHttpRequest.DONE) {
                if (this.status === 200) {
                    console.log("Réponse reçue: %s", this.responseText);
                    const data = JSON.parse(this.responseText); //pour transformer le json en objet
                    console.dir(data);
                    resolve(data.results[0].city);
                    if(data.results.length == 0)
                    {
                        viewP = document.createElement("p");
                        viewP.className = 'text';
                        viewP.textContent = `Pas de résultats pour cette ville`;
                        result.appendChild(viewP);
                    }
                    else{
                        const mesure = data.results[0].measurements[0].value;
                        let valeur=null;
                        let icon = null;
                        if(mesure<=50)
                        {
                            valeur = "faible";
                            icon = "smile outline";
                        }
                        else if(mesure>=75)
                        {
                            valeur = "moyenne";
                            icon = "meh outline";
                        }
                        else{
                            valeur = "élevée";
                            icon ="frown outline";
                        }
                        console.log(valeur);
                        monStockage = localStorage.setItem(`Mesures`, `ville :${data.results[0].city} -> mesure: ${mesure}`);
                        viewIcon = document.createElement("i");
                        viewIcon.className = `${icon} icon`;
                        result.appendChild(viewIcon);
                        
                        viewP = document.createElement("p");
                        viewP.className = 'text';
                        viewP.textContent = `La pollution de l'air est ${valeur}`;
                        result.appendChild(viewP);
    
                    }
                } 
                else 
                {
                    console.log("Status de la réponse: %d (%s)", this.status, this.statusText);
                }
            }
        
        }
        req.open('GET', `https://api.openaq.org/v1/latest?city=${city}&parameter=pm10`, true);
        req.send(null)
    });
    return httpPromise;
}


function meteo(city)
{
    //La requête sur OpenWeatherMap 
     console.log(`Meteo de la ville de ${city}`);
}
