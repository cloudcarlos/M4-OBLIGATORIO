window.onload = async () => {
    
    const personajes = await obtenerPersonajes()
    //console.log(personajes) 
    generadorCard = genCard(personajes)
    generadorCard.next();
    
    const selectores = document.querySelectorAll(".selector-personajes p")
    
    selectores.forEach( (selector) => {
        selector.addEventListener("mouseover", (evento) => manejadorMouseOut(evento))
    })
}

/**
 * crearCard
 * - recibe los datos de un personaje
 * - crea el card usando createElement
 * - retorna el card con toda la informacion 
*/
const crearCard = (data) => {
    
    const card = document.createElement('div');
    card.classList.add('card', 'card-personajes', 'p-0')

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body', "text-center");

    const title = document.createElement('h5');
    title.classList.add('card-title');
    title.textContent = data.name;

    const p = document.createElement('p');
    p.classList.add('card-text');

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'list-group-flush');

    const li1 = document.createElement('li');
    li1.classList.add('list-group-item');
    li1.textContent = `Estatura: `;

    const li2 = document.createElement('li');
    li2.classList.add('list-group-item');
    li2.textContent = `Peso: `;

    const span1 = document.createElement("span");
    //span1.classList.add('badge', 'badge-primary');
    span1.textContent = data.height;

    const span2 = document.createElement("span");
    span2.textContent = data.mass;

    //append
    li2.appendChild(span2)
    li1.appendChild(span1)
    ul.append(li1, li2)
    p.append(ul)
    cardBody.append(title, p)
    card.appendChild(cardBody)

    return card
}

/**
 * funcion* genCard
 * - row1, row2, row3 controla qué posicion dentro del map de personajes se tiene que renderizar
 * - evalúa si el row del cual se está llamando gen corresponde a row1, row2 o row3
 * - llama a crearCard( personaje )
 * - renderiza el contenido en el row correcto
 * 
 *  
*/

function* genCard(personajes) {
    let row1 = 1
    let row2 = 6
    let row3 = 12

    while (true) {
        let texto = yield
        let id = 0;
        let contenedor = "";
        let card = "";

        if (texto === "principales" && row1 <= 5 ) {
            id = row1;
            contenedor = texto;
            row1++;
        }
        else if (texto === "secundarios" && row2 <=11 ) {
            id = row2;
            contenedor = texto;
            row2++
        }
        else if (texto === "otros" && row3 <= 17) {
            id = row3;
            contenedor = texto;
            row3++
        }

        try {
            let personaje = personajes.get(id)
            card = crearCard( personaje )
            let contenedorElement = document.getElementById(`contenedor-${contenedor}`);
            contenedorElement.appendChild(card)
        } catch (error) {
            console.error(`error en el generador ::: ${error}`)
        }
    }
}

/**
 * obtenerPersonajes()
 * funcion async con la siguiente metodología
 * - genera todos las url de los 17 personajes
 * - recibe con await todas las promesas de las 17 conexiones a la api 
 * - crea el objeto Map() personajes, para almacenar los datos de las 17 api
 * - recorre todas las promesas para ir guardando la data dentro de map de forma correcta
 * - retorna un objeto Map con todos los personajes. 
*/

async function obtenerPersonajes() {
    try{
        const urls = []
        for( let i = 1; i <= 17; i++){
            const url = `https://swapi.dev/api/people/${i}/`; 
            urls.push(url);
        }
        const respuestas = await Promise.all( urls.map( url=> fetch(url) )  )
        const personajes= new Map();
        let i = 1
        respuestas.forEach( async respuesta => {
            const personaje = await respuesta.json()
            const {name,height,mass} = personaje
            console.log("guardando:: "+i)
            //este ternario controla si el json trae o no datos. Si no trae nada crea un objeto con datos alternativos para almacenar, y no estropear el map
            !(name,height,mass) ? personajes.set(i,{"name":"Sin datos","height":"0","mass":"0"}) : personajes.set(i,{name,height,mass})
            i++
        })
        return personajes
    } catch{
        console.log('Personaje no encontrado')
    }
}

/**
 * manejadorMouseOut()
 * contiene todas las instrucciones que se ejecutan despues de pasar el mouse sobre los selectores
 * - selecciona el id del elemento padre (row) para saber qué row seleccionar para renderizar 
 * - envio del id del row para renderizar las card dentro del row
 */
let generadorCard; 

function manejadorMouseOut (evento) {
    evento.preventDefault();
    const rowId = evento.target.parentElement.parentElement.id;
    generadorCard.next(rowId)
}
