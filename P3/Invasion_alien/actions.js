
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

//-- MUSICA:
var juego = document.getElementById('sonido1');
var win = document.getElementById('sonido2');
var lose = document.getElementById('sonido3');
var disparo = document.getElementById('disparo');
var bomba = document.getElementById('bomba');

var puntuacion = 0;

//-- REINICIAR:
var gameOver = false;
var reiniciarBtn = document.getElementById('reiniciar-btn');
var ganarBtn = document.getElementById('ganar-btn');

reiniciarBtn.addEventListener('click', reiniciarJuego);
ganarBtn.addEventListener('click', reiniciarJuego);

var victoria = false;

//-- JUGADOR:
var ImagenJugador = new Image();
ImagenJugador.src = 'sans.png';


//-- EXPLOSION:
var ImagenExplosion = new Image();
ImagenExplosion.src = 'explosion.png';
var explosiones = [];


//-- DISPARO:
var balas = [];
var ImagenHueso = new Image();
ImagenHueso.src = 'hueso.png';


//-- ALIENS:

var ImagenEnemigo = new Image();
ImagenEnemigo.src = 'enemigos.png';

var LADRILLO = {
    F: 3,
    C: 8,
    w: 40,
    h: 40,
    padding: 25,
    visible: true
  };

var ladrillos = [];

