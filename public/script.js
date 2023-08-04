const botonX = document.querySelectorAll('.exit');
const seccionOculta = document.getElementById('section_hidden');
const listadoCuentas = document.getElementById('listado_cuentas');
const ventanaDetalleCuenta = document.getElementById('div_cuenta');
const btnAgregarCuenta = document.getElementById('btn_agregar_cuenta');
const ventanaCrearCuenta = document.getElementById('div_agregar_cuenta');
const btnAgregarMovimiento = document.getElementById('btn_agregar_movimiento');
const ventanaAgregarMovimiento = document.getElementById('div_agregar_movimiento');

botonX.forEach(boton => {
  boton.addEventListener('click', function () {
    seccionOculta.style.display = 'none';
  })
})

btnAgregarCuenta.addEventListener('click', () => {
  mostrarVentana(ventanaCrearCuenta);
})

btnAgregarMovimiento.addEventListener('click', () => {
  mostrarVentana(ventanaAgregarMovimiento);
})

function mostrarVentana (ventana) {
  seccionOculta.style.display = 'flex';
  ventanaCrearCuenta.style.display = 'none';
  ventanaDetalleCuenta.style.display = 'none';
  ventanaAgregarMovimiento.style.display = 'none';
  ventana.style.display = 'flex';
}



function renderizarLista(arr){
  //INNERHTML al div listadoCuentas basado en el array que se obtiene como parametro. <h2 class="cuenta">Banco de Chile</h2>
  let listado = '';
  arr.forEach(indice=> {
    listado += h2('cuenta', indice);
  })
  listadoCuentas.innerHTML = listado;
  const cuentas = document.querySelectorAll('.cuenta');
  cuentas.forEach(cuenta => {
    cuenta.addEventListener('click', () => {
     mostrarVentana(ventanaDetalleCuenta);
    })
  })
}

renderizarLista(['Banco de Chile', 'Banco Estado, cuenta RUT', 'Banco Estado, cuenta de ahorro', 'Cuenta familiar']);


function tr(arr){return `<tr>${arr.map(x=>td(x)).join('')}</tr>`};
function td(x){return `<td>${x}</td>`};
function btn(c, n, i, t, disabled){return `<button class="${c}" name="${n}" id="${i}" ${disabled ? 'disabled' : ''}>${t}</button>`}
function h2(c, t){return `<h2 class="${c}">${t}</h2>`};
function ajaxPost (url, objeto, callback){
  let xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200){callback(JSON.parse(xhr.responseText));}
  };
  xhr.send(JSON.stringify(objeto));
};