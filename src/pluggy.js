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

export function httpGetAsync(url, callback, errorCallback = null, token = null, responseType = 'text') {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(xhr.response)
      } else {
        if(errorCallback) {
          errorCallback(xhr.response)
        }
      }
    }
  }

  xhr.open('GET', url, true) // true for asynchronous

  if (token) {
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
  }

  xhr.responseType = responseType
  xhr.send()
}

export function httpGetSync(url, callback, errorCallback = () => {}, token = null) {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(xhr.responseText)
      } else {
        errorCallback(xhr.responseText)
      }
    }
  }
  xhr.open('GET', url, false) // true for asynchronous
  if (token) {
    xhr.setRequestHeader('Authorization', `Bearer ${token}`)
  }
  xhr.send(null)
}

export function httpPostAsync(url, callback, errorCallback, body, token, type) {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(xhr.responseText)
      } else {
        errorCallback(xhr.responseText)
      }
    }
  }
  xhr.open('POST', url, true) // true for asynchronous
  xhr.setRequestHeader('Authorization', `Bearer ${token}`)
  if (type) xhr.setRequestHeader('Content-Type', type)
  xhr.send(body)
}

export function httpPutAsync(url, callback, errorCallback, body, token, type) {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(xhr.responseText)
      } else {
        errorCallback(xhr.responseText)
      }
    }
  }
  xhr.open('PUT', url, true) // true for asynchronous
  xhr.setRequestHeader('Authorization', `Bearer ${token}`)
  if (type) xhr.setRequestHeader('Content-Type', type)
  xhr.send(body)
}

export function httpDeleteAsync(url, callback, errorCallback, token) {
  const xhr = new XMLHttpRequest()
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        callback(xhr.responseText)
      } else {
        errorCallback(xhr.responseText)
      }
    }
  }
  xhr.open('DELETE', url, true) // true for asynchronous
  xhr.setRequestHeader('Authorization', `Bearer ${token}`)
  xhr.send(null)
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
// export const sessionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzQxYmJlZTYyN2E0ZWQ5OGZlMzRjMmEiLCJyb2xlcyI6WyJNZW1iZXIiLCJEZXZlbG9wZXIiXSwiYmVoYWxmT2ZVc2VySWQiOiI1YzQxYmJlZTYyN2E0ZWQ5OGZlMzRjMmEiLCJ1c2VybmFtZSI6Ik1hcmNvIENvbXVuaXRhIiwidGVhbVJvbGUiOiIiLCJraW5kIjoiVXNlclBlcnNvbiIsImlhdCI6MTU2MjYwNDU3NSwiZXhwIjoxNTYyNjkwOTc1fQ.E2MUJtVNWBuiUUHUOr-B8mvB6uDwGCdKMMKyb7i7aMk'

if (hostname === 'develop.pluggy.eu') {
  API = 'https://develop.pluggy.eu/api/v1'
} else if (hostname === 'beta.pluggy.eu') {
  API = 'https://beta.pluggy.eu/api/v1'
} else if (hostname === 'pluggy.eu') {
  API = 'https://pluggy.eu/api/v1'
} else {
  API = 'https://develop.pluggy.eu/api/v1'
}

console.log('API SETTING:')
console.log(API)

// =================== RETRIEVE EXHIBITION ============================= //
export const exhibition = {
  // description: '',
  // id: '',
  // arrayMetadata: [{...}, {...}, ... , {...}],
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
//   exhibition.id = "5d237638c111af88e9026a80"
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
    exhibition.arrayMetadata = response.data.metadata
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
