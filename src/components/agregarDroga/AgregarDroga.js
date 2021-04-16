import React, { useState, useEffect, useRef } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Select from "react-select";
import {
  borrarDesdeLS,
  accederAPI,
  errorApi,
} from "../../utils/fetchFunctions";
import variables from "../../var/variables.js";

export default function AgregarDroga(props) {
  const [userInfo, setUserInfo] = useState(
    props.history.location.state?.userInfo
  );
  // Controla el loader
  const [loader, setLoader] = useState(true);
  const [loaderTexto, setLoaderTexto] = useState(
    "Cargando datos del pastillero."
  );

  const [pastillero, setPastillero] = useState(null);

  const [drogas, setDrogas] = useState(null);
  const [drogaSeleccionada, setDrogaSeleccionada] = useState(null);
  const [drogasParaMostrar, setDrogasParaMostrar] = useState(null);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);
  const [horariosParaMostrar, setHorariosParaMostrar] = useState(null);

  const drogaRef = useRef(null);
  const concentracionRef = useRef(null);
  const notasRef = useRef(null);

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
    }
  }, [props]);

  // Función que apaga el loader cuando verifica que
  // todos los componentes terminaron de cargar su parte
  useEffect(() => {
    if (userInfo && pastillero && drogas) {
      const nombreDrogas = [];
      const drogaParaGuardar = {};
      drogas.forEach((droga) => {
        drogaParaGuardar.label = droga.nombre;
        drogaParaGuardar.value = droga.id;
        nombreDrogas.push(Object.assign({}, drogaParaGuardar));
      });

      const nombreHorarios = [];
      const horarioParaGuardar = {};
      pastillero.dosis.forEach((dosis) => {
        horarioParaGuardar.label = dosis.horario;
        horarioParaGuardar.value = dosis.id;
        nombreHorarios.push(Object.assign({}, horarioParaGuardar));
      });

      setDrogasParaMostrar(nombreDrogas);
      setHorariosParaMostrar(nombreHorarios);
      setLoader(false);
    }
  }, [userInfo, pastillero, drogas]);

  function navegarASeccion(seccion) {
    props.history.push(
      {
        pathname: seccion,
      },
      { userInfo }
    );
  }

  // Este proceso se ejecuta al ingresar el formulario
  function ingresarDroga() {
    // Verifica que todos los campos se hayan ingresado
    if (!drogaSeleccionada && !drogaRef.current.value) {
      alert("Debes ingresar o seleccionar una droga");
      return false;
    } else if (!horarioSeleccionado) {
      alert("Debes seleccionar un horario para la dosis");
      return false;
    } else if (!concentracionRef.current.value) {
      alert("Debes ingresar una dosis en miligramos");
      return false;
    }

    // Genera un objeto vacío con los datos para enviar
    const dataEnviar = {};
    dataEnviar.dosis_id = horarioSeleccionado.value;
    dataEnviar.cantidad_mg = concentracionRef.current.value;

    // Si el usuario ingresó notas, se cargan en el objeto a enviar

    dataEnviar.notas = notasRef.current?.value;

    // Enciende el loader
    setLoader(true);
    setLoaderTexto("Cargando el medicamento.");

    // Si el usuario ingresó el nombre de una droga en lugar de seleccionarla
    // de la lista se debe ingresar a la db
    if (drogaRef.current && drogaRef.current.value) {
      const nuevaDroga = {
        nombre: drogaRef.current.value,
        pastillero: pastillero.id,
      };

      // Se agrega la droga a través del endpoint
      accederAPI(
        "POST",
        "droga",
        nuevaDroga,
        (respuesta) => {
          dataEnviar.droga_id = respuesta.id;
          // Se agrega la dosis a través del endpoint
          accederAPI(
            "POST",
            "drogaxdosis",
            dataEnviar,
            () => {
              navegarASeccion("editarDroga");
            },
            errorApi
          );
        },
        errorApi
      );
    } else {
      dataEnviar.droga_id = drogaSeleccionada.value;
      // Se agrega la dosis a través del endpoint
      accederAPI(
        "POST",
        "drogaxdosis",
        dataEnviar,
        () => {
          navegarASeccion("editarDroga");
        },
        errorApi
      );
    }
  }

  // Recibe el pastillero seleccionado del Footer y lo guarda en state
  function establecerPastillero(pastillero) {
    // Una vez que define cuál es el pastillero seleccionado
    // busca las drogas correspondientes en la API
    setPastillero(pastillero);

    accederAPI(
      "GET",
      "droga?pastillero=" + pastillero.id,
      null,
      (respuesta) => {
        setDrogas(respuesta.drogas);
      },
      errorApi
    );
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
              navegarASeccion("editarDroga");
            }}
            logoChico={true}
          />
        )}
        <div className="content">
          {!loader && (
            <>
              <p>Agrega droga a tus dosis</p>
              <p>
                Si quieres agregar una dosis de una droga ya ingresada,
                selecciónala de la lista.
              </p>
              <Select
                className="pretty-input"
                value={drogaSeleccionada}
                onChange={setDrogaSeleccionada}
                options={drogasParaMostrar}
                placeholder="Droga..."
              />
              {!drogaSeleccionada && (
                <>
                  <p> Sino, escribe el nombre debajo y será agregada.</p>
                  <input
                    name="droga"
                    type="text"
                    ref={drogaRef}
                    className="pretty-input pretty-text"
                  />
                </>
              )}
              <p>Selecciona en qué momento del día se debe consumir.</p>
              <Select
                className="pretty-input"
                value={horarioSeleccionado}
                onChange={setHorarioSeleccionado}
                options={horariosParaMostrar}
                placeholder="Horario..."
              />
              <p> Ingresa la concentración en mg.</p>
              <input
                name="concentracion"
                type="number"
                ref={concentracionRef}
                className="pretty-input pretty-text"
              />
              <p>
                {" "}
                Si quieres puedes escribir notas para la toma del medicamento.
              </p>
              <input
                name="notas"
                type="text"
                ref={notasRef}
                className="pretty-input pretty-text"
              />

              <div className="nav-buttons" onClick={ingresarDroga}>
                <div className="nav-button">
                  <div className="nav-icon chico nav-icon-check"></div>
                  <span className="single-line">agregar</span>
                  <span>droga</span>
                </div>
              </div>
            </>
          )}
        </div>
        {userInfo && (
          <Footer
            pastilleros={userInfo.pastilleros}
            navegarAHome={() => {
              navegarASeccion("home");
            }}
            establecerPastillero={establecerPastillero}
          />
        )}
      </div>
    </div>
  );
}
