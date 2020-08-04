import variables from "./var/variables.js";

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

//.-----------------

export function fetchCompanies() {
  return fetch(variables.api_url + "/pastillero");
}
