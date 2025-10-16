const botonCambioTema = document.querySelector('.themeSelector')
const seccionOperadores = document.querySelectorAll('.numeros-operadores')
const body = document.querySelector('body')
const botones = document.querySelectorAll('.boton, .boton-punto, .button-suma, .button-resta, .button-mult, .button-divi');
const botonIgual = document.querySelector('.button-igual')
const botonReset = document.querySelector('.button-reset')
const botonDelete = document.querySelector('.button-delete')
const botonSuma = document.querySelector('.button-suma')
let displayResult = document.querySelector('.result-number')
const operationDisplay = document.querySelector('.operation-display')
const operadores = document.querySelectorAll('.button-suma, .button-resta, .button-mult, .button-divi');

let currentDisplay = '0';
let operador = null;
let valorAnterior = null;
let valorActual = null;
let resultado = null;

console.log(displayResult);

// Función para obtener el valor numérico actual manejando puntos decimales
function obtenerValorActual() {
    // Si el display termina con punto, quitarlo antes de convertir
    if (currentDisplay.endsWith('.')) {
        return parseFloat(currentDisplay.slice(0, -1));
    }
    return parseFloat(currentDisplay);
}

// Función para verificar si el display tiene un valor numérico válido
function esValorValido() {
    return currentDisplay !== '' && currentDisplay !== '0' && currentDisplay !== '.' && !isNaN(obtenerValorActual());
}

// Función para formatear el resultado y evitar números con muchos decimales
function formatResultado(num) {
    // Si es un número entero, devolver como entero
    if (Number.isInteger(num)) {
        return num.toString();
    }
    
    // Redondear a 8 decimales para evitar problemas de precisión
    const rounded = Math.round(num * 100000000) / 100000000;
    
    // Convertir a string y eliminar ceros innecesarios al final
    return parseFloat(rounded.toString()).toString();
}

// Cambiar tema
function changeTema() {
    botonCambioTema.addEventListener('input', (e) => {
        const themeValue = e.target.value;
        body.classList.remove('theme-1', 'theme-2', 'theme-3');
        body.classList.add(`theme-${themeValue}`)
    })
}

changeTema()

// Actualizar display principal
function actualizarDisplay() {
    displayResult.textContent = currentDisplay;
}

// Actualizar display de operación
function actualizarOperationDisplay() {
    if (valorAnterior !== null && operador !== null) {
        operationDisplay.textContent = `${valorAnterior} ${operador}`;
    } else {
        operationDisplay.textContent = '';
    }
}

// Calcular operación pendiente
function calcularOperacionPendiente() {
    if (operador && valorAnterior !== null && valorActual !== null) {
        // Asegurarse de que los valores son números válidos
        if (isNaN(valorAnterior) || isNaN(valorActual)) {
            currentDisplay = 'Error';
            actualizarDisplay();
            return;
        }
        
        switch (operador) {
            case '+':
                resultado = valorAnterior + valorActual;
                break;
            case '-':
                resultado = valorAnterior - valorActual;
                break;
            case '*':
                resultado = valorAnterior * valorActual;
                break;
            case '/':
                if (valorActual !== 0) {
                    resultado = valorAnterior / valorActual;
                } else {
                    resultado = 'Error';
                }
                break;
        }
        
        if (resultado !== 'Error' && !isNaN(resultado)) {
            valorAnterior = resultado;
            // Formatear el resultado para evitar números con muchos decimales
            currentDisplay = formatResultado(resultado);
            actualizarDisplay();
        } else {
            currentDisplay = 'Error';
            actualizarDisplay();
            // Reset después de error
            setTimeout(() => {
                currentDisplay = '0';
                operador = null;
                valorAnterior = null;
                valorActual = null;
                operationDisplay.textContent = '';
                actualizarDisplay();
            }, 1000);
        }
    }
}

// Agregar valor al display al presionar boton
function agregarValor() {
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            const valorBoton = boton.textContent;
            
            // Si el display muestra "0", reemplázalo, de lo contrario concatena
            if (currentDisplay === '0' && valorBoton !== '.') {
                currentDisplay = valorBoton;
            } else {
                currentDisplay += valorBoton;
            }
            
            actualizarDisplay();
        });
    });
}

agregarValor();

// Resetear calculadora
function resetearCalculadora() {
    botonReset.addEventListener('click', () => {
        currentDisplay = '0';
        operador = null;
        valorAnterior = null;
        valorActual = null;
        resultado = null;
        operationDisplay.textContent = '';
        actualizarDisplay();
    })
}

resetearCalculadora()

// Calcular resultado con igual
function calcularResultado() {
    botonIgual.addEventListener('click', () => {
        if (operador && valorAnterior !== null && esValorValido()) {
            valorActual = obtenerValorActual();
            calcularOperacionPendiente();
            
            // Limpiar después del cálculo
            operationDisplay.textContent = '';
            operador = null;
            valorAnterior = null;
            valorActual = null;
        }
    })
}

calcularResultado()

// Seleccionar operador 
function seleccionarOperador() {
    operadores.forEach(boton => {
        boton.addEventListener('click', () => {
            const operadorSeleccionado = boton.textContent.trim();
            
            // Solo procesar si hay un valor actual válido
            if (esValorValido()) {
                if (operador && valorAnterior !== null) {
                    // Si ya hay una operación pendiente, calcular primero
                    valorActual = obtenerValorActual();
                    calcularOperacionPendiente();
                } else {
                    // Nueva operación
                    valorAnterior = obtenerValorActual();
                }
                
                operador = operadorSeleccionado;
                actualizarOperationDisplay();
                currentDisplay = ''; // Vaciar para el siguiente número
                actualizarDisplay();
            }
        });
    });
}

