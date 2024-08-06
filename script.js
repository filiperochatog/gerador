document.getElementById('generate').addEventListener('click', generatePalette);
document.getElementById('paletteType').addEventListener('change', updateDescription);
document.getElementById('invertColors').addEventListener('click', invertColors);
document.getElementById('eyedropper').addEventListener('click', activateEyedropper);

const colorBlocks = document.querySelectorAll('.color');
colorBlocks.forEach(block => {
    block.addEventListener('click', () => copyColor(block));
});

function generatePalette() {
    const type = document.getElementById('paletteType').value;
    const colorCount = parseInt(document.getElementById('colorCount').value);
    const baseColor = getRandomColor();
    let colors = [baseColor];

    if (type === 'complementary') {
        colors.push(getComplementaryColor(baseColor));
    } else {
        switch (type) {
            case 'analogous':
                colors.push(...getAnalogousColors(baseColor, colorCount - 1));
                break;
            case 'triadic':
                colors.push(...getTriadicColors(baseColor, colorCount - 1));
                break;
            case 'tetradic':
                colors.push(...getTetradicColors(baseColor, colorCount - 1));
                break;
        }
    }

    for (let i = 1; i <= colors.length; i++) {
        const colorBlock = document.getElementById(`color${i}`);
        colorBlock.style.backgroundColor = colors[i - 1];
        colorBlock.innerText = colors[i - 1];
        colorBlock.setAttribute('data-color', colors[i - 1]);
    }
    for (let i = colors.length + 1; i <= 5; i++) {
        const colorBlock = document.getElementById(`color${i}`);
        colorBlock.style.backgroundColor = '#f4f4f4';
        colorBlock.innerText = '';
        colorBlock.removeAttribute('data-color');
    }

    // Atualizar o fundo de pré-visualização
    const backgroundPreview = document.getElementById('backgroundPreview');
    backgroundPreview.style.background = `linear-gradient(45deg, ${colors.join(', ')})`;
}

function invertColors() {
    const colors = [];
    const colorBlocks = document.querySelectorAll('.color');
    colorBlocks.forEach(block => {
        if (block.getAttribute('data-color')) {
            colors.push(block.getAttribute('data-color'));
        }
    });
    colors.reverse();
    for (let i = 0; i < colors.length; i++) {
        const colorBlock = document.getElementById(`color${i + 1}`);
        colorBlock.style.backgroundColor = colors[i];
        colorBlock.innerText = colors[i];
        colorBlock.setAttribute('data-color', colors[i]);
    }
}

function copyColor(block) {
    const color = block.getAttribute('data-color');
    navigator.clipboard.writeText(color).then(() => {
        showFeedback();
    });
}

function showFeedback() {
    const feedback = document.createElement('div');
    feedback.className = 'copied show';
    feedback.innerText = 'Cor copiada!';
    document.body.appendChild(feedback);
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b];
}

function rgbToHex(r, g, b) {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getComplementaryColor(hex) {
    const [r, g, b] = hexToRgb(hex);
    const compColor = rgbToHex(255 - r, 255 - g, 255 - b);
    return compColor;
}

function getAnalogousColors(hex, count) {
    const colors = [];
    const [r, g, b] = hexToRgb(hex);
    for (let i = 1; i <= count; i++) {
        colors.push(rgbToHex((r + 30 * i) % 256, (g + 30 * i) % 256, (b + 30 * i) % 256));
    }
    return colors;
}

function getTriadicColors(hex, count) {
    const colors = [];
    const [r, g, b] = hexToRgb(hex);
    for (let i = 1; i <= count; i++) {
        colors.push(rgbToHex((r + 120 * i) % 256, (g + 120 * i) % 256, (b + 120 * i) % 256));
    }
    return colors;
}

function getTetradicColors(hex, count) {
    const colors = [];
    const [r, g, b] = hexToRgb(hex);
    for (let i = 1; i <= count; i++) {
        colors.push(rgbToHex((r + 90 * i) % 256, (g + 90 * i) % 256, (b + 90 * i) % 256));
    }
    return colors;
}

function updateDescription() {
    const type = document.getElementById('paletteType').value;
    const description = document.getElementById('description');
    const colorCountInput = document.getElementById('colorCount');
    switch (type) {
        case 'complementary':
            description.innerText = "Paleta Complementar: Combinações de cores que estão opostas no círculo cromático. Ex: azul e laranja.";
            colorCountInput.disabled = true;
            colorCountInput.value = 2;
            break;
        case 'analogous':
            description.innerText = "Paleta Análoga: Combinações de cores que estão próximas umas das outras no círculo cromático. Ex: azul, azul-esverdeado e azul-violeta.";
            colorCountInput.disabled = false;
            break;
        case 'triadic':
            description.innerText = "Paleta Triádica: Combinações de três cores que estão igualmente espaçadas no círculo cromático. Ex: vermelho, azul e amarelo.";
            colorCountInput.disabled = false;
            break;
        case 'tetradic':
            description.innerText = "Paleta Tetrádica: Combinações de quatro cores que estão espaçadas uniformemente no círculo cromático. Ex: vermelho, verde, azul e laranja.";
            colorCountInput.disabled = false;
            break;
    }
}

function activateEyedropper() {
    if (!window.EyeDropper) {
        alert('Seu navegador não suporta a ferramenta Eyedropper.');
        return;
    }
    const eyeDropper = new EyeDropper();
    eyeDropper.open().then(result => {
        const pickedColor = result.sRGBHex;
        document.getElementById('color1').style.backgroundColor = pickedColor;
        document.getElementById('color1').innerText = pickedColor;
        document.getElementById('color1').setAttribute('data-color', pickedColor);
    }).catch(e => {
        console.log(e);
    });
}

// Inicializar a descrição ao carregar a página
updateDescription();
