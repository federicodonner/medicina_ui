import React, { useState, useRef, useEffect } from "react";
import Header from "../header/Header";
import { guardarEnLS, accederAPI } from "../../utils/fetchFunctions";
import "./login.css";
import variables from "../../var/variables.js";

export default function Login(props) {
  const [loader, setLoader] = useState(true);
  const [loaderTexto, setLoaderTexto] = useState("Verificando login.");
  const [formIngresada, setFormIngresada] = useState(false);

  const [userInfo, setUserInfo] = useState(null);

  const loginRef = useRef(null);
  const passwordRef = useRef(null);

  useEffect(() => {
    // Va a buscar los datos del usuario
    // Si los encuentra, entra a la app y le pasa los datos al componente
    accederAPI(
      "GET",
      "usuario",
      null,
      () => {
        navigateToSection("home");
      },
      usuarioNoLogueado
    );
  }, []);

  function navigateToSection(section) {
    props.history.push({
      pathname: section,
    });
  }

  // callback de la llamada a la API cuando el estado no es 200
  function usuarioNoLogueado(datos) {
    // Error 500+ es un error de la API, lo manda a la pantalla del error
    if (datos.status >= 500) {
      this.props.history.push("error");
      // Si el error es de otros tipos, muestra el mensaje de error y apaga el loader
    } else {
      setLoader(false);
    }
  }

  // Callback de error de post a oauth
  function errorDeLogin(data) {
    // Verifica si es un error de la API o un problema de oauth
    if (data.status >= 500) {
      alert("Ocurrió un error, por favor inténtalo denuevo más tarde.");
    } else {
      alert(data.detail);
      setLoader(false);
      setFormIngresada(false);
    }
  }

  function submitLogin(e) {
    e.preventDefault();
    // Indica que fue ingresado el formulario
    setFormIngresada(true);

    // Verifica que se hayan ingresados ambos campos
    if (loginRef.current.value && passwordRef.current.value) {
      setLoaderTexto("Enviando información de login.");
      setLoader(true);

      // Genera el objeto de datos para el login
      var data = {
        username: loginRef.current.value,
        access: passwordRef.current.value,
        grant_type: "password",
      };

      accederAPI(
        "POST",
        "oauth",
        data,
        (respuesta) => {
          guardarEnLS(variables.LSLoginToken, respuesta.token);
          navigateToSection("home");
        },
        errorDeLogin
      );
    }
  }

  function apagarErrores() {
    setFormIngresada(false);
  }

  return (
    <div className="app-view cover">
      <div className="scrollable">
        {loader && (
          <div className="loader-container">
            <p>
              <img className="loader" src="/images/loader.svg" />
            </p>
            <p className={"negrita"}>{loaderTexto}</p>
          </div>
        )}
        {!loader && (
          <>
            <Header />
            <div className="content">
              <p>
                Bienvenido a MiDosis la plataforma online de gestión de
                medicamentos.
              </p>
              <form onSubmit={submitLogin}>
                <div className={"login-form"}>
                  <span className="label">Nombre de usuario:</span>
                  <input
                    rows="8"
                    name="nombre"
                    type="text"
                    ref={loginRef}
                    onChange={apagarErrores}
                    className="login-input"
                  />
                  {formIngresada &&
                    loginRef.current &&
                    !loginRef.current.value && (
                      <span className="login-error">
                        Debes completar tu nombre de usuario.
                      </span>
                    )}
                </div>
                <div className={"login-form"}>
                  <span className="label">Contraseña:</span>
                  <input
                    rows="8"
                    name="nombre"
                    type="password"
                    ref={passwordRef}
                    onChange={apagarErrores}
                    className="login-input"
                  />
                  {formIngresada &&
                    passwordRef.current &&
                    !passwordRef.current.value && (
                      <span className="login-error">
                        Debes completar tu contraseña.
                      </span>
                    )}
                </div>
                <button className="login-submit" type="submit">
                  Ingresar
                </button>
              </form>
              <div className={"pretty-olvido"}>Olvidé mi contraseña</div>
              <div
                className={"pretty-olvido"}
                onClick={() => {
                  navigateToSection("crearCuenta");
                }}
              >
                Crear una cuenta
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
