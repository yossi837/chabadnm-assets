/* ===================================
   CHABADNM.ORG - COMPLETE JAVASCRIPT
   =================================== */

// ==== PAGE SETUP ====
document.addEventListener('DOMContentLoaded', function() {
  // Check if current page is homepage
  if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
    document.body.classList.add('homepage');
  }
  
  // Add page URL to body
  document.body.setAttribute('data-page-url', window.location.href);
});

// ==== SCROLL ANIMATIONS ====
document.addEventListener('DOMContentLoaded', function() {
  // Intersection Observer for scroll animations
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  
  // Select all elements to animate
  const elementsToAnimate = document.querySelectorAll(`
    .banner-updates,
    .sneak-peek-container,
    .sneak-peek-item,
    .message.custom,
    .icon-updates,
    .promo_slider:not(:first-of-type),
    .latest_photos,
    .widget-4.subscribe,
    .candlelighting,
    .daily_thought,
    .facebook_likebox
  `);
  
  // Add animation class and observe
  elementsToAnimate.forEach(element => {
    if (!element.closest('.hp-row-first')) {
      element.classList.add('animate-on-scroll');
      observer.observe(element);
    }
  });
});

// ==== VIDEO HERO (HOMEPAGE ONLY) ====
document.addEventListener('DOMContentLoaded', function() {
  // Only run on homepage
  if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') return;
  
  // Video configurations
  const videoData = [
    { src: "https://www1.clhosting.org/media/av/1299/qesb12999328.mp4", start: 138, duration: 12 },
    { src: "https://www1.clhosting.org/media/av/1307/Irvg13070329.mp4", start: 76, duration: 17 },
    { src: "https://www1.clhosting.org/media/av/1306/LTOB13065009.mp4", start: 26, duration: 50 }
  ];
  
  // Remove existing hero if present
  const existingHero = document.querySelector('.video-hero');
  if (existingHero) existingHero.remove();
  
  // Create hero section
  const videoHero = document.createElement('div');
  videoHero.className = 'video-hero';
  
  // Create divider
  const divider = document.createElement('div');
  divider.className = 'hero-divider';
  
  // Set up videos HTML
  videoHero.innerHTML = `
    <video id="heroVideo0" autoplay muted playsinline style="opacity: 0;">
      <source src="${videoData[0].src}#t=${videoData[0].start}" type="video/mp4">
    </video>
    <video id="heroVideo1" muted playsinline style="opacity: 0;">
      <source src="${videoData[1].src}#t=${videoData[1].start}" type="video/mp4">
    </video>
    <video id="heroVideo2" muted playsinline style="opacity: 0;">
      <source src="${videoData[2].src}#t=${videoData[2].start}" type="video/mp4">
    </video>
    <div class="hero-content">
      <h1>Chabad of New Mexico</h1>
      <p>Your Jewish Home in the Southwest</p>
    </div>
    <div class="lets-go-text">Let's Explore</div>
    <svg class="scroll-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M7 13l5 5 5-5"/>
      <path d="M7 6l5 5 5-5"/>
    </svg>
  `;
  
  // Insert elements
  document.body.insertBefore(videoHero, document.body.firstChild);
  document.body.insertBefore(divider, videoHero.nextSibling);
  
  const videos = [0, 1, 2].map(i => document.getElementById(`heroVideo${i}`));
  let currentVideoIndex = 0;
  let isTransitioning = false;
  
  // Preload all videos
  videos.forEach(video => video.load());
  
  // Initial video fade in
  videos[0].addEventListener('loadeddata', function() {
    setTimeout(() => this.style.opacity = '1', 100);
  });
  
  function fadeIn(element) {
    return new Promise(resolve => {
      element.style.opacity = '1';
      setTimeout(resolve, 1500);
    });
  }
  
  function fadeOut(element) {
    return new Promise(resolve => {
      element.style.opacity = '0';
      setTimeout(resolve, 1500);
    });
  }
  
  // Shuffle remaining videos order
  function getNextVideoIndex() {
    if (currentVideoIndex === 0) {
      return Math.random() < 0.5 ? 1 : 2;
    }
    return currentVideoIndex === 1 ? 2 : 1;
  }
  
  async function transitionToNextVideo() {
    if (isTransitioning) return;
    isTransitioning = true;
    
    const currentVideo = videos[currentVideoIndex];
    const nextIndex = getNextVideoIndex();
    const nextVideo = videos[nextIndex];
    const nextVideoData = videoData[nextIndex];
    
    try {
      nextVideo.currentTime = nextVideoData.start;
      await nextVideo.play();
      await fadeIn(nextVideo);
      await fadeOut(currentVideo);
      currentVideo.pause();
      currentVideoIndex = nextIndex;
      isTransitioning = false;
    } catch (err) {
      console.error('Error in video transition:', err);
      isTransitioning = false;
    }
  }
  
  // Handle video transitions
  videos.forEach((video, index) => {
    video.addEventListener('timeupdate', function() {
      if (this === videos[currentVideoIndex] && 
          this.currentTime >= videoData[currentVideoIndex].start + videoData[currentVideoIndex].duration) {
        transitionToNextVideo();
      }
    });
  });
  
  // Force play first video
  videos[0].play().catch(err => console.error('Error playing first video:', err));
  
  // Smooth scroll on arrow click
  const scrollArrow = document.querySelector('.scroll-arrow');
  if (scrollArrow) {
    scrollArrow.addEventListener('click', () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth'
      });
    });
  }
  
  // Add parallax effect to videos
  window.addEventListener('scroll', function() {
    let scroll = window.pageYOffset;
    videos.forEach(video => {
      video.style.transform = `translate3d(-50%, calc(-50% + ${scroll * 0.4}px), 0)`;
    });
  });
  
  // Adjust hero title for mobile
  if (window.innerWidth <= 768) {
    const heroTitle = document.querySelector('.video-hero .hero-content h1');
    if (heroTitle) {
      heroTitle.innerHTML = heroTitle.textContent.replace('Chabad of', 'Chabad of<br>');
    }
  }
});

