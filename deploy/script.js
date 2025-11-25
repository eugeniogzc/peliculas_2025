
// MODELO DE DATOS
let mis_peliculas_iniciales = [
   {titulo: "Superlópez",   director: "Javier Ruiz Caldera", "miniatura": "files/superlopez.png", id: 287947},
   {titulo: "Jurassic Park", director: "Steven Spielberg", "miniatura": "files/jurassicpark.png", id: 329},
   {titulo: "Interstellar",  director: "Christopher Nolan", "miniatura": "files/interstellar.png", id: 157336}
];

let mis_peliculas = [];
let mis_keywords = [];
let movie_keywords = {};

const getFavorites = () => JSON.parse(localStorage.getItem('favorites')) || [];
const saveFavorites = (favorites) => localStorage.setItem('favorites', JSON.stringify(favorites));
const isFavorite = (movieId) => getFavorites().some(movie => movie.id === movieId);

const toggleFavorite = (movie) => {
    let favorites = getFavorites();
    if (isFavorite(movie.id)) {
        favorites = favorites.filter(fav => fav.id !== movie.id);
    } else {
        favorites.push(movie);
    }
    saveFavorites(favorites);
};


// VISTAS
const indexView = (peliculas, recommended_movies) => {
    let view = `
        <h1>Mis Películas</h1>
        <div class="actions">
            <a href="#edit" class="button new">Añadir</a>
            <button class="reset">Reset</button>
            <a href="#my-keywords" class="button my-keywords">Mis Keywords</a>
            <button class="download">Descargar</button>
            <a href="#search" class="button search-btn">Buscar</a>
            <a href="#favorites" class="button favorites">Favoritos</a>
        </div>
    `;

    // Sección de Recomendaciones
    view += `<h2>Basado en tus Keywords</h2>`;
    if (recommended_movies.length > 0) {
        view += '<div class="movie-grid">';
        for (const movie of recommended_movies) {
            const movie_index = mis_peliculas.findIndex(p => p.id === movie.id);
            view += `
            <div class="movie">
               <div class="movie-img">
                    <a href="#detail/${movie_index}"><img src="${movie.miniatura}" onerror="this.src='files/placeholder.png'"/></a>
               </div>
               <div class="title">
                   ${movie.titulo || "<em>Sin título</em>"}
                   <small>(${movie.match_count} coincidencias)</small>
               </div>
               <div class="actions">
                    <button class="toggle-favorite" data-movie-id="${movie.id}">${isFavorite(movie.id) ? 'Quitar Fav' : 'Añadir Fav'}</button>
                    <a href="#edit/${movie_index}" class="button edit">editar</a>
                    <button class="delete" data-my-id="${movie_index}">borrar</button>
                    <a href="#keywords/${movie.id}" class="button keywords">keywords</a>
                </div>
            </div>`;
        }
        view += '</div>';
    } else {
        view += `<p>Añade keywords a tu lista y visualiza las keywords de las películas para recibir recomendaciones.</p>`;
    }

    // Sección de Todas las Películas
    view += `<h2>Todas las Películas</h2>`;
    view += '<div class="movie-grid">';
    let i = 0;
    while(i < peliculas.length) {
      view += `
        <div class="movie">
           <div class="movie-img">
                <a href="#detail/${i}"><img src="${peliculas[i].miniatura}" onerror="this.src='files/placeholder.png'"/></a>
           </div>
           <div class="title">
               ${peliculas[i].titulo || "<em>Sin título</em>"}
           </div>
           <div class="actions">
                <button class="toggle-favorite" data-movie-id="${peliculas[i].id}">${isFavorite(peliculas[i].id) ? 'Quitar Fav' : 'Añadir Fav'}</button>
                <a href="#edit/${i}" class="button edit">editar</a>
                <button class="delete" data-my-id="${i}">borrar</button>
                <a href="#keywords/${peliculas[i].id}" class="button keywords">keywords</a>
            </div>
        </div>`;
      i = i + 1;
    };
    view += '</div>';

    return view;
}

