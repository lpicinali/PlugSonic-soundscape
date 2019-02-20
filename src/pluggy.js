// eslint-disable-next-line
export const sessionToken = Pluggy.getToken()
export const API = 'https://develop.pluggy.eu/api/v1/'

export function httpHintAsync(url, callback) {
  // console.log('\nHTTP HINT ASYNC')
  // console.log(`url: ${url}`)
  // console.log(`callback: ${callback}`)
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200)
      callback(xhr.responseText)
  }
  xhr.open("GET", url, true) // true for asynchronous
  xhr.send(null);
}

export function httpGetAsync(url, callback, token) {
  // console.log('\nHTTP GET ASYNC')
  // console.log(`url: ${url}`)
  // console.log(`callback: ${callback}`)
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200)
      callback(xhr.responseText)
  }
  xhr.open("GET", url, true) // true for asynchronous
  if (token) {
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
  }
  xhr.send(null);
}

export function httpPostAsync(theUrl, callback, body, token, type) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
      callback(xmlHttp.responseText);
  }
  // added Authorization header
  xmlHttp.open("POST", theUrl, true); // true for asynchronous
  xmlHttp.setRequestHeader('Authorization', `Bearer ${token}`);
  if (type)
    xmlHttp.setRequestHeader("Content-Type", type);
  xmlHttp.send(body);
}
