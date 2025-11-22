
const FAVORITES_KEY = 'movieFavorites';

const getFavorites = () => {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
};

const saveFavorites = (favorites) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
};

const isFavorite = (movieId) => {
    return getFavorites().some(movie => movie.id === movieId);
};

const addFavorite = (movie) => {
    if (!isFavorite(movie.id)) {
        const favorites = getFavorites();
        favorites.push(movie);
        saveFavorites(favorites);
    }
};

const removeFavorite = (movieId) => {
    let favorites = getFavorites();
    favorites = favorites.filter(movie => movie.id !== movieId);
    saveFavorites(favorites);
};

const toggleFavorite = (movie) => {
    if (isFavorite(movie.id)) {
        removeFavorite(movie.id);
    } else {
        addFavorite(movie);
    }
};
