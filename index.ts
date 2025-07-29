/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // --- Elements ---
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    
    const modal = document.getElementById('ltbb-modal');
    const modalOverlay = document.getElementById('ltbb-modal-overlay');
    const openModalBtn = document.getElementById('open-ltbb-modal-btn');
    const modalCloseBtn = document.getElementById('modal-close-btn');

    // --- Sidebar Logic ---
    const closeSidebar = () => {
        body.classList.remove('sidebar-open');
        // Only remove noscroll if modal is also closed
        if (modal?.classList.contains('hidden')) {
            body.classList.remove('noscroll');
        }
    };

    if (menuToggle && sidebar && overlay && sidebarCloseBtn) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            body.classList.add('sidebar-open');
            body.classList.add('noscroll');
        });

        overlay.addEventListener('click', closeSidebar);
        sidebarCloseBtn.addEventListener('click', closeSidebar);

        sidebar.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // --- Modal Logic ---
    const closeModal = () => {
        if (modal && modalOverlay) {
            modal.classList.add('hidden');
            modalOverlay.classList.add('hidden');
            // Only remove noscroll if sidebar is also closed
            if (!body.classList.contains('sidebar-open')) {
                body.classList.remove('noscroll');
            }
        }
    };
    
    if (openModalBtn && modal && modalOverlay && modalCloseBtn) {
        openModalBtn.addEventListener('click', () => {
            // Close sidebar first for a cleaner transition
            if (body.classList.contains('sidebar-open')) {
                closeSidebar();
            }
            modal.classList.remove('hidden');
            modalOverlay.classList.remove('hidden');
            body.classList.add('noscroll');
        });

        modalCloseBtn.addEventListener('click', closeModal);
        modalOverlay.addEventListener('click', closeModal);
    }

    // --- Smooth Scroll for ALL anchor links ---
    const allLinks = document.querySelectorAll('a[href^="#"]');
    allLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetAttr = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
            if (targetAttr && targetAttr.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetAttr);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                    // If it's a mobile nav link, close the sidebar
                    if (body.classList.contains('sidebar-open')) {
                        closeSidebar();
                    }
                }
            }
        });
    });

    // --- Reviews Slider ---
    const sliderTrack = document.querySelector('.reviews-slider-track') as HTMLElement;
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');

    if (sliderTrack && prevBtn && nextBtn) {
        const reviews = Array.from(sliderTrack.querySelectorAll('.review-card')) as HTMLElement[];
        const reviewCount = reviews.length;
        let currentIndex = 0;
        let slideInterval: number;

        if (reviewCount > 0) {
            const showReview = (index: number) => {
                const currentActive = reviews[currentIndex];
                currentActive?.classList.remove('active');

                currentIndex = index;
                const newActiveCard = reviews[currentIndex];
                newActiveCard?.classList.add('active');
            };

            const nextReview = () => {
                const newIndex = (currentIndex + 1) % reviewCount;
                showReview(newIndex);
            };

            const prevReview = () => {
                const newIndex = (currentIndex - 1 + reviewCount) % reviewCount;
                showReview(newIndex);
            };
            
            const startAutoPlay = () => {
                clearInterval(slideInterval);
                if (reviewCount > 1) {
                    slideInterval = window.setInterval(nextReview, 7000);
                }
            };

            // Initial setup
            reviews[currentIndex].classList.add('active');
            
            if (reviewCount > 1) {
                nextBtn.addEventListener('click', () => {
                    nextReview();
                    startAutoPlay();
                });

                prevBtn.addEventListener('click', () => {
                    prevReview();
                    startAutoPlay();
                });

                startAutoPlay();
            } else {
                // Hide nav buttons if only one review
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
            }
        }
    }
});