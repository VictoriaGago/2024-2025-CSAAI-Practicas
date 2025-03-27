class Teclado {
    constructor(displayId, botonClass, mensajeId, intentosId) {
        this.teclado = document.getElementById(displayId);
        this.botones = Array.from(document.getElementsByClassName(botonClass));
        this.mensaje = document.getElementById(mensajeId);
        this.intentosElemento = document.getElementById(intentosId);
        this.codigoCorrecto = this.generarCodigoAleatorio();
        this.valorActual = ["*", "*", "*", "*"];
        this.maximoIntentos = 10;
        this.intentosRestantes = this.maximoIntentos;
        this.juegoIniciado = false;

        this.inicializarEventos();
        this.bloquearBotones(true);
        this.actualizarDisplay();
    }

    inicializarEventos() {
        this.botones.forEach((boton) => {
            boton.onclick = () => {
                if (!this.juegoIniciado || this.intentosRestantes <= 0) return;

                let numero = boton.value;

                if (this.valorActual.includes(numero)) return;

                if (this.codigoCorrecto.includes(numero)) {
                    let index = this.codigoCorrecto.indexOf(numero);
                    this.valorActual[index] = numero;
                    boton.classList.add("correcto");
                } else {
                    boton.classList.add("incorrecto");
                }

                this.intentosRestantes--;
                this.intentosElemento.innerHTML = this.intentosRestantes;
                this.actualizarDisplay();

                if (this.valorActual.join("") === this.codigoCorrecto.join("")) {
                    this.juegoTerminado(true);
                } else if (this.intentosRestantes === 0) {
                    this.juegoTerminado(false);
                }
            };
        });
    }

    bloquearBotones(estado) {
        this.botones.forEach((boton) => {
            boton.disabled = estado;
        });
    }

    actualizarDisplay() {
        this.teclado.innerHTML = this.valorActual.join("");
    }

    juegoTerminado(ganaste) {
        crono.stop();
        this.bloquearBotones(true);

        setTimeout(() => {
            alert(ganaste ? "¡Bomba desactivada! 🎉 Reiniciando..." : "¡BOOM! 💥 Se acabaron los intentos. Reiniciando...");
            location.reload();
        }, 1000);
    }

    generarCodigoAleatorio() {
        let numeros = "0123456789".split("");
        let codigo = [];
        while (codigo.length < 4) {
            let index = Math.floor(Math.random() * numeros.length);
            codigo.push(numeros.splice(index, 1)[0]);
        }
        console.log("Código secreto:", codigo.join("")); // Para pruebas
        return codigo;
    }

    iniciarJuego() {
        this.juegoIniciado = true;
        this.bloquearBotones(false);
        this.mensaje.innerHTML = "Introduce el código:";
        crono.start();
    }

    reiniciarJuego() {
        location.reload();
    }
}

const teclado = new Teclado("teclado", "digito", "mensaje", "intentos");

const gui = {
    display: document.getElementById("display"),
    start: document.getElementById("start"),
    stop: document.getElementById("stop"),
    reset: document.getElementById("reset"),
};

const crono = new Crono(gui.display);

gui.start.onclick = () => teclado.iniciarJuego();
gui.stop.onclick = () => crono.stop();
gui.reset.onclick = () => teclado.reiniciarJuego();
