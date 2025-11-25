
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

const movieCard = (movie, index) => {
    const isFav = isFavorite(movie.id);
    return `
        <div class="movie" data-movie-id="${movie.id}" data-movie-index="${index}">
            <img src="${movie.miniatura}" class="movie-img" onerror="this.src='files/placeholder.png'">
            <div class="movie-info">
                <h3 class="movie-title">${movie.titulo}</h3>
                <div class="movie-actions">
                    <a href="#edit/${index}" class="action-btn" title="Editar"><i class="fas fa-edit"></i></a>
                    <button class="action-btn delete" data-my-id="${index}" title="Borrar"><i class="fas fa-trash"></i></button>
                    <a href="#keywords/${movie.id}" class="action-btn" title="Keywords"><i class="fas fa-tags"></i></a>
                    <button class="action-btn toggle-favorite" data-movie-id="${movie.id}" title="${isFav ? 'Quitar de Favoritos' : 'Añadir a Favoritos'}">
                        <i class="fas ${isFav ? 'fa-heart-broken' : 'fa-heart'}"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

const movieCarousel = (title, movies, id) => {
    if (movies.length === 0) return '';

    let movie_cards = movies.map((movie, i) => {
        const original_index = mis_peliculas.findIndex(p => p.id === movie.id);
        return `<div class="swiper-slide">${movieCard(movie, original_index)}</div>`;
    }).join('');

    return `
        <section class="movie-carousel-container">
            <h2>${title}</h2>
            <div class="swiper-container" id="${id}">
                <div class="swiper-wrapper">
                    ${movie_cards}
                </div>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            </div>
        </section>
    `;
}

const indexView = (peliculas, recommended_movies) => {
    let view = `
        <header class="main-header">
            <h1>Mis Películas</h1>
            <div class="header-actions">
                <a href="#search" class="btn">Buscar</a>
                <a href="#favorites" class="btn">Favoritos</a>
                <a href="#my-keywords" class="btn">Mis Keywords</a>
                <div class="dropdown">
                    <button class="btn dropdown-toggle">Avanzado</button>
                    <div class="dropdown-menu">
                        <button class="dropdown-item download">Descargar Populares</button>
                        <button class="dropdown-item reset">Resetear Todo</button>
                    </div>
                </div>
            </div>
        </header>
    `;

    view += movieCarousel('Basado en tus Keywords', recommended_movies, 'recommended-carousel');
    view += movieCarousel('Todas las Películas', peliculas, 'all-movies-carousel');
    view += movieCarousel('Favoritos', getFavorites(), 'favorites-carousel-main');

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
            <button class="btn ${action_class}" ${data_id}>${button_label}</button>
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
                <button class="btn toggle-favorite" data-movie-id="${pelicula.id}">${isFavorite(pelicula.id) ? 'Quitar Fav' : 'Añadir Fav'}</button>
                <a href="#main" class="button index">Volver</a>
            </div>
        </div>
     </div>
    `;
}

const keywordsView = (movieId, keywords) => {
    const movie = mis_peliculas.find(p => p.id == movieId) || getFavorites().find(p => p.id == movieId);
    let view = `<div class="keywords-page">
                    <h2>Keywords para "${movie.titulo}"</h2>
                `;
    view += `<div class="keywords-list">`;
    for (const keyword of keywords) {
        const is_selected = mis_keywords.includes(keyword.name);
        const button_class = is_selected ? 'selected' : '';
        const icon_class = is_selected ? 'fa-check' : 'fa-plus';

        view += `<div class="keyword-tag anime-fade-in">
                    <span>${keyword.name}</span>
                    <button class="toggle-keyword action-btn ${button_class}" data-keyword="${keyword.name}">
                        <i class="fas ${icon_class}"></i>
                    </button>
                 </div>`;
    }
    view += `</div>`;
    view += `<div class="actions">
                <a href="#main" class="btn">Volver</a>
             </div></div>`;
    return view;
}

const myKeywordsView = () => {
    let view = `<div class="keywords-page">
                    <h2>Mis Keywords</h2>
                `;
    if (mis_keywords.length > 0) {
        view += `<div class="keywords-list">`;
        for (const keyword of mis_keywords) {
            view += `<div class="keyword-tag anime-fade-in">
                        <span>${keyword}</span>
                        <button class="toggle-keyword action-btn" data-keyword="${keyword}">
                            <i class="fas fa-minus"></i>
                        </button>
                     </div>`;
        }
        view += `</div>`;
    } else {
        view += `<p>Aún no has añadido ninguna keyword a tu lista. Explora las keywords de las películas para empezar.</p>`;
    }
    view += `<div class="actions">
                <a href="#main" class="btn">Volver</a>
             </div></div>`;
    return view;
}


