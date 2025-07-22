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
        const reviews = sliderTrack.querySelectorAll('.review-card');
        const reviewCount = reviews.length;
        let currentIndex = 0;
        let slideInterval: number;

        if (reviewCount > 1) {
            const showReview = (index: number) => {
                const firstReview = reviews[0] as HTMLElement;
                if (firstReview) {
                    // Use getComputedStyle for robustness, with a fallback
                    const gap = parseFloat(getComputedStyle(sliderTrack).gap) || 16;
                    const reviewWidth = firstReview.offsetWidth;
                    const offset = index * (reviewWidth + gap);
                    sliderTrack.style.transform = `translateX(-${offset}px)`;
                }
            };

            const nextReview = () => {
                currentIndex = (currentIndex + 1) % reviewCount;
                showReview(currentIndex);
            };

            const prevReview = () => {
                currentIndex = (currentIndex - 1 + reviewCount) % reviewCount;
                showReview(currentIndex);
            };

            const resetInterval = () => {
                clearInterval(slideInterval);
                slideInterval = window.setInterval(nextReview, 7000);
            };
            
            nextBtn.addEventListener('click', () => {
                nextReview();
                resetInterval();
            });

            prevBtn.addEventListener('click', () => {
                prevReview();
                resetInterval();
            });

            // Recalculate on resize to handle responsive changes
            window.addEventListener('resize', () => {
                // Temporarily disable transition for a smooth resize
                sliderTrack.style.transition = 'none';
                showReview(currentIndex);
                // Restore transition after the repaint
                // Using a timeout ensures the 'none' transition is applied first
                setTimeout(() => {
                    sliderTrack.style.transition = 'transform 0.5s ease-in-out';
                }, 50);
            });

            // Start the initial interval
            resetInterval();
        }
    }
});