let debounceTimer;
let fuse = null;
let fullData = [];

const API_URL = 'https://alqueria-production.up.railway.app/api/alqueria/pdv';

// Cargar los datos de la API
async function loadData() {
    try {
        console.log("Intentando cargar datos desde la API...");
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const data = await response.json();
        fullData = data.result || [];

        console.log("Datos cargados correctamente:", fullData);
        initializeFuse();
    } catch (error) {
        console.error("Error al cargar los datos:", error);
        alert("No se pudieron cargar los datos. Inténtalo más tarde.");
    }
}

// Inicializar Fuse.js para búsqueda rápida
function initializeFuse() {
    const options = {
        keys: ['SAP', 'CANAL', 'NOMBRE EMPRESA', 'REGIONAL NOVUUS', 'DEPARTAMENTO', 'MUNICIPIO', 'NOMBRE PV', 'DIRECCIÓN PV', 'HORARIO', 'CODIGO PDV', 'ID EMPRESA'],
        threshold: 0.3,
    };
    fuse = new Fuse(fullData, options);
}

// Manejo de la entrada de búsqueda con debounce
function handleInput() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        const query = document.getElementById('searchInput').value.trim();
        if (query) {
            performSearch(query);
        } else {
            document.getElementById('results').innerHTML = '';
        }
    }, 300);
}

// Realizar búsqueda con Fuse.js
function performSearch(query) {
    const results = fuse.search(query).map(result => result.item);
    renderResults(results);
}

// Renderizar los resultados en HTML con animaciones
function renderResults(results) {
    let output = `<h2>Resultados (${results.length} encontrados):</h2>`;

    if (results.length > 0) {
        results.forEach(result => {
            output += `
                <div class="result-item">
                    <h3>${result['NOMBRE PV'] || 'N/A'}</h3>
                    <ul>
                        <li><strong>SAP:</strong> ${result.SAP || 'N/A'}
                        <i class="material-icons copy-icon" onclick="copyToClipboard('${result.SAP}')">content_copy</i>
                        </li>
                        <li><strong>Canal:</strong> ${result.CANAL || 'N/A'}</li>
                        <li><strong>Departamento:</strong> ${result.DEPARTAMENTO || 'N/A'}</li>
                        <li><strong>Municipio:</strong> ${result.MUNICIPIO || 'N/A'}</li>
                        <li><strong>Nombre PDV:</strong> ${result['NOMBRE PV'] || 'N/A'}</li>
                        <li><strong>Dirección:</strong> ${result['DIRECCIÓN PV'] || 'N/A'}</li>
                        <li><strong>Horas Febrero 2026:</strong> ${result['HORAS MES FEBRERO 2026'] || 'N/A'}</li>
                        <li><strong>Visitas:</strong> ${result['NUMERO DE VISITAS MES'] || 'N/A'}</li>
                        <li><strong>Horario:</strong> ${result.HORARIO || 'N/A'}</li>
                    </ul>
                </div>
            `;
        });
    } else {
        output += '<p>No se encontraron resultados.</p>';
    }

    document.getElementById('results').innerHTML = output;
}

// Copiar al portapapeles
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(() => alert('Documento copiado al portapapeles'))
        .catch(err => console.error('Error:', err));
}

// Modo Oscuro
document.getElementById("darkModeToggle").addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");
});

// Cargar datos al inicio
loadData();
