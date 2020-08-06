import variables from "./var/variables.js";

// Devuelve el token de local storage para los requests
// No se exporta porque es utilizada sólo desde este archivo
function getTokenDesdeLS() {
  return localStorage.getItem("midosis_logintoken");
}

// Guarda datos en LS
export function guardarEnLS(key, datosGuardar) {
  localStorage.setItem(key, datosGuardar);
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



export function fetchPastilleros() {
  return fetch(variables.api_url + "/pastillero");
}

export function fetchDosis(idPastillero) {
  return fetch(variables.api_url + "/pastillero/" + idPastillero);
}

export function fetchDroga(pastillero) {
  if (pastillero) {
    return fetch(variables.api_url + "/droga?pastillero=" + pastillero);
  } else {
    return fetch(variables.api_url + "/droga");
  }
}

export function addDroga(data) {
  const url = variables.api_url + "/droga";
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate",
    },
    body: JSON.stringify(data),
  });
}

export function addDrogaxdosis(data) {
  const url = variables.api_url + "/drogaxdosis";
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate",
    },
    body: JSON.stringify(data),
  });
}

export function editDrogaxdosis(data, drogaxdosis_id, callback) {
  const url = variables.api_url + "/drogaxdosis/" + drogaxdosis_id;
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate",
    },
    body: JSON.stringify(data),
  }).then(function () {
    callback();
  });
}

export function deleteDrogaxdosis(drogaxdosis_id, callback) {
  const url = variables.api_url + "/drogaxdosis/" + drogaxdosis_id;
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate",
    },
  }).then(function () {
    callback();
  });
}

export function addCompra(data) {
  const url = variables.api_url + "/compra";
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate",
    },
    body: JSON.stringify(data),
  });
}

export function fetchStock(pastillero) {
  if (pastillero) {
    return fetch(variables.api_url + "/stock/" + pastillero);
  } else {
    return fetch(variables.api_url + "/stock");
  }
}

export function processStock(data) {
  const url = variables.api_url + "/armarpastillero";
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate",
    },
    body: JSON.stringify(data),
  });
}


// Verifica la información en local storage
// Si encuentra el pastillero lo devuelve
// Debería ser llamado desde componentDidMount en cualquier ruta
export function verifyLogin() {
  const pastillero = localStorage.getItem("midosis_pastillero");
  if (pastillero) {
    return { pastillero: pastillero };
  }
}
