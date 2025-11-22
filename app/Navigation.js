
document.addEventListener('DOMContentLoaded', () => {

    const views = document.querySelectorAll('.view');

    const navigateTo = (viewId) => {
        let activeViewFound = false;
        views.forEach(view => {
            if (view.id === viewId) {
                // Found the target view
                activeViewFound = true;
                // Delay showing the new view for the fade-out effect
                setTimeout(() => {
                    view.classList.remove('hidden');
                }, 150); // Half the transition duration
            } else {
                // Hide all other views
                view.classList.add('hidden');
            }
        });
        if (!activeViewFound) {
            console.warn(`View with id '${viewId}' not found. Defaulting to main view.`);
            navigateTo('main');
        }
    };

    document.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (!link || !link.getAttribute('href')?.startsWith('#')) return;

        event.preventDefault();
        const targetViewId = link.getAttribute('href').substring(1);
        
        // Prepare the view with the correct controller
        const myId = link.dataset.myId;
        if (link.matches('.show')) {
            showContr(myId);
        } else if (link.matches('.edit')) {
            editContr(myId);
        } else if (link.matches('.new')) {
            newContr();
        } else if (link.matches('.keywords')) {
            keywordsContr(myId);
        } else if (link.matches('.my-keywords')) {
            myKeywordsContr();
        } else if (link.matches('.favorites')) {
            favoritesContr();
        } else if (link.matches('.search-btn')) {
            searchContr();
        }

        navigateTo(targetViewId);
    });

    window.addEventListener('hashchange', () => {
        const targetViewId = window.location.hash.substring(1) || 'main';
        navigateTo(targetViewId);
        history.pushState("", document.title, window.location.pathname + window.location.search);
    });

    // Initial navigation
    const initialViewId = window.location.hash.substring(1) || 'main';
    navigateTo(initialViewId);
});
