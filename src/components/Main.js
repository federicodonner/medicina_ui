import React, { useState, useEffect } from "react";
import Footer from "./footer/Footer";
import Login from "./login/Login";
import MensajeAlerta from "./mensajeAlerta/MensajeAlerta";
import {
  accederAPI,
  borrarDesdeLS,
  guardarEnLS,
  leerDesdeLS,
} from "../utils/fetchFunctions";
import variables from "../var/variables.js";
import Router from "./Router";

export default function Main(props) {
  const [userInfo, setUserInfo] = useState(null);

  const [pastillero, setPastillero] = useState(null);

  const [mostrarLogin, setMostrarLogin] = useState(false);

  // Los hijos pueden apagar o prender el header y el footer si los necesitan
  const [mostrarFooter, setMostrarFooter] = useState(true);

  // Objeto de configuración de mensaje
  const [configuracionMensaje, setConfiguracionMensaje] = useState({});

  // Function llamada al inicializar el componente
  // Va a buscar los datos del usuario que después se los va a pasar
  // a los componentes hijo
  useEffect(() => {
    // Precarga el loader para conexiones lentas
    new Image().src = "/images/loader.svg";
    new Image().src = "/images/loader_dots.svg";
    cargarUsuario();
  }, []);

  // Cuando carga el componente va a buscar al usuario
  // Una vez que lo tiene, define cuál es el pastillero seleccionado
  useEffect(() => {
    if (userInfo) {
      // verifica que el usuario tenga pastilleros
      if (userInfo.pastilleros?.length > 0) {
        // Si tiene, verifica que ya haya un pastillero por defecto ya guardado
        var pastilleroActual = JSON.parse(
          leerDesdeLS(variables.LSPastilleroPorDefecto)
        );

        if (!pastilleroActual) {
          // Si no hay un pastillero actual
          // guarda el primer pastillero como pastillero por defecto
          // el LS y en el state
          pastilleroActual = userInfo.pastilleros[0].id;
          guardarEnLS(
            variables.LSPastilleroPorDefecto,
            JSON.stringify(pastilleroActual)
          );
        }

        accederAPI(
          "GET",
          "pastillero/" + pastilleroActual,
          null,
          setPastillero,
          errorUserInfo
        );
      }
    }
  }, [userInfo]);

  // Esta llamada a la API se separa del useEffect al cargar el componente
  // ya que puede ser invocada por un hijo
  function cargarUsuario() {
    accederAPI("GET", "usuario", null, setUserInfo, errorUserInfo);
  }

  // Callback del error del GET de usuario
  function errorUserInfo(respuesta) {
    borrarDesdeLS(variables.LSLoginToken);
    setMostrarLogin(true);
  }

  // Una vez que el componente valida que los campos del login están completos
  // invoca esta función para hacer el login efectivo
  function camposLoginValidados(datosLogin) {
    setMostrarLogin(false);
    accederAPI(
      "POST",
      "oauth",
      datosLogin,
      (respuesta) => {
        guardarEnLS(variables.LSLoginToken, respuesta.token);
        setMostrarLogin(false);
        accederAPI("GET", "usuario", null, setUserInfo, errorUserInfo);
      },
      (respuesta) => {
        alert(respuesta.detail);
        setMostrarLogin(true);
      }
    );
  }

  // Callback ejecutado por Login cuando crea una nueva cuenta
  function cuentaCreada(respuesta) {
    // Guarda el login token del nuevo usuario<
    guardarEnLS(variables.LSLoginToken, respuesta.token);
    // Lo elimina y guarda los datos del usuario
    delete respuesta.token;
    setUserInfo(respuesta);
    // Muestra la sección actual a través del Router
    setMostrarLogin(false);
  }

  // Función disparada por el footer cuando el usuario selecciona
  // un nuevo pastillero de la lista
  function seleccionPastillero(nuevoPastillero) {
    accederAPI(
      "GET",
      "pastillero/" + nuevoPastillero.id,
      null,
      (respuesta) => {
        setPastillero(respuesta);
        guardarEnLS(
          variables.LSPastilleroPorDefecto,
          JSON.stringify(respuesta.id)
        );
      },
      errorUserInfo
    );
  }

  return (
    <div className="app-view cover">
      <MensajeAlerta
        configuracionMensaje={configuracionMensaje}
        setConfiguracionMensaje={setConfiguracionMensaje}
      />
      <div className="scrollable">
        {mostrarLogin && (
          <Login
            camposLoginValidados={camposLoginValidados}
            cuentaCreada={cuentaCreada}
            setConfiguracionMensaje={setConfiguracionMensaje}
          />
        )}
        {!mostrarLogin && !userInfo && (
          <div className="loader-container">
            <p>
              <img className="loader" src="/images/loader.svg" alt="loader" />
            </p>
            <p className={"negrita"}>Cargando </p>
          </div>
        )}
        {!mostrarLogin && userInfo && (
          <>
            <Router
              setUserInfo={setUserInfo}
              userInfo={userInfo}
              pastillero={pastillero}
              setMostrarFooter={setMostrarFooter}
              seleccionPastillero={seleccionPastillero}
              cargarUsuario={cargarUsuario}
              setConfiguracionMensaje={setConfiguracionMensaje}
            />

            <Footer
              pastilleros={userInfo.pastilleros}
              pastilleroActivo={pastillero}
              navegarANuevoPastillero={() => {
                console.log("navegar a nuevo pastillero");
              }}
              seleccionPastillero={seleccionPastillero}
              escondido={!mostrarFooter}
            />
          </>
        )}
      </div>
    </div>
  );
}
