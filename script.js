// Configuration
const CONFIG = {
    images: [
        {
            src: 'https://placehold.co/1080x1920/e0e0e0/909090?text=Background+1',
            textBounds: { x: 100, y: 500, w: 880, h: 400 }
        },
        {
            src: 'https://placehold.co/1080x1920/f0f0e0/909090?text=Background+2',
            textBounds: { x: 100, y: 800, w: 880, h: 400 }
        },
        {
            src: 'https://placehold.co/1080x1920/e0f0f0/909090?text=Background+3',
            textBounds: { x: 100, y: 600, w: 880, h: 400 }
        }
    ]
};

// State
let state = {
    selectedImageIndex: 0,
    userText: ''
};

// DOM Elements
const screens = {
    landing: document.getElementById('landing-page'),
    selection: document.getElementById('selection-screen'),
    result: document.getElementById('result-screen')
};

const buttons = {
    start: document.getElementById('start-btn'),
    generate: document.getElementById('generate-btn'),
    download: document.getElementById('download-btn'),
    back: document.getElementById('back-btn')
};

const inputs = {
    text: document.getElementById('user-text'),
    imageOptions: document.querySelectorAll('.image-option')
};

const canvas = document.getElementById('result-canvas');
const ctx = canvas.getContext('2d');
const resultImage = document.getElementById('result-image');

// Navigation Functions
function showScreen(screenName) {
    Object.values(screens).forEach(screen => {
        screen.classList.remove('active');
        screen.classList.add('hidden');
    });

    // Small delay to allow fade out
    setTimeout(() => {
        Object.values(screens).forEach(s => s.style.display = 'none'); // Fully hide

        const target = screens[screenName];
        target.style.display = 'flex';
        // Force reflow
        void target.offsetWidth;

        target.classList.remove('hidden');
        target.classList.add('active');
    }, 500);
}

// Event Listeners
buttons.start.addEventListener('click', () => {
    // Hide landing, show selection
    screens.landing.classList.remove('active');
    screens.landing.classList.add('hidden');

    screens.selection.classList.remove('hidden');
    screens.selection.classList.add('active');
});

inputs.imageOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Update UI
        inputs.imageOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');

        // Update State
        state.selectedImageIndex = parseInt(option.dataset.index);
    });
});

buttons.generate.addEventListener('click', () => {
    const text = inputs.text.value.trim();
    if (!text) {
        alert('אנא כתבו מסר כלשהו');
        return;
    }
    state.userText = text;

    generateImage().then(() => {
        screens.selection.classList.remove('active');
        screens.selection.classList.add('hidden');

        screens.result.classList.remove('hidden');
        screens.result.classList.add('active');
    });
});

buttons.back.addEventListener('click', () => {
    screens.result.classList.remove('active');
    screens.result.classList.add('hidden');

    screens.selection.classList.remove('hidden');
    screens.selection.classList.add('active');
});

buttons.download.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'mindful-moment.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

// Core Logic: Image Generation
async function generateImage() {
    const config = CONFIG.images[state.selectedImageIndex];

    // Load Image
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Allow cross-origin images (fixes SecurityError)
    img.src = config.src;

    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });

    // Set Canvas Size to match Image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw Background
    ctx.drawImage(img, 0, 0);

    // Configure Text
    ctx.fillStyle = '#2c2c2c'; // Dark grey, elegant
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Dynamic Font Sizing
    const fontSize = 60; // Base size
    ctx.font = `400 ${fontSize}px "Playfair Display", serif`;

    // Draw Text with Wrapping
    wrapText(ctx, state.userText,
        config.textBounds.x + (config.textBounds.w / 2), // Center X
        config.textBounds.y, // Start Y
        config.textBounds.w,
        fontSize * 1.5 // Line height
    );

    // Export to Image Element
    resultImage.src = canvas.toDataURL('image/png');
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    const lines = [];

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
        } else {
            line = testLine;
        }
    }
    lines.push(line);

    // Calculate total height to vertically center
    const totalHeight = lines.length * lineHeight;
    let currentY = y - (totalHeight / 2) + (lineHeight / 2); // Adjust starting Y to center block

    for (let i = 0; i < lines.length; i++) {
        context.fillText(lines[i], x, currentY);
        currentY += lineHeight;
    }
}
