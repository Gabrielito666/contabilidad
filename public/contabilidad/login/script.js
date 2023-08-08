const ventanaAlerta = document.getElementById('ventana_mensaje');



document.getElementById('btn_login').onclick = ()=>{
  ajaxPost('/login', {usuario : document.getElementById('input_usuario').value, password : document.getElementById('input_password').value}, callback)
};

function callback (res){if (res.ok){window.location.href = "/../app/index.html";}else{mostrarAlerta('red', 'Alguno de los campos es incorrecto')}}

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