// Variables de trabajo
const canvas = document.getElementById('networkCanvas');
const ctx = canvas.getContext('2d');

let redAleatoria;
let nodoOrigen = 0, nodoDestino = 0;
let rutaMinimaConRetardos;

const max = 5;
const min = 2;
const nodeRadius = 40;
const nodeConnect = 2;
const nodeRandomDelay = 1000;
const pipeRandomWeight = 100; // No hay retardo entre nodos 100

// Localizando elementos en el DOM
const btnCNet = document.getElementById("btnCNet");
const btnMinPath = document.getElementById("btnMinPath");

// Clase para representar un nodo en el grafo
class Nodo {

  constructor(id, x, y, delay) {
    this.id = id; // Identificador del nodo
    this.x = x; // Coordenada X del nodo
    this.y = y; // Coordenada Y del nodo
    this.delay = delay; // Retardo del nodo en milisegundos
    this.conexiones = []; // Array de conexiones a otros nodos
  }
  
  // Método para agregar una conexión desde este nodo a otro nodo con un peso dado
  conectar(nodo, peso) {
    this.conexiones.push({ nodo, peso });
  }

    // Método para saber si un nodo está en la lista de conexiones de otro
    isconnected(idn) {

        let isconnected = false;

        this.conexiones.forEach(({ nodo: conexion, peso }) => {      
            if (idn == conexion.id) {
            //console.log("id nodo conectado:" + conexion.id);
            isconnected = true;
            }      
        });
        
        return isconnected;
        }

    // Método para saber la distancia entre dos nodos
    node_distance(nx, ny) {

        var a = nx - this.x;
        var b = ny - this.y;
            
        return Math.floor(Math.sqrt( a*a + b*b ));
  }

    // Método para encontrar el nodo más alejado
    far_node( nodos ) {

        let distn = 0;
        let cnode = this.id;
        let distaux = 0;
        let pos = 0;
        let npos = 0;
    
        for (let nodo of nodos) {
          distaux = this.node_distance(nodo.x, nodo.y);
      
          if (distaux != 0 && distaux > distn) {
            distn = distaux;
            cnode = nodo.id;
            npos = pos;
          }
    
          pos += 1;
        }
      
        return {pos: npos, id: cnode, distance: distn,};
    
      }

    // Método para encontrar el nodo más cercano
  close_node( nodos ) {

    let far_node = this.far_node( nodos );
    let cnode = far_node.id;
    let distn = far_node.distance;
    let distaux = 0;
    let pos = 0;
    let npos = 0;    
  
    for (let nodo of nodos) {
      distaux = this.node_distance(nodo.x, nodo.y);
  
      if (distaux != 0 && distaux <= distn) {
        distn = distaux;
        cnode = nodo.id;
        npos = pos;
      }

      pos += 1;
    }
  
    return {pos:npos, id: cnode, distance: distn,}
  }
}
  
// Función para generar una red aleatoria con nodos en diferentes estados de congestión
function crearRedAleatoriaConCongestion(numNodos, numConexiones) {
  
  const nodos = [];
  let x = 0, y = 0, delay = 0;
  let nodoActual = 0, nodoAleatorio = 0, pickNode = 0, peso = 0;

  // Generamos los nodos
  const zonaAncho = canvas.width / numNodos; // Dividimos el canvas en 5 zonas

  for (let i = 0; i < numNodos; i++) {
    const zonaInicioX = i * zonaAncho;
    const zonaFinX = zonaInicioX + zonaAncho;
  
    x = randomNumber(zonaInicioX + nodeRadius, zonaFinX - nodeRadius);
    y = randomNumber(nodeRadius, canvas.height - nodeRadius);
    delay = generarRetardo();
  
    nodos.push(new Nodo(i, x, y, delay));
  }
  

  // Conectamos los nodos
  // Seleccionamos los nodos más cercanos teniendo en cuenta la distancia
  // Seleccionamos tantos nodos como indica la variable numConexiones
  // El nodo será candidato siempre que no estén ya conectados
  for (let nodo of nodos) {
    //console.log("id: " + nodo.id + " distancia al nodo: " + nodo.node_distance(nodos[0].x, nodos[0].y));
 
     const clonedArray = [...nodos];
 
     for (let j = 0; j < numConexiones; j++) {
       let close_node = nodo.close_node(clonedArray);
       //console.log(close_node);
 
       if (!nodo.isconnected(close_node.id) && !clonedArray[close_node.pos].isconnected(nodo.id)) {
         // Añadimos una nueva conexión
         // Con el nodo más cercano y la distancia a ese nodo como el peso de la conexión
         nodo.conectar(clonedArray[close_node.pos], close_node.distance);
       }
 
       // Eliminamos el nodo seleccionado del array clonado para evitar que 
       // vuelva a salir elegido con splice.
       // 0 - Inserta en la posición que le indicamos.
       // 1 - Remplaza el elemento, y como no le damos un nuevo elemento se queda vacío.      
       clonedArray.splice(close_node.pos, 1);
     }
 
   }

  return nodos;
}

