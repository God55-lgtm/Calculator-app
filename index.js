const botonCambioTema = document.querySelector('.themeSelector')
const seccionOperadores = document.querySelector('.numeros-operadores')
const body = document.querySelector('body')

function changeTema() {
    botonCambioTema.addEventListener('input',(e)=>{
        const themeValue = e.target.value;
        body.classList.remove('theme-1', 'theme-2', 'theme-3');

        body.classList.add(`theme-${themeValue}`)
        
        
    })
}

changeTema()

