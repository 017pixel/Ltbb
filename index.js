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
            const targetAttr = e.currentTarget.getAttribute('href');
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
    const sliderWrapper = document.querySelector('.reviews-slider-wrapper');
    const sliderTrack = document.querySelector('.reviews-slider-track');
    const prevBtn = document.getElementById('prev-review');
    const nextBtn = document.getElementById('next-review');
    const dotsContainer = document.querySelector('.reviews-dots');

    if (sliderTrack && prevBtn && nextBtn && sliderWrapper && dotsContainer) {
        const reviews = Array.from(sliderTrack.children);
        const reviewCount = reviews.length;
        let currentIndex = 0;
        let slideInterval;
        const dots = [];

        if (reviewCount > 0) {
            const adjustWrapperHeight = () => {
                const activeCard = reviews[currentIndex];
                if (activeCard) {
                    sliderWrapper.style.height = `${activeCard.offsetHeight}px`;
                }
            };

            const updateDots = () => {
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            };

            const showReview = (index) => {
                if (index < 0 || index >= reviewCount) return;
                currentIndex = index;
                sliderTrack.style.transform = `translateX(-${currentIndex * 100}%)`;
                adjustWrapperHeight();
                if (dots.length > 0) {
                    updateDots();
                }
            };

            const nextReview = () => showReview((currentIndex + 1) % reviewCount);
            const prevReview = () => showReview((currentIndex - 1 + reviewCount) % reviewCount);
            
            const startAutoPlay = () => {
                clearInterval(slideInterval);
                if (reviewCount > 1) {
                    slideInterval = window.setInterval(nextReview, 7000);
                }
            };

            // Initial setup
            if (reviewCount > 1) {
                 // Create dots
                for (let i = 0; i < reviewCount; i++) {
                    const dot = document.createElement('button');
                    dot.classList.add('review-dot');
                    dot.setAttribute('aria-label', `Go to review ${i + 1}`);
                    dot.addEventListener('click', () => {
                        showReview(i);
                        startAutoPlay(); // Reset timer on manual navigation
                    });
                    dotsContainer.appendChild(dot);
                    dots.push(dot);
                }

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
                // Hide nav buttons and dots if only one review
                prevBtn.style.display = 'none';
                nextBtn.style.display = 'none';
                dotsContainer.style.display = 'none';
            }

            // Set initial state
            showReview(0);

            // Adjust height on window resize
            window.addEventListener('resize', adjustWrapperHeight);
            // Also adjust height after a small delay to account for font loading, etc.
            setTimeout(adjustWrapperHeight, 100);
        }
    }
});