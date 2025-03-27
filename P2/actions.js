//-- Clase teclado

class Teclado {
    constructor(displayId, botonClass, mensajeId) {
        this.teclado = document.getElementById(displayId);
        this.botones = document.getElementsByClassName(botonClass);
        this.mensaje = document.getElementById(mensajeId);
        this.codigoCorrecto = this.generarCodigoAleatorio();
        this.valorActual = '';
        this.maximoDigito = 4;
        this.juegoIniciado = false;
        this.inicializarEventos();
        this.actualizarDisplay();
        console.log("Código aleatorio generado: ", this.codigoCorrecto);
    }

    inicializarEventos() {
        for (let boton of this.botones) {
            boton.onclick = () => {
                let numero = boton.value;
                if (this.valorActual.includes(numero)) return;

                // Cambiar color del botón según si el número está en el código
                if (this.codigoCorrecto.includes(numero)) {
                    boton.classList.add("correcto");
                    boton.classList.remove("incorrecto");
                } else {
                    boton.classList.add("incorrecto");
                    boton.classList.remove("correcto");
                }

                if (this.valorActual.length < this.maximoDigito && !this.valorActual.includes(numero)) {
                    this.valorActual += numero;
                    this.actualizarDisplay();
                    }

                if (this.valorActual.length === this.maximoDigito) {
                    this.verificarCodigo();
                }
                }
            }
        }

    verificarCodigo() {
            let display = this.teclado.innerHTML; // Obtenemos el valor actual del display
        
            if (display === this.codigoCorrecto) {
                this.mensaje.innerHTML = "¡Bomba desactivada! 🎉";
                this.mensaje.style.color = "green";
            } else {
                this.mensaje.innerHTML = "¡Explosión! 💥 Intenta de nuevo.";
                this.mensaje.style.color = "red";
            }
    }
    
    actualizarDisplay() {
        let display = Array(this.maximoDigito).fill("*"); // Inicializamos con "*"
        let valorActualArray = this.valorActual.split(""); // Convertimos en array
        let codigoArray = this.codigoCorrecto.split(""); // Convertimos el código en array
        let estado = Array(this.maximoDigito).fill(false); // Estado de las posiciones (false = vacía)
    
        // Recorremos los números ingresados
        for (let i = 0; i < valorActualArray.length; i++) {
            let numeroIngresado = valorActualArray[i];
    
            // Buscamos todas las posiciones donde aparece el número en el código
            for (let j = 0; j < codigoArray.length; j++) {
                if (codigoArray[j] === numeroIngresado && !estado[j]) {
                    display[j] = numeroIngresado; // Asignamos el número en la posición correcta
                    estado[j] = true; // Marcamos la posición como ocupada
                    break; // Salimos del bucle para evitar sobreescribir en caso de números repetidos
                }
            }
        }
    
        // Convertimos el array `display` a un string y actualizamos la pantalla
        this.teclado.innerHTML = display.join("");
    }
    
    
    generarCodigoAleatorio() {
        let numeros = "0123456789".split(""); // Array de números
        let codigo = '';
        while (codigo.length < 4) {

            let index = Math.floor(Math.random() * numeros.length); // Obtener un índice aleatorio
            codigo += numeros[index]; // Añadir el número al código
            
            console.log("Código parcial: ", codigo);
            
            numeros.splice(index, 1); // Eliminar el número del array para evitar repeticiones
            
        }
        return codigo;
    }

    }



// Crear una instancia de la clase Teclado
const teclado = new Teclado('teclado', 'digito', 'mensaje');


//-- Clase cronómetro
class Crono {

    //-- Constructor. Hay que indicar el 
    //-- display donde mostrar el cronómetro
    constructor(display) {
        this.display = display;

        //-- Tiempo
        this.cent = 0, //-- Centésimas
        this.seg = 0,  //-- Segundos
        this.min = 0,  //-- Minutos
        this.timer = 0;  //-- Temporizador asociado
    }

    //-- Método que se ejecuta cada centésima
    tic() {
        //-- Incrementar en una centesima
        this.cent += 1;

        //-- 100 centésimas hacen 1 segundo
        if (this.cent == 100) {
        this.seg += 1;
        this.cent = 0;
        }

        //-- 60 segundos hacen un minuto
        if (this.seg == 60) {
        this.min = 1;
        this.seg = 0;
        }

        //-- Mostrar el valor actual
        this.display.innerHTML = this.min + ":" + this.seg + ":" + this.cent
    }

    //-- Arrancar el cronómetro
    start() {
       if (!this.timer) {
          //-- Lanzar el temporizador para que llame 
          //-- al método tic cada 10ms (una centésima)
          this.timer = setInterval( () => {
              this.tic();
          }, 10);
        }
    }

    //-- Parar el cronómetro
    stop() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    //-- Reset del cronómetro
    reset() {
        this.cent = 0;
        this.seg = 0;
        this.min = 0;

        this.display.innerHTML = "0:0:0";
    }
}


//-- Elementos de la gui
const gui = {
    display : document.getElementById("display"),
    start : document.getElementById("start"),
    stop : document.getElementById("stop"),
    reset : document.getElementById("reset")
}

console.log("Ejecutando JS...");

//-- Definir un objeto cronómetro
const crono = new Crono(gui.display);

//---- Configurar las funciones de retrollamada

//-- Arranque del cronometro
gui.start.onclick = () => {
    console.log("Start!!");
    crono.start();
}
  
//-- Detener el cronómetro
gui.stop.onclick = () => {
    console.log("Stop!");
    crono.stop();
}

//-- Reset del cronómetro
gui.reset.onclick = () => {
    console.log("Reset!");
    crono.reset();
}