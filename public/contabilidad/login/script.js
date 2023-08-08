document.getElementById('input_usuario').value = window.location.search.startsWith('?') ? window.location.search.substring(1) : '';

document.getElementById('btn_login').onclick = ()=>{
    ajaxPost('/login', {usuario : document.getElementById('input_usuario').value, password : document.getElementById('input_password').value}, ()=>{})
};
function ajaxPost (url, objeto, callback){
    let xhr = new XMLHttpRequest();
    xhr.open('POST', `contabilidad${url}`, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
      if(xhr.readyState === 4 && xhr.status === 200){callback(JSON.parse(xhr.responseText));}
    };
    xhr.send(JSON.stringify(objeto));
};