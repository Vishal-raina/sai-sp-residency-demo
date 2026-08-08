document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 1. Navbar Scroll Effect & Active Links
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    
    function handleScrollEffects() {
        // Sticky Header / Background transition
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Link Highlighting
        let currentSectionId = 'home';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScrollEffects);
    handleScrollEffects(); // Trigger initially

    // 2. Mobile Menu Toggle
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const navMenu = document.getElementById('navMenu');

    hamburgerMenu.addEventListener('click', () => {
        hamburgerMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburgerMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.fade-up-init, .reveal-slide-init');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                const delay = element.getAttribute('data-delay') || 0;
                
                setTimeout(() => {
                    if (element.classList.contains('fade-up-init')) {
                        element.classList.add('fade-up-active');
                    } else if (element.classList.contains('reveal-slide-init')) {
                        element.classList.add('reveal-slide-active');
                    }
                }, delay);

                observer.unobserve(element);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Staggered entry for Hero Content on load
    const heroElements = document.querySelectorAll('.hero-content .fade-up-init');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('fade-up-active');
        }, index * 200 + 100);
    });

    // Slow scale down zoom of hero bg image
    const heroBgImg = document.getElementById('heroBgImg');
    if (heroBgImg) {
        setTimeout(() => {
            heroBgImg.style.transform = 'scale(1)';
        }, 100);
    }

    // Parallax effect on scroll
    const parallaxImg = document.getElementById('parallaxImg');
    if (parallaxImg) {
        window.addEventListener('scroll', () => {
            const scrollPos = window.scrollY;
            const elementOffset = parallaxImg.parentElement.offsetTop;
            const visibleArea = window.innerHeight;
            
            if (scrollPos + visibleArea >= elementOffset) {
                const yPos = (scrollPos - elementOffset) * 0.15;
                parallaxImg.style.transform = `translateY(${yPos}px)`;
            }
        });
    }

    // 4. Booking Bar Interaction & Custom Toast
    const bookingForm = document.getElementById('bookingForm');
    const toastContainer = document.getElementById('toastContainer');

    // Pre-populate input dates (Check-in = today, Check-out = tomorrow)
    const checkinInput = document.getElementById('checkin');
    const checkoutInput = document.getElementById('checkout');
    if (checkinInput && checkoutInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        checkinInput.value = today.toISOString().split('T')[0];
        checkoutInput.value = tomorrow.toISOString().split('T')[0];
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <i data-lucide="check-circle-2"></i>
            <span class="toast-msg">${message}</span>
        `;
        toastContainer.appendChild(toast);
        lucide.createIcons(); // Initialize the icon in new element
        
        // Remove toast after animation
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            setTimeout(() => toast.remove(), 400);
        }, 3600);
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast("Thank you! Our team will get in touch with you shortly.");
        });
    }

    // 5. Rooms Modal Functionality
    const roomModal = document.getElementById('roomModal');
    const modalClose = document.getElementById('modalClose');
    const modalRoomImg = document.getElementById('modalRoomImg');
    const modalRoomTitle = document.getElementById('modalRoomTitle');
    const modalRoomDesc = document.getElementById('modalRoomDesc');
    const modalFeaturesList = document.getElementById('modalFeaturesList');
    
    // Rooms data for modal
    const roomsData = {
        comfort: {
            title: "COMFORT ROOM",
            desc: "Designed thoughtfully with efficiency in mind, the Comfort Room offers premium bedding, modern sanitation, and quiet spaces perfect for travelers looking to unwind after visiting the attractions.",
            img: "Images/sp-residency (1).jpg",
            features: ["Individually Controlled AC", "Complimentary High-speed Wi-Fi", "Prisinte Bath Amenities", "Daily Housekeeping", "Flat Screen LED TV", "In-room Intercom"]
        },
        deluxe: {
            title: "DELUXE ROOM",
            desc: "The Deluxe Room boasts sophisticated wood trims and elevated comforts. A spacious layout provides room to breathe, work, and relax in style.",
            img: "Images/sp-residency.jpg",
            features: ["Individually Controlled AC", "Complimentary High-speed Wi-Fi", "Tea & Coffee Making Facilities", "Work Desk Setup", "Plush King Size Bedding", "Premium Bathroom Supplies"]
        },
        family: {
            title: "FAMILY STAY",
            desc: "Our Family Stay accommodations prioritize space and joint comfort. Ideal for travel groups and families looking for a convenient home away from home.",
            img: "Images/sp-residency-pollachi-pic-9.jpg",
            features: ["Generous Double Bedding Setup", "Individually Controlled AC", "Complimentary High-speed Wi-Fi", "Spacious Lounge Area", "Interconnected Bathrooms", "Flat Screen Smart TV"]
        }
    };

    document.querySelectorAll('.room-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent if clicking modal button directly
            const roomId = card.getAttribute('data-room-id');
            const data = roomsData[roomId];
            
            if (data) {
                modalRoomImg.src = data.img;
                modalRoomImg.alt = data.title;
                modalRoomTitle.textContent = data.title;
                modalRoomDesc.textContent = data.desc;
                
                modalFeaturesList.innerHTML = '';
                data.features.forEach(feat => {
                    const li = document.createElement('li');
                    li.innerHTML = `<i data-lucide="check"></i> ${feat}`;
                    modalFeaturesList.appendChild(li);
                });
                
                lucide.createIcons(); // Initialize check icons
                roomModal.classList.add('active');
                roomModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeModal() {
        roomModal.classList.remove('active');
        roomModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }
    
    // Close modal on click outside content
    if (roomModal) {
        roomModal.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                closeModal();
            }
        });
    }

    // 6. Fullscreen Lightbox & Gallery Navigation
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxCounter = document.getElementById('lightboxCounter');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    
    // Collect all gallery images
    const galleryItems = document.querySelectorAll('.gallery-item');
    const galleryImages = [];
    
    galleryItems.forEach(item => {
        const img = item.querySelector('.gallery-img');
        const label = item.querySelector('.gallery-label').textContent;
        galleryImages.push({
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            label: label
        });
    });

    let currentImgIndex = 0;

    function openLightbox(index) {
        currentImgIndex = index;
        const imgData = galleryImages[currentImgIndex];
        
        lightboxImg.src = imgData.src;
        lightboxImg.alt = imgData.alt;
        lightboxCaption.textContent = imgData.label;
        lightboxCounter.textContent = `${currentImgIndex + 1} / ${galleryImages.length}`;
        
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showNextImage() {
        currentImgIndex = (currentImgIndex + 1) % galleryImages.length;
        openLightbox(currentImgIndex);
    }

    function showPrevImage() {
        currentImgIndex = (currentImgIndex - 1 + galleryImages.length) % galleryImages.length;
        openLightbox(currentImgIndex);
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);

    // Keyboard Navigation for Lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        }
    });

    // Close lightbox on click outside the image
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target.id === 'lightbox' || e.target.classList.contains('lightbox-content')) {
                closeLightbox();
            }
        });
    }

    // 7. Testimonial Carousel
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.getElementById('sliderPrev');
    const nextBtn = document.getElementById('sliderNext');
    let currentTestimonialIndex = 0;

    function showTestimonial(index) {
        testimonialCards.forEach(card => card.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        currentTestimonialIndex = index;
        testimonialCards[currentTestimonialIndex].classList.add('active');
        dots[currentTestimonialIndex].classList.add('active');
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const nextIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
            showTestimonial(nextIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            const prevIndex = (currentTestimonialIndex - 1 + testimonialCards.length) % testimonialCards.length;
            showTestimonial(prevIndex);
        });
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'), 10);
            showTestimonial(index);
        });
    });

    // Auto rotate testimonials
    let testimonialInterval = setInterval(() => {
        const nextIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
        showTestimonial(nextIndex);
    }, 8000);

    // Pause auto rotate when interacting
    const testimonialsSection = document.getElementById('reviews');
    if (testimonialsSection) {
        testimonialsSection.addEventListener('mouseenter', () => clearInterval(testimonialInterval));
        testimonialsSection.addEventListener('mouseleave', () => {
            testimonialInterval = setInterval(() => {
                const nextIndex = (currentTestimonialIndex + 1) % testimonialCards.length;
                showTestimonial(nextIndex);
            }, 8000);
        });
    }

    // 8. Back to Top Button
    const backToTop = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 600) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
