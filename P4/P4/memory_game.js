var selectors = {
    gridContainer: document.querySelector('.grid-container'),
    tablero: document.querySelector('.tablero'),
    movimientos: document.querySelector('.movimientos'),
    timer: document.querySelector('.timer'),
    comenzar: document.querySelector('button'),
    win: document.querySelector('.win')
};

var state = {
    reset: false,
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
};

var generateGame = () => {

    var dimensions = selectors.tablero.getAttribute('grid-dimension');

    //-- Nos aseguramos de que el número de dimensiones es par
    // y si es impar lanzamos un error
    if (dimensions % 2 !== 0) {
        throw new Error("Las dimensiones del tablero deben ser un número par.");
    }

    //-- Creamos un array con los emojis que vamos a utilizar en nuestro juego
    var emojis = ['🐒', '🦧', '🐵', '🙈', '🦍', '🖕', '✌️', '👍', '✋', '🤟', '🍌', '🙉', '🙊', '🟫',
                    '🙋‍♀️', '👩‍🦲', '🎅', '🧙'];
    
    //-- Elegimos un subconjunto de emojis al azar, así cada vez que comienza el juego
    // es diferente.
    // Es decir, si tenemos un array con 10 emojis, vamos a elegir el cuadrado de las
    // dimensiones entre dos, para asegurarnos de que cubrimos todas las cartas
    var picks = pickRandom(emojis, (dimensions * dimensions) / 2) ;

    //-- Después descolocamos las posiciones para asegurarnos de que las parejas de cartas
    // están desordenadas.
    var items = shuffle([...picks, ...picks]);
    
    //-- Vamos a utilizar una función de mapeo para generar 
    //  todas las cartas en función de las dimensiones
    var cards = `
        <div class="tablero" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `;
    
    //-- Vamos a utilizar un parser para transformar la cadena que hemos generado
    // en código html.
    var parser = new DOMParser().parseFromString(cards, 'text/html');

    //-- Por último, vamos a inyectar el código html que hemos generado dentro de el contenedor
    // para el tablero de juego.
    selectors.tablero.innerHTML = parser.querySelector('.tablero').innerHTML;
    selectors.tablero.style.gridTemplateColumns = `repeat(${dimensions}, auto)`;
    };

var pickRandom = (array, items) => {
    // La sintaxis de tres puntos nos sirve para hacer una copia del array
     var clonedArray = [...array];
    // Random picks va almacenar la selección al azar de emojis
    var randomPicks = [] ;

    for (let index = 0; index < items; index++) {
        var randomIndex = Math.floor(Math.random() * clonedArray.length);
        // Utilizamos el índice generado al azar entre los elementos del array clonado
        // para seleccionar un emoji y añadirlo al array de randompicks.
        randomPicks.push(clonedArray[randomIndex]);
        // Eliminamos el emoji seleccionado del array clonado para evitar que 
        // vuelva a salir elegido con splice.
        // 0 - Inserta en la posición que le indicamos.
        // 1 - Remplaza el elemento, y como no le damos un nuevo elemento se queda vacío.
        clonedArray.splice(randomIndex, 1);
    }

    return randomPicks;
};

var shuffle = array => {
    var clonedArray = [...array];

    // Intercambiamos las posiciones de los emojis al azar para desorganizar el array
    // así nos aseguramos de que las parejas de emojis no están consecutivas.
    // Para conseguirlo utilizamos un algoritmo clásico de intercambio y nos apoyamos
    // en una variable auxiliar.
    for (let index = clonedArray.length - 1; index > 0; index--) {
        var randomIndex = Math.floor(Math.random() * (index + 1));
        var original = clonedArray[index];

        clonedArray[index] = clonedArray[randomIndex];
        clonedArray[randomIndex] = original;
    }

    return clonedArray;
};

var attachEventListeners = () => {
    document.addEventListener('click', event => {
        // Del evento disparado vamos a obtener alguna información útil
        // Como el elemento que ha disparado el evento y el contenedor que lo contiene
        var eventTarget = event.target;
        var eventParent = eventTarget.parentElement;

        // Cuando se trata de una carta que no está girada, le damos la vuelta para mostrarla
        if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
            flipCard(eventParent);
        // Pero si lo que ha pasado es un clic en el botón de comenzar lo que hacemos es
        // empezar el juego
        } else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
            startGame();
        }
    });
    
};

