# Wedding Photo Gallery

A beautiful, responsive web application for collecting and displaying wedding photos from guests. Built with HTML, CSS, and JavaScript, this application allows guests to easily upload photos either from their devices or directly from their cameras.

## Features

- Clean, elegant design suitable for weddings
- Two upload options:
  - Upload from device
  - Capture from camera
- Responsive gallery view of all uploaded photos
- Mobile-friendly interface
- No login required for guests
- Powered by Uploadcare for reliable file handling

## Setup

1. Clone this repository
2. Sign up for a free Uploadcare account at https://uploadcare.com
3. Get your public key from the Uploadcare dashboard
4. Replace `YOUR_PUBLIC_KEY` in `js/main.js` and `js/gallery.js` with your actual Uploadcare public key
5. Deploy to GitHub Pages or your preferred hosting service

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- Uses Uploadcare Widget for file uploads
- Responsive design using CSS Grid and Flexbox
- No backend required - all photos are stored in Uploadcare
- Cross-browser compatible

## Customization

The website can be easily customized by modifying:
- Colors in `css/styles.css`
- Layout in HTML files
- Uploadcare widget settings in JavaScript files

## License

MIT License - feel free to use and modify for your wedding! 