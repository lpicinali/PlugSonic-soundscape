// eslint-disable-next-line
// export const sessionToken = Pluggy.getToken()
export const sessionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzQxYmJlZTYyN2E0ZWQ5OGZlMzRjMmEiLCJiZWhhbGZPZlVzZXJJZCI6IjVjNDFiYmVlNjI3YTRlZDk4ZmUzNGMyYSIsIm1lbWJlck9mR3JvdXBzIjpbXSwidXNlcm5hbWUiOiJNYXJjbyBDb211bml0YSIsInJvbGVzIjpbIk1lbWJlciJdLCJjbGllbnRJZCI6IndlYl9kZXYiLCJpYXQiOjE1NTE0NDE0ODksImV4cCI6MTU1MTUyNzg4OX0.jPmUbbHSRt_WGOVhB0hN-t_Ea4S1Z4lkJerKTNuVPT0'
export const API = 'https://develop.pluggy.eu/api/v1'

export function httpHintAsync(url, callback) {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200)
      callback(xhr.responseText)
  }
  xhr.open("GET", url, true) // true for asynchronous
  xhr.send(null);
}

export function httpGetAsync(url, callback, token) {
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

export function httpPostAsync(url, callback, body, token, type) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("POST", url, true); // true for asynchronous
  xmlHttp.setRequestHeader('Authorization', `Bearer ${token}`);
  if (type)
    xmlHttp.setRequestHeader("Content-Type", type);
  xmlHttp.send(body);
}

export function httpPutAsync(url, callback, body, token, type) {
  const xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState === 4 && xmlHttp.status === 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open("PUT", url, true); // true for asynchronous
  xmlHttp.setRequestHeader('Authorization', `Bearer ${token}`);
  if (type)
    xmlHttp.setRequestHeader("Content-Type", type);
  xmlHttp.send(body);
}
