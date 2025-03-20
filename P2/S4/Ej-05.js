//-- Tenemos acceso al documento html mediante  
//-- el objeto document

//-- Leer el párrafo identificado como test
const test = document.getElementById('test')

//-- Mostrar en la consola el contenido del párrafo
//-- (es la propiedad innerHTML)
console.log("Párrafo test leído. Dice:")
console.log(test.innerHTML)

//-- Identificamos el texto con la id del html y la printeamos con el comando inner