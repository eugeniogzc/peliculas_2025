
let swiper;

const initializeRouter = () => {
    const views = document.querySelectorAll('.view');
    const mainView = document.getElementById('main-view');

    const hideAllViews = () => {
        views.forEach(view => {
            view.style.display = 'none';
        });
    };

    const showView = (viewId) => {
        hideAllViews();
        const view = document.getElementById(viewId);
        if (view) {
            anime({
                targets: view,
                opacity: [0, 1],
                duration: 800,
                easing: 'easeInOutQuad',
                begin: () => {
                    view.style.display = 'block';
                }
            });
        }
    };

    swiper = new Swiper('.swiper-container', {
        loop: false,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        on: {
            slideChange: () => {
                const activeSlide = swiper.slides[swiper.activeIndex];
                const viewId = activeSlide.querySelector('.view').id;
                window.location.hash = `#${viewId.replace('-view', '')}`;
            }
        }
    });

    const route = () => {
        const hash = window.location.hash.substring(1) || 'main';
        const [view, param] = hash.split('/');
        let viewId = `${view}-view`;

        if (!document.getElementById(viewId)) {
            viewId = 'main-view';
            window.location.hash = '#main';
        }
        
        showView(viewId);

        const slideIndex = Array.from(swiper.slides).findIndex(slide => slide.querySelector('.view').id === viewId);
        if (slideIndex !== -1) {
            swiper.slideTo(slideIndex);
        }

        switch (view) {
            case 'main':
                indexContr();
                break;
            case 'detail':
                showContr(Number(param));
                break;
            case 'edit':
                editContr(Number(param));
                break;
            case 'keywords':
                keywordsContr(param);
                break;
            case 'my-keywords':
                myKeywordsContr();
                break;
            case 'search':
                searchContr();
                break;
            case 'favorites':
                favoritesContr();
                break;
            default:
                indexContr();
                break;
        }
    };

    window.addEventListener('hashchange', route);
    route(); 
};
