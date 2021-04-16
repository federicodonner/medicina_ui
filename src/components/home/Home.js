import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import {
  accederAPI,
  borrarDesdeLS,
  guardarEnLS,
  leerDesdeLS,
} from "../../utils/fetchFunctions";
import variables from "../../var/variables.js";
import "./home.css";

import * as PusherPushNotifications from "@pusher/push-notifications-web";

export default function Home(props) {
  const [userInfo, setUserInfo] = useState(null);

  // Controla mostrar el loader de la sección
  const [loader, setLoader] = useState(true);

  // Cuando carga el userInfo apaga el loader
  useEffect(() => {
    if (userInfo) {
      setLoader(false);
    }
  }, [userInfo]);

  // Function llamada al inicializar el componente
  useEffect(() => {
    accederAPI("GET", "usuario", null, recibirDatos, errorApi);
  }, []);

  function navegarASeccion(section, data) {
    props.history.push(
      {
        pathname: section,
      },
      { userInfo }
    );
  }

  function signOut() {
    borrarDesdeLS(variables.LSLoginToken);
    props.history.push({ pathname: "/login" });
  }

  // Callback de la llamada a la API cuando el estado es 200
  function recibirDatos(respuesta) {
    if (respuesta.pastilleros.length == 0) {
      this.props.history.push(
        { pathname: "/nuevopastillero" },
        { userInfo: respuesta }
      );
    } else {
      // ------------------------------------
      // Registrar push notifications
      // const beamsClient = new PusherPushNotifications.Client({
      //   instanceId: "f1746db2-2f5b-47ab-9398-750bc69edb88",
      // });
      //
      // beamsClient
      //   .start()
      //   .then(() => beamsClient.addDeviceInterest("hello"))
      //   .then(() =>
      //     console.log("Successfully registered and subscribed!")
      //   )
      //   .catch(console.error);

      // -------------------------

      // Guarda los datos en state y apaga el loader
      setUserInfo(respuesta);
    }
  }

  // callback de la llamada a la API cuando el estado no es 200
  function errorApi(datos) {
    alert(datos.detail);
    // Error 401 significa sin permisos, desloguea al usuario
    if (datos.status == 401) {
      signOut();
      // Error 500+ es un error de la API, lo manda a la pantalla del error
    } else if (datos.status >= 500) {
      props.history.push("error");
      // Si el error es de otros tipos, muestra el mensaje de error y apaga el loader
    } else {
      setLoader(false);
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
            <p className={"negrita"}>Verificando login</p>
          </div>
        )}
        {!loader && (
          <>
            <Header
              nombreCompleto={userInfo.nombre + " " + userInfo.apellido}
              mostrarBotonNotificaciones={true}
              navegarAUsuario={() => {
                navegarASeccion("usuario");
              }}
            />
            <div className="content">
              <div className="nav-buttons home">
                <div
                  className="nav-button"
                  onClick={() => {
                    navegarASeccion("editarDroga");
                  }}
                >
                  <div className="nav-icon nav-icon-ver-dosis"></div>
                  <span className="single-line">ver</span>
                  <span>mis dosis</span>
                </div>
                <div
                  className="nav-button"
                  onClick={() => {
                    navegarASeccion("verStock");
                  }}
                >
                  <div className="nav-icon nav-icon-consultar-stock"></div>
                  <span className="single-line">consultar</span>
                  <span>stock</span>
                </div>
                <div
                  className="nav-button"
                  onClick={() => {
                    navegarASeccion("ingresarCompra");
                  }}
                >
                  <div className="nav-icon nav-icon-ingresar-compra"></div>
                  <span className="single-line">ingresar</span>
                  <span>compra</span>
                </div>
              </div>
            </div>
            <Footer
              navegarANuevoPastillero={() => {
                navegarASeccion("nuevopastillero");
              }}
              pastilleros={userInfo.pastilleros}
              cambioPastilleroHabilitado={true}
            />
          </>
        )}
      </div>
    </div>
  );
}
