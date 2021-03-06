import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import Modal from "../modal/Modal";
import { accederAPI, errorApi, logOut } from "../../utils/fetchFunctions";
import "./usuario.css";

export default function Usuario(props) {
  const [loader, setLoader] = useState(true);
  const [loaderTexto, setLoaderTexto] = useState("Cargando tus datos");

  const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);
  const [mostrarModalPastillero, setMostrarModalPastillero] = useState(false);
  const [mostrarModalPassword, setMostrarModalPassword] = useState(false);

  // Función ejecutada en la primera carga del componente
  useEffect(() => {
    props.setMostrarFooter(false);
    setLoader(false);
  }, [props]);

  function navegarASeccion(section) {
    props.history.push({
      pathname: section,
    });
  }

  // Función ejecutada al actualizar los datos del usuario
  function submitEditarUsuario(datos) {
    // Cierro el modal y prendo el loader
    setLoaderTexto("Enviado datos");
    setLoader(true);
    setMostrarModalUsuario(false);

    accederAPI("PUT", "usuario", datos, props.cargarUsuario, errorApi);
  }

  // Función ejecutada al actualizar el password
  function submitActualizarPassword(datos) {
    // Prende el loader y esconde el modal
    setLoader(true);
    setMostrarModalPassword(false);

    accederAPI(
      "POST",
      "cambiopassword",
      datos,
      (respuesta) => {
        props.setConfiguracionMensaje({ textoMensaje: respuesta.detail });
        navegarASeccion("/");
      },
      (respuesta) => {
        // En este request, el status 403 significa contraseña incorrecta
        // No quiero navegar si devuelve ese error
        if (respuesta.status === 403) {
          props.setConfiguracionMensaje({
            textoMensaje: respuesta.detail,
            tipoMensaje: "error",
          });
          setLoader(false);
          setMostrarModalPassword(true);
        } else {
          errorApi();
        }
      }
    );
  }

  return (
    <>
      {loader && (
        <div className="loader-container">
          <p>
            <img className="loader" src="/images/loader.svg" alt="loader" />
          </p>
          <p className={"negrita"}>{loaderTexto}</p>
        </div>
      )}

      <div className="content">
        <Header
          volver={() => {
            navegarASeccion("/");
          }}
          cerrarSesion={logOut}
        />
        {mostrarModalUsuario && (
          <Modal
            defaultNavButtons={true}
            mostrarModal={mostrarModalUsuario}
            cerrarModal={() => setMostrarModalUsuario(false)}
            titulo={"Editar datos"}
            submitModal={submitEditarUsuario}
            campos={[
              {
                tipo: "texto",
                etiqueta: "Nombre",
                nombre: "nombre",
                value: props.userInfo.nombre,
                obligatorio: true,
              },
              {
                tipo: "texto",
                etiqueta: "Apellido",
                nombre: "apellido",
                value: props.userInfo.apellido,
                obligatorio: true,
              },
              {
                tipo: "texto",
                etiqueta: "Email",
                nombre: "email",
                value: props.userInfo.email,
                obligatorio: true,
                regexValidate: RegExp(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/),
              },
            ]}
          />
        )}
        {mostrarModalPassword && (
          <Modal
            setConfiguracionMensaje={props.setConfiguracionMensaje}
            defaultNavButtons={true}
            mostrarModal={mostrarModalPassword}
            cerrarModal={() => setMostrarModalPassword(false)}
            titulo={"Cambiar contraseña"}
            submitModal={submitActualizarPassword}
            campos={[
              {
                tipo: "password",
                etiqueta: "Contraseña actual",
                nombre: "actual",
                obligatorio: true,
              },
              {
                tipo: "password",
                etiqueta: "Contraseña nueva",
                nombre: "nueva",
                obligatorio: true,
              },
            ]}
          />
        )}

        {!loader && props.userInfo && (
          <>
            <p>
              <span className="newline">
                {props.userInfo.nombre + " " + props.userInfo.apellido}
              </span>
              <span className="newLine">{props.userInfo.email}</span>
            </p>

            <div className="nav-buttons tres">
              {props.pastillero && (
                <div
                  className="nav-button"
                  onClick={() => setMostrarModalPastillero(true)}
                >
                  <div className="nav-icon chico nav-icon-pastillero"></div>
                  <span className="single-line">editar</span>
                  <span>pastillero</span>
                </div>
              )}
              {!props.pastillero && (
                <div
                  className="nav-button"
                  onClick={() => navegarASeccion("nuevoPastillero")}
                >
                  <div className="nav-icon chico nav-icon-pastillero"></div>
                  <span className="single-line">crear</span>
                  <span>pastillero</span>
                </div>
              )}
              <div
                className="nav-button"
                onClick={() => navegarASeccion("compartirpastillero")}
              >
                <div className="nav-icon chico nav-icon-compartir-pastillero"></div>
                <span className="single-line">compartir</span>
                <span>pastillero</span>
              </div>
              <div
                className="nav-button"
                onClick={() => navegarASeccion("agregarpastillero")}
              >
                <div className="nav-icon chico nav-icon-compartir-pastillero-invert"></div>
                <span className="single-line">agregar</span>
                <span>pastillero</span>
              </div>
              <div
                className="nav-button"
                onClick={() => setMostrarModalUsuario(true)}
              >
                <div className="nav-icon chico nav-icon-edit"></div>
                <span className="single-line">editar</span>
                <span>datos</span>
              </div>
              <div
                className="nav-button"
                onClick={() => {
                  setMostrarModalPassword(true);
                }}
              >
                <div className="nav-icon chico nav-icon-password"></div>
                <span className="single-line">cambiar</span>
                <span>contraseña</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
