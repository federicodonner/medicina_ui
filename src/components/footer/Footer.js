import React, { useState, useEffect } from "react";
import Select from "react-select";
import {
  leerDesdeLS,
  guardarEnLS,
  accederAPI,
} from "../../utils/fetchFunctions";
import variables from "../../var/variables.js";
import "./footer.css";

import * as Fitty from "fitty/dist/fitty.min";

export default function Footer(props) {
  // Constrola que se muestre el loader
  const [loader, setLoader] = useState(true);

  // Controla el footer agrandado
  const [agrandado, setAgrandado] = useState(false);

  const [pastilleroSeleccionado, setPastilleroSeleccionado] = useState(null);

  const [pastilleros, setPastilleros] = useState(null);

  useEffect(() => {
    // Procesa los pastilleros recibidos para mostrar el seleccionado
    // y la lista de otros posibles para cambiar
    procesarPastilleros();
  }, []);

  function navegarANuevoPastillero() {
    props.navegarANuevoPastillero();
  }

  function navegarAHome() {
    props.navegarAHome();
  }

  // Función ejecutada cuando se selecciona un pastillero nuevo
  // Actualiza el id en LS y ejecuta la función de home que lo actualiza en state
  function seleccionPastillero(pastilleroSeleccionado) {
    guardarEnLS(
      variables.LSPastilleroPorDefecto,
      JSON.stringify(pastilleroSeleccionado.id)
    );
    // reinicia la seleccción del combo
    // event.target.value = 0;
    // Procesa el state para actualizar el nombre del usuario y el combo
    procesarPastilleros();
  }

  function procesarPastilleros() {
    // Verifica que ya haya un pastillero por defecto ya guardado
    var pastilleroActual = JSON.parse(
      leerDesdeLS(variables.LSPastilleroPorDefecto)
    );

    if (!pastilleroActual) {
      // Si no hay un pastillero actual
      // guarda el primer pastillero como pastillero por defecto
      // el LS y en el state
      pastilleroActual = props.pastilleros[0].id;
      guardarEnLS(
        variables.LSPastilleroPorDefecto,
        JSON.stringify(pastilleroActual)
      );
    }

    // Si el Componente padre le pide que espeficique el pastillero,
    // Va a buscar los detalles y ejecuta el callback del componente padre
    if (props.establecerPastillero) {
      accederAPI(
        "GET",
        "pastillero/" + pastilleroActual,
        null,
        props.establecerPastillero,
        (respuesta) => {
          console.log(respuesta.detail);
        }
      );
    }

    var pastilleroSeleccionadoAux = {};
    var otrosPastilleros = [];
    // Recorre los pastilleros buscando al seleccionado
    // Necesita eliminarlo de la lista de opciones y obtener el nombre del dueño
    props.pastilleros.forEach((pastillero) => {
      // Procesa cada pastillero para el select
      pastillero.label =
        pastillero.paciente_nombre + " " + pastillero.paciente_apellido;
      pastillero.value = pastillero.id;
      if (pastillero.id == pastilleroActual) {
        pastilleroSeleccionadoAux.nombreCompleto =
          pastillero.paciente_nombre + " " + pastillero.paciente_apellido;
      } else {
        // Si no es el seleccionado lo guarda en un array para el state
        otrosPastilleros.push(pastillero);
      }
    });

    // Guarda los datos en el state y cierra el modal por si está abierto
    setPastilleroSeleccionado(pastilleroSeleccionadoAux);
    setPastilleros(otrosPastilleros);
    setAgrandado(false);
    setLoader(false);
    // Fitty(".fit", { maxSize: 22 });
  }

  return (
    <div className={agrandado ? "footer agrandado" : "footer"}>
      {loader && <img className="loader-footer" src="/images/loader.svg" />}
      {!loader && (
        <>
          <div className="titulo-footer">
            {pastilleroSeleccionado && (
              <span
                className="fit"
                onClick={() => {
                  setAgrandado(true);
                }}
              >
                Pastillero de{" "}
                <span className="negrita">
                  {pastilleroSeleccionado.nombreCompleto}
                </span>
              </span>
            )}
            {!pastilleroSeleccionado && (
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
            {props.cambioPastilleroHabilitado &&
              pastilleros &&
              pastilleros.length > 0 && (
                <div className="texto-con-pastilleros-footer">
                  <Select
                    className="select-pastillero"
                    onChange={seleccionPastillero}
                    options={pastilleros}
                    placeholder="Selecciona otro pastillero"
                  />
                  <p>
                    Presiona{" "}
                    <span className="negrita" onClick={navegarANuevoPastillero}>
                      aquí
                    </span>{" "}
                    para crear uno nuevo.
                  </p>
                </div>
              )}
            {props.cambioPastilleroHabilitado &&
              pastilleros &&
              pastilleros.length < 1 && (
                <div className="texto-sin-pastilleros-footer">
                  <p>
                    No tienes otros pastilleros, presiona{" "}
                    <span className="negrita" onClick={navegarANuevoPastillero}>
                      aquí
                    </span>{" "}
                    para crear uno nuevo.
                  </p>
                </div>
              )}
            {!props.cambioPastilleroHabilitado && (
              <div className="texto-sin-pastilleros-footer">
                <p>
                  No puedes cambiar de pastillero desde esta sección. Para
                  hacerlo debes volver a la{" "}
                  <span className="negrita" onClick={navegarAHome}>
                    pantalla principal
                  </span>
                  .
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
