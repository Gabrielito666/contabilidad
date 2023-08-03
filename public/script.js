






function tr(arr){return `<tr>${arr.map(x=>td(x)).join('')}</tr>`};
function td(x){return `<td>${x}</td>`};
function btn(c, n, i, t, disabled){return `<button class="${c}" name="${n}" id="${i}" ${disabled ? 'disabled' : ''}>${t}</button>`}

function ajaxPost (url, objeto, callback){
  let xhr = new XMLHttpRequest();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200){callback(JSON.parse(xhr.responseText));}
  };
  xhr.send(JSON.stringify(objeto));
};
ajaxPost('/me', undefined, gestorNoticias);