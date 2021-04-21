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
    if (props.pastilleros && props.pastilleroActivo) {
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
    } else {
      setAgrandado(false);
      setLoader(false);
    }
  }, [props]);

  function cambioDePastillero(pastillero) {
    setLoader(true);
    setAgrandado(false);
    props.seleccionPastillero(pastillero);
  }

  function navegarASeccion(seccion) {
    window.location.href = seccion;
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
                className="fit negrita"
                onClick={() => {
                  setAgrandado(true);
                }}
              >
                No tienes pastillero seleccionado.
              </span>
            )}
          </div>
          <div className="modal-seleccion-pastillero">
            <div className="texto-con-pastilleros-footer">
              {pastilleros && pastilleros.length > 0 && (
                <Select
                  className="select-pastillero"
                  options={pastilleros}
                  onChange={cambioDePastillero}
                  placeholder="Selecciona otro pastillero"
                />
              )}
              <p>
                Presionando{" "}
                <span
                  className="negrita"
                  onClick={() => {
                    navegarASeccion("usuario");
                  }}
                >
                  aquí
                </span>{" "}
                puedes configurarlos.
              </p>
            </div>
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
