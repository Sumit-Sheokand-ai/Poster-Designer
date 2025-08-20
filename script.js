// ============ ENHANCED INITIALIZATION ============
let currentImages = [];
let selectedElement = null;
let dragOffset = { x: 0, y: 0 };
let isDragging = false;
let currentFontCategory = 'all';

// Font categories for enhanced preview
const fontCategories = {
    futuristic: ['Orbitron', 'Rajdhani', 'Exo 2', 'Audiowide', 'Electrolize', 'Quantico', 'Aldrich', 'Jura', 'Play'],
    bold: ['Bebas Neue', 'Russo One', 'Anton', 'Black Ops One', 'Teko', 'Saira Condensed', 'Gemunu Libre'],
    decorative: ['Monoton', 'Faster One', 'Syncopate', 'Wallpoet', 'Creepster', 'Eater', 'Nosifer', 'Permanent Marker', 'Bungee'],
    elegant: ['Michroma', 'Gruppo', 'Bai Jamjuree', 'Abril Fatface'],
    monospace: ['Space Mono', 'Nova Mono', 'Share Tech Mono', 'Chakra Petch']
};

// All fonts combined for preview
const allFonts = [
    ...fontCategories.futuristic,
    ...fontCategories.bold,
    ...fontCategories.decorative,
    ...fontCategories.elegant,
    ...fontCategories.monospace
];

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 2000);

    createParticles();
    generateFontPreviews();
    initializeEventListeners();
    initializeImageHandling();
    initializeTabs();
    initializeFontCategories();
    updatePoster();
});

// ============ ENHANCED PARTICLE SYSTEM ============
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const colors = ['#00ff88', '#00d4ff', '#ff0080', '#8000ff', '#ff6b00', '#ffff00'];
    
    for (let i = 0; i < 75; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
        particle.style.width = particle.style.height = (Math.random() * 3 + 2) + 'px';
        particlesContainer.appendChild(particle);
    }
}

// ============ ENHANCED FONT PREVIEW GENERATION ============
function generateFontPreviews() {
    const previewGrid = document.getElementById('fontPreviewGrid');
    const currentText = document.getElementById('textInput').value || 'PREVIEW';
    
    // Determine which fonts to show based on current category
    let fontsToShow;
    if (currentFontCategory === 'all') {
        fontsToShow = allFonts;
    } else {
        fontsToShow = fontCategories[currentFontCategory] || allFonts;
    }
    
    previewGrid.innerHTML = '';
    
    fontsToShow.forEach(font => {
        const previewItem = document.createElement('div');
        previewItem.className = 'font-preview-item';
        previewItem.dataset.font = font;
        
        // Determine category for display
        let category = 'Other';
        Object.keys(fontCategories).forEach(cat => {
            if (fontCategories[cat].includes(font)) {
                category = cat.charAt(0).toUpperCase() + cat.slice(1);
            }
        });
        
        previewItem.innerHTML = `
            <div class="font-name">${font}</div>
            <div class="font-sample" style="font-family: '${font}', sans-serif;">${currentText}</div>
            <div class="font-category">${category}</div>
        `;
        
        previewItem.addEventListener('click', () => {
            document.getElementById('fontSelect').value = font;
            updatePoster();
            
            // Update active preview
            document.querySelectorAll('.font-preview-item').forEach(item => {
                item.classList.remove('active');
            });
            previewItem.classList.add('active');
        });
        
        previewGrid.appendChild(previewItem);
    });
}

// ============ FONT CATEGORY SYSTEM ============
function initializeFontCategories() {
    const categoryButtons = document.querySelectorAll('.font-tab-btn');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update current category and regenerate previews
            currentFontCategory = category;
            generateFontPreviews();
        });
    });
}

// ============ TAB SYSTEM ============
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Remove active from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active to clicked button and corresponding content
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}

