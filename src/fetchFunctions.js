export function fetchCompanies() {
  return fetch(
    "http://www.federicodonner.com/clublibros_api/public/api/empresas"
  );
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

export function getBookCover(bookName) {
  const formattedBookName = bookName.replace(/\s/g, "+");
  var url =
    "https://www.googleapis.com/customsearch/v1?key=AIzaSyBiRqnIECMCs9LKRyf_CD8795BRc7Bpbzg&cx=009973845365108789937:h0kxgycmpmu&searchType=image&q=" +
    formattedBookName +
    "+book+cover";
  return fetch(url, {
    method: "GET"
  });
}

// This function verifies login information in local storage
// If not found, it navigates to userselect
// Should be called from componentDidMount in every route
export function verifyLogin() {
  const username = localStorage.getItem("libroclub_username");
  const token = localStorage.getItem("libroclub_token");
  const user_id = localStorage.getItem("libroclub_id");

  if (username && token && user_id) {
    return { username: username, user_id: user_id, token: token };
  }
}
