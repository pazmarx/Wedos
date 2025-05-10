// Wedding Photo Gallery - Main JavaScript
// Handles file uploads and camera capture functionality

// Uploadcare configuration
const UPLOADCARE_PUBLIC_KEY = '09433680de3afcc5ee82'; // Replace with your Uploadcare public key

// Initialize Uploadcare widget for device uploads
const uploadWidget = uploadcare.Widget('[role=uploadcare-uploader]', {
    publicKey: UPLOADCARE_PUBLIC_KEY,
    imagesOnly: true,
    imagePreviewMaxSize: 25 * 1024 * 1024, // 25MB
    imageShrink: '1024x1024', // Resize large images
    locale: 'en',
    localePluralize: true,
    multiple: true,
    multipleMax: 10, // Maximum 10 files per upload
    multipleMin: 1,
    preferredTypes: '.png,.jpg,.jpeg,.heic,.heif',
    tabs: 'file camera url gdrive dropbox',
    dragAndDrop: true,
    clearable: true,
    systemDialog: true,
    inputAcceptTypes: 'image/*'
});

// Initialize camera widget
const cameraWidget = uploadcare.Widget('[role=uploadcare-camera]', {
    publicKey: UPLOADCARE_PUBLIC_KEY,
    imagesOnly: true,
    imagePreviewMaxSize: 25 * 1024 * 1024,
    imageShrink: '1024x1024',
    locale: 'en',
    localePluralize: true,
    multiple: false, // Camera capture is single file
    preferredTypes: '.png,.jpg,.jpeg',
    tabs: 'camera', // Only show camera tab
    clearable: true,
    systemDialog: true,
    inputAcceptTypes: 'image/*'
});

// Handle successful uploads
function handleUploadSuccess(file) {
    // Show success message
    const successMessage = document.createElement('div');
    successMessage.className = 'upload-success';
    successMessage.textContent = 'Photo uploaded successfully!';
    document.querySelector('.upload-container').appendChild(successMessage);

    // Remove success message after 3 seconds
    setTimeout(() => {
        successMessage.remove();
    }, 3000);

    // Redirect to gallery after successful upload
    setTimeout(() => {
        window.location.href = 'gallery.html';
    }, 2000);
}

// Handle upload errors
function handleUploadError(error) {
    console.error('Upload error:', error);
    const errorMessage = document.createElement('div');
    errorMessage.className = 'upload-error';
    errorMessage.textContent = 'Error uploading photo. Please try again.';
    document.querySelector('.upload-container').appendChild(errorMessage);

    // Remove error message after 3 seconds
    setTimeout(() => {
        errorMessage.remove();
    }, 3000);
}

// Set up event listeners for both widgets
uploadWidget.onUploadComplete((fileInfo) => {
    handleUploadSuccess(fileInfo);
});

cameraWidget.onUploadComplete((fileInfo) => {
    handleUploadSuccess(fileInfo);
});

uploadWidget.onDialogOpen(() => {
    // Add loading state
    document.body.classList.add('uploading');
});

uploadWidget.onDialogClose(() => {
    // Remove loading state
    document.body.classList.remove('uploading');
});

cameraWidget.onDialogOpen(() => {
    document.body.classList.add('uploading');
});

cameraWidget.onDialogClose(() => {
    document.body.classList.remove('uploading');
});

// Add error handling for both widgets
uploadWidget.onError(handleUploadError);
cameraWidget.onError(handleUploadError);

// Check if the device has a camera
async function checkCameraAvailability() {
    try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const hasCamera = devices.some(device => device.kind === 'videoinput');

        const cameraButton = document.querySelector('.btn-camera');
        if (cameraButton) {
            if (!hasCamera) {
                cameraButton.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Error checking camera availability:', error);
    }
}

// Initialize camera check when the page loads
document.addEventListener('DOMContentLoaded', () => {
    checkCameraAvailability();
}); 