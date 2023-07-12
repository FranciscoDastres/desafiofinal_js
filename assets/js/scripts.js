const input = document.querySelector("#input")
const select = document.querySelector(".select")
const result = document.querySelector(".result")
const button = document.querySelector("#button")

async function getCoinValues() {
    try{
    const response = await fetch("https://mindicador.cl/api/");
    const arrayCoin = await response.json();
    return arrayCoin;
    }
    catch (e) {
      alert("Error, intenta luego... API fuera de servicio")
    }
}
    
      
async function conversor(divisor) {
    const data = await getCoinValues();
    let quantity = Number(input.value);
    let division = (quantity / data[divisor].valor).toFixed(2);
    result.innerHTML = ` <h3>Resultado: $ ${division} </h3>`;
}
  
async function getDailyCoin(currency) {
    try {
      const response = await fetch("https://mindicador.cl/api/" + currency);
      const arrayCoin = await response.json();
      const lastDays = arrayCoin.serie.slice(0, 20).reverse();
      const labels = lastDays.map((day) => {
        return day.fecha;
      });
      const divisa = lastDays.map((day) => {
        return day.valor;
      });
      const datasets = [
        {
          label: currency,
          borderColor: "rgb(255, 0, 149)",
          divisa,
        },
      ];
      return { labels, datasets };
    } 
    catch (e) {
      alert("Error, intenta luego... API fuera de servicio")
    }
 }



button.addEventListener("click", function () {
    if (input.value ==""){
        alert ("Ingresa cantidad en CLP y la convertiremos.")
    }
    if (input.value <0) {
        alert ("Tiene que ser un valor positivo ...")
    }
    let final = conversor (
        select.options[select.selectedIndex].value
    );
})


