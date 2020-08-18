import variables from "./var/variables.js";

// Devuelve el token de local storage para los requests
// No se exporta porque es utilizada sólo desde este archivo
function getTokenDesdeLS() {
  return localStorage.getItem(variables.LSLoginToken);
}

// Guarda datos en LS
export function guardarEnLS(key, datosGuardar) {
  localStorage.setItem(key, datosGuardar);
}

// Lee desde LS
export function leerDesdeLS(key) {
  return localStorage.getItem(key);
}

// Borra el resgistro de LS
export function borrarDesdeLS(key) {
  return localStorage.removeItem(key);
}

export function getData(endpoint) {
  var accessToken = getTokenDesdeLS();
  var promise = Promise.race([
    // Genera dos promesas, una con el fetch y otra con el timeout de 5 segundos
    // la que termine primero resuelve
    fetch(variables.api_url + "/" + endpoint, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
      },
    }),
    new Promise(function (resolve, reject) {
      setTimeout(() => reject(new Error("request timeout")), 10000);
    }),
  ]);
  return promise;
}

// Función genérica parea postear datos en la API
export function postData(endpoint, data) {
  var accessToken = getTokenDesdeLS();
  const url = variables.api_url + "/" + endpoint;
  var promise = Promise.race([
    // Genera dos promesas, una con el fetch y otra con el timeout de 5 segundos
    // la que termine primero resuelve
    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "accept-encoding": "gzip, deflate",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(data),
    }),
    new Promise(function (resolve, reject) {
      setTimeout(() => reject(new Error("request timeout")), 10000);
    }),
  ]);
  return promise;
}

// Función genérica parea put datos en la API
export function putData(endpoint, data) {
  var accessToken = getTokenDesdeLS();
  const url = variables.api_url + "/" + endpoint;
  var promise = Promise.race([
    // Genera dos promesas, una con el fetch y otra con el timeout de 5 segundos
    // la que termine primero resuelve
    fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "accept-encoding": "gzip, deflate",
        Authorization: "Bearer " + accessToken,
      },
      body: JSON.stringify(data),
    }),
    new Promise(function (resolve, reject) {
      setTimeout(() => reject(new Error("request timeout")), 10000);
    }),
  ]);
  return promise;
}

// Función genérica parea postear datos en la API
export function deleteData(endpoint) {
  var accessToken = getTokenDesdeLS();
  const url = variables.api_url + "/" + endpoint;
  var promise = Promise.race([
    // Genera dos promesas, una con el fetch y otra con el timeout de 5 segundos
    // la que termine primero resuelve
    fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "accept-encoding": "gzip, deflate",
        Authorization: "Bearer " + accessToken,
      },
    }),
    new Promise(function (resolve, reject) {
      setTimeout(() => reject(new Error("request timeout")), 10000);
    }),
  ]);
  return promise;
}
