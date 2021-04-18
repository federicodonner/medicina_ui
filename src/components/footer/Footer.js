import React, { useState, useEffect } from "react";
import Select from "react-select";
import "./footer.css";

import * as Fitty from "fitty/dist/fitty.min";

export default function Footer(props) {
  // Constrola que se muestre el loader
  const [loader, setLoader] = useState(true);

  // Controla el footer agrandado
  const [agrandado, setAgrandado] = useState(false);

  const [pastilleros, setPastilleros] = useState(null);

  useEffect(() => {
    var otrosPastilleros = [];
    // Recorre los pastilleros buscando al seleccionado
    // Necesita eliminarlo de la lista de opciones y obtener el nombre del dueño
    props.pastilleros.forEach((pastillero) => {
      // Procesa cada pastillero para el select
      pastillero.label =
        pastillero.paciente_nombre + " " + pastillero.paciente_apellido;
      pastillero.value = pastillero.id;
      if (pastillero.id != props.pastilleroActivo.id) {
        // Si no es el seleccionado lo guarda en un array para el state
        otrosPastilleros.push(pastillero);
      }
    });

    // Guarda los datos en el state y cierra el modal por si está abierto
    setPastilleros(otrosPastilleros);
    setAgrandado(false);
    setLoader(false);
    Fitty(".fit", { maxSize: 22 });
  }, [props]);

  function cambioDePastillero(pastillero) {
    setLoader(true);
    setAgrandado(false);
    props.seleccionPastillero(pastillero);
  }

  return (
    <div
      className={
        agrandado
          ? "footer agrandado"
          : "footer " + (props.escondido ? "escondido" : "")
      }
    >
      {loader && <img className="loader-footer" src="/images/loader.svg" />}
      {!loader && (
        <>
          <div className="titulo-footer">
            {props.pastilleroActivo && (
              <span
                className="fit"
                onClick={() => {
                  setAgrandado(true);
                }}
              >
                Pastillero de{" "}
                <span className="negrita">
                  {props.pastilleroActivo.paciente.nombre +
                    " " +
                    props.pastilleroActivo.paciente.apellido}
                </span>
              </span>
            )}
            {!props.pastilleroActivo && (
              <span
                className="fit"
                onClick={() => {
                  setAgrandado(true);
                }}
              >
                Sin pastillero. <span className="negrita">Selecciona uno</span>.
              </span>
            )}
          </div>
          <div className="modal-seleccion-pastillero">
            {pastilleros && pastilleros.length > 0 && (
              <div className="texto-con-pastilleros-footer">
                <Select
                  className="select-pastillero"
                  options={pastilleros}
                  onChange={cambioDePastillero}
                  placeholder="Selecciona otro pastillero"
                />
                <p>
                  Presiona <span className="negrita">aquí</span> para crear uno
                  nuevo.
                </p>
              </div>
            )}
            {pastilleros && pastilleros.length < 1 && (
              <div className="texto-sin-pastilleros-footer">
                <p>
                  No tienes otros pastilleros, presiona{" "}
                  <span className="negrita">aquí</span> para crear uno nuevo.
                </p>
              </div>
            )}
            <span
              className="negrita"
              onClick={() => {
                setAgrandado(false);
              }}
            >
              Cerrar
            </span>
          </div>
        </>
      )}
    </div>
  );
}
