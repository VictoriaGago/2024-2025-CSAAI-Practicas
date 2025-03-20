console.log("Ejecutando JS...");

const display = document.getElementById('display');
const botones = document.getElementsByClassName("digito");

for (let boton of botones) {
    console.log("Boton: " +  boton.value);
    boton.onclick= function() {
        display.innerHTML = boton.value;
      }
}