const editView = (i, pelicula) => {
    const isNew = i === undefined;
    const movie_title = isNew ? '' : pelicula.titulo;
    const movie_director = isNew ? '' : pelicula.director;
    const movie_miniatura = isNew ? '' : pelicula.miniatura;
    const button_label = isNew ? 'Crear' : 'Actualizar';
    const action_class = isNew ? 'create' : 'update';
    const data_id = isNew ? '' : `data-my-id="${i}"`;

    return `<h2>${isNew ? 'Crear' : 'Editar'} Película</h2>
        <div class="field">
        Título <br>
        <input  type="text" id="titulo" placeholder="Título" value="${movie_title}">
        </div>
        <div class="field">
        Director <br>
        <input  type="text" id="director" placeholder="Director" value="${movie_director}">
        </div>
        <div class="field">
        Miniatura <br>
        <input  type="text" id="miniatura" placeholder="URL de la miniatura" value="${movie_miniatura}">
        </div>
        <div class="actions">
            <button class="${action_class}" ${data_id}>${button_label}</button>
            <a href="#main" class="button index">Volver</a>
        </div>`;
}

const showView = (pelicula) => {
    if (!pelicula) {
        return `
            <h2 class="anime-fade-in">Error: Película no encontrada</h2>
            <p class="anime-fade-in">La película que buscas no está en la lista. Puede que haya sido eliminada o que el enlace sea incorrecto.</p>
            <div class="actions anime-fade-in">
                <a href="#main" class="button index">Volver a la lista</a>
            </div>
        `;
    }

    const title = pelicula.titulo || '<em>Título no disponible</em>';
    const director = pelicula.director || '<em>Director no disponible</em>';
    const poster = pelicula.miniatura || 'files/placeholder.png';

    return `
     <div class="detail-container anime-fade-in">
        <div class="detail-poster">
            <img src="${poster}" onerror="this.src='files/placeholder.png'"/>
        </div>
        <div class="detail-info">
            <h2>${title}</h2>
            <p><strong>Director:</strong> ${director}</p>
            <div class="actions">
                <button class="toggle-favorite" data-movie-id="${pelicula.id}">${isFavorite(pelicula.id) ? 'Quitar Fav' : 'Añadir Fav'}</button>
                <a href="#main" class="button index">Volver</a>
            </div>
        </div>
     </div>
    `;
}

const keywordsView = (movieId, keywords) => {
    let view = `<h2>Keywords</h2>`;
    view += `<div class="keywords-list">`;
    for (const keyword of keywords) {
        view += `<div class="keyword anime-fade-in">
                    <span>${keyword.name}</span>
                    <button class="add-keyword" data-keyword="${keyword.name}">Agregar a mi lista</button>
                 </div>`;
    }
    view += `</div>`;
    view += `<div class="actions">
                <a href="#main" class="button index">Volver</a>
             </div>`;
    return view;
}

const myKeywordsView = () => {
    let view = `<h2>Mis Keywords</h2>`;
    view += `<div class="keywords-list">`;
    for (const keyword of mis_keywords) {
        view += `<div class="keyword anime-fade-in">
                    <span>${keyword}</span>
                    <button class="remove-keyword" data-keyword="${keyword}">Eliminar</button>
                 </div>`;
    }
    view += `</div>`;
    view += `<div class="actions">
                <a href="#main" class="button index">Volver</a>
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
            <a href="#main" class="button index">Volver</a>
        </div>
        <div id="results-container"></div>
        `;
}

