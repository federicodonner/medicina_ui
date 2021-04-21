import React, { useState, useEffect, useRef } from "react";
import Modal from "../modal/Modal";
import variables from "../../var/variables.js";
import { accederAPI, errorApi } from "../../utils/fetchFunctions";
import "./editarDroga.css";

export default function EditarDroga(props) {
  // Controla el loader
  const [loader, setLoader] = useState(true);
  const [loaderTexto, setLoaderTexto] = useState(
    "Cargando datos del pastillero"
  );

  const [pastillero, setPastillero] = useState(null);

  // Modal para agregar y editar drogas
  const [mostrarModal, setMostrarModal] = useState(false);
  const [datosModal, setDatosModal] = useState(null);
  // Los horarios de las dosis están separados porque son los únicos
  // campos del modal que no cambian al seleccionar una nueva droga
  const [horariosModal, setHorariosModal] = useState(null);

  const [horariosParaMostrar, setHorariosParaMostrar] = useState(null);

  const cantidadRef = useRef(null);
  const notasRef = useRef(null);

  // Función ejecutada en la primera carga del componente
  useEffect(() => {
    if (props.userInfo.pastilleros?.length < 1) {
      alert(
        "No tienes un pastillero ingresado, configura uno en la sección de usuario"
      );
      navegarASeccion("/");
    }

    // Si tiene un pastillero determinado, lo carga
    if (props.pastillero) {
      setPastillero(props.pastillero);
    }

    props.setMostrarHeader(true);
    props.setMostrarFooter(true);
  }, [props]);

  // Función que apaga el loader cuando verifica que
  // todos los componentes terminaron de cargar su parte
  useEffect(() => {
    if (pastillero) {
      var horarios = [];
      var horario = {};
      // Por cada horario del pastillero se carga en el array en state
      pastillero.dosis.forEach(function (dosis, index) {
        horario.label = dosis.horario;
        horario.value = dosis.id;
        horarios.push(Object.assign({}, horario));
      });

      // Carga todos los datos procesados en state
      setMostrarModal(false);
      setHorariosModal(horarios);
      setLoader(false);
    }
  }, [pastillero]);

  // Muestra el modal cuando se cargan los datos
  useEffect(() => {
    // Si hay una droga cargada, muestro el modal
    if (datosModal?.droga) {
      setMostrarModal(true);
    }
  }, [datosModal]);

  function navegarASeccion(section) {
    props.history.push({
      pathname: section,
    });
  }

  // Arma el objeto e invoca la API para editar la dosis
  function submitEditarDroga(datos) {
    // Guarda el horario seleccionado en estate para actualizar la lista
    var datosModalEditado = datosModal;
    datosModalEditado.horario.value = datos["dosis_id"];
    setDatosModal(datosModalEditado);

    // Enciende el loader
    setLoaderTexto("Editando la dosis");
    setLoader(true);

    // Envía la request a la API con el callback para recargar la página
    accederAPI(
      "PUT",
      "drogaxdosis/" + datosModal.drogaxdosis_id,
      datos,
      editarDrogaEnState,
      errorApi
    );
  }

  function submitEliminarDroga() {
    if (
      window.confirm(
        "¿Seguro que desea eliminar la dósis de " + datosModal.droga + "?"
      )
    ) {
      // Enciende el loader
      setLoaderTexto("Eliminando la dosis");
      setLoader(true);

      // Envía la request a la API con el callback para recargar la página
      accederAPI(
        "DELETE",
        "drogaxdosis/" + datosModal.drogaxdosis_id,
        null,
        editarDrogaEnState,
        errorApi
      );
    }
  }

  // Si se editó una dosis, la edita en state para matchear con la db
  function editarDrogaEnState(drogaxdosisEditado) {
    var pastilleroEditado = pastillero;
    var horarioSeleccionado = datosModal.horario.value;
    var drogaxdosisId = datosModal.drogaxdosis_id;

    // Arma los horarios de los datos para el modal
    // Aprovecha que va a recorrer el array de dosis del pastillero
    var datosModalEditado = { horarios: [] };

    // Va a buscar la drogaxdosis eliminada para borrarla
    pastilleroEditado.dosis.forEach((dosis) => {
      var horario = {};
      horario.label = dosis.horario;
      horario.value = dosis.id;
      datosModalEditado.horarios.push(Object.assign({}, horario));

      if (dosis.drogas.length >= 0) {
        dosis.drogas.forEach((drogaxdosis, index) => {
          if (drogaxdosis.id == drogaxdosisId) {
            // Cuando encuentra el editado, lo elimina
            dosis.drogas.splice(index, 1);
          }
        });
      }
      // Después de eliminar el encontrado, si fue una edición
      // lo agrega en el horario seleccionado
      // (si fue elmiinada una droga, el objeto de respuesta de la API no tiene id)
      if (dosis.id == horarioSeleccionado && drogaxdosisEditado.id) {
        dosis.drogas.push(drogaxdosisEditado);
      }
    });
    // Guarda el state actualizado
    setPastillero(pastilleroEditado);
    setDatosModal(datosModalEditado);
    setMostrarModal(false);
    setLoader(false);
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

      <div className="content">
        {datosModal && !loader && (
          <>
            {mostrarModal && (
              <Modal
                defaultNavButtons={false}
                mostrarModal={mostrarModal}
                cerrarModal={() => {
                  setMostrarModal(false);
                }}
                titulo={datosModal.droga}
                submitModal={submitEditarDroga}
                campos={[
                  {
                    tipo: "select",
                    etiqueta: "Horario",
                    nombre: "dosis_id",
                    obligatorio: true,
                    opciones: horariosModal,
                    seleccionado: datosModal.horario,
                  },
                  {
                    tipo: "texto",
                    etiqueta: "Cantidad (mg)",
                    nombre: "cantidad_mg",
                    value: datosModal.cantidad_mg,
                    obligatorio: true,
                  },
                  {
                    tipo: "texto",
                    etiqueta: "Notas",
                    nombre: "notas",
                    value: datosModal.notas,
                    obligatorio: false,
                  },
                ]}
                navButtons={[
                  {
                    textoArriba: "Cancelar",
                    tipo: "nav-icon-cross",
                    esCerrar: true,
                  },
                  {
                    textoArriba: "Eliminar",
                    textoAbajo: "dosis",
                    tipo: "nav-icon-alert",
                    funcion: submitEliminarDroga,
                  },
                  {
                    textoArriba: "Guardar",
                    textoAbajo: "cambios",
                    tipo: "nav-icon-check",
                    esAceptar: true,
                  },
                ]}
              />
            )}
          </>
        )}

        {!loader && (
          <>
            <p>Seleccione una dosis para editarla</p>
            {pastillero && (
              <ul className="dosis-horario">
                {pastillero.dosis.map((dosis) => {
                  return (
                    <li key={"dosis" + dosis.id} className="dosis-horario">
                      {dosis.horario}
                      <ul className="dosis-droga">
                        {dosis.drogas.map((droga) => {
                          return (
                            <li
                              key={droga.id}
                              className="dosis-droga"
                              onClick={() => {
                                setDatosModal({
                                  horario: {
                                    value: dosis.id,
                                    label: dosis.horario,
                                  },
                                  droga: droga.nombre,
                                  drogaxdosis_id: droga.id,
                                  droga_id: droga.droga_id,
                                  cantidad_mg: droga.cantidad_mg,
                                  notas: droga.notas,
                                  horarios: [],
                                });
                              }}
                            >
                              {droga.nombre} - {droga.cantidad_mg} mg
                              {droga.notas && (
                                <span className="notas-dosis">
                                  {droga.notas}
                                </span>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            )}
            <div className="nav-buttons">
              <div
                className="nav-button"
                onClick={() => {
                  navegarASeccion("agregarDroga");
                }}
              >
                <div className="nav-icon nav-icon-agregar-dosis chico"></div>
                <span className="single-line">agregar</span>
                <span>droga</span>
              </div>

              <div
                className="nav-button"
                onClick={() => {
                  navegarASeccion("descontarStock");
                }}
              >
                <div className="nav-icon nav-icon-pastillero chico"></div>
                <span className="single-line">pastillero</span>
                <span>armado</span>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
