const input = document.querySelector("#input");
const select = document.querySelector(".select");
const result = document.querySelector(".result");
const button = document.querySelector("#button");
const graph = document.querySelector("#myChart");

let html = "<option value='selected'>Seleccione</option>";
let indicador_grafica = null;
let ultimo_valor = null;
let fechas = [];
let valores = [];
let myChart;

async function getCoinValues() {
  try {
    const response = await fetch("https://mindicador.cl/api/");
    const arrayCoin = await response.json();
    return arrayCoin;
  } catch (e) {
    alert("Error, intenta luego... API fuera de servicio");
  }
}

async function conversor(divisor) {
  const data = await getCoinValues();
  let quantity = Number(input.value);
  let division = (quantity / data[divisor].valor).toFixed(2);
  result.innerHTML = `<h3>Resultado: $ ${division} </h3>`;
}

async function ultimos10Valores(moneda) {
  try {
    const indicador = await fetch(`https://mindicador.cl/api/${moneda}`);
    const data = await indicador.json();
    indicador_grafica = await data.serie.slice(0, 10).reverse();
    ultimo_valor = Number(
      parseInt(indicador_grafica[indicador_grafica.length - 1]["valor"])
    );
    fechas = [];
    valores = [];
    indicador_grafica.forEach((elemento) => {
      fechas.push(elemento.fecha);
      valores.push(parseInt(elemento.valor));
    });
    for (let i = 0; i < fechas.length; i++) {
      fechas[i] = fechas[i].slice(0, 10).split("-").reverse().join("-");
    }
  } catch (error) {
    alert(error.message);
  }
}

// Evento change del select
select.addEventListener("change", () => {
  let moneda = select.value;
  ultimos10Valores(moneda);
});

button.addEventListener("click", function () {
  if (input.value == "") {
    alert("Ingresa cantidad en CLP y la convertiremos.");
    return;
  }
  if (input.value < 0) {
    alert("Tiene que ser un valor positivo ...");
    return;
  }
  let final = conversor(select.options[select.selectedIndex].value);
  limpiar_grafica();
  renderizar_grafica();
});

function renderizar_grafica() {
  if (myChart) {
    myChart.destroy();
  }
  myChart = new Chart(graph, {
    type: "line",
    data: {
      labels: fechas,
      datasets: [
        {
          label: "Historial de precios",
          data: valores,
          borderWidth: 1,
          borderColor: "rgb(255, 0, 149)",
        },
      ],
    },
  });
}

// Función para limpiar el gráfico existente
function limpiar_grafica() {
  if (myChart) {
    myChart.destroy();
  }
}