const resultsView = (results) => {
    let view = `<h2>Resultados de la Búsqueda</h2>`;
    if (results.length === 0) {
        view += `<p>No se encontraron resultados.</p>`;
    } else {
        view += '<div class="results-grid">';
        for (const result of results) {
            view += `
            <div class="movie anime-fade-in">
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
    return view;
}

const favoritesView = () => {
    const favorites = getFavorites();
    let view = `<h2>Mis Películas Favoritas</h2>`;

    if (favorites.length === 0) {
        view += `<p>Aún no has añadido ninguna película a tus favoritos.</p>`;
    } else {
        view += '<div class="movie-grid">';
        for (const movie of favorites) {
            const movie_index = mis_peliculas.findIndex(p => p.id === movie.id);
            view += `
            <div class="movie">
               <div class="movie-img">
                    <a href="#detail/${movie_index}"><img src="${movie.miniatura}" onerror="this.src='files/placeholder.png'"/></a>
               </div>
               <div class="title">
                   ${movie.titulo || "<em>Sin título</em>"}
               </div>
               <div class="actions">
                    <button class="toggle-favorite" data-movie-id="${movie.id}">${isFavorite(movie.id) ? 'Quitar Fav' : 'Añadir Fav'}</button>
                    <a href="#edit/${movie_index}" class="button edit">editar</a>
                    <button class="delete" data-my-id="${movie_index}">borrar</button>
                    <a href="#keywords/${movie.id}" class="button keywords">keywords</a>
                </div>
            </div>`;
        }
        view += '</div>';
    }
    view += `<div class="actions">
                <a href="#main" class="button index">Volver</a>
             </div>`;
    return view;
}

const animateElements = (selector) => {
    const elements = document.querySelectorAll(selector);
    if(elements.length > 0) {
        anime({
            targets: selector,
            opacity: [0, 1],
            translateY: [20, 0],
            delay: anime.stagger(100)
        });
    }
}


// CONTROLADORES 
const initContr = () => {
    if (localStorage.getItem('mis_peliculas')) {
        mis_peliculas = JSON.parse(localStorage.getItem('mis_peliculas'));
    } else {
        localStorage.setItem('mis_peliculas', JSON.stringify(mis_peliculas_iniciales));
        mis_peliculas = mis_peliculas_iniciales;
    }

    if (localStorage.getItem('my_keywords')) {
        mis_keywords = JSON.parse(localStorage.getItem('my_keywords'));
    } else {
        localStorage.setItem('my_keywords', JSON.stringify([]));
    }

    if (localStorage.getItem('movie_keywords')) {
        movie_keywords = JSON.parse(localStorage.getItem('movie_keywords'));
    } else {
        localStorage.setItem('movie_keywords', JSON.stringify({}));
    }

    if (!localStorage.getItem('favorites')) {
        localStorage.setItem('favorites', JSON.stringify([]));
    }
    
    initializeRouter();
};

const indexContr = () => {
    const recommended_movies = mis_peliculas.map(pelicula => {
        const keywords = movie_keywords[pelicula.id] || [];
        const match_count = keywords.reduce((count, keyword) => {
            return count + (mis_keywords.includes(keyword.name) ? 1 : 0);
        }, 0);
        return {...pelicula, match_count};
    })
    .filter(pelicula => pelicula.match_count > 0)
    .sort((a, b) => b.match_count - a.match_count);

    document.getElementById('main-view').innerHTML = indexView(mis_peliculas, recommended_movies);
    animateElements('#main-view .movie');
};

const showContr = (i) => {
    if (typeof i !== 'number' || i < 0 || i >= mis_peliculas.length) {
        document.getElementById('detail-view').innerHTML = showView(null);
    } else {
        document.getElementById('detail-view').innerHTML = showView(mis_peliculas[i]);
    }
    animateElements('#detail-view > *');
}

const editContr = (i) => {
    document.getElementById('edit-view').innerHTML = editView(i, mis_peliculas[i]);
}

const createContr = () => {
    const id = Date.now();
    const nueva_pelicula = {
        id: id,
        titulo: document.getElementById('titulo').value,
        director: document.getElementById('director').value,
        miniatura: document.getElementById('miniatura').value
    };
    mis_peliculas.push(nueva_pelicula);
    localStorage.setItem('mis_peliculas', JSON.stringify(mis_peliculas));
    window.location.hash = '#main';
};

const updateContr = (i) => {
    mis_peliculas[i].titulo   = document.getElementById('titulo').value;
    mis_peliculas[i].director = document.getElementById('director').value;
    mis_peliculas[i].miniatura = document.getElementById('miniatura').value;
    localStorage.setItem('mis_peliculas', JSON.stringify(mis_peliculas));
    window.location.hash = '#main';
};

const deleteContr = (i) => {
    if (confirm(`¿Seguro que quieres borrar "${mis_peliculas[i].titulo}"?`)) {
        mis_peliculas.splice(i, 1);
        localStorage.setItem('mis_peliculas', JSON.stringify(mis_peliculas));
        window.location.hash = '#main';
    }
};

const resetContr = () => {
    if (confirm("¿Seguro que quieres reiniciar las películas?")) {
        localStorage.setItem('mis_peliculas', JSON.stringify(mis_peliculas_iniciales));
        localStorage.setItem('movie_keywords', JSON.stringify({}));
        localStorage.setItem('my_keywords', JSON.stringify([]));
        localStorage.setItem('favorites', JSON.stringify([]));
        window.location.reload();
    }
};

const keywordsContr = (movieId) => {
    if (movie_keywords[movieId]) {
        document.getElementById('keywords-view').innerHTML = keywordsView(movieId, movie_keywords[movieId]);
        animateElements('#keywords-view .keyword');
    } else {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/keywords?api_key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                const keywords = (data.keywords || []).map(kw => ({...kw, name: kw.name.toLowerCase()}));
                movie_keywords[movieId] = keywords;
                localStorage.setItem('movie_keywords', JSON.stringify(movie_keywords));
                document.getElementById('keywords-view').innerHTML = keywordsView(movieId, keywords);
                animateElements('#keywords-view .keyword');
            })
            .catch(err => console.error(err));
    }
}

const downloadContr = () => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`)
        .then(response => response.json())
        .then(response => {
            const fetchPromises = response.results.map(p => {
                return fetch(`https://api.themoviedb.org/3/movie/${p.id}?append_to_response=credits&api_key=${API_KEY}`)
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
    document.getElementById('my-keywords-view').innerHTML = myKeywordsView();
    animateElements('#my-keywords-view .keyword');
}

const searchContr = () => {
    document.getElementById('search-view').innerHTML = searchView();
    const searchButton = document.querySelector('#search-view .do-search');
    searchButton.addEventListener('click', () => {
        const query = document.getElementById('query').value.trim();
        if (!query) {
            alert("Por favor, introduce un término de búsqueda.");
            return;
        }

        fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&api_key=${API_KEY}`)
            .then(response => response.json())
            .then(response => {
                document.getElementById('results-container').innerHTML = resultsView(response.results);
                animateElements('#results-container .movie');
            })
            .catch(err => {
                console.error(err);
                alert("Error al realizar la búsqueda. Comprueba la consola para más detalles.");
            });
    });
}

const addFromAPIContr = (movieId) => {
    if (mis_peliculas.some(p => p.id == movieId)) {
        alert('Esta película ya está en tu lista.');
        return;
    }

    fetch(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits&api_key=${API_KEY}`)
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
            window.location.hash = '#main';
        })
        .catch(err => {
            console.error(err);
            alert("Error al añadir la película. Comprueba la consola para más detalles.");
        });
};

const favoritesContr = () => {
    document.getElementById('favorites-view').innerHTML = favoritesView();
    animateElements('#favorites-view .movie');
    makeFavoritesDraggable();
    makeDropzone(); 
}


// ROUTER de eventos
const matchEvent = (ev, sel) => ev.target.matches(sel);
const myId = (ev) => Number(ev.target.dataset.myId);

document.addEventListener('click', ev => {
    if      (matchEvent(ev, '.update')) updateContr(myId(ev));
    else if (matchEvent(ev, '.create')) createContr();
    else if (matchEvent(ev, '.delete')) deleteContr(myId(ev));
    else if (matchEvent(ev, '.reset'))  resetContr();
    else if (matchEvent(ev, '.add-keyword')) addKeywordToList(ev.target.dataset.keyword);
    else if (matchEvent(ev, '.remove-keyword')) removeKeywordFromList(ev.target.dataset.keyword);
    else if (matchEvent(ev, '.download')) downloadContr();
    else if (matchEvent(ev, '.add-from-api')) addFromAPIContr(ev.target.dataset.movieId);
    else if (matchEvent(ev, '.toggle-favorite')) {
        const movieId = Number(ev.target.dataset.movieId);
        const movie_index = mis_peliculas.findIndex(p => p.id === movieId);
        const movie_in_favs = getFavorites().find(p => p.id === movieId);
        const movie = movie_index !== -1 ? mis_peliculas[movie_index] : movie_in_favs;

        if (movie) {
            toggleFavorite(movie);
            
            const current_view_name = window.location.hash.substring(1) || 'main';
            const [view, param] = current_view_name.split('/');

            if (view === 'main' || view === '') {
                indexContr();
            } else if (view === 'favorites') {
                favoritesContr();
            } else if (view === 'detail') {
                showContr(Number(param));
            }
        }
    }
});


// Inicialización        
document.addEventListener('DOMContentLoaded', initContr);