for (var i = 0; i < LADRILLO.F; i++) {

  ladrillos[i] = [];

  for (var j = 0; j < LADRILLO.C; j++) {

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
    var x = 315;
    var y = canvas.height - 60;

//-- Variables para teclado:
    var velocidad = 10;

//-- Variables para ladrillos:
    var velocidadX = 3;
    var velocidadY = 0.1;

//-- Variables para cambiar direccion de los ladrillos:
    var direccionLadrillosX = 1;
    var direccionLadrillosY = 1;

function iniciarMusica(){
    juego.volume = 0.3;
    juego.play();
}

// FUNCIONES PARA QUE FUNCIONE CON EL MOVIL (se ejecutan desde el html)

function moverNave(direccion) {
    x += velocidad * direccion;
    x = Math.max(0, Math.min(canvas.width - 70, x));
}

function disparar() {
    var nuevoDisparo = {
        x: x + 70 / 2 - 2,
        y: y,
        r: 3,
        dy: -5
    };
    
    disparo.currentTime = 0;
    disparo.play();
    balas.push(nuevoDisparo);
}

//-- FUNCIONES 'NORMALES'

function dibujarJugador(){

    ctx.drawImage(ImagenJugador, x, y, 70, 70);

}

function moverJugador(){

    document.body.onkeydown = function(event){
            
        switch(event.keyCode){

            case 37: // Izquierda
                x -= velocidad;
                x = Math.max(0, Math.min(canvas.width - 70, x));
                break;

            case 39: // Derecha
                x += velocidad;
                x = Math.max(0, Math.min(canvas.width - 70, x));
                break;

            case 32: 

                var nuevoDisparo = {

                    x: x + 70 / 2-2,
                    y : y,
                    r : 3,
                    dy : -5, //-- velocidad
                };

                disparo.currentTime = 0;
                disparo.play();

                balas.push(nuevoDisparo);

                break;
        }
    };
}

function dibujarLadrillos(){

    for (var i = 0; i < LADRILLO.F; i++) {

        for (var j = 0; j < LADRILLO.C; j++) {

        if (ladrillos[i][j].visible) {

            ctx.beginPath();
            
            ctx.drawImage(ImagenEnemigo, ladrillos[i][j].xl, ladrillos[i][j].yl, LADRILLO.w, LADRILLO.h);

            ctx.closePath();
        }
        }
    }
}

function moverLadrillos(){

    for (var i = 0; i < LADRILLO.F; i++) {

        for (var j = 0; j < LADRILLO.C; j++) {

            ladrillos[i][j].xl += velocidadX * direccionLadrillosX;

            ladrillos[i][j].yl += velocidadY * direccionLadrillosY;

        }
    }
    
    var primerLadrillo = ladrillos[0][0];

    var ultimoLadrillo = ladrillos[0][LADRILLO.C-1];
    
    if (primerLadrillo.xl <= 0) {

        direccionLadrillosX = 1; // Ir a la derecha
    }

    if (ultimoLadrillo.xl + LADRILLO.w >= canvas.width) {

        direccionLadrillosX = -1; // Ir a la izquierda
    }
    

    if (primerLadrillo.yl <= 0) {

        direccionLadrillosY = 1; // Ir abajo
    }

    if (ultimoLadrillo.yl + LADRILLO.w >= canvas.width) {

        direccionLadrillosY = -1; // Ir arriba
    }

}

function dibujarBalas() {

    for (var i = 0; i < balas.length; i++) {

        ctx.beginPath();
        ctx.drawImage(ImagenHueso, balas[i].x, balas[i].y, 20, 40);
        ctx.closePath();

        balas[i].y += balas[i].dy;

        var balaEliminada = false;

        for (var k = 0; k < LADRILLO.F && !balaEliminada; k++) {

            for (var j = 0; j < LADRILLO.C && !balaEliminada; j++) {
    
                var ladrillo = ladrillos[k][j];
                if (ladrillo.visible && colision(balas[i], ladrillo)){
                    
                    explosiones.push({
                        x: ladrillo.xl,
                        y: ladrillo.yl,
                        frame: 0,
                        active: true
                    });

                    ladrillo.visible = false;
                    balas.splice(i, 1);
                    i--;
                    balaEliminada = true;
                    puntuacion += 10;
                    bomba.currentTime = 0;
                    bomba.play();
                }
            }
        }

        if(!balaEliminada && balas[i] && balas[i].y < 0){

            balas.splice(i, 1);
            i--;
        }
    }
}

function colision(bala, ladrillo){
    
    return (

        bala.x + bala.r > ladrillo.xl &&
        bala.x - bala.r < ladrillo.xl + ladrillo.w &&
        bala.y + bala.r > ladrillo.yl &&
        bala.y - bala.r < ladrillo.yl + ladrillo.h
    );
    
}

function mostrarGameOver() {

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px "Press Start 2P"';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Stay determinated...', canvas.width / 2, canvas.height / 2 - 30);
    
    disparo.pause();
    juego.pause();
    lose.currentTime = 0;
    lose.volume = 0.3;
    lose.play();
    
    reiniciarBtn.style.display = 'block';
}

function mostrarWIN() {

    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '30px "Comic Sans MS"';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('* pretty humerus, right? ;)', canvas.width / 2, canvas.height / 2 - 30);

    disparo.pause();
    juego.pause();
    win.currentTime = 0;
    win.volume = 0.3;
    win.play();

    ganarBtn.style.display = 'block';
}

function reiniciarJuego() {
   
    iniciarMusica();
    win.currentTime = 0;
    win.pause();
    lose.currentTime = 0;
    lose.pause();

    puntuacion = 0;
    gameOver = false;
    victoria = false;
    balas = [];
    x = 315;
    y = canvas.height - 60;
    
    for (var i = 0; i < LADRILLO.F; i++) {

        for (var j = 0; j < LADRILLO.C; j++) {

            ladrillos[i][j].visible = true;
            ladrillos[i][j].xl = (LADRILLO.w + LADRILLO.padding) * j;
            ladrillos[i][j].yl = (LADRILLO.h + LADRILLO.padding) * i;
        }
    }

    ganarBtn.style.display = 'none';
    reiniciarBtn.style.display = 'none';
    
    requestAnimationFrame(update);
}

function dibujarPuntuacion() {

    ctx.font = '20px "Press Start 2P"';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'left';
    ctx.fillText('score: ' + puntuacion, 20, 30);
}

function dibujarExplosiones() {

    for (var i = 0; i < explosiones.length; i++) {

        if (explosiones[i].active) {

                ctx.drawImage(
                ImagenExplosion,
                explosiones[i].x,
                explosiones[i].y,
                LADRILLO.w,
                LADRILLO.h
            );
            
            explosiones[i].frame++;
            
            if (explosiones[i].frame > 10) {

                explosiones[i].active = false;
                explosiones.splice(i, 1);
                i--;
            }
        }
    }
}

function update(){

    var todosInvisibles = true;

    for (var i = 0; i < LADRILLO.F; i++) {

        for (var j = 0; j < LADRILLO.C; j++) {

            if (ladrillos[i][j].visible) {

                todosInvisibles = false;

                if (ladrillos[i][j].yl + LADRILLO.h >= canvas.height - 70) {
                    
                    gameOver = true;
                }
            }
        }
    }

    if (todosInvisibles && !victoria) {

        victoria = true;

        mostrarWIN();
        return;
    }
    
    if (gameOver) {
        mostrarGameOver();
        return;
    }


    ctx.clearRect(0, 0, canvas.width, canvas.height);

    iniciarMusica();
    
    moverJugador();

    dibujarJugador();

    moverLadrillos();

    dibujarLadrillos();

    //-- moverBalas() esta en moverJugador() 

    dibujarBalas();

    dibujarPuntuacion();

    dibujarExplosiones();

    requestAnimationFrame(update);

}

update();