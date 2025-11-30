# Mindful Moments - Meditation Image Generator

A vanilla JavaScript web application that allows users to create personalized meditation cards by overlaying text onto elegant background images.

## Features
- **Landing Page**: elegant entry point with business info and Instagram link.
- **Image Selection**: Choose from 3 curated background styles.
- **Text Overlay**: Input custom meditation phrases.
- **Canvas Generation**: Instantly generates a downloadable PNG image with the text overlaid.
- **Responsive Design**: Fully functional on mobile and desktop.

## Setup & Usage
1.  Clone the repository.
2.  Open `index.html` in your browser.
3.  No build step required (Vanilla JS/CSS).

## Customization
### Changing Background Images
1.  Place your 1080x1920 PNG files in the `assets/` folder.
2.  Update `script.js` `CONFIG` object:
    ```javascript
    const CONFIG = {
        images: [
            {
                src: 'assets/your-image-1.png',
                textBounds: { x: 100, y: 500, w: 880, h: 400 } // Adjust coordinates as needed
            },
            // ...
        ]
    };
    ```

### Adjusting Text Style
Modify the `generateImage` function in `script.js` to change font family, size, or color.

## License
All rights reserved.
