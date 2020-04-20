import variables from "./var/variables.js";

export function fetchPastilleros() {
  return fetch(variables.api_url + "/pastillero");
}

export function fetchDosis(idPastillero) {
  return fetch(variables.api_url + "/pastillero/" + idPastillero);
}

export function fetchDroga(pastillero) {
  if(pastillero){
    return fetch(variables.api_url + "/droga?pastillero="+pastillero);
  }else{
    return fetch(variables.api_url + "/droga");
  }
}

export function addDroga(data) {
  const url = variables.api_url + "/droga";
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate"
    },
    body: JSON.stringify(data)
  });
}

export function addDrogaxdosis(data) {
  const url = variables.api_url + "/drogaxdosis";
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate"
    },
    body: JSON.stringify(data)
  });
}

export function editDrogaxdosis(data, drogaxdosis_id, callback) {
  const url = variables.api_url + "/drogaxdosis/" + drogaxdosis_id;
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate"
    },
    body: JSON.stringify(data)
  }).then(function() {
    callback();
  });
}

export function deleteDrogaxdosis(drogaxdosis_id, callback) {
  const url = variables.api_url + "/drogaxdosis/" + drogaxdosis_id;
  return fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate"
    }
  }).then(function() {
    callback();
  });
}

export function fetchUsers(empresa) {
  return fetch(
    "http://www.federicodonner.com/clublibros_api/public/api/usuarios?empresa=" +
    empresa
  );
}

export function fetchUser(token, id) {
  const url =
  "http://www.federicodonner.com/clublibros_api/public/api/usuarios/" + id;

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token
    }
  });
}

export function signupUser(user, companyId) {
  const data = { nombre: user.nombre, email: user.email, empresa: companyId };
  const url =
  "http://www.federicodonner.com/clublibros_api/public/api/usuarios";
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate"
    },
    body: JSON.stringify(data)
  });
}

export function fetchActiveUser(token) {
  const url = "http://www.federicodonner.com/clublibros_api/public/api/yo";

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token
    }
  });
}

export function fetchBooks(token, availables) {
  const url =
  "http://www.federicodonner.com/clublibros_api/public/api/libros?disponibles=" +
  availables;

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token
    }
  });
}

export function fetchBook(token, id) {
  const url =
  "http://www.federicodonner.com/clublibros_api/public/api/libros/" + id;

  return fetch(url, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token
    }
  });
}

export function addBook(book, userId, token) {
  const url = "http://www.federicodonner.com/clublibros_api/public/api/libros";
  const data = {
    titulo: book.titulo,
    autor: book.autor,
    ano: book.ano,
    resumen: book.resumen,
    idioma: book.idioma,
    usr_dueno: userId
  };
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(data)
  });
}

export function addReview(data, token) {
  const url = "http://www.federicodonner.com/clublibros_api/public/api/reviews";
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(data)
  });
}

export function rentBook(data, token) {
  const url =
  "http://www.federicodonner.com/clublibros_api/public/api/alquileres";
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate",
      Authorization: "Bearer " + token
    },
    body: JSON.stringify(data)
  });
}

export function returnBook(book_id, token) {
  const url =
  "http://www.federicodonner.com/clublibros_api/public/api/alquileres/" +
  book_id;
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate",
      Authorization: "Bearer " + token
    }
  });
}

export function enableBook(enable, book_id, token) {
  const enableText = enable ? "enable" : "disable";
  const url =
  "http://www.federicodonner.com/clublibros_api/public/api/libros/" +
  book_id +
  "?operation=" +
  enableText;
  return fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate",
      Authorization: "Bearer " + token
    }
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

export function loginUser(user) {
  const data = { grant_type: "password", user: user };
  const url = "http://www.federicodonner.com/clublibros_api/public/api/oauth";

  return fetch(url, {
    method: "POST", // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      "Content-Type": "application/json",
      "accept-encoding": "gzip, deflate"
    }
  });
}
