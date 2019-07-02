export function getQueryVariable(query, variable) {
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0] === variable) {
      return pair[1]
    }
  }
  return false
}

export function httpHintAsync(url, callback) {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) callback(xhr.responseText)
  }
  xhr.open('GET', url, true) // true for asynchronous
  xhr.send(null)
}

export function httpGetAsync(url, callback, token) {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4 && xhr.status === 200) callback(xhr.responseText)
  }
  xhr.open('GET', url, true) // true for asynchronous
  if (token) {
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
  }
  xhr.send(null)
}

export function httpGetSync(url, callback, errorCallback, token) {
  const xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200) {
        callback(xmlHttp.responseText)
      } else {
        errorCallback(xmlHttp.responseText)
      }
    }
  }
  xmlHttp.open('GET', url, false) // true for asynchronous
  if (token) {
    xmlHttp.setRequestHeader('Authorization', `Bearer ${token}`)
  }
  xmlHttp.send(null)
}

export function httpPostAsync(url, callback, errorCallback, body, token, type) {
  const xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200) {
        callback(xmlHttp.responseText)
      } else {
        errorCallback(xmlHttp.responseText)
      }
    }
  }
  xmlHttp.open('POST', url, true) // true for asynchronous
  xmlHttp.setRequestHeader('Authorization', `Bearer ${token}`)
  if (type) xmlHttp.setRequestHeader('Content-Type', type)
  xmlHttp.send(body)
}

export function httpPutAsync(url, callback, errorCallback, body, token, type) {
  const xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200) {
        callback(xmlHttp.responseText)
      } else {
        errorCallback(xmlHttp.responseText)
      }
    }
  }
  xmlHttp.open('PUT', url, true) // true for asynchronous
  xmlHttp.setRequestHeader('Authorization', `Bearer ${token}`)
  if (type) xmlHttp.setRequestHeader('Content-Type', type)
  xmlHttp.send(body)
}

export function httpDeleteAsync(url, callback, errorCallback, token) {
  const xmlHttp = new XMLHttpRequest()
  xmlHttp.onreadystatechange = () => {
    if (xmlHttp.readyState === 4) {
      if (xmlHttp.status === 200) {
        callback(xmlHttp.responseText)
      } else {
        errorCallback(xmlHttp.responseText)
      }
    }
  }
  xmlHttp.open('DELETE', url, true) // true for asynchronous
  xmlHttp.setRequestHeader('Authorization', `Bearer ${token}`)
  xmlHttp.send(null)
}

// ========================== SET API ================================== //
const url = new URL(
  window.location !== window.parent.location
    ? document.referrer
    : document.location.href
)
const hostname = url.hostname

export let API
// eslint-disable-next-line
export const sessionToken = Pluggy.getToken()
// export const sessionToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzQxYmJlZTYyN2E0ZWQ5OGZlMzRjMmEiLCJyb2xlcyI6WyJNZW1iZXIiLCJEZXZlbG9wZXIiXSwiYmVoYWxmT2ZVc2VySWQiOiI1YzQxYmJlZTYyN2E0ZWQ5OGZlMzRjMmEiLCJ1c2VybmFtZSI6Ik1hcmNvIENvbXVuaXRhIiwidGVhbVJvbGUiOiIiLCJraW5kIjoiVXNlclBlcnNvbiIsImlhdCI6MTU2MTExNDg5NiwiZXhwIjoxNTYxMjAxMjk2fQ.IGruCKs209MahlIxY7VtAxjTjTI8bG4SPL-ezLRh_DE"

if (hostname === 'develop.pluggy.eu') {
  API = 'https://develop.pluggy.eu/api/v1'
} else if (hostname === 'beta.pluggy.eu') {
  API = 'https://beta.pluggy.eu/api/v1'
} else {
  API = 'https://develop.pluggy.eu/api/v1'
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

if (hostname === 'develop.pluggy.eu' || hostname === 'beta.pluggy.eu') {
  const exhibitionQuery = window.location.search.substring(1)
  exhibition.id = getQueryVariable(exhibitionQuery, 'exhibitionId')
  console.log('EXHIBITION ID')
  console.log(exhibition.id)
  httpGetSync(
    `${API}/exhibitions/${exhibition.id}`,
    getExhibitionCallback,
    getExhibitionErrorCallback,
    sessionToken
  )
}

// if (hostname === "localhost") {
//   exhibition.id = "5d0ce6e87f20abd27dbef672"
//   console.log('EXHIBITION ID')
//   console.log(exhibition.id)
//   httpGetSync(
//     `${API}/exhibitions/${exhibition.id}`,
//     getExhibitionCallback,
//     getExhibitionErrorCallback,
//     sessionToken
//   )
// }

function getExhibitionCallback(responseText) {
  const response = JSON.parse(responseText)

  if (response.success) {
    exhibition.description = response.data.description
    exhibition.isPublished = response.data.public
    exhibition.metadata = response.data.metadata
    exhibition.ownerId = response.data.owner._id
    exhibition.tags = response.data.tags.map((tag, index) => ({
      key: index,
      label: tag,
    }))
    exhibition.title = response.data.title

    console.log('EXHIBITION RETRIEVED')
    console.log(exhibition)
  } else {
    console.log('RETRIEVE FAILED')
  }
}

function getExhibitionErrorCallback(responseText) {
  console.log('ERROR CALLBACK')
  console.log(responseText)
}
