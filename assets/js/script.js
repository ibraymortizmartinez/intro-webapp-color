// Al principio de tu script.js
let history = JSON.parse(localStorage.getItem('color_logs')) || [];

function updateColor() {
    const r = parseInt(document.getElementById('red').value);
    const g = parseInt(document.getElementById('green').value);
    const b = parseInt(document.getElementById('blue').value);

    const hex = rgbToHex(r, g, b);
    
    // Sincronizar UI
    document.getElementById('valR').innerText = r;
    document.getElementById('valG').innerText = g;
    document.getElementById('valB').innerText = b;
    document.getElementById('colorDisplay').style.backgroundColor = hex;
    document.getElementById('colorDisplay').style.boxShadow = `0 0 30px ${hex}`;
    document.getElementById('hexInput').value = hex.toUpperCase();
    
    // Actualizar Armonías y Textos
    updateHarmonies(r, g, b);
    document.getElementById('rgbText').innerText = `${r}, ${g}, ${b}`;
    document.getElementById('hslText').innerText = rgbToHsl(r, g, b);

    // Bordes dinámicos
    document.querySelectorAll('.bento-item').forEach(item => {
        item.style.borderColor = hex;
    });
}

function addToHistory(color) {
    if (history.includes(color)) return; // Evitar duplicados seguidos
    history.unshift(color);
    if (history.length > 12) history.pop();
    
    localStorage.setItem('color_logs', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('recentColors');
    container.innerHTML = '';
    
    history.forEach(color => {
        const div = document.createElement('div');
        div.className = 'recent-swatch';
        div.style.backgroundColor = color;
        div.style.color = color; // Para el shadow
        
        div.onclick = () => {
            const rgb = hexToRgb(color);
            document.getElementById('red').value = rgb.r;
            document.getElementById('green').value = rgb.g;
            document.getElementById('blue').value = rgb.b;
            updateColor();
        };
        container.appendChild(div);
    });
}

// Evento de copia modificado
document.getElementById('copyBtn').onclick = function() {
    const val = document.getElementById('hexInput').value;
    navigator.clipboard.writeText(val);
    addToHistory(val);
    
    this.innerText = "LOGGED_";
    setTimeout(() => this.innerText = "COPY_HEX", 800);
};

// Carga inicial del historial al abrir la página
renderHistory();

const sliders = document.querySelectorAll('.slider');
const hexInput = document.getElementById('hexInput');
const colorDisplay = document.getElementById('colorDisplay');
const recentList = document.getElementById('recentColors');

// Actualización principal
function updateColor() {
    const r = parseInt(document.getElementById('red').value);
    const g = parseInt(document.getElementById('green').value);
    const b = parseInt(document.getElementById('blue').value);

    const hex = rgbToHex(r, g, b);
    
    // Actualizar Interfaz
    document.getElementById('valR').innerText = r;
    document.getElementById('valG').innerText = g;
    document.getElementById('valB').innerText = b;
    
    colorDisplay.style.backgroundColor = `rgb(${r},${g},${b})`;
    colorDisplay.style.boxShadow = `0 0 40px ${hex}`;
    hexInput.value = hex.toUpperCase();
    
    document.getElementById('rgbText').innerText = `${r}, ${g}, ${b}`;
    document.getElementById('hslText').innerText = rgbToHsl(r, g, b);

    updateHarmonies(r, g, b);
    
    // Aplicar color a bordes
    document.querySelectorAll('.bento-item').forEach(item => {
        item.style.borderColor = hex;
    });
}

// Lógica de Armonías
function updateHarmonies(r, g, b) {
    const hsl = rgbToHslArray(r, g, b); // [h, s, l]

    // Complementario (+180 grados)
    const compH = (hsl[0] + 180) % 360;
    const compColor = `hsl(${compH}, ${hsl[1]}%, ${hsl[2]}%)`;
    document.getElementById('compColor').style.backgroundColor = compColor;

    // Análogos (+30 y -30 grados)
    document.getElementById('anaColor1').style.backgroundColor = `hsl(${(hsl[0] + 30) % 360}, ${hsl[1]}%, ${hsl[2]}%)`;
    document.getElementById('anaColor2').style.backgroundColor = `hsl(${(hsl[0] - 30 + 360) % 360}, ${hsl[1]}%, ${hsl[2]}%)`;
}

// Input Manual HEX
hexInput.addEventListener('input', (e) => {
    let hex = e.target.value;
    if (/^#?[0-9A-F]{6}$/i.test(hex)) {
        if(!hex.startsWith('#')) hex = '#' + hex;
        const rgb = hexToRgb(hex);
        document.getElementById('red').value = rgb.r;
        document.getElementById('green').value = rgb.g;
        document.getElementById('blue').value = rgb.b;
        updateColor();
    }
});

// Botón Aleatorio
document.getElementById('randomBtn').addEventListener('click', () => {
    document.getElementById('red').value = Math.floor(Math.random() * 256);
    document.getElementById('green').value = Math.floor(Math.random() * 256);
    document.getElementById('blue').value = Math.floor(Math.random() * 256);
    updateColor();
});

// Auxiliares de conversión
function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join("");
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHslArray(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function rgbToHsl(r, g, b) {
    const res = rgbToHslArray(r, g, b);
    return `${res[0]}, ${res[1]}%, ${res[2]}%`;
}

// Copiado al portapapeles genérico
function setupClickCopy(id, textSource) {
    document.getElementById(id).addEventListener('click', () => {
        const text = document.getElementById(textSource).innerText;
        navigator.clipboard.writeText(text);
        const originalText = document.getElementById(id).innerHTML;
        document.getElementById(id).innerHTML = "DATA_COPIED_TO_BUFFER";
        setTimeout(() => document.getElementById(id).innerHTML = originalText, 1000);
    });
}

setupClickCopy('copyRgb', 'rgbText');
setupClickCopy('copyHsl', 'hslText');

// Inicialización
sliders.forEach(s => s.addEventListener('input', updateColor));
updateColor();

function updateColor() {
    const r = parseInt(document.getElementById('red').value);
    const g = parseInt(document.getElementById('green').value);
    const b = parseInt(document.getElementById('blue').value);

    const hex = rgbToHex(r, g, b);
    
    document.getElementById('valR').innerText = r;
    document.getElementById('valG').innerText = g;
    document.getElementById('valB').innerText = b;
    
    colorDisplay.style.backgroundColor = `rgb(${r},${g},${b})`;
    colorDisplay.style.boxShadow = `0 0 40px ${hex}`;
    document.getElementById('hexInput').value = hex.toUpperCase();
    
    document.getElementById('rgbText').innerText = `${r}, ${g}, ${b}`;
    document.getElementById('hslText').innerText = rgbToHsl(r, g, b);

    updateHarmonies(r, g, b);
    
    // Cambiar bordes dinámicos
    document.querySelectorAll('.bento-item').forEach(item => {
        item.style.borderColor = hex;
    });
}

// --- LÓGICA DE CARGA DE COLOR ---
function loadColor(hex) {
    const rgb = hexToRgb(hex);
    if (rgb) {
        // 1. Mover los sliders físicamente
        document.getElementById('red').value = rgb.r;
        document.getElementById('green').value = rgb.g;
        document.getElementById('blue').value = rgb.b;
        
        // 2. Ejecutar la actualización general
        updateColor();
    }
}

// --- ACTUALIZACIÓN DE ARMONÍAS (Modificado para clics) ---
function updateHarmonies(r, g, b) {
    const hsl = rgbToHslArray(r, g, b);

    // Complementario
    const compH = (hsl[0] + 180) % 360;
    const compHex = hslToHex(compH, hsl[1], hsl[2]);
    const compDiv = document.getElementById('compColor');
    compDiv.style.backgroundColor = compHex;
    compDiv.onclick = () => loadColor(compHex); // <--- CLIC FUNCIONAL

    // Análogo 1
    const ana1H = (hsl[0] + 30) % 360;
    const ana1Hex = hslToHex(ana1H, hsl[1], hsl[2]);
    const ana1Div = document.getElementById('anaColor1');
    ana1Div.style.backgroundColor = ana1Hex;
    ana1Div.onclick = () => loadColor(ana1Hex); // <--- CLIC FUNCIONAL

    // Análogo 2
    const ana2H = (hsl[0] - 30 + 360) % 360;
    const ana2Hex = hslToHex(ana2H, hsl[1], hsl[2]);
    const ana2Div = document.getElementById('anaColor2');
    ana2Div.style.backgroundColor = ana2Hex;
    ana2Div.onclick = () => loadColor(ana2Hex); // <--- CLIC FUNCIONAL
}

// --- RENDERIZADO DE HISTORIAL (Modificado para clics) ---
function renderHistory() {
    const container = document.getElementById('recentColors');
    container.innerHTML = '';
    
    history.forEach(color => {
        const div = document.createElement('div');
        div.className = 'recent-swatch';
        div.style.backgroundColor = color;
        div.style.color = color; 
        
        // Al hacer clic, cargamos el color en el diamante y sliders
        div.onclick = () => loadColor(color); 
        
        container.appendChild(div);
    });
}

// --- FUNCIONES AUXILIARES NECESARIAS ---
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// Asegúrate de que tu función hexToRgb sea robusta:
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Lógica de Uptime para el Footer
let seconds = 0;
let minutes = 0;
let hours = 0;

function updateUptime() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    
    const timeString = 
        (hours < 10 ? "0" + hours : hours) + ":" + 
        (minutes < 10 ? "0" + minutes : minutes) + ":" + 
        (seconds < 10 ? "0" + seconds : seconds);
        
    const uptimeElement = document.getElementById('uptime-counter');
    if (uptimeElement) uptimeElement.innerText = timeString;
}

// Iniciar el contador al cargar la página
setInterval(updateUptime, 1000);

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. RELOJ DEL SISTEMA ---
    const updateClock = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-GB', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        });
        document.getElementById('os-clock').textContent = timeString;
    };
    setInterval(updateClock, 1000);
    updateClock();

    // --- 2. CONTADOR DE UPTIME (Footer) ---
    let seconds = 0;
    const uptimeElement = document.getElementById('uptime-counter');
    setInterval(() => {
        seconds++;
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        uptimeElement.textContent = `${hrs}:${mins}:${secs}`;
    }, 1000);

    // --- 3. NAVEGACIÓN DEL NAVBAR (Funcionalidad de Botones) ---
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // No cancelamos el evento para que el hash (#) cambie en la URL
            
            // Quitar clase activa de todos
            navLinks.forEach(l => l.classList.remove('active'));
            // Añadir al seleccionado
            e.currentTarget.classList.add('active');

            // Efecto visual: Simular carga del sistema
            const statusText = document.querySelector('.status-bar .blink');
            const originalText = statusText.textContent;
            statusText.textContent = "LOADING_MODULE...";
            
            setTimeout(() => {
                statusText.textContent = originalText;
            }, 600);
        });
    });

    // --- 4. FUNCIÓN EXTRA: Botón RANDOM_SEED ---
    const randomBtn = document.getElementById('randomBtn');
    randomBtn.addEventListener('click', () => {
        // Generar color aleatorio
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        
        // Aquí llamarías a la función que ya tengas para actualizar los sliders
        // Ejemplo: updateSystemColors(r, g, b);
        console.log(`New Seed Generated: RGB(${r},${g},${b})`);
    });
});



