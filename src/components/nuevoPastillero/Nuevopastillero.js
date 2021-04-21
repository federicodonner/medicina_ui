import React, { useState, useEffect, useRef } from "react";
import Header from "../header/Header";
import {
  accederAPI,
  borrarDesdeLS,
  errorApi,
} from "../../utils/fetchFunctions";
import variables from "../../var/variables.js";
import "./nuevoPastillero.css";

export default function NuevoPastillero(props) {
  // Controla el loader
  const [loader, setLoader] = useState(true);
  const [loaderTexto, setLoaderTexto] = useState("Cargando datos del usuario");

  // Variable usada para forzar un re-render del componente
  const [forceUpdate, setForceUpdate] = useState(1);

  const dosis1Ref = useRef(null);
  const dosis2Ref = useRef(null);
  const dosis3Ref = useRef(null);
  const dosis4Ref = useRef(null);
  const dosis5Ref = useRef(null);
  const dosis6Ref = useRef(null);

  // Función ejecutada en la primera carga del componente
  useEffect(() => {
    props.setMostrarFooter(false);
    setLoader(false);
  }, [props]);

  function crearPastillero(e) {
    e.preventDefault();
    var dosisEnviar = [];

    // Recorre los campos y agrega las dosis que va encontrando
    if (dosis1Ref.current.value) {
      dosisEnviar.push(JSON.stringify({ horario: dosis1Ref.current.value }));
    }
    if (dosis2Ref.current && dosis2Ref.current.value) {
      dosisEnviar.push(JSON.stringify({ horario: dosis2Ref.current.value }));
    }
    if (dosis3Ref.current && dosis3Ref.current.value) {
      dosisEnviar.push(JSON.stringify({ horario: dosis3Ref.current.value }));
    }
    if (dosis4Ref.current && dosis4Ref.current.value) {
      dosisEnviar.push(JSON.stringify({ horario: dosis4Ref.current.value }));
    }
    if (dosis5Ref.current && dosis5Ref.current.value) {
      dosisEnviar.push(JSON.stringify({ horario: dosis5Ref.current.value }));
    }
    if (dosis6Ref.current && dosis6Ref.current.value) {
      dosisEnviar.push(JSON.stringify({ horario: dosis6Ref.current.value }));
    }

    // Verifica que haya algo en el array
    if (!dosisEnviar.length) {
      alert(
        "Debes especificar al menos un horario de toma para tu pastillero."
      );
    } else {
      // Si llega acá es porque hay dosis ingresadas
      // Enciende el loader
      setLoaderTexto("Generando tu pastillero");
      setLoader(true);

      // Arma los datos para enviar
      var data = { dia_actualizacion: 1, dosis: dosisEnviar };
      accederAPI(
        "POST",
        "pastillero",
        data,
        () => {
          props.cargarUsuario();
          navegarASeccion("/");
        },
        errorApi
      );
    }
  }

  // Necesario para que se actualice el componente y
  // aparezcan o desaparezcan los campos
  function refrescarState() {
    setForceUpdate(forceUpdate + 1);
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
            <img className="loader" src="/images/loader.svg" />
          </p>
          <p className={"negrita"}>{loaderTexto}</p>
        </div>
      )}
      {!loader && (
        <>
          <div className="content">
            <Header
              volver={() => {
                navegarASeccion("usuario");
              }}
            />
            <p>Crea un nuevo pastillero</p>
            <p>
              Especifica en qué momentos del día harás las tomas de medicamentos
              de tu nuevo pastillero. Tienes hasta 6. Puedes ponerles el nombre
              que quieras.
            </p>
            <p>Tomas de medicamentos:</p>

            <div className={"dosis-form"}>
              <input
                rows="8"
                name="toma1"
                type="text"
                ref={dosis1Ref}
                className="dosis-input"
                onChange={refrescarState}
              />
              {((dosis1Ref.current && dosis1Ref.current.value) ||
                (dosis2Ref.current && dosis2Ref.current.value)) && (
                <input
                  rows="8"
                  name="toma2"
                  type="text"
                  ref={dosis2Ref}
                  className="login-input"
                  onChange={refrescarState}
                />
              )}
              {((dosis2Ref.current && dosis2Ref.current.value) ||
                (dosis3Ref.current && dosis3Ref.current.value)) && (
                <input
                  rows="8"
                  name="toma2"
                  type="text"
                  ref={dosis3Ref}
                  className="dosis-input"
                  onChange={refrescarState}
                />
              )}
              {((dosis3Ref.current && dosis3Ref.current.value) ||
                (dosis4Ref.current && dosis4Ref.current.value)) && (
                <input
                  rows="8"
                  name="toma2"
                  type="text"
                  ref={dosis4Ref}
                  className="dosis-input"
                  onChange={refrescarState}
                />
              )}
              {((dosis4Ref.current && dosis4Ref.current.value) ||
                (dosis5Ref.current && dosis5Ref.current.value)) && (
                <input
                  rows="8"
                  name="toma2"
                  type="text"
                  ref={dosis5Ref}
                  className="dosis-input"
                  onChange={refrescarState}
                />
              )}
              {((dosis5Ref.current && dosis5Ref.current.value) ||
                (dosis6Ref.current && dosis6Ref.current.value)) && (
                <input
                  rows="8"
                  name="toma2"
                  type="text"
                  ref={dosis6Ref}
                  className="dosis-input"
                  onChange={refrescarState}
                />
              )}
            </div>
            <div className="nav-buttons">
              <div className="nav-button" onClick={crearPastillero}>
                <div className="nav-icon chico nav-icon-check"></div>
                <span className="newLine">Crear</span>
                <span>pastillero</span>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
