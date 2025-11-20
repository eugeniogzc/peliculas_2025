// MODELO DE DATOS
let mis_peliculas_iniciales = [
   {titulo: "Superlópez",   director: "Javier Ruiz Caldera", "miniatura": "files/superlopez.png", id: 287947},
   {titulo: "Jurassic Park", director: "Steven Spielberg", "miniatura": "files/jurassicpark.png", id: 329},
   {titulo: "Interstellar",  director: "Christopher Nolan", "miniatura": "files/interstellar.png", id: 157336}
];

let mis_peliculas = [];
let mis_keywords = [];
let movie_keywords = {};

// VISTAS
const indexView = (peliculas, recommended_movies) => {
    let i = 0;
    let view = "";

    view += `<div class="actions">
                <button class="new">Añadir</button>
                <button class="reset">Reset</button>
                <button class="my-keywords">Mis Keywords</button>
                <button class="download">Descargar</button>
                <button class="search-btn">Buscar</button>
            </div>`;

    // Sección de Recomendaciones
    view += `<h2>Basado en tus Keywords</h2>`;
    if (recommended_movies.length > 0) {
        view += '<div class="movie-grid">';
        for (const movie of recommended_movies) {
            const movie_index = mis_peliculas.findIndex(p => p.id === movie.id);
            view += `
            <div class="movie">
               <div class="movie-img">
                    <img class="show" data-my-id="${movie_index}" src="${movie.miniatura}" onerror="this.src='files/placeholder.png'"/>
               </div>
               <div class="title">
                   ${movie.titulo || "<em>Sin título</em>"}
                   <small>(${movie.match_count} coincidencias)</small>
               </div>
               <div class="actions">
                   <button class="edit" data-my-id="${movie_index}">editar</button>
                   <button class="delete" data-my-id="${movie_index}">borrar</button>
                   <button class="keywords" data-my-id="${movie.id}">keywords</button>
                </div>
            </div>\n`;
        }
        view += '</div>';
    } else {
        view += `<p>Añade keywords a tu lista y visualiza las keywords de las películas para recibir recomendaciones.</p>`;
    }

    // Sección de Todas las Películas
    view += `<h2>Todas las Películas</h2>`;
    view += '<div class="movie-grid">';
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
               <button class="keywords" data-my-id="${peliculas[i].id}">keywords</button>
            </div>
        </div>\n`;
      i = i + 1;
    };
    view += '</div>';

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

const keywordsView = (movieId, keywords) => {
    let view = `<h2>Keywords</h2>`;
    view += `<div class="keywords-list">`;
    for (const keyword of keywords) {
        view += `<div class="keyword">
                    <span>${keyword.name}</span>
                    <button class="add-keyword" data-keyword="${keyword.name}">Agregar a mi lista</button>
                 </div>`;
    }
    view += `</div>`;
    view += `<div class="actions">
                <button class="index">Volver</button>
             </div>`;
    return view;
}

const myKeywordsView = () => {
    let view = `<h2>Mis Keywords</h2>`;
    view += `<div class="keywords-list">`;
    for (const keyword of mis_keywords) {
        view += `<div class="keyword">
                    <span>${keyword}</span>
                    <button class="remove-keyword" data-keyword="${keyword}">Eliminar</button>
                 </div>`;
    }
    view += `</div>`;
    view += `<div class="actions">
                <button class="index">Volver</button>
             </div>`;
    return view;
}

const searchView = () => {
    return `<h2>Buscar Película en TMDb</h2>
        <div class="field">
        Título <br>
        <input type="text" id="query" placeholder="Escribe el título...">
        </div>
        <div class="actions">
            <button class="do-search">Buscar</button>
            <button class="index">Volver</button>
        </div>`;
}

const resultsView = (results) => {
    let view = `<h2>Resultados de la Búsqueda</h2>`;
    if (results.length === 0) {
        view += `<p>No se encontraron resultados.</p>`;
    } else {
        view += '<div class="results-grid">';
        for (const result of results) {
            view += `
            <div class="movie">
               <div class="movie-img">
                    <img src="https://image.tmdb.org/t/p/w500${result.poster_path}" onerror="this.src='files/placeholder.png'"/>
               </div>
               <div class="title">
                   ${result.title} <br>
                   <small>${result.release_date}</small>
               </div>
               <div class="actions">
                   <button class="add-from-api" data-movie-id="${result.id}">Añadir</button>
                </div>
            </div>`;
        }
        view += '</div>';
    }
    view += `<div class="actions">
                <button class="index">Volver</button>
             </div>`;
    return view;
}


// CONTROLADORES 
const initContr = () => {
    if (!localStorage.getItem('mis_peliculas')) {
        localStorage.setItem('mis_peliculas', JSON.stringify(mis_peliculas_iniciales));
    }
    if (!localStorage.getItem('my_keywords')) {
        localStorage.setItem('my_keywords', JSON.stringify([]));
    }
    if (!localStorage.getItem('movie_keywords')) {
        localStorage.setItem('movie_keywords', JSON.stringify({}));
    }
    indexContr();
};

const indexContr = () => {
    mis_peliculas = JSON.parse(localStorage.getItem('mis_peliculas')) || [];
    mis_keywords = JSON.parse(localStorage.getItem('my_keywords')) || [];
    movie_keywords = JSON.parse(localStorage.getItem('movie_keywords')) || {};

    const recommended_movies = mis_peliculas.map(pelicula => {
        const keywords = movie_keywords[pelicula.id] || [];
        const match_count = keywords.reduce((count, keyword) => {
            return count + (mis_keywords.includes(keyword.name) ? 1 : 0);
        }, 0);
        return {...pelicula, match_count};
    })
    .filter(pelicula => pelicula.match_count > 0)
    .sort((a, b) => b.match_count - a.match_count);

    document.getElementById('main').innerHTML = indexView(mis_peliculas, recommended_movies);
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
        localStorage.setItem('movie_keywords', JSON.stringify({}));
        indexContr();
    }
};

const keywordsContr = (movieId) => {
    movie_keywords = JSON.parse(localStorage.getItem('movie_keywords')) || {};

    if (movie_keywords[movieId]) {
        document.getElementById('main').innerHTML = keywordsView(movieId, movie_keywords[movieId]);
    } else {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_KEY}`
            }
        };

        fetch(`https://api.themoviedb.org/3/movie/${movieId}/keywords`, options)
            .then(response => response.json())
            .then(response => {
                const keywords = processKeywords(response.keywords);
                movie_keywords[movieId] = keywords;
                localStorage.setItem('movie_keywords', JSON.stringify(movie_keywords));
                document.getElementById('main').innerHTML = keywordsView(movieId, keywords);
            })
            .catch(err => console.error(err));
    }
}

