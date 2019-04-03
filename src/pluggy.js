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


// eslint-disable-next-line
export const API = 'https://develop.pluggy.eu/api/v1'
// eslint-disable-next-line
// export const sessionToken = Pluggy.getToken()
export const sessionToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YzQxYmJlZTYyN2E0ZWQ5OGZlMzRjMmEiLCJiZWhhbGZPZlVzZXJJZCI6IjVjNDFiYmVlNjI3YTRlZDk4ZmUzNGMyYSIsIm1lbWJlck9mR3JvdXBzIjpbXSwidXNlcm5hbWUiOiJNYXJjbyBDb211bml0YSIsInJvbGVzIjpbIk1lbWJlciIsIkRldmVsb3BlciJdLCJpYXQiOjE1NTQzMDg4MjYsImV4cCI6MTU1NDM5NTIyNn0.LVENrbrkSiqz0p_l6H20UTgaWVX9quAIMF6Yid3bxhg'

// =================== RETRIEVE EXHIBITION ============================= //
// export const exhibitionUrl = window.location.href
// export const exhibitionQuery = window.location.search.substring(1)
// export const exhibitionId = getQueryVariable(exhibitionQuery,'exhibitionId')
export const exhibitionId = '5ca4aae0cd2eb4f3c4ebab20'

let title
let description
let tags
let metadata

function getExhibitionCallback(responseText) {
  const response = JSON.parse(responseText)
  console.log('EXHIBITION RESPONSE')
  console.log(response)
  title = response.data.title
  description = response.data.description
  tags = response.data.tags.map((tag,index) => (
    {key: index, label: tag}
  ))
  metadata = response.data.metadata
}

function getExhibitionErrorCallback(responseText) {
    console.log('ERROR CALLBACK')
    console.log(responseText)
}

httpGetSync(`${API}/exhibitions/${exhibitionId}`, getExhibitionCallback, getExhibitionErrorCallback, sessionToken)

export const exhibitionTitle = title
export const exhibitionDescription = description
export const exhibitionTags = tags
export const exhibitionMetadata = metadata

// console.log('EXHIBITION:')
// console.log(`Id: ${exhibitionId}`)
// console.log(`Title: ${exhibitionTitle}`)
// console.log(`Description: ${exhibitionDescription}`)
// console.log(`Tags: ${exhibitionTags}`)
// console.log(`Metadata:`)
// console.log(exhibitionMetadata)