const searchView = () => {
    return `<h2>Buscar Película en TMDb</h2>
        <div class="field">
        Título <br>
        <input type="text" id="query" placeholder="Escribe el título...">
        </div>
        <div class="actions">
            <button class="btn do-search">Buscar</button>
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
                   <button class="btn add-from-api" data-movie-id="${result.id}">Añadir</button>
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
        view += movieCarousel('Favoritos', favorites, 'favorites-carousel');
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

const initSwiper = (id) => {
    const el = document.getElementById(id);
    if (el && el.children.length > 0) {
        new Swiper(`#${id}`, {
            slidesPerView: 'auto',
            spaceBetween: 15,
            allowTouchMove: false, // Esta es la línea que he añadido
            navigation: {
                nextEl: `#${id} .swiper-button-next`,
                prevEl: `#${id} .swiper-button-prev`,
            },
            breakpoints: {
                600: { slidesPerView: 3, spaceBetween: 20 },
                900: { slidesPerView: 4, spaceBetween: 20 },
                1200: { slidesPerView: 5, spaceBetween: 25 },
                1500: { slidesPerView: 6, spaceBetween: 30 },
            }
        });
    }
}

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
    
    // Initialize carousels
    initSwiper('recommended-carousel');
    initSwiper('all-movies-carousel');
    initSwiper('favorites-carousel-main');
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
        animateElements('#keywords-view .keyword-tag');
    } else {
        fetch(`https://api.themoviedb.org/3/movie/${movieId}/keywords?api_key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                const keywords = (data.keywords || []).map(kw => ({...kw, name: kw.name.toLowerCase()}));
                movie_keywords[movieId] = keywords;
                localStorage.setItem('movie_keywords', JSON.stringify(movie_keywords));
                document.getElementById('keywords-view').innerHTML = keywordsView(movieId, keywords);
                animateElements('#keywords-view .keyword-tag');
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

const toggleKeywordContr = (keyword) => {
    const keywordIndex = mis_keywords.indexOf(keyword);
    if (keywordIndex > -1) {
        mis_keywords.splice(keywordIndex, 1);
    } else {
        mis_keywords.push(keyword);
    }
    localStorage.setItem('my_keywords', JSON.stringify(mis_keywords));

    const [view, param] = (window.location.hash.substring(1) || 'main').split('/');
    if (view === 'my-keywords') {
        myKeywordsContr();
    } else if (view === 'keywords') {
        keywordsContr(param);
    }
};

const myKeywordsContr = () => {
    document.getElementById('my-keywords-view').innerHTML = myKeywordsView();
    animateElements('#my-keywords-view .keyword-tag');
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
    initSwiper('favorites-carousel');
}

// ROUTER de eventos
const matchEvent = (ev, sel) => ev.target.closest(sel);
const myId = (ev) => Number(matchEvent(ev, '[data-my-id]').dataset.myId);

document.addEventListener('click', ev => {
    const toggleKeywordBtn = matchEvent(ev, '.toggle-keyword');
    const movieCardElement = matchEvent(ev, '.movie');

    if (matchEvent(ev, '.update')) updateContr(myId(ev));
    else if (matchEvent(ev, '.create')) createContr();
    else if (matchEvent(ev, '.delete')) deleteContr(myId(ev));
    else if (matchEvent(ev, '.reset'))  resetContr();
    else if (toggleKeywordBtn) {
        const keyword = toggleKeywordBtn.dataset.keyword;
        toggleKeywordContr(keyword);
    }
    else if (matchEvent(ev, '.download')) downloadContr();
    else if (matchEvent(ev, '.add-from-api')) addFromAPIContr(matchEvent(ev, '.add-from-api').dataset.movieId);
    else if (matchEvent(ev, '.toggle-favorite')) {
        const movieId = Number(matchEvent(ev, '[data-movie-id]').dataset.movieId);
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
    } else if(matchEvent(ev, '.dropdown-toggle')) {
        matchEvent(ev, '.dropdown').classList.toggle('open');
    } else if (movieCardElement && !matchEvent(ev, '.action-btn')) {
        const movieIndex = movieCardElement.dataset.movieIndex;
        if (movieIndex !== 'undefined' && movieIndex !== null) {
            window.location.hash = `#detail/${movieIndex}`;
        }
    }
});


// Inicialización        
document.addEventListener('DOMContentLoaded', initContr);
