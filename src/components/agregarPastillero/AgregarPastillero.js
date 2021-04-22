import React, { useState, useEffect, useRef } from "react";
import Header from "../header/Header";
import { accederAPI } from "../../utils/fetchFunctions";
import "./agregarPastillero.css";

export default function AgregarPastillero(props) {
  // Controla el loader
  const [loader, setLoader] = useState(true);

  const hashRef = useRef(null);

  // Cuando recibe la inforamción de userInfo
  // verifica que tenga un pastillero del que sea el paciente
  useEffect(() => {
    props.setMostrarFooter(false);
    setLoader(false);
  }, [props.userInfo]);

  function navegarASeccion(section) {
    props.history.push({
      pathname: section,
    });
  }

  // Función llamada por el botón de agregar pastillero
  function agregarPastillero() {
    // Verifica que se haya ingresado un hash
    if (!hashRef.current?.value) {
      props.setConfiguracionMensaje({ textoMensaje: "Debes ingresar un hash" });
      return false;
    }

    setLoader(true);
    accederAPI(
      "POST",
      "agregarpastillero",
      { hash: hashRef.current.value },
      (respuesta) => {
        props.setConfiguracionMensaje({ textoMensaje: respuesta.detail });
        props.cargarUsuario();
        navegarASeccion("/");
      },
      (respuesta) => {
        props.setConfiguracionMensaje({
          textoMensaje: respuesta.detail,
          tipoMensaje: "error",
        });
        setLoader(false);
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
            <p>Agregar pastillero</p>
            <p>
              Si quieres agregar el pastillero de otro usuario a tu cuenta,
              debes ingresar el código que obtuvo ese usuario en la sección
              correspondiente desde su cuenta. Sólo el dueño de un pastillero
              puede compartirlo.
            </p>
            <input
              name="hash"
              type="text"
              ref={hashRef}
              className="pretty-input pretty-text"
            />
            <p>
              Una vez que lo hayas agregado podrás seleccionar el pastillero
              activo desde la barra amarilla debajo en cada sección.
            </p>
            <div className="nav-buttons">
              <div className="nav-button" onClick={agregarPastillero}>
                <div className="nav-icon chico nav-icon-check"></div>
                <span className="single-line">agregar</span>
                <span>pastillero</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
