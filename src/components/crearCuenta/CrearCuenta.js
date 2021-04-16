import React, { useState, useRef } from "react";
import Header from "../header/Header";
import { accederAPI, guardarEnLS, errorApi } from "../../utils/fetchFunctions";
import variables from "../../var/variables.js";
import "./crearCuenta.css";

export default function CrearCuenta(props) {
  const [loader, setLoader] = useState(false);

  const [formIngresada, setFormIngresada] = useState(false);

  const nombreRef = useRef(null);
  const apellidoRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordConfirmRef = useRef(null);

  function volverALogin() {
    props.history.push("login");
  }

  // Función utilizada para actualizar el state y esconder
  // el cartel de falta de input cuando el usuario ingresa algo
  function actualizarState() {
    setFormIngresada(false);
  }

  function submitLogin(e) {
    e.preventDefault();

    // Indica que fue ingresado el formulario
    setFormIngresada(true);

    // Verifica que se hayan ingresados ambos campos
    if (
      nombreRef.current.value &&
      apellidoRef.current.value &&
      emailRef.current.value &&
      passwordRef.current.value &&
      passwordConfirmRef.current.value
    ) {
      // Verifica que las contraseñas sean iguales
      if (passwordRef.current.value == passwordConfirmRef.current.value) {
        // Prende el loader
        setLoader(true);

        // Genera el objeto de datos para el login
        var data = {
          nombre: nombreRef.current.value,
          apellido: apellidoRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
        };

        accederAPI(
          "POST",
          "usuario",
          data,
          (respuesta) => {
            guardarEnLS(variables.LSLoginToken, respuesta.token);
            props.history.push({
              pathname: "home",
            });
          },
          errorApi
        );
      } else {
        // Si las contraseñas no coinciden las borra
        passwordRef.current.value = "";
        passwordConfirmRef.current.value = "";
      }
    }
  }

  return (
    <div className="app-view cover">
      <div className="scrollable">
        {loader && (
          <div className="loader-container">
            <p>
              <img className="loader" src="/images/loader.svg" />
            </p>
            <p className={"negrita"}>Enviando información de registro</p>
          </div>
        )}

        <Header logoChico={true} volver={volverALogin} />

        <div className={loader ? "content escondido" : "content"}>
          <p>
            Aquí podrás crear una nueva cuenta y empezar a usar MiDosis
            inmediatamente.
          </p>
          <p>Ingresa tus datos</p>
          <form onSubmit={submitLogin}>
            <div className={"login-form"}>
              <span className="label">Nombre:</span>
              <input
                rows="8"
                name="nombre"
                type="text"
                ref={nombreRef}
                className="login-input"
                onChange={actualizarState}
              />
              {formIngresada &&
                nombreRef.current &&
                !nombreRef.current.value && (
                  <span className="login-error">
                    Debes completar tu nombre.
                  </span>
                )}
            </div>
            <div className={"login-form"}>
              <span className="label">Apellido:</span>
              <input
                rows="8"
                name="apellido"
                type="text"
                ref={apellidoRef}
                className="login-input"
                onChange={actualizarState}
              />
              {formIngresada &&
                apellidoRef.current &&
                !apellidoRef.current.value && (
                  <span className="login-error">
                    Debes completar tu apellido.
                  </span>
                )}
            </div>
            <div className={"login-form"}>
              <span className="label">Email:</span>
              <input
                rows="8"
                name="email"
                type="text"
                ref={emailRef}
                className="login-input"
                onChange={actualizarState}
              />
              {formIngresada && emailRef.current && !emailRef.current.value && (
                <span className="login-error">Debes completar tu email.</span>
              )}

              {formIngresada &&
                emailRef.current &&
                emailRef.current.value &&
                !RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/).test(
                  emailRef.current.value
                ) && (
                  <span className="login-error">
                    El formato del email no es correcto.
                  </span>
                )}
            </div>
            <div className={"login-form"}>
              <span className="label">Contraseña:</span>
              <input
                rows="8"
                name="password"
                type="password"
                ref={passwordRef}
                className="login-input"
                onChange={actualizarState}
              />
              {formIngresada &&
                passwordRef.current &&
                !passwordRef.current.value && (
                  <span className="login-error">
                    Debes completar tu contraseña.
                  </span>
                )}
            </div>
            <div className={"login-form ultimo-campo"}>
              <span className="label">Confirmar contraseña:</span>
              <input
                rows="8"
                name="password"
                type="password"
                ref={passwordConfirmRef}
                className="login-input"
                onChange={actualizarState}
              />
              {formIngresada &&
                passwordRef.current &&
                !passwordConfirmRef.current.value && (
                  <span className="login-error">
                    Debes confirmar tu contraseña.
                  </span>
                )}
              {formIngresada &&
                passwordRef.current &&
                passwordConfirmRef.current.value &&
                passwordRef.current.value !=
                  passwordConfirmRef.current.value && (
                  <span className="login-error">
                    Las contraseñas no coinciden.
                  </span>
                )}
            </div>
            <div className="nav-buttons">
              <div className="nav-button" onClick={submitLogin}>
                <div className="nav-icon chico nav-icon-check"></div>
                <span className="newLine">crear</span>
                <span>cuenta</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