// ==== SUBSCRIBE SECTION ====
document.addEventListener('DOMContentLoaded', function() {
  const subscribeHeader = document.querySelector('.widget-4.subscribe .widget_header h5');
  if(subscribeHeader) {
    subscribeHeader.textContent = "Let's keep in touch";
    subscribeHeader.style.fontSize = '2.5em';
  }
  
  // Set placeholders for subscribe form inputs
  setTimeout(function() {
    const subscribeForm = document.querySelector('.widget-4.subscribe.custom.v280.feed');
    if (subscribeForm) {
      const inputs = subscribeForm.querySelectorAll('input[type="text"], input[type="email"]');
      if (inputs.length >= 3) {
        inputs[0].placeholder = 'First Name';
        inputs[1].placeholder = 'Last Name';
        inputs[2].placeholder = 'Email Address';
      }
    }
  }, 1500); // Wait for form to load
});

// ==== CONTACT PAGE ENHANCEMENTS ====
document.addEventListener('DOMContentLoaded', function() {
  // Only run on contact page
  if (!document.querySelector('.feedback_form')) return;
  
  // Add title section
  const formContainer = document.querySelector('.feedback_form');
  if (formContainer) {
    const titleSection = document.createElement('div');
    titleSection.className = 'contact-title-section';
    
    const title = document.createElement('h1');
    title.className = 'contact-title';
    title.textContent = "Contact Us Today!";
    
    const subtitle = document.createElement('p');
    subtitle.className = 'contact-subtitle';
    subtitle.textContent = "We'd love to hear from you. Fill out the form below, and we'll respond as soon as possible.";
    
    titleSection.appendChild(title);
    titleSection.appendChild(subtitle);
    formContainer.insertAdjacentElement('beforebegin', titleSection);
  }
  
  // Create contact info section
  const contactInfo = document.createElement('div');
  contactInfo.className = 'contact-info-section';
  contactInfo.innerHTML = `
    <h2 style="font-size: 1.5rem; font-weight: 600; margin-bottom: 1.5rem; color: #1a237e;">
      Contact Information
    </h2>
    <div class="contact-info-item">
      <div class="contact-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
        </svg>
      </div>
      <div>
        <strong>Address</strong><br>
        4000 San Pedro Northeast<br>
        Albuquerque, NM 87110
      </div>
    </div>
    <div class="contact-info-item">
      <div class="contact-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"></path>
        </svg>
      </div>
      <div>
        <strong>Phone</strong><br>
        <a href="tel:505-880-1181" style="color: #3949ab; text-decoration: none;">505-880-1181</a>
      </div>
    </div>
    <a href="https://wa.me/5058801181" target="_blank" class="whatsapp-button">
      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      </svg>
      <div>
        <strong>Chat on WhatsApp</strong>
        <div style="font-size: 0.9rem; opacity: 0.9;">We'll try to answer as soon as possible</div>
      </div>
    </a>
    <iframe 
      id="mapFrame"
      src="//www.chabad.org/centers/maps/i_map.asp?mosadids=444"
    ></iframe>
  `;
  
  // Insert into sidebar
  const sidebar = document.querySelector('#MosadInformation');
  if (sidebar) {
    sidebar.innerHTML = '';
    sidebar.appendChild(contactInfo);
  }
  
  // Remove sidebar navigation
  const sidebarLocalNavigation = document.querySelector('.sidebar-local-navigation');
  if (sidebarLocalNavigation) {
    sidebarLocalNavigation.remove();
  }
  
  // Enhance submit button
  const submitButton = document.querySelector('.co_global_button button');
  if (submitButton) {
    // Remove >> from submit text
    const submitSpan = submitButton.querySelector('span');
    if (submitSpan) {
      submitSpan.textContent = submitSpan.textContent.replace('»', '').trim();
    }
    
    // Add hover effects
    submitButton.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-2px)';
    });
    
    submitButton.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  }
});