const downloadContr = () => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
        }
    };

    fetch('https://api.themoviedb.org/3/movie/popular', options)
        .then(response => response.json())
        .then(response => {
            const fetchPromises = response.results.map(p => {
                return fetch(`https://api.themoviedb.org/3/movie/${p.id}?append_to_response=credits`, options)
                    .then(res => res.json());
            });

            return Promise.all(fetchPromises);
        })
        .then(moviesWithDetails => {
            mis_peliculas = moviesWithDetails.map(movie => {
                const director = movie.credits.crew.find(person => person.job === 'Director');
                return {
                    id: movie.id,
                    titulo: movie.title,
                    director: director ? director.name : 'Desconocido',
                    miniatura: `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                };
            });
            localStorage.setItem('mis_peliculas', JSON.stringify(mis_peliculas));
            indexContr();
        })
        .catch(err => {
            console.error(err);
            alert("Error al descargar las películas. Comprueba la consola para más detalles.");
        });
};

const cleanKeyword = (keyword) => {
  return keyword
    .replace(/[^a-zñáéíóú0-9 ]+/igm, "")
    .trim()
    .toLowerCase();
};

const processKeywords = (keywords) => {
    return keywords.map(keyword => {
        keyword.name = cleanKeyword(keyword.name);
        return keyword;
    });
};

const addKeywordToList = (keyword) => {
    if (!mis_keywords.includes(keyword)) {
        mis_keywords.push(keyword);
        localStorage.setItem('my_keywords', JSON.stringify(mis_keywords));
    }
    myKeywordsContr();
}

const removeKeywordFromList = (keyword) => {
    mis_keywords = mis_keywords.filter(kw => kw !== keyword);
    localStorage.setItem('my_keywords', JSON.stringify(mis_keywords));
    myKeywordsContr();
}

const myKeywordsContr = () => {
    document.getElementById('main').innerHTML = myKeywordsView();
}

const searchContr = () => {
    const query = document.getElementById('query').value.trim();
    if (!query) {
        alert("Por favor, introduce un término de búsqueda.");
        return;
    }

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
        }
    };

    fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`, options)
        .then(response => response.json())
        .then(response => {
            document.getElementById('main').innerHTML = resultsView(response.results);
        })
        .catch(err => {
            console.error(err);
            alert("Error al realizar la búsqueda. Comprueba la consola para más detalles.");
        });
}

const addFromAPIContr = (movieId) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${API_KEY}`
        }
    };

    if (mis_peliculas.some(p => p.id == movieId)) {
        alert('Esta película ya está en tu lista.');
        return;
    }

    fetch(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits`, options)
        .then(response => response.json())
        .then(response => {
            const director = response.credits.crew.find(person => person.job === 'Director');

            const pelicula = {
                id: response.id,
                titulo: response.title,
                director: director ? director.name : 'Desconocido',
                miniatura: `https://image.tmdb.org/t/p/w500${response.poster_path}`
            };
            
            mis_peliculas.push(pelicula);
            localStorage.setItem('mis_peliculas', JSON.stringify(mis_peliculas));
            alert('Película añadida con éxito.');
            indexContr(); 
        })
        .catch(err => {
            console.error(err);
            alert("Error al añadir la película. Comprueba la consola para más detalles.");
        });
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
    else if (matchEvent(ev, '.keywords')) keywordsContr(ev.target.dataset.myId);
    else if (matchEvent(ev, '.add-keyword')) addKeywordToList(ev.target.dataset.keyword);
    else if (matchEvent(ev, '.remove-keyword')) removeKeywordFromList(ev.target.dataset.keyword);
    else if (matchEvent(ev, '.my-keywords')) myKeywordsContr();
    else if (matchEvent(ev, '.download')) downloadContr();
    else if (matchEvent(ev, '.search-btn')) document.getElementById('main').innerHTML = searchView();
    else if (matchEvent(ev, '.do-search')) searchContr();
    else if (matchEvent(ev, '.add-from-api')) addFromAPIContr(ev.target.dataset.movieId);
})


// Inicialización        
document.addEventListener('DOMContentLoaded', initContr);
