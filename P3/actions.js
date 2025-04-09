const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//-- JUGADOR:
const ImagenJugador = new Image();
ImagenJugador.src = 'nave.webp';

//-- ALIENS:
const LADRILLO = {
    F: 3,
    C: 8,
    w: 30,
    h: 20,
    padding: 25,
    visible: true
  }

  const ladrillos = [];

for (let i = 0; i < LADRILLO.F; i++) {

  ladrillos[i] = [];

  for (let j = 0; j < LADRILLO.C; j++) {

    ladrillos[i][j] = {

      xl: (LADRILLO.w + LADRILLO.padding) * j,
      yl: (LADRILLO.h + LADRILLO.padding) * i,
      w: LADRILLO.w,
      h: LADRILLO.h,
      padding: LADRILLO.padding,
      visible: LADRILLO.visible

    };
  }
}


//-- Posiciones para empezar:
    let x = 300;
    let y = 340;

//-- Variables para teclado:
    const velocidad = 10;

//-- Variables para ladrillos:
    const velocidadX = 3;
    const velocidadY = 0.3;

//-- Variables para cambiar direccion de los ladrillos:
    let direccionLadrillosX = 1;
    let direccionLadrillosY = 1;


function dibujarJugador(){

    ctx.drawImage(ImagenJugador, x, y, 70, 70);

}

function moverJugador(){

    document.body.onkeydown = function(event){
            
        switch(event.keyCode){

            case 37: // Izquierda
                x-=velocidad;
                x = Math.max(0, Math.min(canvas.width - 70, x));
                break;

            case 39: // Derecha
                x+=velocidad;
                x = Math.max(0, Math.min(canvas.width - 70, x));
                break;
        }
    }

    
}

function dibujarLadrillos(){

    for (let i = 0; i < LADRILLO.F; i++) {

        for (let j = 0; j < LADRILLO.C; j++) {

        if (ladrillos[i][j].visible) {

            ctx.beginPath();
            ctx.rect(ladrillos[i][j].xl, ladrillos[i][j].yl, LADRILLO.w, LADRILLO.h);
            ctx.fillStyle = 'blue';
            ctx.fill();
            ctx.closePath();
        }
        }
    }
}

function moverLadrillos(){

    for (let i = 0; i < LADRILLO.F; i++) {

        for (let j = 0; j < LADRILLO.C; j++) {

            ladrillos[i][j].xl += velocidadX * direccionLadrillosX;

            ladrillos[i][j].yl += velocidadY * direccionLadrillosY;

        }
    }
    
    const primerLadrillo = ladrillos[0][0];

    const ultimoLadrillo = ladrillos[0][LADRILLO.C-1];
    
    if (primerLadrillo.xl <= 0) {

        direccionLadrillosX = 1; // Ir a la derecha
    }

    if (ultimoLadrillo.xl + LADRILLO.w >= canvas.width) {

        direccionLadrillosX = -1; // Ir a la izquierda
    }
    

    if (primerLadrillo.yl <= 0) {

        direccionLadrillosY = 1; // Ir a la derecha
    }

    if (ultimoLadrillo.yl + LADRILLO.w >= canvas.width) {

        direccionLadrillosY = -1; // Ir a la izquierda
    }

}

function update(){

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    moverJugador()

    dibujarJugador()

    moverLadrillos()

    dibujarLadrillos()

    requestAnimationFrame(update);

}

update()