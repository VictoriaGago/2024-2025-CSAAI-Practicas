//-- Obtención del canvas y de los elementos HTML a usar
const canvas = document.getElementById('ctiro');
const ctx = canvas.getContext('2d');

//-- Acceder al botón de disparo
const btnLanzar = document.getElementById("btnLanzar");
//-- Acceder al botón de inicio
const btnIniciar = document.getElementById("btnIniciar");


//-- Declaración de variables y objetos
let xop = 5;
let yop = 150;
let xp = xop;
let yp = yop;
let velp = 2;

//-- Coordenadas iniciales del objetivo
let xomin = 5;
let xomax = 150;
let xo = 30; //getRandomXO(xomin,xomax);
let yo = 175;

//-- función para pintar el objetivo
function dibujarO(x,y) {

  //-- Pintando el objetivo
  ctx.beginPath();

  //-- Dibujar un circulo: coordenadas x,y del centro
  //-- Radio, Angulo inicial y angulo final
  ctx.arc(x, y, 25, 0, 2 * Math.PI);

  ctx.lineWidth = 2;

  ctx.fillStyle = 'red';

  ctx.fill();

  //-- Dibujar el trazo
  ctx.stroke();
  ctx.closePath();
}

function dibujarP(x,y,lx,ly,color) {

    //-- Pintando el proyectil
    ctx.beginPath();

    //-- Definir un rectángulo de dimensiones lx x ly,
    ctx.rect(x, y, lx, ly);

    //-- Color de relleno del rectángulo
    ctx.fillStyle = color;

    //-- Mostrar el relleno
    ctx.fill();

    //-- Mostrar el trazo del rectángulo
    ctx.stroke();

    ctx.closePath();
}

//-- Función principal de actualización
function update() 
{
  //-- Implementación del algoritmo de animación:
    //-- 2) Borrar el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

  //-- 1) Actualizar posición de los elementos
    dibujarO(xo,yo); // Pintar el objetivo
    
    dibujarP(xop, yop, 50, 50, "green"); // Pintar el proyectil

  //-- 3) Pintar los elementos en el canvas

  //-- 4) Repetir
    requestAnimationFrame(update);
}

function lanzar() 
{
  //-- Implementación del algoritmo de animación:

  //-- 1) Actualizar posición de los elementos
  xo = xo + velp;

  //-- 2) Borrar el canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //-- 3) Pintar los elementos en el canvas
  dibujarP(xop, yop, 50, 50, "green"); // Pintar el proyectil
  dibujarO(xo,yo); // Pintar el objetivo

  //-- 4) Repetir
  requestAnimationFrame(lanzar);
}

//-- Función de retrollamada del botón de disparo
btnLanzar.onclick = () => {
  lanzar();
}

//-- Función de retrollamada del botón iniciar
btnIniciar.onclick = () => {
  location.reload();
}

//-- Hay que llamar a update la primera vez
update();