// ==== FLOATING CONTACT BUTTON ====
document.addEventListener('DOMContentLoaded', function() {
  const buttonContainer = document.querySelector('.floating-contact-button');
  const button = document.querySelector('.contact-button');
  
  if (!buttonContainer || !button) return;
  
  let isExpanded = false;
  let rippleTimeout;
  let lastScrollTop = 0;
  let scrollTimeout;
  let hideTimeout;
  let userHasScrolled = false;
  let isScrollingUp = false;
  let lastScrollPosition = window.pageYOffset;
  
  // Smart scroll detection
  function handleScroll() {
    const currentScroll = window.pageYOffset;
    const headerHeight = document.querySelector('header')?.offsetHeight || 400;
    
    // Determine scroll direction
    isScrollingUp = currentScroll < lastScrollPosition;
    
    // Show conditions
    const shouldShow = currentScroll > headerHeight && 
                      (isScrollingUp || currentScroll > headerHeight * 2);
    
    // Update button visibility
    if (shouldShow) {
      clearTimeout(hideTimeout);
      buttonContainer.classList.remove('hiding');
      buttonContainer.classList.add('visible');
    } else {
      buttonContainer.classList.add('hiding');
      hideTimeout = setTimeout(() => {
        buttonContainer.classList.remove('visible');
      }, 400);
    }
    
    // Collapse on mobile scroll
    if (window.innerWidth <= 768 && Math.abs(currentScroll - lastScrollTop) > 50) {
      if (isExpanded) toggleExpand();
    }
    
    lastScrollPosition = currentScroll;
    lastScrollTop = currentScroll;
    userHasScrolled = true;
  }
  
  // Debounced scroll handler
  function debouncedScroll() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(handleScroll, 100);
  }
  
  // Create ripple effect
  function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    ripple.className = 'ripple';
    
    button.appendChild(ripple);
    
    clearTimeout(rippleTimeout);
    rippleTimeout = setTimeout(() => ripple.remove(), 600);
  }
  
  // Toggle expanded state
  function toggleExpand() {
    isExpanded = !isExpanded;
    button.classList.toggle('expanded');
  }
  
  // Event Listeners
  window.addEventListener('scroll', debouncedScroll);
  handleScroll();
  
  // Desktop behavior
  if (window.innerWidth > 768) {
    buttonContainer.addEventListener('mouseenter', () => {
      if (!isExpanded) toggleExpand();
    });
    
    buttonContainer.addEventListener('mouseleave', () => {
      if (isExpanded) toggleExpand();
    });
  }
  
  // Mobile behavior
  button.addEventListener('click', (e) => {
    createRipple(e);
    if (window.innerWidth <= 768) {
      if (!isExpanded) {
        toggleExpand();
      } else {
        window.location.href = 'https://www.chabadnm.org/tools/feedback.htm';
      }
    } else if (isExpanded) {
      window.location.href = 'https://www.chabadnm.org/tools/feedback.htm';
    }
  });
  
  // Handle window resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (isExpanded && window.innerWidth <= 768) {
        toggleExpand();
      }
    }, 250);
  });
  
  // Auto-hide after 5 seconds of inactivity
  function startInactivityTimer() {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      if (!isExpanded) {
        buttonContainer.classList.add('hiding');
        setTimeout(() => {
          buttonContainer.classList.remove('visible');
        }, 400);
      }
    }, 5000);
  }
  
  // Reset inactivity timer on user interaction
  ['mousemove', 'click', 'touchstart', 'scroll'].forEach(event => {
    document.addEventListener(event, () => {
      if (userHasScrolled) {
        startInactivityTimer();
      }
    });
  });
});

// ==== QUICK ACCESS FAB (MOBILE) ====
document.addEventListener('DOMContentLoaded', function() {
  const mainFab = document.getElementById('mainFab');
  const fabMenu = document.getElementById('fabMenu');
  
  if (!mainFab || !fabMenu) return;
  
  let isOpen = false;
  
  mainFab.addEventListener('click', function(e) {
    e.stopPropagation();
    isOpen = !isOpen;
    mainFab.classList.toggle('active');
    fabMenu.classList.toggle('active');
  });
  
  // Close menu when clicking outside
  document.addEventListener('click', function(event) {
    if (isOpen && !event.target.closest('.quick-access-fab')) {
      isOpen = false;
      mainFab.classList.remove('active');
      fabMenu.classList.remove('active');
    }
  });
  
  // Add touch feedback
  const buttons = document.querySelectorAll('.fab-item-button');
  buttons.forEach(button => {
    button.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('touchend', function() {
      this.style.transform = '';
    });
  });
});

