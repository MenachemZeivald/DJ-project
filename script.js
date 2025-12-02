// Configuration
const CONFIG = {
    images: [
        {
            src: 'assets/photo1.jpg',
            textBounds: { x: 100, y: 500, w: 880, h: 400 }
        },
        {
            src: 'assets/photo2.jpg',
            textBounds: { x: 100, y: 800, w: 880, h: 400 }
        },
        {
            src: 'assets/photo3.jpg',
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
    img.src = config.src;

    await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
    });

    // Wait for font to load
    const fontSize = 120; // Base size
    const fontSpec = `500 ${fontSize}px "FbRegevTurbo-Regular"`;
    try {
        await document.fonts.load(fontSpec);
    } catch (e) {
        console.warn('Font loading failed, using fallback', e);
    }

    // Set Canvas Size to match Image
    canvas.width = img.width;
    canvas.height = img.height;

    // Draw Background
    ctx.drawImage(img, 0, 0);

    // Configure Text
    ctx.fillStyle = state.selectedImageIndex === 0 ? '#6e6a8e' : '#3d3d3d'; // Dark grey, elegant
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Dynamic Font Sizing
    ctx.font = `${fontSpec}, serif`;

    // Draw Text Centered
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    ctx.fillText(state.userText, x, y);

    // Export to Image Element
    resultImage.src = canvas.toDataURL('image/png');
}
