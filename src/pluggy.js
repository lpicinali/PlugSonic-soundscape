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
console.log("location")
console.log(window.location)
const hostname = window.location.hostname
console.log("hostname")
console.log(hostname)
console.log("ancestor origins")
console.log(location.ancestorOrigins)
console.log("parent")
console.log(window.parent.location)


export let API
// eslint-disable-next-line
export let sessionToken = Pluggy.getToken()


// function getApiCallback(responseText) {
//   console.log('API CALLBACK')
//   console.log(responseText)
// }
//
// function getApiErrorCallback(responseText) {
//     console.log('API ERROR CALLBACK')
//     console.log(responseText)
// }
// httpGetSync("https://develop.pluggy.eu/api/v1", getApiCallback, getApiErrorCallback, sessionToken)
// httpGetSync("https://beta.pluggy.eu/api/v1", getApiCallback, getApiErrorCallback, sessionToken)

if (hostname === "develop.pluggy.eu") {
  API = "https://develop.pluggy.eu/api/v1"
} else if (hostname === "beta.pluggy.eu") {
  API = "https://beta.pluggy.eu/api/v1"
}
console.log("API url")
console.log(API)

// =================== RETRIEVE EXHIBITION ============================= //
export let userId = ''
export let exhibitionTitle = ''
export let exhibitionDescription = ''
export let exhibitionTags = []
export let exhibitionMetadata = []

export let exhibitionQuery
export let exhibitionId

function getExhibitionCallback(responseText) {
  const response = JSON.parse(responseText)
  console.log('RETRIEVE EXHIBITION RESPONSE')
  console.log(response)
  if (response.success) {
    userId = response.data.owner._id
    exhibitionTitle = response.data.title
    exhibitionDescription = response.data.description
    exhibitionTags = response.data.tags.map((tag,index) => (
      {key: index, label: tag}
    ))
    exhibitionMetadata = response.data.metadata
  }
}

function getExhibitionErrorCallback(responseText) {
    console.log('ERROR CALLBACK')
    console.log(responseText)
}


if (hostname === "develop.pluggy.eu" || hostname === "beta.pluggy.eu") {
  exhibitionQuery = window.location.search.substring(1)
  exhibitionId = getQueryVariable(exhibitionQuery,'exhibitionId')
  httpGetSync(`${API}/exhibitions/${exhibitionId}`, getExhibitionCallback, getExhibitionErrorCallback, sessionToken)
}