// ==== BACK TO TOP BUTTON ====
document.addEventListener('DOMContentLoaded', function() {
  const backToTopButton = document.getElementById('back-to-top');
  const footer = document.getElementById('modern-footer');
  
  if (!backToTopButton) return;
  
  window.addEventListener('scroll', function() {
    const triggerPoint = document.body.scrollHeight * 0.3;
    const footerTop = footer ? footer.offsetTop : document.body.scrollHeight;
    const scrollPosition = window.scrollY + window.innerHeight;
    
    // Show button when past 30% of page
    if (window.scrollY > triggerPoint) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
    
    // Change color when overlapping footer
    if (scrollPosition >= footerTop) {
      backToTopButton.classList.add('white');
    } else {
      backToTopButton.classList.remove('white');
    }
  });
  
  // Scroll to top behavior
  backToTopButton.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ==== DONATION FORM ENHANCEMENTS ====
document.addEventListener('DOMContentLoaded', function() {
  // PayPal button styling
  const paypalOption = document.querySelector('input[name="payment_method"][value="paypal"]');
  const donateButton = document.querySelector('.donate-button');
  
  if (paypalOption && donateButton) {
    const updateDonateButton = () => {
      if (paypalOption.checked) {
        donateButton.classList.add('paypal-selected');
      } else {
        donateButton.classList.remove('paypal-selected');
      }
    };
    
    const paymentOptions = document.querySelectorAll('input[name="payment_method"]');
    paymentOptions.forEach((option) => {
      option.addEventListener('change', updateDonateButton);
    });
    
    updateDonateButton();
  }
  
  // Fix frequency toggle to maintain pill shape
  setTimeout(function() {
    const frequencyToggle = document.querySelector('.frequency-toggle, #frequency-toggle');
    if (frequencyToggle) {
      // Ensure pill shape styles are applied
      frequencyToggle.style.borderRadius = '50px';
      frequencyToggle.style.overflow = 'hidden';
      
      // Add event listeners to handle the toggle
      const labels = frequencyToggle.querySelectorAll('.frequency-toggle__label');
      const radios = frequencyToggle.querySelectorAll('input[type="radio"]');
      
      labels.forEach((label, index) => {
        label.addEventListener('click', function() {
          // Remove selected class from all labels
          labels.forEach(l => l.classList.remove('selected'));
          // Add selected class to clicked label
          this.classList.add('selected');
          
          // Update the toggle class
          if (index === 0) {
            frequencyToggle.classList.remove('monthly');
            frequencyToggle.classList.add('one-time');
          } else {
            frequencyToggle.classList.remove('one-time');
            frequencyToggle.classList.add('monthly');
          }
          
          // Check the corresponding radio
          if (radios[index]) {
            radios[index].checked = true;
          }
        });
      });
      
      // Set initial state based on existing classes
      if (frequencyToggle.classList.contains('monthly')) {
        labels[1]?.classList.add('selected');
      } else {
        labels[0]?.classList.add('selected');
      }
    }
  }, 1000);
  
  // Add icons to labels
  const donateSection = document.querySelector('#donate');
  if (donateSection) {
    const creditCardLabel = donateSection.querySelector('label[for="credit-card"]');
    if (creditCardLabel) creditCardLabel.classList.add('credit-card-icon');
    
    const addressLabel = donateSection.querySelector('label[for="address"]');
    if (addressLabel) addressLabel.classList.add('location-icon');
    
    const calendarLabel = donateSection.querySelector('label[for="frequency-toggle"]');
    if (calendarLabel) calendarLabel.classList.add('calendar-icon');
    
    // Typewriter effect for heading
    const heading = donateSection.querySelector('h1');
    if (heading) {
      const text = heading.textContent;
      heading.textContent = '';
      let i = 0;
      const typeEffect = () => {
        if (i < text.length) {
          heading.textContent += text[i];
          i++;
          setTimeout(typeEffect, 50);
        }
      };
      typeEffect();
    }
    
    // Enhance next button
    const nextButton = donateSection.querySelector('.js-next-button');
    if (nextButton) {
      nextButton.innerHTML = `Next <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10.293 2.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 11-1.414-1.414L14.586 10H4a1 1 0 110-2h10.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>`;
    }
  }
});

// ==== IMAGE GRID REBUILD ====
document.addEventListener('DOMContentLoaded', function() {
  function getImageUrl(element) {
    if (!element) return '';
    if (element.style && element.style.backgroundImage) {
      return element.style.backgroundImage.replace(/url\(['"]?(.*?)['"]?\)/g, '$1');
    }
    if (element.src) {
      return element.src;
    }
    return '';
  }
  
  function rebuildImageGrid() {
    const container = document.querySelector('.sneak-peek-container');
    if (!container) {
      console.log('Sneak peek container not found.');
      return;
    }
    
    const allItems = Array.from(container.querySelectorAll('.sneak-peek-item'));
    if (allItems.length === 0) {
      console.log('No sneak peek items found.');
      return;
    }
    
    const panelData = allItems.map(item => {
      const titleElement = item.querySelector('h6 a');
      const title = titleElement ? titleElement.textContent.trim() : '';
      const url = titleElement ? titleElement.href : '#';
      let imageUrl = '';
      
      const thumbnailLink = item.querySelector('a.thumbnail');
      if (thumbnailLink) {
        const img = thumbnailLink.querySelector('img');
        imageUrl = getImageUrl(img);
      }
      
      if (!imageUrl) {
        const firstDiv = item.querySelector('div');
        if (firstDiv) {
          imageUrl = getImageUrl(firstDiv);
        }
      }
      
      return { title, url, image: imageUrl };
    });
    
    // Filter out items without an image or title
    const validPanelData = panelData.filter(panel => panel.image && panel.title);
    
    const imageGrid = document.createElement('div');
    imageGrid.className = 'image-grid';
    
    // Create rows dynamically
    const itemsPerRow = 3;
    for (let i = 0; i < validPanelData.length; i += itemsPerRow) {
      const rowData = validPanelData.slice(i, i + itemsPerRow);
      const row = document.createElement('div');
      row.className = 'image-grid-row';
      
      rowData.forEach(panel => {
        const item = document.createElement('div');
        item.className = 'image-grid-item';
        item.innerHTML = `
          <img src="${panel.image}" alt="${panel.title}" loading="lazy">
          <div class="image-grid-caption">${panel.title}</div>
          <a href="${panel.url}" class="grid-item-link" aria-label="${panel.title}"></a>
        `;
        row.appendChild(item);
      });
      
      imageGrid.appendChild(row);
    }
    
    const parentElement = container.parentNode;
    if (parentElement) {
      parentElement.replaceChild(imageGrid, container);
      console.log('Image grid rebuilt.');
      
      // Intersection Observer for staggered animations
      const panels = imageGrid.querySelectorAll('.image-grid-item');
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const delay = entry.target.closest('.image-grid').querySelectorAll('.image-grid-item').length > 3 ? 
                         index * 0.08 : index * 0.1;
            entry.target.style.transitionDelay = `${delay}s`;
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1
      });
      
      panels.forEach(panel => {
        observer.observe(panel);
      });
    } else {
      console.error('Could not find parent element to replace sneak peek container.');
    }
  }
  
  // Run rebuild function with slight delay
  setTimeout(rebuildImageGrid, 300);
});

// ==== MOBILE DONATE BUTTON FIX ====
document.addEventListener('DOMContentLoaded', function() {
  function fixMobileDonate() {
    const donateItems = document.querySelectorAll('.mobile-menu-item');
    
    donateItems.forEach(item => {
      const link = item.querySelector('a');
      
      if (link && (link.textContent.trim().toLowerCase() === 'donate' ||
          (link.href && link.href.includes('/4970020')))) {
        
        // Reset parent item styling
        item.style.cssText = "background: none; box-shadow: none; padding: 0; margin: 10px 0;";
        
        // Style only the link itself
        link.style.cssText = `
          background: #3E88EF;
          color: white;
          padding: 9px 40px;
          border-radius: 50px;
          font-weight: 700;
          display: inline-block;
          text-align: center;
          margin: 15px auto;
          text-decoration: none;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          font-size: 1.5em;
        `;
      }
    });
  }
  
  setTimeout(fixMobileDonate, 1000);
  
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => setTimeout(fixMobileDonate, 300));
  }
});

// ==== HIDE FLOATING ELEMENTS IN EMBEDDED FORMS ====
document.addEventListener('DOMContentLoaded', function() {
  function isEmbeddedPage() {
    return window.self !== window.top || window.location.href.includes("formembed.js.asp");
  }
  
  function hideAllFloatingElements() {
    document.querySelectorAll('*').forEach(el => {
      const computedStyle = window.getComputedStyle(el);
      if (computedStyle.position === 'fixed' || computedStyle.position === 'absolute') {
        el.style.display = 'none';
      }
    });
  }
  
  if (isEmbeddedPage()) {
    hideAllFloatingElements();
  }
});

// ==== HIDE ELEMENTS ON SPECIFIC PAGES ====
document.addEventListener('DOMContentLoaded', function() {
  var currentURL = window.location.href;
  var pagesToHideOn = [
    "/6798725/", // Seder page
    "/6798726/", // Other Pesach page
    "/6798727/"  // Other Pesach page
  ];
  
  // Check if the current URL is one of the pages to hide on
  for (var i = 0; i < pagesToHideOn.length; i++) {
    if (currentURL.indexOf(pagesToHideOn[i]) > -1) {
      document.body.classList.add('hide-on-these-pages');
      break;
    }
  }
});

// ==== MOBILE NAVIGATION SCRIPT ====
window.addEventListener('load', function() {
  // Check if embedded page
  function isEmbeddedPage() {
    return window.self !== window.top || window.location.href.includes("formembed.js.asp");
  }
  if (isEmbeddedPage()) {
    console.log("Mobile Nav: Skipping execution on embedded page.");
    return;
  }
  
  // Check if not mobile width
  if (window.innerWidth > 768) return;
  
  const body = document.body;
  if (!body) { console.error("Mobile Nav: Body not found."); return; }
  
  const currentHref = window.location.href;
  const pathname = window.location.pathname;
  const isMinisite = currentHref.includes('/aid/6798725/') || 
                     currentHref.includes('/aid/6798726/') || 
                     currentHref.includes('/aid/6798727/');
  const isHome = pathname === '/' || pathname === '/default.aspx';
  
  // Don't run on home or specific minisites
  if (isHome || isMinisite) {
    console.log('Mobile nav skipped on home/minisite.');
    return;
  }
  
  body.setAttribute('data-page-url', currentHref);
  
  // Hide Original Elements & Reset Body
  document.querySelectorAll('#header, .header_container, .co_menu_container_wrapper, .branding-search, .header-wrapper, .clearfix.links, .header_branding, .site-nav-wrapper, .cs-mobile-menu-open, button[type="button"].cs-mobile-menu-open, .mobile-menu-toggle')
    .forEach(el => { 
      if(el) el.style.cssText = 'display:none!important;height:0!important;overflow:hidden!important;margin:0!important;padding:0!important;border:none!important;visibility:hidden!important;'; 
    });
  body.style.paddingTop = '0px';
  body.style.marginTop = '0px';
  
  // Menu Item Scraping Function
  function getNavItems() {
    try {
      console.log("Mobile Nav: Starting getNavItems...");
      const menuItems = [];
      const tempMobileNavSeen = new Set();
      const primaryNavContainers = document.querySelectorAll('.main_menu_container, .co_menu_container');
      
      if (primaryNavContainers.length === 0) {
        console.warn("Mobile Nav: No nav containers found.");
        return [];
      }
      
      primaryNavContainers.forEach((container) => {
        const items = container.querySelectorAll('.co_menu_item');
        items.forEach((item, itemIndex) => {
          const parentLink = item.querySelector('a.parent, a.bg_extension');
          const submenuContainer = item.querySelector('.co_submenu_container');
          
          if (parentLink && parentLink.textContent) {
            const text = parentLink.textContent.trim().replace(/\s+/g, ' ');
            let url = parentLink.getAttribute('href');
            if (!url || url.trim() === '' || url.trim() === 'javascript:void(0);') {
              url = '#';
            }
            
            const menuItem = { 
              text: text, 
              url: url, 
              hasSubmenu: false, 
              submenu: [], 
              isDonate: item.classList.contains('donate_link') || text.toLowerCase().includes('donate') 
            };
            
            if (submenuContainer) {
              const subLinks = submenuContainer.querySelectorAll(':scope > .wrapper > .column_wrapper > .co_column > a.item');
              
              subLinks.forEach(subLink => {
                if (subLink.tagName === 'A' && subLink.textContent) {
                  const subUrl = subLink.getAttribute('href');
                  if (subUrl && subUrl.trim() !== '#' && subLink.textContent.trim() !== '') {
                    menuItem.submenu.push({
                      text: subLink.textContent.trim().replace(/\s+/g, ' '),
                      url: subUrl
                    });
                  }
                }
              });
              menuItem.hasSubmenu = menuItem.submenu.length > 0;
              if (menuItem.hasSubmenu) { 
                console.log(`Mobile Nav: Found ${menuItem.submenu.length} direct child items for "${menuItem.text}"`); 
              }
            }
            
            const unwantedKeywords = ['home', 'search'];
            const isUnwanted = unwantedKeywords.includes(text.toLowerCase());
            
            if (text && (url !== '#' || menuItem.hasSubmenu) && !isUnwanted) {
              const key = `${text}-${url}`;
              if (!tempMobileNavSeen.has(key)) { 
                menuItems.push(menuItem); 
                tempMobileNavSeen.add(key); 
              }
            }
          }
        });
      });
      
      console.log(`Mobile Nav: FINAL ${menuItems.length} unique items processed.`);
      if (menuItems.length === 0) console.error("Mobile Nav: No menu items extracted.");
      return menuItems;
    } catch (error) {
      console.error('Mobile Nav: Error in getNavItems:', error);
      return [];
    }
  }
  
  // Build Menu HTML
  function buildMenuHTML(items) {
    if (!items || items.length === 0) { 
      return '<p style="padding:20px; text-align:center; color:#888;">Menu content not found.</p>'; 
    }
    
    let html = '<ul class="menu-items" role="menu">';
    items.forEach((item, index) => {
      if (item.isDonate) return;
      
      const liClasses = item.hasSubmenu ? "menu-item has-children" : "menu-item";
      html += `<li class="${liClasses}" role="none">`;
      
      if (item.hasSubmenu) {
        const id = `submenu-toggle-${index}`;
        html += `
          <input type="checkbox" id="${id}" class="submenu-toggle">
          <a href="${item.url}" class="menu-item-link" role="menuitem">${item.text}</a>
          <label for="${id}" class="menu-item-toggle-icon" aria-label="Toggle submenu for ${item.text}">
            <svg class="menu-item-chevron" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </label>
          <ul class="submenu" role="menu">
            ${item.submenu.map(sub => `<li class="submenu-item" role="none"><a href="${sub.url}" role="menuitem">${sub.text}</a></li>`).join('')}
          </ul>`;
      } else {
        html += `<a href="${item.url}" role="menuitem">${item.text}</a>`;
      }
      html += `</li>`;
    });
    html += '</ul>';
    return html;
  }
  
  // Create Header & Menu Elements
  const header = document.createElement('div');
  header.className = 'modern-mobile-header';
  header.innerHTML = `
    <input type="checkbox" id="menu-toggle-state" class="menu-state">
    <label for="menu-toggle-state" class="menu-toggle" aria-label="Toggle Menu"><div class="hamburger-icon"><span></span><span></span><span></span></div></label>
    <a href="/" class="mobile-site-title"><span class="home-icon" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></span> Chabad of New Mexico</a>
    <input type="checkbox" id="search-toggle-state" class="search-state">
    <label for="search-toggle-state" class="search-toggle" aria-label="Toggle Search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3E88EF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></label>
    <div class="search-overlay" id="search-overlay" aria-hidden="true"><div class="search-form"><form action="/search/results.asp" method="get" role="search"><input type="text" name="searchWord" class="search-input" placeholder="Search..." aria-label="Search Input"></form></div></div>`;
  
  if(body.firstChild) { 
    body.insertBefore(header, body.firstChild); 
  } else { 
    body.appendChild(header); 
  }
  
  const menu = document.createElement('div');
  menu.id = 'mobile-menu';
  menu.setAttribute('aria-hidden', 'true');
  
  // Populate Menu
  const navItems = getNavItems();
  menu.innerHTML = buildMenuHTML(navItems);
  
  // Add bottom links and donate button
  if (navItems && navItems.length > 0) {
    const bottomLinks = document.createElement('div');
    bottomLinks.className = 'menu-bottom-links';
    bottomLinks.setAttribute('role', 'navigation');
    bottomLinks.innerHTML = `
      <a href="/" class="menu-bottom-link-item"><div class="menu-bottom-link-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg></div><span>Home</span></a>
      <a href="/tools/feedback.asp" class="menu-bottom-link-item"><div class="menu-bottom-link-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg></div><span>Contact</span></a>
      <a href="/tools/subscribe/default.htm" class="menu-bottom-link-item"><div class="menu-bottom-link-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg></div><span>Subscribe</span></a>`;
    menu.appendChild(bottomLinks);
    
    const donateItem = navItems.find(item => item.isDonate);
    const donateUrl = donateItem ? donateItem.url : '/4970020';
    const donateBtn = document.createElement('a');
    donateBtn.className = 'menu-donate-btn';
    donateBtn.href = donateUrl;
    donateBtn.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg> Donate Now`;
    menu.appendChild(donateBtn);
  }
  
  if (header) { 
    header.appendChild(menu); 
  } else { 
    console.error("Mobile Nav: Header element missing, cannot append menu."); 
  }
  
  // Event Listeners
  const menuToggle = document.getElementById('menu-toggle-state');
  const searchToggle = document.getElementById('search-toggle-state');
  const searchInput = document.querySelector('.search-input');
  const headerEl = document.querySelector('.modern-mobile-header');
  
  // Scroll Listener
  let lastY = 0;
  window.addEventListener('scroll', () => {
    if (!headerEl) return;
    const currentY = window.pageYOffset;
    if (currentY > lastY && currentY > 5) {
      if (!headerEl.classList.contains('hidden')) { 
        headerEl.classList.add('hidden'); 
      }
    } else if (currentY < lastY || currentY <= 5) {
      if (headerEl.classList.contains('hidden')) { 
        headerEl.classList.remove('hidden'); 
      }
    }
    lastY = currentY <= 0 ? 0 : currentY;
  }, { passive: true });
  
  // Toggle Handler
  function handleStateChange() {
    const menuOpen = menuToggle ? menuToggle.checked : false;
    const searchOpen = searchToggle ? searchToggle.checked : false;
    if (menuOpen || searchOpen) { 
      body.classList.add('mobile-nav-open'); 
    } else { 
      body.classList.remove('mobile-nav-open'); 
    }
    if (searchOpen && searchInput) { 
      setTimeout(() => searchInput.focus(), 100); 
    } else if (!searchOpen && searchInput) { 
      searchInput.blur(); 
    }
    if(menu) menu.setAttribute('aria-hidden', !menuOpen);
    const searchOverlay = document.getElementById('search-overlay');
    if(searchOverlay) searchOverlay.setAttribute('aria-hidden', !searchOpen);
    
    if (!menuOpen && menu) {
      menu.querySelectorAll('.menu-item-toggle-icon[aria-expanded="true"]').forEach(label => label.setAttribute('aria-expanded', 'false'));
      menu.querySelectorAll('.submenu-toggle:checked').forEach(chk => chk.checked = false);
    }
  }
  
  if(menuToggle) menuToggle.addEventListener('change', handleStateChange);
  if(searchToggle) searchToggle.addEventListener('change', handleStateChange);
  
  // Submenu ARIA handling
  if(menu) {
    menu.addEventListener('change', function(e) {
      if (e.target.classList.contains('submenu-toggle')) {
        const label = menu.querySelector(`label[for="${e.target.id}"]`);
        if(label) {
          label.setAttribute('aria-expanded', e.target.checked);
          console.log(`Mobile Nav: Checkbox ${e.target.id} changed, updated label aria-expanded to ${e.target.checked}`);
        }
      }
    });
  }
  
  // Adjust content margin
  const contentEl = document.getElementById('content');
  if (contentEl && headerEl) {
    if (window.getComputedStyle(headerEl).display !== 'none') {
      contentEl.style.marginTop = '56px';
    } else {
      contentEl.style.marginTop = '0px';
    }
  }
  
  console.log("Mobile Nav Script Initialized.");
});

// ==== FOOTER EVENTS ====
document.addEventListener('DOMContentLoaded', function() {
  // Set current year for copyright
  const currentYearEl = document.getElementById('current-year');
  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }
  
  // Function to fetch upcoming events from the menu
  function fetchUpcomingEvents() {
    const eventsContainer = document.getElementById('footer-events-container');
    if (!eventsContainer) return;
    
    // Try to find events in the main navigation
    const menuItems = document.querySelectorAll('.co_menu_item');
    let upcomingEventLinks = [];
    
    // Look for the "Upcoming Events" menu item
    menuItems.forEach(item => {
      const menuTitle = item.querySelector('.parent');
      if (menuTitle && menuTitle.textContent.includes('Upcoming')) {
        // Get all submenu links
        const subItems = item.querySelectorAll('.co_submenu_container .item');
        subItems.forEach(subItem => {
          if (subItem.getAttribute('data-aid')) {
            upcomingEventLinks.push({
              title: subItem.querySelector('span').textContent.trim(),
              url: subItem.getAttribute('href') || subItem.querySelector('a').getAttribute('href'),
              aid: subItem.getAttribute('data-aid')
            });
          }
        });
      }
    });
    
    // If no events found, use a fallback
    if (upcomingEventLinks.length === 0) {
      upcomingEventLinks = [
        { title: "Purim 2025", url: "/templates/articlecco_cdo/aid/6790089/jewish/Purim-at-Chabad-of-New-Mexico.htm" },
        { title: "Passover 2025", url: "/templates/section_cdo/aid/6798725/jewish/Passover-2025.htm" },
        { title: "JLI Courses", url: "/templates/articlecco_cdo/aid/6747699/jewish/JLI-Adult-Education-Decoding-the-Talmud.htm" }
      ];
    }
    
    // Limit to 3 events
    upcomingEventLinks = upcomingEventLinks.slice(0, 3);
    
    // Clear loading indicator
    eventsContainer.innerHTML = '';
    
    // Create event cards
    upcomingEventLinks.forEach(event => {
      const eventCard = document.createElement('div');
      eventCard.className = 'event-card';
      
      eventCard.innerHTML = `
        <div class="event-title">${event.title}</div>
        <div class="event-description">Join us for this special event at Chabad of New Mexico.</div>
        <a href="${event.url}" class="event-link">Learn More →</a>
      `;
      
      eventsContainer.appendChild(eventCard);
    });
    
    // Add "View All Events" link
    const viewAllLink = document.createElement('a');
    viewAllLink.href = "/templates/events.htm";
    viewAllLink.className = "view-all-link";
    viewAllLink.style.display = "block";
    viewAllLink.style.marginTop = "15px";
    viewAllLink.style.color = "#007aff";
    viewAllLink.style.fontSize = "14px";
    viewAllLink.style.fontWeight = "500";
    viewAllLink.textContent = "View All Events →";
    eventsContainer.appendChild(viewAllLink);
  }
  
  // Run the function after a short delay to ensure the DOM is ready
  setTimeout(fetchUpcomingEvents, 500);
});

// ==== END OF SCRIPTS ====
