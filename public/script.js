const botonX = document.querySelectorAll('.exit');
const seccionOculta = document.getElementById('section_hidden');
const listadoCuentas = document.getElementById('listado_cuentas');
const ventanaDetalleCuenta = document.getElementById('div_cuenta');
const btnMostrarAgregarCuenta = document.getElementById('btn_mostrar_agregar_cuenta');
const ventanaCrearCuenta = document.getElementById('div_agregar_cuenta');
const labelAgregarUsuario = document.getElementById('label_agregar_usuario');
const btnAgregarMovimiento = document.getElementById('btn_agregar_movimiento');
const ventanaAgregarMovimiento = document.getElementById('div_agregar_movimiento');
const tituloPrincipal = document.getElementById('titulo_principal');
const btnAgregarCuenta = document.getElementById('btn_agregar_cuenta');
const ventanaAlerta = document.getElementById('ventana_mensaje');
const bodyTabla = document.getElementById('body_tabla');

let usuario, otroUsuario;
let cuentas = [];
let detalle = [];

ajaxPost('/listadoCuentas', {}, callbackListado)
function callbackListado (res) {
  cuentas = res.cuentas;
  renderizarLista(cuentas)
  usuario = res.usuario;
  otroUsuario = usuario === 'Anto' ? 'Gabrielito' : 'Anto';
  tituloPrincipal.innerHTML = `Cuentas ${usuario}`
  labelAgregarUsuario.innerHTML = `Añadir a ${otroUsuario}`
}

botonX.forEach(boton => {
  boton.addEventListener('click', function () {
    seccionOculta.style.display = 'none';
  })
})//ahora es solo un boton x

btnMostrarAgregarCuenta.addEventListener('click', () => {
  mostrarVentana(ventanaCrearCuenta);
})

btnAgregarMovimiento.addEventListener('click', () => {
  mostrarVentana(ventanaAgregarMovimiento);
})

btnAgregarCuenta.addEventListener('click', function () {
  btnAgregarCuenta.disabled = true;
  let objeto = {
    nombre : document.getElementById('input_agregar_cuenta').value,
    usuarios : document.getElementById('chk_agregar_usuario').checked ? [usuario, otroUsuario] : [usuario]
  }
  ajaxPost('/crearCuenta', objeto, callbackCrearCuenta);
})
function callbackCrearCuenta(res){
  if(res.ok){
    cuentas.push(document.getElementById('input_agregar_cuenta').value);
    renderizarLista(cuentas)
    seccionOculta.style.display = 'none';
  }
  mostrarAlerta(res.ok ? 'green' : 'red', res.mensaje)
  btnAgregarCuenta.disabled = false;
  document.getElementById('input_agregar_cuenta').value = '';
  ocument.getElementById('chk_agregar_usuario').checked = false;
}

function mostrarVentana (ventana) {
  seccionOculta.style.display = 'flex';
  ventanaCrearCuenta.style.display = 'none';
  ventanaDetalleCuenta.style.display = 'none';
  ventanaAgregarMovimiento.style.display = 'none';
  ventana.style.display = 'flex';
}

function renderizarLista(arr){
  let listado = '';
  arr.forEach(indice=> {
    listado += h2('cuenta', indice);
  })
  listadoCuentas.innerHTML = listado;
  const cuentas = document.querySelectorAll('.cuenta');
  cuentas.forEach(cuenta => {
    cuenta.addEventListener('click', () => {
     mostrarVentana(ventanaDetalleCuenta);
	ajaxPost('/detalleCuenta', {nombre : cuenta.innerHTML}, callbackDetalle);
    })
  })
}7

function callbackDetalle(res){
	detalle = res;
	if(res.length > 1){
		bodyTabla.innerHTML = 'no has agrgado movimientos a esta cuenta';
	}else{
		renderizarTabla(res)
	}
}
function renderizarTabla(arr){
	let stringRows = [];
	arr.forEach(movimiento =>{
		stringRows.puhs(tr([movimiento.numero, movimiento.fecha, movimiento.monto, movimiento.detalle]));
		bodyTabla.innerHTML = stringRows.join('');
	})
}
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

function mostrarAlerta (color, mensaje) {
  ventanaAlerta.style.backgroundColor = color;
  ventanaAlerta.innerHTML = `<h3>${mensaje}</h3>`;
  ventanaAlerta.style.display = 'flex';
  setTimeout(() => {ventanaAlerta.style.display = 'none';}, 3000);
};
