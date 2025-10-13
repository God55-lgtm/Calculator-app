const botonCambioTema = document.querySelector('.themeSelector')
const seccionOperadores = document.querySelectorAll('.numeros-operadores')
const body = document.querySelector('body')
const botones = document.querySelectorAll('.boton, .boton-punto, .button-suma, .button-resta, .button-mult, .button-divi');
const botonIgual = document.querySelector('.button-igual')
const botonReset = document.querySelector('.button-reset')
const botonDelete = document.querySelector('.button-delete')
const botonSuma = document.querySelector('.button-suma')
let displayResult = document.querySelector('.result-number')
const operadores = document.querySelectorAll('.button-suma, .button-resta, .button-mult, .button-divi');

let currentDisplay = '0';
let operador = null;
let valorAnterior = null;
let valorActual = null;
let resultado = null;

console.log(displayResult);

// Cambiar tema
function changeTema() {
    botonCambioTema.addEventListener('input', (e) => {
        const themeValue = e.target.value;
        body.classList.remove('theme-1', 'theme-2', 'theme-3');
        body.classList.add(`theme-${themeValue}`)
    })
}

changeTema()

// Actualizar display
function actualizarDisplay() {
    displayResult.textContent = currentDisplay;
}
actualizarDisplay();

// Agregar valor al display al presionar boton
function agregarValor() {
    botones.forEach(boton => {
        boton.addEventListener('click', () => {
            const valorBoton = boton.textContent;
            displayResult.textContent = valorBoton;
            if (currentDisplay === '0') {
                currentDisplay = valorBoton;
            } else {
                currentDisplay += valorBoton;
            }
            actualizarDisplay();
        }
        )
    })
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
        actualizarDisplay();
    })
}

resetearCalculadora()

function calcularResultado() {
    botonIgual.addEventListener('click', () => {
        valorActual = parseFloat(currentDisplay);
        if (operador && valorAnterior !== null && valorActual !== null) {
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
                    }
                    else {
                        resultado = 'Error';
                    }
                    break;
            }
            currentDisplay = resultado.toString();
            actualizarDisplay();
            operador = null;
            valorAnterior = null;
            valorActual = null;
        }



    }

    )

}
calcularResultado()

// Seleccionar operador 
function seleccionarOperador() {
    operadores.forEach(boton => {
        boton.addEventListener('click', () => {
            operador = boton.textContent.trim();
            valorAnterior = parseFloat(currentDisplay);
            currentDisplay = '0';
            actualizarDisplay();
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
            currentDisplay += '.';
            actualizarDisplay();
        }
    })
}
manejarPuntoDecimal()
// Manejar numeros negativos
function manejarNumeroNegativo() {
    const botonNegativo = document.querySelector('.button-negativo');
    botonNegativo.addEventListener('click', () => {
        if (currentDisplay !== '0') {
            if (currentDisplay.startsWith('-')) {
                currentDisplay = currentDisplay.slice(1);
            } else {
                currentDisplay = '-' + currentDisplay;
            }
            actualizarDisplay();
        }
    })
}
manejarNumeroNegativo()

// Manejar porcentaje
function manejarPorcentaje() {
    const botonPorcentaje = document.querySelector('.button-porcentaje');
    botonPorcentaje.addEventListener('click', () => {
        const valor = parseFloat(currentDisplay);
        if (!isNaN(valor)) {
            currentDisplay = (valor / 100).toString();
            actualizarDisplay();
        }
    })
}
manejarPorcentaje()

// Manejar operadores encadenados
function manejarOperadoresEncadenados() {
    seccionOperadores.forEach(seccion => {
        seccion.addEventListener('click', (e) => {
            if (e.target.classList.contains('numeros-operadores')) {
                if (operador && valorAnterior !== null) {
                    valorActual = parseFloat(currentDisplay);
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
                            }
                            else {
                                resultado = 'Error';
                            }
                            break;
                    }
                    currentDisplay = resultado.toString();
                    actualizarDisplay();
                    valorAnterior = resultado;
                }
                operador = e.target.textContent;
                valorAnterior = parseFloat(currentDisplay);
                currentDisplay = '0';
                actualizarDisplay();
            }
        })
    }
    )
}
manejarOperadoresEncadenados()
// Manejar overflow en display
function manejarOverflowDisplay() {
    const maxLength = 12; // Longitud máxima del display
    if (currentDisplay.length > maxLength) {
        currentDisplay = currentDisplay.slice(0, maxLength);
        actualizarDisplay();
        alert('Número demasiado grande');
    }
}
setInterval(manejarOverflowDisplay, 100);
manejarOverflowDisplay()
// Manejar teclas del teclado
function manejarTeclasTeclado() {
    document.addEventListener('keydown', (e) => {
        const tecla = e.key;
        if (!isNaN(tecla) || tecla === '.') {
            if (tecla === '.' && currentDisplay.includes('.')) return;
            if (currentDisplay === '0' && tecla !== '.') {
                currentDisplay = tecla;
            } else {
                currentDisplay += tecla;
            }
            actualizarDisplay();
        } else if (['+', '-', '*', '/'].includes(tecla)) {
            if (operador && valorAnterior !== null) {
                valorActual = parseFloat(currentDisplay);
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
                        }
                        else {
                            resultado = 'Error';
                        }
                        break;
                }
                currentDisplay = resultado.toString();
                actualizarDisplay();
                valorAnterior = resultado;
            }
            operador = tecla;
            valorAnterior = parseFloat(currentDisplay);
            currentDisplay = '0';
            actualizarDisplay();
        } else if (tecla === 'Enter' || tecla === '=') {
            valorActual = parseFloat(currentDisplay);
            if (operador && valorAnterior !== null && valorActual !== null) {
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
                        }
                        else {
                            resultado = 'Error';
                        }
                        break;
                }
                currentDisplay = resultado.toString();
                actualizarDisplay();
                operador = null;
                valorAnterior = null;
                valorActual = null;
            }
        } else if (tecla === 'Backspace') {
            if (currentDisplay.length > 1) {
                currentDisplay = currentDisplay.slice(0, -1);
            } else {
                currentDisplay = '0';
            }
            actualizarDisplay();
        } else if (tecla === 'Escape') {
            currentDisplay = '0';
            operador = null;
            valorAnterior = null;
            valorActual = null;
            resultado = null;
            actualizarDisplay();
        }
    })
}
manejarTeclasTeclado()