// Función para generar un retardo aleatorio entre 0 y 1000 ms
function generarRetardo() {
  return Math.random() * nodeRandomDelay;
}

// Generar un número aleatorio dentro de un rango
function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

// Dibujar la red en el canvas
function drawNet(nnodes) {
    // Dibujamos las conexiones entre nodos
    nnodes.forEach(nodo => {
      nodo.conexiones.forEach(({ nodo: conexion, peso }) => {
        ctx.beginPath();
        ctx.moveTo(nodo.x, nodo.y);
        ctx.lineTo(conexion.x, conexion.y);
        ctx.stroke();
  
        ctx.font = '12px Arial';
        ctx.fillStyle = 'black';
        ctx.textAlign = 'center';
        pw = "N" + nodo.id + " pw " + peso;
        const midX = Math.floor((nodo.x + conexion.x)/2);
        const midY = Math.floor((nodo.y + conexion.y)/2);
        ctx.fillText(pw, midX, midY);  
  
      });
    });
  
    let nodoDesc; // Descripción del nodo
  
    // Dibujamos los nodos
    nnodes.forEach(nodo => {
      ctx.beginPath();
      ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fillStyle = 'blue';
      ctx.fill();
      ctx.stroke();
      ctx.font = '12px Arial';
      ctx.fillStyle = 'white';
      ctx.textAlign = 'center';
      nodoDesc = "N" + nodo.id + " delay " + Math.floor(nodo.delay);
      ctx.fillText(nodoDesc, nodo.x, nodo.y + 5);
    });
  }

let numNodos;
const nodos_contador = document.getElementById('nodeCount');
const tiempo_contador = document.getElementById('totalTime');
const ruta_optima = document.getElementById('optimalRute');
const mensaje = document.getElementById('mensaje');

// Función de calback para generar la red de manera aleatoria
btnCNet.onclick = () => {

    numNodos = Math.floor(Math.random() * (max - min + 1)) + min;
    console.log(numNodos)
    // Generar red de nodos con congestión creada de manera aleatoria redAleatoria
    // Cada nodo tendrá un delay aleatorio para simular el envío de paquetes de datos
    redAleatoria = crearRedAleatoriaConCongestion(numNodos, nodeConnect);

    // Limpiamos el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la red que hemos generado
    drawNet(redAleatoria);

    nodos_contador.textContent = numNodos;
    mensaje.textContent = 'Red generada correctamente';
    mensaje.font = '12px Arial';
    mensaje.fillStyle = 'white';
    mensaje.textAlign = 'center';
};


btnMinPath.onclick = () => {

    console.log(numNodos)

    // Supongamos que tienes una red de nodos llamada redAleatoria y tienes nodos origen y destino
    nodoOrigen = redAleatoria[0]; // Nodo de origen
    nodoDestino = redAleatoria[numNodos - 1]; // Nodo de destino

    // Calcular la ruta mínima entre el nodo origen y el nodo destino utilizando Dijkstra con retrasos
    rutaMinimaConRetardos = dijkstraConRetardos(redAleatoria, nodoOrigen, nodoDestino);
    console.log("Ruta mínima con retrasos:", rutaMinimaConRetardos);

    var lista_id = [];
    var lista_tiempo = [];

    for(let nodo of rutaMinimaConRetardos){
        lista_id.push(nodo.id)
        lista_tiempo.push(nodo.delay)
    };

    rutaMinimaConRetardos.forEach(nodo => {
        ctx.beginPath();
        ctx.arc(nodo.x, nodo.y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = 'green';
        ctx.fill();
        ctx.stroke();
        ctx.font = '12px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        nodoDesc = "N" + nodo.id + " delay " + Math.floor(nodo.delay);
        ctx.fillText(nodoDesc, nodo.x, nodo.y + 5);
    });

    tiempo_contador.textContent = lista_tiempo.reduce((a, b) => a + b, 0) + ' ms';
    ruta_optima.textContent = lista_id.join('  >  ');
    mensaje.textContent = 'Ruta calculada correctamente';
    mensaje.font = '12px Arial';
    mensaje.fillStyle = 'white';
    mensaje.textAlign = 'center';

};

