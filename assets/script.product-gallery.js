const initializeProductGallery = (gallery) => {
    if (!gallery || gallery.__productGallery || !gallery.querySelector) {
        return;
    }

    const thumbsElement = gallery.querySelector('[data-gallery-thumbs]');
    const mainElement = gallery.querySelector('[data-gallery-main]');
    const prevButton = gallery.querySelector('[data-gallery-prev]');
    const nextButton = gallery.querySelector('[data-gallery-next]');

    if (!thumbsElement || !mainElement || typeof Swiper === 'undefined') {
        return;
    }

    if (mainElement.swiper) {
        return;
    }

    const thumbsSwiper = new Swiper(thumbsElement, {
        slidesPerView: 'auto',
        spaceBetween: 8,
        watchSlidesProgress: true,
        slideToClickedSlide: true,

        breakpoints: {
            768: {
                direction: 'vertical',
            },
        },
    });

    const mainSwiper = new Swiper(mainElement, {
        slidesPerView: 1.1,
        centeredSlides: true,
        spaceBetween: 8,

        breakpoints: {
            768: {
                slidesPerView: 1,
                centeredSlides: false,
                spaceBetween: 0,
            },
        },

        navigation: {
            prevEl: prevButton,
            nextEl: nextButton,
        },

        thumbs: {
            swiper: thumbsSwiper,
        },
    });

    thumbsSwiper.on('click', () => {
        if (typeof thumbsSwiper.clickedIndex === 'number') {
            mainSwiper.slideTo(thumbsSwiper.clickedIndex);
        }
    });

    gallery.__productGallery = {
        mainSwiper,
        thumbsSwiper,
    };
};

const destroyProductGallery = (gallery) => {
    if (!gallery || !gallery.__productGallery) {
        return;
    }

    const { mainSwiper, thumbsSwiper } = gallery.__productGallery;

    if (mainSwiper && typeof mainSwiper.destroy === 'function') {
        mainSwiper.destroy(true, true);
    }

    if (thumbsSwiper && typeof thumbsSwiper.destroy === 'function') {
        thumbsSwiper.destroy(true, true);
    }

    delete gallery.__productGallery;
};

const initializeProductGalleries = (root = document) => {
    if (!root || typeof root.querySelectorAll !== 'function') {
        return;
    }

    root.querySelectorAll('[data-product-gallery]').forEach((gallery) => {
        initializeProductGallery(gallery);
    });
};

const handleSectionLoad = (event) => {
    const target = event && event.target ? event.target : document;
    initializeProductGalleries(target);
};

const handleSectionUnload = (event) => {
    const target = event && event.target ? event.target : document;

    if (!target || typeof target.querySelectorAll !== 'function') {
        return;
    }

    target.querySelectorAll('[data-product-gallery]').forEach((gallery) => {
        destroyProductGallery(gallery);
    });
};

if (!document.__productGalleryListenersBound) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeProductGalleries();
        });
    } else {
        initializeProductGalleries();
    }

    document.addEventListener('shopify:section:load', handleSectionLoad);
    document.addEventListener('shopify:section:unload', handleSectionUnload);
    document.__productGalleryListenersBound = true;
}