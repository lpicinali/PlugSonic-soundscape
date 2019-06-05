export function getQueryVariable(query, variable) {
  const vars = query.split("&");
  for (let i=0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return(false);
}

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

export function httpGetSync(url, callback, errorCallback, token) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(xhr.responseText)
      } else {
        errorCallback(xhr.responseText)
      }
    }
  }
  xhr.open("GET", url, false) // true for asynchronous
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

// ========================== SET API ================================== //
const url = new URL((window.location !== window.parent.location)
            ? document.referrer
            : document.location.href)
const hostname = url.hostname
// console.log('HOSTNAME')
// console.log(hostname)

export let API
// eslint-disable-next-line
export const sessionToken = Pluggy.getToken()
// export const sessionToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzQxYmJlZTYyN2E0ZWQ5OGZlMzRjMmEiLCJyb2xlcyI6WyJNZW1iZXIiLCJEZXZlbG9wZXIiXSwiYmVoYWxmT2ZVc2VySWQiOiI1YzQxYmJlZTYyN2E0ZWQ5OGZlMzRjMmEiLCJ1c2VybmFtZSI6Ik1hcmNvIENvbXVuaXRhIiwidGVhbVJvbGUiOiIiLCJraW5kIjoiVXNlclBlcnNvbiIsImlhdCI6MTU1OTcyODEwNiwiZXhwIjoxNTU5ODE0NTA2fQ.Dnd7q7gJ0LKbAF9lY2XvylVQiTKOxOZN_2yeEN_wr1U"

if (hostname === "develop.pluggy.eu") {
  API = "https://develop.pluggy.eu/api/v1"
} else if (hostname === "beta.pluggy.eu") {
  API = "https://beta.pluggy.eu/api/v1"
} else {
  API = "https://develop.pluggy.eu/api/v1"
}

console.log('API SETTING:')
console.log(API)

// =================== RETRIEVE EXHIBITION ============================= //
export const exhibition = {
  // description: '',
  // id: '',
  // metadata: {},
  // ownerId: '',
  // tags: [],
  // title: '',
  // isPublished: false,
}

if (hostname === "develop.pluggy.eu" || hostname === "beta.pluggy.eu") {
  const exhibitionQuery = window.location.search.substring(1)
  // console.log('EXHIBITION QUERY')
  // console.log(exhibitionQuery)
  exhibition.id = getQueryVariable(exhibitionQuery,'exhibitionId')
  console.log('EXHIBITION ID')
  console.log(exhibition.id)
  httpGetSync(`${API}/exhibitions/${exhibition.id}`, getExhibitionCallback, getExhibitionErrorCallback, sessionToken)
}

// if (hostname === "localhost") {
//   exhibition.id = "5cf63b3f96dc6b8929652f27"
//   console.log('EXHIBITION ID')
//   console.log(exhibition.id)
//   httpGetSync(`${API}/exhibitions/${exhibition.id}`, getExhibitionCallback, getExhibitionErrorCallback, sessionToken)
// }

function getExhibitionCallback(responseText) {
  const response = JSON.parse(responseText)
  // console.log('RETRIEVE EXHIBITION RESPONSE')
  // console.log(response)
  if (response.success) {
    exhibition.description = response.data.description
    exhibition.isPublished = response.data.public
    exhibition.metadata = response.data.metadata
    exhibition.ownerId = response.data.owner._id
    exhibition.tags = response.data.tags.map((tag,index) => (
      {key: index, label: tag}
    ))
    exhibition.title = response.data.title

    console.log('RETRIEVE SUCCESSFUL')
    console.log(exhibition)
  } else {
    console.log('RETRIEVE FAILED')
  }
}

function getExhibitionErrorCallback(responseText) {
    console.log('ERROR CALLBACK')
    console.log(responseText)
}
