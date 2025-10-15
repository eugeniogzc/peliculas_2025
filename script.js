// MODELO DE DATOS

let mis_peliculas_iniciales = [
   {titulo: "Superlópez",   director: "Javier Ruiz Caldera", "miniatura": "files/superlopez.png"},
   {titulo: "Jurassic Park", director: "Steven Spielberg", "miniatura": "files/jurassicpark.png"},
   {titulo: "Interstellar",  director: "Christopher Nolan", "miniatura": "files/interstellar.png"}
];

let mis_peliculas = [];

// VISTAS

const indexView = (peliculas) => {
    let i=0;
    let view = "";

    while(i < peliculas.length) {
      view += `
        <div class="movie">
           <div class="movie-img">
                <img class="show" data-my-id="${i}" src="${peliculas[i].miniatura}" onerror="this.src='files/placeholder.png'"/>
           </div>
           <div class="title">
               ${peliculas[i].titulo || "<em>Sin título</em>"}
           </div>
           <div class="actions">
               <button class="edit" data-my-id="${i}">editar</button>
               <button class="delete" data-my-id="${i}">borrar</button>
            </div>
        </div>\n`;
      i = i + 1;
    };

    view += `<div class="actions">
                <button class="new">Añadir</button>
                <button class="reset">Reset</button>
            </div>`;

    return view;
}

const editView = (i, pelicula) => {
    return `<h2>Editar Película </h2>
        <div class="field">
        Título <br>
        <input  type="text" id="titulo" placeholder="Título" 
                value="${pelicula.titulo}">
        </div>
        <div class="field">
        Director <br>
        <input  type="text" id="director" placeholder="Director" 
                value="${pelicula.director}">
        </div>
        <div class="field">
        Miniatura <br>
        <input  type="text" id="miniatura" placeholder="URL de la miniatura" 
                value="${pelicula.miniatura}">
        </div>
        <div class="actions">
            <button class="update" data-my-id="${i}">
                Actualizar
            </button>
            <button class="index">
                Volver
            </button>
       `;
}

const showView = (pelicula) => {
    return `
     <h2>${pelicula.titulo}</h2>
     <p>
        <strong>Director:</strong> ${pelicula.director}
     </p>
     <div class="actions">
        <button class="index">Volver</button>
     </div>`;
}

const newView = () => {
    return `<h2>Crear Película</h2>
        <div class="field">
        Título <br>
        <input  type="text" id="titulo" placeholder="Título">
        </div>
        <div class="field">
        Director <br>
        <input  type="text" id="director" placeholder="Director">
        </div>
        <div class="field">
        Miniatura <br>
        <input  type="text" id="miniatura" placeholder="URL de la miniatura">
        </div>
        <div class="actions">
            <button class="create">Crear</button>
            <button class="index">Volver</button>
        </div>`;
}


// CONTROLADORES 

const initContr = () => {
    if (!localStorage.getItem('mis_peliculas')) {
        localStorage.setItem('mis_peliculas', JSON.stringify(mis_peliculas_iniciales));
    }
    indexContr();
};

const indexContr = () => {
    mis_peliculas = JSON.parse(localStorage.getItem('mis_peliculas')) || [];
    document.getElementById('main').innerHTML = indexView(mis_peliculas);
};

const showContr = (i) => {
    document.getElementById('main').innerHTML = showView(mis_peliculas[i]);
}

const newContr = () => {
    document.getElementById('main').innerHTML = newView();
}

const createContr = () => {
    const nueva_pelicula = {
        titulo: document.getElementById('titulo').value,
        director: document.getElementById('director').value,
        miniatura: document.getElementById('miniatura').value
    };
    mis_peliculas.push(nueva_pelicula);
    localStorage.setItem('mis_peliculas', JSON.stringify(mis_peliculas));
    indexContr();
};

const editContr = (i) => {
    document.getElementById('main').innerHTML = editView(i,  mis_peliculas[i]);
}

const updateContr = (i) => {
    mis_peliculas[i].titulo   = document.getElementById('titulo').value;
    mis_peliculas[i].director = document.getElementById('director').value;
    mis_peliculas[i].miniatura = document.getElementById('miniatura').value;
    localStorage.setItem('mis_peliculas', JSON.stringify(mis_peliculas));
    indexContr();
};

const deleteContr = (i) => {
    if (confirm(`¿Seguro que quieres borrar "${mis_peliculas[i].titulo}"?`)) {
        mis_peliculas.splice(i, 1);
        localStorage.setItem('mis_peliculas', JSON.stringify(mis_peliculas));
        indexContr();
    }
};

const resetContr = () => {
    if (confirm("¿Seguro que quieres reiniciar las películas?")) {
        localStorage.setItem('mis_peliculas', JSON.stringify(mis_peliculas_iniciales));
        indexContr();
    }
};

// ROUTER de eventos
const matchEvent = (ev, sel) => ev.target.matches(sel)
const myId = (ev) => Number(ev.target.dataset.myId)

document.addEventListener('click', ev => {
    if      (matchEvent(ev, '.index'))  indexContr  ();
    else if (matchEvent(ev, '.edit'))   editContr   (myId(ev));
    else if (matchEvent(ev, '.update')) updateContr (myId(ev));
    else if (matchEvent(ev, '.show'))   showContr   (myId(ev));
    else if (matchEvent(ev, '.new'))    newContr    ();
    else if (matchEvent(ev, '.create')) createContr ();
    else if (matchEvent(ev, '.delete')) deleteContr (myId(ev));
    else if (matchEvent(ev, '.reset'))  resetContr  ();
})


// Inicialización        
document.addEventListener('DOMContentLoaded', initContr);