// ============ IMAGE HANDLING ============
function initializeImageHandling() {
    const uploadZone = document.getElementById('uploadZone');
    const imageInput = document.getElementById('imageInput');

    // Click to browse
    uploadZone.addEventListener('click', () => imageInput.click());

    // File input change
    imageInput.addEventListener('change', handleFileSelect);

    // Drag and drop
    uploadZone.addEventListener('dragover', handleDragOver);
    uploadZone.addEventListener('dragleave', handleDragLeave);
    uploadZone.addEventListener('drop', handleFileDrop);

    // Image controls
    document.getElementById('removeImageBtn').addEventListener('click', removeCurrentImage);
    document.getElementById('resetImageBtn').addEventListener('click', resetImageFilters);
}

function handleDragOver(e) {
    e.preventDefault();
    document.getElementById('uploadZone').classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    document.getElementById('uploadZone').classList.remove('drag-over');
}

function handleFileDrop(e) {
    e.preventDefault();
    document.getElementById('uploadZone').classList.remove('drag-over');
    const files = e.dataTransfer.files;
    handleFiles(files);
}

function handleFileSelect(e) {
    const files = e.target.files;
    handleFiles(files);
}

function handleFiles(files) {
    for (let file of files) {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                addImageToCanvas(e.target.result, file.name);
            };
            reader.readAsDataURL(file);
        }
    }
}

function addImageToCanvas(imageSrc, fileName) {
    const canvas = document.getElementById('poster-canvas');
    const imageElement = document.createElement('div');
    imageElement.className = 'canvas-element';
    imageElement.style.position = 'absolute';
    imageElement.style.left = '50%';
    imageElement.style.top = '50%';
    imageElement.style.transform = 'translate(-50%, -50%)';
    imageElement.innerHTML = `
        <img src="${imageSrc}" class="canvas-image" alt="${fileName}">
        <div class="resize-handle"></div>
    `;

    canvas.appendChild(imageElement);
    
    // Add to images array
    currentImages.push({
        element: imageElement,
        src: imageSrc,
        name: fileName
    });

    // Show image controls
    document.getElementById('imageControls').classList.add('active');
    document.getElementById('imagePreview').src = imageSrc;

    // Add to layer list
    addToLayerList(fileName, 'image', imageElement);

    // Make it draggable
    makeElementDraggable(imageElement);

    // Select this element
    selectElement(imageElement);
}

function makeElementDraggable(element) {
    element.addEventListener('mousedown', startDragging);
}

function startDragging(e) {
    if (e.target.classList.contains('resize-handle')) return;
    
    selectedElement = e.currentTarget;
    selectElement(selectedElement);
    isDragging = true;
    
    const rect = selectedElement.getBoundingClientRect();
    const canvasRect = document.getElementById('poster-canvas').getBoundingClientRect();
    
    dragOffset.x = e.clientX - rect.left;
    dragOffset.y = e.clientY - rect.top;

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
}

function drag(e) {
    if (!isDragging || !selectedElement) return;
    
    const canvasRect = document.getElementById('poster-canvas').getBoundingClientRect();
    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;
    
    selectedElement.style.left = x + 'px';
    selectedElement.style.top = y + 'px';
    selectedElement.style.transform = 'none';
}

function stopDragging() {
    isDragging = false;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDragging);
}

function selectElement(element) {
    // Remove selection from all elements
    document.querySelectorAll('.canvas-element').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Add selection to current element
    element.classList.add('selected');
    selectedElement = element;
}

function addToLayerList(name, type, element) {
    const layerList = document.getElementById('layerList');
    const layerItem = document.createElement('div');
    layerItem.className = 'layer-item';
    layerItem.dataset.layer = type + '-' + Date.now();
    layerItem.innerHTML = `
        <div class="layer-icon">${type === 'image' ? '📷' : 'T'}</div>
        <div class="layer-name">${name}</div>
        <div class="layer-visibility" data-visible="true">👁️</div>
    `;
    
    layerItem.addEventListener('click', () => {
        document.querySelectorAll('.layer-item').forEach(item => item.classList.remove('active'));
        layerItem.classList.add('active');
        selectElement(element);
    });
    
    layerList.appendChild(layerItem);
}

