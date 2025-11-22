
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

    view += `
        <div class="actions">
            <a href="#edit-view" class="new">Añadir</a>
            <button class="reset">Reset</button>
            <a href="#favorites-view" class="my-keywords">Mis Keywords</a>
            <button class="download">Descargar</button>
            <a href="#search-view" class="search-btn">Buscar</a>
            <a href="#favorites-view" class="favorites">Favoritos</a>
        </div>
    `;

    // Sección de Recomendaciones
    view += `<h2>Basado en tus Keywords</h2>`;
    if (recommended_movies.length > 0) {
        view += '<div class="swiper-container"><div class="swiper-wrapper">';
        for (const movie of recommended_movies) {
            const movie_index = mis_peliculas.findIndex(p => p.id === movie.id);
            view += `
            <div class="swiper-slide movie">
               <div class="movie-img">
                    <a href="#detail-view" class="show" data-my-id="${movie_index}"><img src="${movie.miniatura}" onerror="this.src='files/placeholder.png'"/></a>
               </div>
               <div class="title">
                   ${movie.titulo || "<em>Sin título</em>"}
                   <small>(${movie.match_count} coincidencias)</small>
               </div>
               <div class="actions">
                    <button class="toggle-favorite" data-movie-id="${movie.id}">${isFavorite(movie.id) ? 'Quitar Fav' : 'Añadir Fav'}</button>
                    <a href="#edit-view" class="edit" data-my-id="${movie_index}">editar</a>
                    <button class="delete" data-my-id="${movie_index}">borrar</button>
                    <a href="#keywords-view" class="keywords" data-my-id="${movie.id}">keywords</a>
                </div>
            </div>\n`;
        }
        view += '</div></div>';
    } else {
        view += `<p>Añade keywords a tu lista y visualiza las keywords de las películas para recibir recomendaciones.</p>`;
    }

    // Sección de Todas las Películas
    view += `<h2>Todas las Películas</h2>`;
    view += '<div class="swiper-container"><div class="swiper-wrapper">';
    while(i < peliculas.length) {
      view += `
        <div class="swiper-slide movie">
           <div class="movie-img">
                <a href="#detail-view" class="show" data-my-id="${i}"><img src="${peliculas[i].miniatura}" onerror="this.src='files/placeholder.png'"/></a>
           </div>
           <div class="title">
               ${peliculas[i].titulo || "<em>Sin título</em>"}
           </div>
           <div class="actions">
                <button class="toggle-favorite" data-movie-id="${peliculas[i].id}">${isFavorite(peliculas[i].id) ? 'Quitar Fav' : 'Añadir Fav'}</button>
                <a href="#edit-view" class="edit" data-my-id="${i}">editar</a>
                <button class="delete" data-my-id="${i}">borrar</button>
                <a href="#keywords-view" class="keywords" data-my-id="${peliculas[i].id}">keywords</a>
            </div>
        </div>\n`;
      i = i + 1;
    };
    view += '</div></div>';

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
            <a href="#main" class="index">Volver</a>
        </div>`;
}

const showView = (pelicula) => {
    return `
     <h2 class="anime-fade-in">${pelicula.titulo}</h2>
     <p class="anime-fade-in">
        <strong>Director:</strong> ${pelicula.director}
     </p>
     <div class="actions anime-fade-in">
        <button class="toggle-favorite" data-movie-id="${pelicula.id}">${isFavorite(pelicula.id) ? 'Quitar Fav' : 'Añadir Fav'}</button>
        <a href="#main" class="index">Volver</a>
     </div>`;
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
                <a href="#main" class="index">Volver</a>
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
                <a href="#main" class="index">Volver</a>
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
            <a href="#main" class="index">Volver</a>
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
        view += '<div class="swiper-container"><div class="swiper-wrapper">';
        for (const movie of favorites) {
            const movie_index = mis_peliculas.findIndex(p => p.id === movie.id);
            view += `
            <div class="swiper-slide movie">
               <div class="movie-img">
                    <a href="#detail-view" class="show" data-my-id="${movie_index}"><img src="${movie.miniatura}" onerror="this.src='files/placeholder.png'"/></a>
               </div>
               <div class="title">
                   ${movie.titulo || "<em>Sin título</em>"}
               </div>
               <div class="actions">
                    <button class="toggle-favorite" data-movie-id="${movie.id}">${isFavorite(movie.id) ? 'Quitar Fav' : 'Añadir Fav'}</button>
                    <a href="#edit-view" class="edit" data-my-id="${movie_index}">editar</a>
                    <button class="delete" data-my-id="${movie_index}">borrar</button>
                    <a href="#keywords-view" class="keywords" data-my-id="${movie.id}">keywords</a>
                </div>
            </div>\n`;
        }
        view += '</div></div>';
    }
    view += `<div class="actions">
                <a href="#main" class="index">Volver</a>
             </div>`;
    return view;
}

const animateElements = (selector) => {
    anime({
        targets: selector,
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(100) // delay between each element
    });
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

const initSwiper = () => {
    new Swiper('.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    });
}

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
    initSwiper();
    animateElements('#main .movie');
};

const showContr = (i) => {
    document.getElementById('detail-view').innerHTML = showView(mis_peliculas[i]);
    animateElements('#detail-view > *');
}

const newContr = () => {
    document.getElementById('edit-view').innerHTML = editView();
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
    window.location.hash = '#main';
};

const editContr = (i) => {
    document.getElementById('edit-view').innerHTML = editView(i,  mis_peliculas[i]);
}

const updateContr = (i) => {
    mis_peliculas[i].titulo   = document.getElementById('titulo').value;
    mis_peliculas[i].director = document.getElementById('director').value;
    mis_peliculas[i].miniatura = document.getElementById('miniatura').value;
    localStorage.setItem('mis_peliculas', JSON.stringify(mis_peliculas));
    indexContr();
    window.location.hash = '#main';
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
        document.getElementById('keywords-view').innerHTML = keywordsView(movieId, movie_keywords[movieId]);
        animateElements('#keywords-view .keyword');
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
                document.getElementById('keywords-view').innerHTML = keywordsView(movieId, keywords);
                animateElements('#keywords-view .keyword');
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
    document.getElementById('favorites-view').innerHTML = myKeywordsView();
    animateElements('#favorites-view .keyword');
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
            window.location.hash = '#main';
        })
        .catch(err => {
            console.error(err);
            alert("Error al añadir la película. Comprueba la consola para más detalles.");
        });
};

const favoritesContr = () => {
    document.getElementById('favorites-view').innerHTML = favoritesView();
    initSwiper();
    animateElements('#favorites-view .movie');
}


// ROUTER de eventos
const matchEvent = (ev, sel) => ev.target.matches(sel)
const myId = (ev) => Number(ev.target.dataset.myId)

document.addEventListener('click', ev => {
    if      (matchEvent(ev, '.update')) updateContr (myId(ev));
    else if (matchEvent(ev, '.create')) createContr ();
    else if (matchEvent(ev, '.delete')) deleteContr (myId(ev));
    else if (matchEvent(ev, '.reset'))  resetContr  ();
    else if (matchEvent(ev, '.add-keyword')) addKeywordToList(ev.target.dataset.keyword);
    else if (matchEvent(ev, '.remove-keyword')) removeKeywordFromList(ev.target.dataset.keyword);
    else if (matchEvent(ev, '.download')) downloadContr();
    else if (matchEvent(ev, '.add-from-api')) addFromAPIContr(ev.target.dataset.movieId);
    else if (matchEvent(ev, '.toggle-favorite')) {
        const movieId = Number(ev.target.dataset.movieId);
        const movie = mis_peliculas.find(p => p.id === movieId);
        if (movie) {
            toggleFavorite(movie);
            // Re-render current view to update favorite button
            const currentView = window.location.hash.substring(1) || 'main';
            if (currentView === 'main') {
                indexContr();
            } else if (currentView === 'favorites-view') {
                favoritesContr();
            } else if (currentView === 'detail-view') {
                const movieIndex = mis_peliculas.findIndex(p => p.id === movieId);
                showContr(movieIndex);
            }
        }
    }
})

document.addEventListener('DOMContentLoaded', () => {
    initContr();
    searchContr(); // Initialize search view
});
