import React, { useState, useRef } from "react";
import Modal from "../modal/Modal";
import { accederAPI } from "../../utils/fetchFunctions";
import "./login.css";
import variables from "../../var/variables.js";

export default function Login(props) {
  const [formIngresada, setFormIngresada] = useState(false);

  const [userInfo, setUserInfo] = useState(null);

  // Variable en el state utilizada para forzar un re-render del componente
  const [forzarUpdate, setForzarUpdate] = useState(1);

  // Muestra el modal de crear nueva cuenta
  const [mostrarCrearCuenta, setMostrarCrearCuenta] = useState(false);

  const loginRef = useRef(null);
  const passwordRef = useRef(null);

  // Callback de error de post a oauth
  function errorDeLogin(data) {
    // Verifica si es un error de la API o un problema de oauth
    if (data.status >= 500) {
      alert("Ocurrió un error, por favor inténtalo denuevo más tarde.");
    } else {
      alert(data.detail);
      setFormIngresada(false);
    }
  }

  function submitLogin(e) {
    e.preventDefault();
    // Indica que fue ingresado el formulario
    setFormIngresada(true);

    // Verifica que se hayan ingresados ambos campos
    if (!loginRef.current.value || !passwordRef.current.value) {
      return false;
    }

    // Genera el objeto de datos para el login
    var data = {
      username: loginRef.current.value,
      access: passwordRef.current.value,
      grant_type: "password",
    };

    props.camposLoginValidados(data);
  }

  function apagarErrores() {
    setForzarUpdate(forzarUpdate + 1);
  }

  function submitCrearCuenta(campos) {
    accederAPI(
      "POST",
      "usuario",
      campos,
      (respuesta) => {
        props.cuentaCreada(respuesta);
      },
      () => {
        console.log("error");
      }
    );
  }

  return (
    <>
      <div className="header">
        <div className="logo" />
      </div>
      <div className="content">
        <p>
          Bienvenido a MiDosis la plataforma online de gestión de medicamentos.
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
            {formIngresada && loginRef.current && !loginRef.current.value && (
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
            setMostrarCrearCuenta(true);
          }}
        >
          Crear una cuenta
        </div>
      </div>

      {mostrarCrearCuenta && (
        <Modal
          defaultNavButtons={true}
          mostrarModal={mostrarCrearCuenta}
          cerrarModal={() => {
            setMostrarCrearCuenta(false);
          }}
          titulo="Crear una cuenta"
          submitModal={submitCrearCuenta}
          campos={[
            {
              tipo: "texto",
              etiqueta: "Nombre",
              nombre: "nombre",
              obligatorio: true,
            },
            {
              tipo: "texto",
              etiqueta: "Apellido",
              nombre: "apellido",
              obligatorio: true,
            },
            {
              tipo: "texto",
              etiqueta: "Email",
              nombre: "email",
              obligatorio: true,
              regexValidate: RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
            },
            {
              tipo: "password",
              etiqueta: "Contraseña",
              nombre: "password",
              obligatorio: true,
            },
          ]}
        />
      )}
    </>
  );
}