document.addEventListener('DOMContentLoaded', () => {
    var menu = document.querySelector('.menu-inicial');
    var juego = document.querySelector('.game');
    var iniciarBtn = document.getElementById('btn-iniciar-juego');
    var selectTamaño = document.getElementById('tamano-tablero');
    var reiniciarBtn = document.getElementById('btn-reiniciar');

    iniciarBtn.addEventListener('click', () => {
        var dimension = selectTamaño.value;
        selectors.tablero.setAttribute('grid-dimension', dimension);
        generateGame();
        attachEventListeners();
        menu.style.display = 'none';
        juego.style.display = 'block';

    });

    reiniciarBtn.addEventListener('click', () => {
        reiniciarJuego();
    });

});

var startGame = () => {
    
    clearInterval(state.loop);

    // Iniciamos el estado de juego
    state.gameStarted = true;
    // Desactivamos el botón de comenzar
    selectors.comenzar.classList.add('disabled');

    // Comenzamos el bucle de juego
    // Cada segundo vamos actualizando el display de tiempo transcurrido
    // y movimientos
    state.loop = setInterval(() => {
        state.totalTime++
        selectors.movimientos.innerText = `${state.totalFlips} movimientos`;
        selectors.timer.innerText = `tiempo: ${state.totalTime} sec`;
    }, 1000);
};

function reiniciarJuego() {
    state.reset = true;
    clearInterval(state.loop);
    state.gameStarted = false;
    state.flippedCards = 0;
    state.totalFlips = 0;
    state.totalTime = 0;

    selectors.movimientos.innerText = `0 movimientos`;
    selectors.timer.innerText = `tiempo: 0 sec`;
    selectors.gridContainer.classList.remove('flipped');
    selectors.comenzar.classList.remove('disabled');
    selectors.win.innerHTML = '¡Has Ganado!';

    flipBackCards(); 

    // Regenerar tablero
    var dimension = selectors.tablero.getAttribute('grid-dimension');
    selectors.tablero.setAttribute('grid-dimension', dimension);
    generateGame();
    attachEventListeners();
}

var flipBackCards = () => {
    // Seleccionamos las cartas que no han sido emparejadas
    // y quitamos la clase de giro
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped');
    });
    // Ponemos el contado de parejas de cartas a cero
    state.flippedCards = 0;
};

var flipCard = card => {
    // Sumamos uno al contador de cartas giradas
    state.flippedCards++;
    

    // Si el juego no estaba iniciado, lo iniciamos
    if (!state.gameStarted) {
        startGame();
    }

    // Si no tenemos la pareja de cartas girada
    // Giramos la carta añadiendo la clase correspondiente
    if (state.flippedCards <= 2) {
        card.classList.add('flipped');
    }

    // Si ya tenemos una pareja de cartas girada tenemos que comprobar
    if (state.flippedCards === 2) {
        // Sumamos uno al contador general de movimientos
        state.totalFlips++;
        // Seleccionamos las cartas que están giradas
        // y descartamos las que están emparejadas
        var flippedCards = document.querySelectorAll('.flipped:not(.matched)');

        // Si las cartas coinciden las marcamos como pareja 
        // añadiendo la clase correspondiente
        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched');
            flippedCards[1].classList.add('matched');
        }

        console.log(flippedCards[0].innerText);
        console.log(flippedCards[1].innerText);


        // Arrancamos un temporizador que comprobará si tiene
        // que volver a girar las cartas porque no hemos acertado
        // o las deja giradas porque ha sido un match
        // y para eso llamamos a la función flipBackCards()
        setTimeout(() => {
            flipBackCards();
        }, 1000);
    }

    // Antes de terminar, comprobamos si quedan cartas por girar
    // porque cuando no quedan cartas por girar hemos ganado
    // y se lo tenemos que mostrar al jugador
    if (!document.querySelectorAll('.card:not(.flipped)').length) {
        setTimeout(() => {
            // Le damos la vuelta al tablero
            selectors.gridContainer.classList.add('flipped');
            // Le mostramos las estadísticas del juego
            selectors.win.innerHTML = `
                <span class="win-text">
                    ¡Has ganado!<br />
                    con <span class="highlight">${state.totalFlips}</span> movimientos<br />
                    en un tiempo de <span class="highlight">${state.totalTime}</span> segundos
                </span>

            `;
            // Paramos el loop porque el juego ha terminado
            clearInterval(state.loop);
        }, 1000);
    }
};