// Base de datos de información para los apartados
const infoData = {
    "TOOLS": "Módulo de extracción cromática activo. Use los sliders para manipular los canales RGB en tiempo real.",
    "PALETTES": "Accediendo a la base de datos de armonías. Generando esquemas complementarios y análogos.",
    "DOCS": "Protocolos de documentación v3.0.42. Revise la API_ROOT para integraciones externas.",
    "GITHUB": "Accediendo al repositorio central. Código fuente y protocolos de desarrollo disponibles.",
    "LINKEDIN": "Estableciendo conexión con el perfil profesional. Revisando credenciales del operador.",
    "INSTAGRAM": "Abriendo galería visual. Desplegando registros estéticos del laboratorio.",
    "SYSTEM_LOGS": "Estado del kernel: OPTIMAL. No se detectan intrusiones en el sector de red."
};

function showNotification(textRaw) {
    const container = document.getElementById('notification-container');
    
    // LIMPIEZA AVANZADA: 
    // 1. Convertimos a Mayúsculas.
    // 2. Quitamos barras (/), puntos (•) y cualquier cosa que no sea letra o guion bajo.
    const key = textRaw.toUpperCase()
                       .replace(/\//g, '')  // Quita las barras
                       .replace(/•/g, '')   // Quita los puntos decorativos
                       .trim();             // Quita espacios en blanco
    
    console.log("Detectado:", key); // Para que verifiques en la consola

    const text = infoData[key] || `Accediendo al módulo ${key}...`;
    
    const notification = document.createElement('div');
    notification.className = 'cyber-notification';
    notification.innerHTML = `
        <h5>> SYSTEM_INFO: ${key}</h5>
        <p>${text}</p>
    `;
    
    container.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 4000);
}

// Evento para capturar los clics
document.querySelectorAll('.nav-links a, .footer-column a').forEach(link => {
    link.addEventListener('click', (e) => {
        // e.preventDefault(); // Opcional: evita que la página salte al hacer clic
        showNotification(e.currentTarget.textContent);
    });
});