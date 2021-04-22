import React, { useState, useEffect, useRef } from "react";
import Header from "../header/Header";
import { accederAPI, errorApi } from "../../utils/fetchFunctions";
import "./compartirPastillero.css";

export default function CompartirPastillero(props) {
  // Controla el loader
  const [loader, setLoader] = useState(true);

  const [pastilleroHash, setPastilleroHash] = useState(null);
  const [pastilleroPropio, setPastilleroPropio] = useState(false);
  const [hashLoader, setHashLoader] = useState(false);

  const hashRef = useRef(null);

  // Cuando recibe la inforamción de userInfo
  // verifica que tenga un pastillero del que sea el paciente
  useEffect(() => {
    props.setMostrarFooter(false);
    if (props.userInfo.pastilleros.length > 0) {
      var pastilleroPropio = null;
      props.userInfo.pastilleros.forEach((pastillero) => {
        if (pastillero.paciente_id === props.userInfo.id) {
          pastilleroPropio = pastillero;
        }
      });
      // Si no encontró ningún pastillero propio
      // apaga el loader porque el state ya está inicializado como false
      if (!pastilleroPropio) {
        setLoader(false);
        return false;
      }

      // Si estoy acá es porque encontró el pastillero propio
      // Va a buscar el hash en la API
      setPastilleroPropio(pastilleroPropio);
      setLoader(false);
    }
  }, [props.userInfo]);

  function generarHash() {
    setHashLoader(true);
    accederAPI(
      "GET",
      "compartirpastillero/" + pastilleroPropio.id,
      null,
      (respuesta) => {
        setPastilleroHash(respuesta.hash);
        setHashLoader(false);
      },
      errorApi
    );
  }

  function navegarASeccion(section) {
    props.history.push({
      pathname: section,
    });
  }

  return (
    <>
      {loader && (
        <div className="loader-container">
          <p>
            <img className="loader" src="/images/loader.svg" alt="loader" />
          </p>
          <p className={"negrita"}>Cargando datos del pastillero</p>
        </div>
      )}

      <div className="content">
        <Header
          volver={() => {
            navegarASeccion("/usuario");
          }}
        />
        {!loader && (
          <>
            <p>Compartir pastillero</p>
            <p>
              Para compartir tu pastillero, el usuario al que deseas agregar
              debe ingresar el siguiente código en la sección correspondiente en
              su cuenta.
            </p>
            <div className="hashPastillero">
              {hashLoader && (
                <img
                  className="hashLoader"
                  src="/images/loader_dots.svg"
                  alt="loader"
                />
              )}
              {!hashLoader && (
                <>
                  {pastilleroPropio && (
                    <>
                      {pastilleroHash && (
                        <span className="hash">{pastilleroHash}</span>
                      )}
                      {!pastilleroHash && (
                        <span className="mensaje" onClick={generarHash}>
                          Presiona <span className="negrita">aquí</span> para
                          generar un código para compartir tu pastillero.
                        </span>
                      )}
                    </>
                  )}
                  {!pastilleroPropio && (
                    <span className="mensaje">
                      Sólo el paciente puede compartir su pastillero.
                    </span>
                  )}
                </>
              )}
            </div>
            <p>
              Una vez ingresado podrá consultar y editar tu pastillero. Ambos
              recibirán notificaciones cuando el otro usuario haga un cambio.
            </p>
          </>
        )}
      </div>
    </>
  );
}