function removeCurrentImage() {
    if (selectedElement && selectedElement.querySelector('.canvas-image')) {
        selectedElement.remove();
        // Remove from currentImages array
        currentImages = currentImages.filter(img => img.element !== selectedElement);
        
        // Hide controls if no images left
        if (currentImages.length === 0) {
            document.getElementById('imageControls').classList.remove('active');
        }
        
        // Remove from layer list
        document.querySelectorAll('.layer-item').forEach(item => {
            if (item.classList.contains('active')) {
                item.remove();
            }
        });
        
        selectedElement = null;
    }
}

function resetImageFilters() {
    document.getElementById('imageScale').value = 100;
    document.getElementById('imagePosX').value = 50;
    document.getElementById('imagePosY').value = 50;
    document.getElementById('imageRotation').value = 0;
    document.getElementById('imageBrightness').value = 100;
    document.getElementById('imageContrast').value = 100;
    document.getElementById('imageSaturation').value = 100;
    document.getElementById('imageBlur').value = 0;
    
    updateImageStyle();
}

function updateImageStyle() {
    if (!selectedElement || !selectedElement.querySelector('.canvas-image')) return;
    
    const img = selectedElement.querySelector('.canvas-image');
    const scale = document.getElementById('imageScale').value;
    const posX = document.getElementById('imagePosX').value;
    const posY = document.getElementById('imagePosY').value;
    const rotation = document.getElementById('imageRotation').value;
    const brightness = document.getElementById('imageBrightness').value;
    const contrast = document.getElementById('imageContrast').value;
    const saturation = document.getElementById('imageSaturation').value;
    const blur = document.getElementById('imageBlur').value;
    
    selectedElement.style.left = posX + '%';
    selectedElement.style.top = posY + '%';
    selectedElement.style.transform = `translate(-50%, -50%) scale(${scale/100}) rotate(${rotation}deg)`;
    
    img.style.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) blur(${blur}px)`;
    
    // Update slider values
    document.getElementById('imageScaleValue').textContent = scale + '%';
    document.getElementById('imagePosXValue').textContent = posX + '%';
    document.getElementById('imagePosYValue').textContent = posY + '%';
    document.getElementById('imageRotationValue').textContent = rotation + '°';
    document.getElementById('imageBrightnessValue').textContent = brightness + '%';
    document.getElementById('imageContrastValue').textContent = contrast + '%';
    document.getElementById('imageSaturationValue').textContent = saturation + '%';
    document.getElementById('imageBlurValue').textContent = blur + 'px';
}

// ============ ENHANCED EVENT LISTENERS ============
function initializeEventListeners() {
    // Text controls
    document.getElementById('textInput').addEventListener('input', (e) => {
        updatePoster();
        generateFontPreviews(); // Update previews with new text
    });
    
    document.getElementById('fontSelect').addEventListener('change', updatePoster);
    document.getElementById('fontWeight').addEventListener('change', updatePoster);
    
    // Font style and transform buttons
    document.querySelectorAll('[data-font-style]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-font-style]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updatePoster();
        });
    });

    document.querySelectorAll('[data-text-transform]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-text-transform]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updatePoster();
        });
    });
    
    // Sliders
    document.getElementById('fontSize').addEventListener('input', (e) => {
        document.getElementById('fontSizeValue').textContent = e.target.value + 'px';
        updatePoster();
    });

    document.getElementById('letterSpacing').addEventListener('input', (e) => {
        document.getElementById('letterSpacingValue').textContent = e.target.value + 'px';
        updatePoster();
    });

    document.getElementById('lineHeight').addEventListener('input', (e) => {
        document.getElementById('lineHeightValue').textContent = e.target.value;
        updatePoster();
    });

    // Text position and rotation
    document.getElementById('textPosX').addEventListener('input', updatePoster);
    document.getElementById('textPosY').addEventListener('input', updatePoster);
    document.getElementById('textRotation').addEventListener('input', updatePoster);
    
    // Colors
    document.getElementById('textColor').addEventListener('change', updatePoster);
    document.getElementById('bgColor').addEventListener('change', updatePoster);
    
    // Image controls
    document.getElementById('imageScale').addEventListener('input', updateImageStyle);
    document.getElementById('imagePosX').addEventListener('input', updateImageStyle);
    document.getElementById('imagePosY').addEventListener('input', updateImageStyle);
    document.getElementById('imageRotation').addEventListener('input', updateImageStyle);
    document.getElementById('imageBrightness').addEventListener('input', updateImageStyle);
    document.getElementById('imageContrast').addEventListener('input', updateImageStyle);
    document.getElementById('imageSaturation').addEventListener('input', updateImageStyle);
    document.getElementById('imageBlur').addEventListener('input', updateImageStyle);
    
    // Style buttons
    document.querySelectorAll('[data-bg]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-bg]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updatePoster();
        });
    });

    document.querySelectorAll('[data-shadow]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-shadow]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updatePoster();
        });
    });

    document.querySelectorAll('[data-outline]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-outline]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updatePoster();
        });
    });

    document.querySelectorAll('[data-size]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-size]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updateCanvasSize();
        });
    });
    
    // Effect buttons
    document.querySelectorAll('[data-effect]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('[data-effect]').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            updatePoster();
        });
    });
    
    // Action buttons
    document.getElementById('randomizeBtn').addEventListener('click', randomizePoster);
    document.getElementById('resetBtn').addEventListener('click', resetPoster);
    document.getElementById('duplicateBtn').addEventListener('click', duplicateText);
    document.getElementById('exportBtn').addEventListener('click', exportPoster);
}

// ============ ENHANCED POSTER UPDATE ============
function updatePoster() {
    const canvas = document.getElementById('poster-canvas');
    const text = document.getElementById('posterText');
    const textInput = document.getElementById('textInput').value || 'FUTURE DESIGN';
    const fontFamily = document.getElementById('fontSelect').value;
    const fontWeight = document.getElementById('fontWeight').value;
    const fontSize = document.getElementById('fontSize').value;
    const letterSpacing = document.getElementById('letterSpacing').value;
    const lineHeight = document.getElementById('lineHeight').value;
    const textColor = document.getElementById('textColor').value;
    const bgColor = document.getElementById('bgColor').value;
    const posX = document.getElementById('textPosX').value;
    const posY = document.getElementById('textPosY').value;
    const rotation = document.getElementById('textRotation').value;
    
    // Get active font style and text transform
    const activeFontStyle = document.querySelector('[data-font-style].active')?.dataset.fontStyle || 'normal';
    const activeTextTransform = document.querySelector('[data-text-transform].active')?.dataset.textTransform || 'none';
    
    // Update text content and styling
    text.innerHTML = textInput.replace(/\n/g, '<br>');
    text.style.fontFamily = `'${fontFamily}', sans-serif`;
    text.style.fontWeight = fontWeight;
    text.style.fontSize = fontSize + 'px';
    text.style.fontStyle = activeFontStyle;
    text.style.textTransform = activeTextTransform;
    text.style.letterSpacing = letterSpacing + 'px';
    text.style.lineHeight = lineHeight;
    text.style.color = textColor;
    text.style.left = posX + '%';
    text.style.top = posY + '%';
    text.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
    text.setAttribute('data-text', textInput);
    
    // Update slider values
    document.getElementById('textPosXValue').textContent = posX + '%';
    document.getElementById('textPosYValue').textContent = posY + '%';
    document.getElementById('textRotationValue').textContent = rotation + '°';
    
    // Update background
    const activeBackground = document.querySelector('[data-bg].active')?.dataset.bg || 'gradient1';
    
    switch(activeBackground) {
        case 'gradient1': canvas.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'; break;
        case 'gradient2': canvas.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'; break;
        case 'gradient3': canvas.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'; break;
        case 'gradient4': canvas.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'; break;
        case 'gradient5': canvas.style.background = 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'; break;
        case 'gradient6': canvas.style.background = 'linear-gradient(135deg, #ff9a00 0%, #ff0080 100%)'; break;
        case 'gradient7': canvas.style.background = 'linear-gradient(135deg, #8000ff 0%, #ff6b00 100%)'; break;
        case 'solid': canvas.style.background = bgColor; break;
    }
    
    // Apply text shadows
    const activeShadow = document.querySelector('[data-shadow].active')?.dataset.shadow || 'none';
    text.classList.remove('text-shadow-1', 'text-shadow-2', 'text-shadow-3');
    if (activeShadow !== 'none') {
        text.classList.add('text-' + activeShadow);
    }

    // Apply text outlines
    const activeOutline = document.querySelector('[data-outline].active')?.dataset.outline || 'none';
    text.classList.remove('text-border', 'text-outline');
    if (activeOutline !== 'none') {
        text.classList.add('text-' + activeOutline);
    }
    
    // Apply effects
    const activeEffect = document.querySelector('[data-effect].active')?.dataset.effect || 'none';
    text.classList.remove('neon-glow', 'glitch-effect', 'hologram-effect', 'matrix-effect', 'pulse-animation', 'cyberpunk-effect');
    
    switch(activeEffect) {
        case 'glow': text.classList.add('neon-glow'); break;
        case 'glitch': text.classList.add('glitch-effect'); break;
        case 'hologram': text.classList.add('hologram-effect'); break;
        case 'matrix': text.classList.add('matrix-effect'); break;
        case 'pulse': text.classList.add('pulse-animation'); break;
        case 'cyberpunk': text.classList.add('cyberpunk-effect'); break;
    }
}

function updateCanvasSize() {
    const canvas = document.getElementById('poster-canvas');
    const activeSize = document.querySelector('[data-size].active')?.dataset.size || '16:9';
    
    switch(activeSize) {
        case '16:9': 
            canvas.style.aspectRatio = '16/9';
            canvas.style.height = 'auto';
            break;
        case '1:1': 
            canvas.style.aspectRatio = '1/1';
            canvas.style.height = 'auto';
            break;
        case '9:16': 
            canvas.style.aspectRatio = '9/16';
            canvas.style.height = 'auto';
            break;
        case '4:3': 
            canvas.style.aspectRatio = '4/3';
            canvas.style.height = 'auto';
            break;
    }
}

// ============ ENHANCED FUNCTIONS ============
function randomizePoster() {
    const randomTexts = [
        'CYBER PUNK', 'NEON DREAMS', 'FUTURE TECH', 'DIGITAL ART', 'SYNTH WAVE',
        'MATRIX CODE', 'HOLOGRAM', 'QUANTUM LEAP', 'NEURAL NET', 'SPACE AGE',
        'DATA STREAM', 'VIRTUAL REALITY', 'AI POWERED', 'TECH NOIR', 'DIGITAL WORLD'
    ];
    
    const fonts = ['Orbitron', 'Rajdhani', 'Exo 2', 'Bebas Neue', 'Russo One', 'Black Ops One', 'Audiowide', 'Monoton'];
    const weights = ['300', '400', '500', '600', '700', '800', '900'];
    const backgrounds = ['gradient1', 'gradient2', 'gradient3', 'gradient4', 'gradient5', 'gradient6', 'gradient7', 'solid'];
    const effects = ['none', 'glow', 'glitch', 'hologram', 'pulse', 'cyberpunk'];
    const fontStyles = ['normal', 'italic', 'oblique'];
    const textTransforms = ['none', 'uppercase', 'lowercase', 'capitalize'];
    
    document.getElementById('textInput').value = randomTexts[Math.floor(Math.random() * randomTexts.length)];
    document.getElementById('fontSelect').value = fonts[Math.floor(Math.random() * fonts.length)];
    document.getElementById('fontWeight').value = weights[Math.floor(Math.random() * weights.length)];
    document.getElementById('fontSize').value = Math.floor(Math.random() * 150) + 50;
    document.getElementById('fontSizeValue').textContent = document.getElementById('fontSize').value + 'px';
    document.getElementById('letterSpacing').value = Math.floor(Math.random() * 10) - 2;
    document.getElementById('letterSpacingValue').textContent = document.getElementById('letterSpacing').value + 'px';
    document.getElementById('textColor').value = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    document.getElementById('bgColor').value = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    
    // Random font style
    document.querySelectorAll('[data-font-style]').forEach(btn => btn.classList.remove('active'));
    const randomFontStyle = fontStyles[Math.floor(Math.random() * fontStyles.length)];
    document.querySelector(`[data-font-style="${randomFontStyle}"]`).classList.add('active');
    
    // Random text transform
    document.querySelectorAll('[data-text-transform]').forEach(btn => btn.classList.remove('active'));
    const randomTextTransform = textTransforms[Math.floor(Math.random() * textTransforms.length)];
    document.querySelector(`[data-text-transform="${randomTextTransform}"]`).classList.add('active');
    
    // Random background
    document.querySelectorAll('[data-bg]').forEach(btn => btn.classList.remove('active'));
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    document.querySelector(`[data-bg="${randomBg}"]`).classList.add('active');
    
    // Random effect
    document.querySelectorAll('[data-effect]').forEach(btn => btn.classList.remove('active'));
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    document.querySelector(`[data-effect="${randomEffect}"]`).classList.add('active');
    
    updatePoster();
    generateFontPreviews();
}

function resetPoster() {
    document.getElementById('textInput').value = 'FUTURE DESIGN';
    document.getElementById('fontSelect').value = 'Orbitron';
    document.getElementById('fontWeight').value = '400';
    document.getElementById('fontSize').value = 80;
    document.getElementById('fontSizeValue').textContent = '80px';
    document.getElementById('letterSpacing').value = 0;
    document.getElementById('letterSpacingValue').textContent = '0px';
    document.getElementById('lineHeight').value = 1.2;
    document.getElementById('lineHeightValue').textContent = '1.2';
    document.getElementById('textPosX').value = 50;
    document.getElementById('textPosY').value = 50;
    document.getElementById('textRotation').value = 0;
    document.getElementById('textColor').value = '#00ff88e0';
    document.getElementById('bgColor').value = '#0a0a0f';
    
    // Reset all buttons
    document.querySelectorAll('[data-bg]').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-bg="gradient1"]').classList.add('active');
    
    document.querySelectorAll('[data-effect]').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-effect="none"]').classList.add('active');

    document.querySelectorAll('[data-shadow]').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-shadow="none"]').classList.add('active');

    document.querySelectorAll('[data-outline]').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-outline="none"]').classList.add('active');

    document.querySelectorAll('[data-font-style]').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-font-style="normal"]').classList.add('active');

    document.querySelectorAll('[data-text-transform]').forEach(btn => btn.classList.remove('active'));
    document.querySelector('[data-text-transform="none"]').classList.add('active');
    
    updatePoster();
    generateFontPreviews();
}

function duplicateText() {
    const canvas = document.getElementById('poster-canvas');
    const originalText = document.getElementById('posterText');
    const duplicateText = originalText.cloneNode(true);
    duplicateText.id = 'posterText' + Date.now();
    duplicateText.style.left = (parseFloat(originalText.style.left) + 5) + '%';
    duplicateText.style.top = (parseFloat(originalText.style.top) + 5) + '%';
    
    canvas.appendChild(duplicateText);
    makeElementDraggable(duplicateText);
    
    // Add to layer list
    addToLayerList('Duplicate Text', 'text', duplicateText);
}

// ============ ENHANCED EXPORT FUNCTION ============
function exportPoster() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const canvasElement = document.getElementById('poster-canvas');
    
    // Set canvas dimensions based on selected size
    const activeSize = document.querySelector('[data-size].active')?.dataset.size || '16:9';
    switch(activeSize) {
        case '16:9': canvas.width = 1920; canvas.height = 1080; break;
        case '1:1': canvas.width = 1080; canvas.height = 1080; break;
        case '9:16': canvas.width = 1080; canvas.height = 1920; break;
        case '4:3': canvas.width = 1440; canvas.height = 1080; break;
    }
    
    // Draw background
    const activeBackground = document.querySelector('[data-bg].active')?.dataset.bg || 'gradient1';
    if (activeBackground === 'solid') {
        ctx.fillStyle = document.getElementById('bgColor').value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
        // Create gradient backgrounds for export
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        switch(activeBackground) {
            case 'gradient1': gradient.addColorStop(0, '#667eea'); gradient.addColorStop(1, '#764ba2'); break;
            case 'gradient2': gradient.addColorStop(0, '#f093fb'); gradient.addColorStop(1, '#f5576c'); break;
            case 'gradient3': gradient.addColorStop(0, '#4facfe'); gradient.addColorStop(1, '#00f2fe'); break;
            case 'gradient4': gradient.addColorStop(0, '#43e97b'); gradient.addColorStop(1, '#38f9d7'); break;
            case 'gradient5': gradient.addColorStop(0, '#fa709a'); gradient.addColorStop(1, '#fee140'); break;
            case 'gradient6': gradient.addColorStop(0, '#ff9a00'); gradient.addColorStop(1, '#ff0080'); break;
            case 'gradient7': gradient.addColorStop(0, '#8000ff'); gradient.addColorStop(1, '#ff6b00'); break;
        }
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw images first (so they appear behind text)
    currentImages.forEach(imgData => {
        const img = new Image();
        img.onload = function() {
            const element = imgData.element;
            const rect = element.getBoundingClientRect();
            const canvasRect = canvasElement.getBoundingClientRect();
            
            const x = (rect.left - canvasRect.left) / canvasRect.width * canvas.width;
            const y = (rect.top - canvasRect.top) / canvasRect.height * canvas.height;
            const width = rect.width / canvasRect.width * canvas.width;
            const height = rect.height / canvasRect.height * canvas.height;
            
            ctx.drawImage(img, x, y, width, height);
        };
        img.src = imgData.src;
    });
    
    // Draw text elements
    const textElements = canvasElement.querySelectorAll('[id^="posterText"]');
    textElements.forEach(textEl => {
        const text = textEl.textContent;
        const style = window.getComputedStyle(textEl);
        const fontSize = parseFloat(style.fontSize) * (canvas.width / canvasElement.offsetWidth);
        const fontFamily = style.fontFamily;
        const fontWeight = style.fontWeight;
        const color = style.color;
        
        const rect = textEl.getBoundingClientRect();
        const canvasRect = canvasElement.getBoundingClientRect();
        
        const x = (rect.left - canvasRect.left + rect.width/2) / canvasRect.width * canvas.width;
        const y = (rect.top - canvasRect.top + rect.height/2) / canvasRect.height * canvas.height;
        
        ctx.save();
        ctx.fillStyle = color;
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Handle multi-line text
        const lines = text.split('\n');
        lines.forEach((line, index) => {
            const lineY = y + (index - (lines.length - 1) / 2) * fontSize * 1.2;
            ctx.fillText(line, x, lineY);
        });
        
        ctx.restore();
    });
    
    // Download
    const link = document.createElement('a');
    link.download = `poster-enhanced-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    
    // Visual feedback
    const exportBtn = document.getElementById('exportBtn');
    const originalText = exportBtn.textContent;
    exportBtn.textContent = '✅ Exported Successfully!';
    exportBtn.style.background = 'linear-gradient(45deg, #43e97b, #38f9d7)';
    
    setTimeout(() => {
        exportBtn.textContent = originalText;
        exportBtn.style.background = 'linear-gradient(45deg, #ff006e, #fb5607)';
    }, 3000);
}
