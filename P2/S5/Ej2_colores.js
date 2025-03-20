console.log("Ejecutando JS...");

const elemento = document.getElementById("elemento");
const boton = document.getElementById("boton");

boton.onclick = () => {
  console.log("Clic!");

  //-- Cambiar color
  elemento.style.backgroundColor = "pink";
}

//const ---> valor constante de tipo INMUTABLE