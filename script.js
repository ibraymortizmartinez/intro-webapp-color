// Obtener referencias a los controles deslizantes, campos de entrada y el color picker
const redRange = document.getElementById('redRange');
const greenRange = document.getElementById('greenRange');
const blueRange = document.getElementById('blueRange');

const redInput = document.getElementById('redInput');
const greenInput = document.getElementById('greenInput');
const blueInput = document.getElementById('blueInput');

const colorPicker = document.getElementById('colorPicker');

const colorDisplay = document.getElementById('color-display');
const hexCode = document.getElementById('hexCode');

// Función para actualizar el color según los valores RGB
function updateColor() {
    const r = parseInt(redRange.value);
    const g = parseInt(greenRange.value);
    const b = parseInt(blueRange.value);

    const rgbColor = `rgb(${r}, ${g}, ${b})`;
    const hexColor = rgbToHex(r, g, b);

    colorDisplay.style.backgroundColor = rgbColor;
    hexCode.textContent = hexColor;

    // Actualizar los campos de entrada para reflejar el valor de los controles deslizantes
    redInput.value = r;
    greenInput.value = g;
    blueInput.value = b;

    // Actualizar el color picker para reflejar el color actual
    colorPicker.value = hexColor;
}

// Función para convertir un valor RGB a hexadecimal
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// Función para actualizar los controles deslizantes cuando se escribe en los campos de entrada
function updateFromInput() {
    const r = parseInt(redInput.value);
    const g = parseInt(greenInput.value);
    const b = parseInt(blueInput.value);

    redRange.value = r;
    greenRange.value = g;
    blueRange.value = b;

    updateColor();
}

// Función para actualizar los controles de RGB desde el color picker
function updateFromPicker() {
    const hexColor = colorPicker.value;
    const rgb = hexToRgb(hexColor);

    redRange.value = rgb.r;
    greenRange.value = rgb.g;
    blueRange.value = rgb.b;

    updateColor();
}

// Función para convertir hexadecimal a RGB
function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return { r, g, b };
}

// Eventos para los controles deslizantes
redRange.addEventListener('input', updateColor);
greenRange.addEventListener('input', updateColor);
blueRange.addEventListener('input', updateColor);

// Eventos para los campos de entrada
redInput.addEventListener('input', updateFromInput);
greenInput.addEventListener('input', updateFromInput);
blueInput.addEventListener('input', updateFromInput);

// Evento para el color picker
colorPicker.addEventListener('input', updateFromPicker);

// Inicializa el color al cargar la página
updateColor();