seleccionarOperador()

// Borrar ultimo digito
function borrarUltimoDigito() {
    botonDelete.addEventListener('click', () => {
        if (currentDisplay.length > 1) {
            currentDisplay = currentDisplay.slice(0, -1);
        } else {
            currentDisplay = '0';
        }
        actualizarDisplay();
    })
}

borrarUltimoDigito()

// Manejar punto decimal
function manejarPuntoDecimal() {
    const botonPunto = document.querySelector('.boton-punto');
    botonPunto.addEventListener('click', () => {
        if (!currentDisplay.includes('.')) {
            if (currentDisplay === '0' || currentDisplay === '') {
                currentDisplay = '0.';
            } else {
                currentDisplay += '.';
            }
            actualizarDisplay();
        }
    })
}

manejarPuntoDecimal()

// Manejar teclas del teclado
function manejarTeclasTeclado() {
    document.addEventListener('keydown', (e) => {
        const tecla = e.key;
        
        // Prevenir comportamiento por defecto para teclas que usamos
        if (['0','1','2','3','4','5','6','7','8','9','.', '+', '-', '*', '/', 'Enter', '=', 'Backspace', 'Escape', 'Delete'].includes(tecla)) {
            e.preventDefault();
        }

        // Números y punto decimal
        if (!isNaN(tecla) || tecla === '.') {
            if (tecla === '.' && currentDisplay.includes('.')) return;
            
            if (currentDisplay === '0' && tecla !== '.') {
                currentDisplay = tecla;
            } else if (currentDisplay === '' && tecla === '.') {
                currentDisplay = '0.';
            } else {
                currentDisplay += tecla;
            }
            actualizarDisplay();
        } 
        // Operadores
        else if (['+', '-', '*', '/'].includes(tecla)) {
            const operadorSeleccionado = tecla;
            
            // Solo procesar si hay un valor actual válido
            if (esValorValido()) {
                if (operador && valorAnterior !== null) {
                    // Si ya hay una operación pendiente, calcular primero
                    valorActual = obtenerValorActual();
                    calcularOperacionPendiente();
                } else {
                    // Nueva operación
                    valorAnterior = obtenerValorActual();
                }
                
                operador = operadorSeleccionado;
                actualizarOperationDisplay();
                currentDisplay = ''; // Vaciar para el siguiente número
                actualizarDisplay();
            }
        } 
        // Igual/Enter
        else if (tecla === 'Enter' || tecla === '=') {
            if (operador && valorAnterior !== null && esValorValido()) {
                valorActual = obtenerValorActual();
                calcularOperacionPendiente();
                
                // Limpiar después del cálculo
                operationDisplay.textContent = '';
                operador = null;
                valorAnterior = null;
                valorActual = null;
            }
        } 
        // Backspace (borrar último dígito)
        else if (tecla === 'Backspace') {
            if (currentDisplay.length > 1) {
                currentDisplay = currentDisplay.slice(0, -1);
            } else {
                currentDisplay = '0';
            }
            actualizarDisplay();
        } 
        // Escape o Delete (reset)
        else if (tecla === 'Escape' || tecla === 'Delete') {
            currentDisplay = '0';
            operador = null;
            valorAnterior = null;
            valorActual = null;
            resultado = null;
            operationDisplay.textContent = '';
            actualizarDisplay();
        }
    });
}

manejarTeclasTeclado()

// Manejar operadores encadenados
function manejarOperadoresEncadenados() {
    seccionOperadores.forEach(seccion => {
        seccion.addEventListener('click', (e) => {
            if (e.target.classList.contains('button-suma') || 
                e.target.classList.contains('button-resta') || 
                e.target.classList.contains('button-mult') || 
                e.target.classList.contains('button-divi')) {
                
                const operadorSeleccionado = e.target.textContent.trim();
                
                if (esValorValido()) {
                    if (operador && valorAnterior !== null) {
                        valorActual = obtenerValorActual();
                        calcularOperacionPendiente();
                    } else {
                        valorAnterior = obtenerValorActual();
                    }
                    
                    operador = operadorSeleccionado;
                    actualizarOperationDisplay();
                    currentDisplay = '';
                    actualizarDisplay();
                }
            }
        });
    });
}

manejarOperadoresEncadenados()

// Manejar overflow en display
function manejarOverflowDisplay() {
    const maxLength = 12; // Longitud máxima del display
    if (currentDisplay.length > maxLength) {
        currentDisplay = currentDisplay.slice(0, maxLength);
        actualizarDisplay();
    }
}

// Inicializar display
actualizarDisplay();

// Configurar intervalo para manejar overflow
setInterval(manejarOverflowDisplay, 100);


// Mejorar la animación del selector de tema
function mejorarAnimacionTema() {
    const themeSelector = document.querySelector('.themeSelector');
    
    themeSelector.addEventListener('input', (e) => {
        // Agregar clase de animación
        themeSelector.classList.add('changing');
        
        // Remover la clase después de la animación
        setTimeout(() => {
            themeSelector.classList.remove('changing');
        }, 600);
    });
    
    // Efecto al hacer hover en el contenedor del tema
    const temaContainer = document.querySelector('.tema');
    temaContainer.addEventListener('mouseenter', () => {
        themeSelector.style.transform = 'scale(1.02)';
        themeSelector.style.transition = 'transform 0.2s ease';
    });
    
    temaContainer.addEventListener('mouseleave', () => {
        themeSelector.style.transform = 'scale(1)';
    });
}

// Llamar la función después de que se cargue el DOM
document.addEventListener('DOMContentLoaded', function() {
    mejorarAnimacionTema();
});


mejorarAnimacionTema();