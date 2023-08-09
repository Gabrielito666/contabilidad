const botonX = document.querySelectorAll('.exit');
const seccionOculta = document.getElementById('section_hidden');
const listadoCuentas = document.getElementById('listado_cuentas');
const ventanaDetalleCuenta = document.getElementById('div_cuenta');
const btnMostrarAgregarCuenta = document.getElementById('btn_mostrar_agregar_cuenta');
const ventanaCrearCuenta = document.getElementById('div_agregar_cuenta');
const labelAgregarUsuario = document.getElementById('label_agregar_usuario');
const btnMostrarAgregarMovimiento = document.getElementById('btn_mostrar_agregar_movimiento');
const ventanaAgregarMovimiento = document.getElementById('div_agregar_movimiento');
const tituloPrincipal = document.getElementById('titulo_principal');
const btnAgregarCuenta = document.getElementById('btn_agregar_cuenta');
const ventanaAlerta = document.getElementById('ventana_mensaje');
const bodyTabla = document.getElementById('body_tabla');
const btnAgregarMovimiento = document.getElementById('btn_agregar_movimiento');
const spanTotal = document.getElementById('span_total');

let usuario, otroUsuario, cuentas, cuenta, movimientos, movimiento;

ajaxPost('/listadoCuentas', {}, callbackListado)
function callbackListado (res) {
  if(res.ok){
    cuentas = res.cuentas;
    renderizarLista(cuentas)
    usuario = res.usuario;
    otroUsuario = usuario === 'Anto' ? 'Gabrielito' : 'Anto';
    tituloPrincipal.innerHTML = `Cuentas ${usuario}`
    labelAgregarUsuario.innerHTML = `Añadir a ${otroUsuario}`
  }else{
    window.location.href = "/../contabilidad/login/index.html"
  }
  
}
botonX[0].addEventListener('click', function () {seccionOculta.style.display = 'none';});

btnMostrarAgregarCuenta.addEventListener('click', () => {
  mostrarVentana(ventanaCrearCuenta);
})
btnMostrarAgregarMovimiento.addEventListener('click', () => {
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
    renderizarLista(cuentas);
    seccionOculta.style.display = 'none';
  }
  mostrarAlerta(res.ok ? 'green' : 'red', res.mensaje)
  btnAgregarCuenta.disabled = false;
  document.getElementById('input_agregar_cuenta').value = '';
  document.getElementById('chk_agregar_usuario').checked = false;
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
  cuentas.forEach(estaCuenta => {
    estaCuenta.addEventListener('click', () => {
      cuenta = estaCuenta.innerHTML;
      document.getElementById('titulo_cuenta').innerHTML = cuenta;
      bodyTabla.innerHTML = '<tr><td colspan="4">Cargando Datos...</td></tr>';
      spanTotal.innerHTML = '...';
      mostrarVentana(ventanaDetalleCuenta);
	    ajaxPost('/detalleCuenta', {cuenta : cuenta}, callbackDetalle);
    })
  })
}
function callbackDetalle(res){
	movimientos = res.movimientos;
	if(movimientos.length < 1){
		bodyTabla.innerHTML = '<tr><td colspan="4">no has agrgado movimientos a esta cuenta</td></tr>';
    spanTotal.innerHTML = '<span class="monto_positivo">$0</span>';
	}else{
		renderizarTabla(movimientos);
	}
}
function renderizarTabla(arr){
	let stringRows = [];
  let total = 0;
	arr.forEach((movimiento, i) =>{
		stringRows.push(tr([i + 1, movimiento.fecha === undefined ? 'Justo ahora' : movimiento.fecha, `<span class="${movimiento.monto >= 0 ? 'monto_positivo' : 'monto_negativo'}">${formatoMonto(movimiento.monto)}</span>`, movimiento.detalle]));
		bodyTabla.innerHTML = stringRows.join('');
    total += movimiento.monto;
	})
  spanTotal.innerHTML = total;
  spanTotal.style.color = total >= 0 ? 'green' : 'red';
}
btnAgregarMovimiento.addEventListener('click', ()=>{
  btnAgregarMovimiento.disabled = true;
  let tipoMov;
  document.querySelectorAll('.radio_tipo_movimiento').forEach(r=>{if(r.checked){tipoMov = r.value}});
  let monto = document.getElementById('input_monto').value;
  movimiento = {monto : tipoMov === 'entrada' ? +monto : -monto, detalle : document.getElementById('input_detalle').value};
  ajaxPost('/agregarMovimiento', {cuenta : cuenta, movimiento : movimiento}, callbackAgregarMovimiento);
})
function callbackAgregarMovimiento (res){
  if(res.ok){
    movimientos.push(movimiento);
    renderizarTabla(movimientos);
    mostrarVentana(ventanaDetalleCuenta);
    document.getElementById('input_monto').value = 0;
  }
  mostrarAlerta(res.ok ? 'green' : 'red', res.mensaje)
  btnAgregarMovimiento.disabled = false;
  document.getElementById('input_detalle').value = '';
}
function tr(arr){return `<tr>${arr.map(x=>td(x)).join('')}</tr>`};
function td(x){return `<td>${x}</td>`};
function btn(c, n, i, t, disabled){return `<button class="${c}" name="${n}" id="${i}" ${disabled ? 'disabled' : ''}>${t}</button>`}
function h2(c, t){return `<h2 class="${c}">${t}</h2>`};
function formatoMonto(num) {return `$${num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`;};
function ajaxPost (url, objeto, callback){
  let xhr = new XMLHttpRequest();
  xhr.open('POST', `/contabilidad${url}`, true);
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