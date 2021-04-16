import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Modal from "../modal/Modal";
import {
  borrarDesdeLS,
  accederAPI,
  errorApi,
} from "../../utils/fetchFunctions";
import variables from "../../var/variables.js";
import "./usuario.css";

export default function Usuario(props) {
  const [loader, setLoader] = useState(true);
  const [loaderTexto, setLoaderTexto] = useState("Cargando tus datos");

  const [mostrarModalUsuario, setMostrarModalUsuario] = useState(false);
  const [mostrarModalPastillero, setMostrarModalPastillero] = useState(false);

  const [pastillero, setPastillero] = useState(null);

  const [userInfo, setUserInfo] = useState(
    props.history.location.state?.userInfo
  );

  // Función ejecutada en la primera carga del componente
  useEffect(() => {
    // Verifica que el componente anterior le haya pasado los datos del usuario
    if (!props.location.state || !props.location.state.userInfo) {
      // Sino, los va a buscar al servidor
      // Va a buscar los datos del usuario
      accederAPI(
        "GET",
        "usuario",
        null,
        (respuesta) => {
          setUserInfo(respuesta);
        },
        errorApi
      );
    } else {
      recibirDatos(userInfo);
    }
  }, [props]);

  // Función que apaga el loader cuando verifica que
  // todos los componentes terminaron de cargar su parte
  useEffect(() => {
    if (userInfo && pastillero) {
      setLoader(false);
    }
  }, [userInfo, pastillero]);

  function navigateToSection(section) {
    props.history.push(
      {
        pathname: section,
      },
      { userInfo }
    );
  }

  // Callback de la llamada a la API cuando el estado es 200
  function recibirDatos(userInfo) {
    // Antes de guardar los datos verifico que tenga algún pastillero
    // en el que el usaurio sea el paciente
    var pastilleros = userInfo.pastilleros;
    var pastilleroEncontrado = false;
    if (pastilleros) {
      // Recorre los pastilleros, cuando encuentra el del usuario
      // lo separa para guardarlo en state
      pastilleros.forEach((pastillero) => {
        if (!pastilleroEncontrado) {
          if ((pastillero.paciente_id = userInfo.id)) {
            pastilleroEncontrado = true;
            accederAPI(
              "GET",
              "pastillero/" + pastillero.id,
              null,
              recibirPastillero,
              errorApi
            );
          }
        }
      });
    }
    setUserInfo(userInfo);
    setLoader(false);
  }

  // Función que recibe el pastillero del usuario desde la API
  // lo guarda en state y llama a apagar loader
  function recibirPastillero(pastillero) {
    // Le agrega hasta 6 dósis por si el cliente quiere agregar más
    var nuevaDosis = { horario: null };
    for (var i = pastillero.dosis.length; i < 6; i++) {
      pastillero.dosis[i] = nuevaDosis;
    }

    setPastillero(pastillero);
  }

  // Función ejecutada al actualizar los datos del usuario
  function submitEditarUsuario(datos) {
    // Cierro el modal y prendo el loader
    setLoaderTexto("Enviado datos");
    setLoader(true);
    setMostrarModalUsuario(false);

    accederAPI(
      "PUT",
      "usuario",
      datos,
      () => {
        alert("Datos editados exitosamente");
        //Va a buscar los datos
        accederAPI("GET", "usuario", null, recibirDatos, errorApi);
      },
      errorApi
    );
  }

  // Entra a esta función si editó los datos correctamente
  function datosEditadosExitosamente() {
    console.log("datos editados exitosamente");
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
        {userInfo && (
          <Header
            volver={() => {
              navigateToSection("home");
            }}
            logoChico={true}
          />
        )}
        <div className="content">
          {!loader && (
            <>
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
                      value: userInfo.nombre,
                      obligatorio: true,
                    },
                    {
                      tipo: "texto",
                      etiqueta: "Apellido",
                      nombre: "apellido",
                      value: userInfo.apellido,
                      obligatorio: true,
                    },
                    {
                      tipo: "texto",
                      etiqueta: "Email",
                      nombre: "email",
                      value: userInfo.email,
                      obligatorio: true,
                      regexValidate: RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/),
                    },
                  ]}
                />
              )}
            </>
          )}
          {!loader && userInfo && (
            <>
              <p>Datos personales:</p>
              <p>
                <span className="newline">
                  Nombre: {userInfo.nombre + " " + userInfo.apellido}
                </span>
                <span className="newLine">Email: {userInfo.email}</span>
              </p>

              {pastillero && <p>Tienes un pastillero ingresado</p>}

              <div className="nav-buttons tres">
                <div
                  className="nav-button"
                  onClick={() => setMostrarModalUsuario(true)}
                >
                  <div className="nav-icon chico nav-icon-edit"></div>
                  <span className="single-line">editar</span>
                  <span>datos</span>
                </div>
                <div className="nav-button">
                  <div className="nav-icon chico nav-icon-password"></div>
                  <span className="single-line">cambiar</span>
                  <span>contraseña</span>
                </div>
                {pastillero && (
                  <div
                    className="nav-button"
                    onClick={() => setMostrarModalPastillero(true)}
                  >
                    <div className="nav-icon chico nav-icon-pastillero"></div>
                    <span className="single-line">editar tu</span>
                    <span>pastillero</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
