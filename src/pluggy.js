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

export let API
// eslint-disable-next-line
export const sessionToken = Pluggy.getToken()
// export const sessionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzQxYmJlZTYyN2E0ZWQ5OGZlMzRjMmEiLCJiZWhhbGZPZlVzZXJJZCI6IjVjNDFiYmVlNjI3YTRlZDk4ZmUzNGMyYSIsIm1lbWJlck9mR3JvdXBzIjpbXSwidXNlcm5hbWUiOiJNYXJjbyBDb211bml0YSIsInJvbGVzIjpbIk1lbWJlciIsIkRldmVsb3BlciJdLCJpYXQiOjE1NTY4OTcxMTAsImV4cCI6MTU1Njk4MzUxMH0.6EygfOC2TBvD33-pf0MNze_gbHsCfTerSTd_XRbDtag'

if (hostname === "develop.pluggy.eu") {
  API = "https://develop.pluggy.eu/api/v1"
} else if (hostname === "beta.pluggy.eu") {
  API = "https://beta.pluggy.eu/api/v1"
}
// API = "https://develop.pluggy.eu/api/v1"

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
  // exhibitionId = '5ccc5dd7641ea60d81f5be85'
  httpGetSync(`${API}/exhibitions/${exhibitionId}`, getExhibitionCallback, getExhibitionErrorCallback, sessionToken)
}
