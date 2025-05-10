// Wedding Photo Gallery - Gallery JavaScript
// Handles fetching and displaying uploaded images

const UPLOADCARE_PUBLIC_KEY = config.UPLOADCARE_PUBLIC_KEY;
const GALLERY_CONTAINER = document.querySelector('.gallery-grid');
const LOADING_ELEMENT = document.querySelector('.loading');

// Fetch images from Uploadcare
async function fetchImages() {
    try {
        // Show loading state
        LOADING_ELEMENT.style.display = 'flex';

        console.log('Using Uploadcare key:', UPLOADCARE_PUBLIC_KEY); // Debug log

        // Get the list of files from Uploadcare
        const response = await fetch('https://api.uploadcare.com/files/', {
            headers: {
                'Authorization': `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error:', response.status, errorText);
            throw new Error(`Failed to fetch images: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('API Response:', data); // Debug log

        // Filter for image files and sort by upload date (newest first)
        const images = data.results
            .filter(file => file.mime_type.startsWith('image/'))
            .sort((a, b) => new Date(b.datetime_uploaded) - new Date(a.datetime_uploaded));

        // Display images
        displayImages(images);
    } catch (error) {
        console.error('Error fetching images:', error);
        showError(`Failed to load images: ${error.message}`);
    } finally {
        // Hide loading state
        LOADING_ELEMENT.style.display = 'none';
    }
}

// Display images in the gallery grid
function displayImages(images) {
    // Clear existing content
    GALLERY_CONTAINER.innerHTML = '';

    if (images.length === 0) {
        showEmptyState();
        return;
    }

    // Create and append image elements
    images.forEach(image => {
        const imageUrl = `https://ucarecdn.com/${image.uuid}/-/preview/-/quality/lightest/`;
        const imageElement = createImageElement(imageUrl, image.original_filename);
        GALLERY_CONTAINER.appendChild(imageElement);
    });
}

// Create an image element with lazy loading
function createImageElement(url, alt) {
    const wrapper = document.createElement('div');
    wrapper.className = 'gallery-item';

    const img = document.createElement('img');
    img.src = url;
    img.alt = alt || 'Wedding photo';
    img.loading = 'lazy';

    // Add loading animation
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.3s ease-in-out';

    // Show image when loaded
    img.onload = () => {
        img.style.opacity = '1';
    };

    // Handle image click for lightbox
    wrapper.addEventListener('click', () => {
        showLightbox(url, alt);
    });

    wrapper.appendChild(img);
    return wrapper;
}

// Show lightbox for image preview
function showLightbox(url, alt) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="${url}" alt="${alt || 'Wedding photo'}">
            <button class="lightbox-close">&times;</button>
        </div>
    `;

    // Close lightbox on click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.className === 'lightbox-close') {
            lightbox.remove();
        }
    });

    // Close lightbox on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            lightbox.remove();
        }
    });

    document.body.appendChild(lightbox);
}

// Show error message
function showError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    GALLERY_CONTAINER.appendChild(errorElement);
}

// Show empty state message
function showEmptyState() {
    const emptyElement = document.createElement('div');
    emptyElement.className = 'empty-state';
    emptyElement.innerHTML = `
        <h2>No Photos Yet</h2>
        <p>Be the first to share your wedding memories!</p>
        <a href="index.html" class="btn">Upload Photos</a>
    `;
    GALLERY_CONTAINER.appendChild(emptyElement);
}

// Add infinite scroll
let isLoading = false;
let hasMore = true;
let currentPage = 1;

async function loadMoreImages() {
    if (isLoading || !hasMore) return;

    isLoading = true;
    currentPage++;

    try {
        const response = await fetch(`https://api.uploadcare.com/files/?page=${currentPage}`, {
            headers: {
                'Authorization': `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch more images');
        }

        const data = await response.json();
        const images = data.results
            .filter(file => file.mime_type.startsWith('image/'))
            .sort((a, b) => new Date(b.datetime_uploaded) - new Date(a.datetime_uploaded));

        if (images.length === 0) {
            hasMore = false;
            return;
        }

        displayImages(images);
    } catch (error) {
        console.error('Error loading more images:', error);
        showError('Failed to load more images');
    } finally {
        isLoading = false;
    }
}

// Intersection Observer for infinite scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && hasMore) {
            loadMoreImages();
        }
    });
}, {
    rootMargin: '100px'
});

// Observe the last image in the gallery
function observeLastImage() {
    const images = document.querySelectorAll('.gallery-item');
    if (images.length > 0) {
        observer.observe(images[images.length - 1]);
    }
}

// Initialize gallery when the page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchImages();
    observeLastImage();
}); 