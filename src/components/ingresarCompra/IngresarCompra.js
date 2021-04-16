import React, { useState, useEffect, useRef } from "react";
import Header from "../header/Header";
import Select from "react-select";
import Footer from "../footer/Footer";
import {
  accederAPI,
  borrarDesdeLS,
  errorApi,
} from "../../utils/fetchFunctions";
import variables from "../../var/variables.js";

export default function IngresarCompra(props) {
  const [userInfo, setUserInfo] = useState(
    props.history.location.state?.userInfo
  );

  // Controla el loader
  const [loader, setLoader] = useState(true);
  const [loaderTexto, setLoaderTexto] = useState(
    "Cargando datos del pastillero."
  );

  const [pastillero, setPastillero] = useState(null);

  const [drogasParaMostrar, setDrogasParaMostrar] = useState(null);

  const [drogaSeleccionada, setDrogaSeleccionada] = useState(null);

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
    if (userInfo && pastillero && drogasParaMostrar) {
      setLoader(false);
    }
  }, [userInfo, pastillero, drogasParaMostrar]);

  const comprimidoRef = useRef(null);
  const cantidadRef = useRef(null);

  // Este proceso se ejecuta al ingresar el formulario
  function ingresarCompra(event) {
    // Verifica que todos los campos se hayan ingresado
    if (!drogaSeleccionada) {
      alert("Debes seleccionar una droga");
      return false;
    } else if (!comprimidoRef.current.value) {
      alert("Debes ingresar una dosis en miligramos");
      return false;
    } else if (!cantidadRef.current.value) {
      alert("Debes ingresar una cantidad de comprimidos");
      return false;
    }

    setLoader(true);
    setLoaderTexto("Cargando tu compra...");

    // Genera un objeto vacío con los datos para enviar
    const dataEnviar = {};
    dataEnviar.comprimido = comprimidoRef.current.value;
    dataEnviar.cantidad = cantidadRef.current.value;
    dataEnviar.droga = drogaSeleccionada.value;

    // Se agrega la compra a través del endpoint
    accederAPI(
      "POST",
      "compra",
      dataEnviar,
      (respuesta) => {
        alert(respuesta.detail);
        props.history.push("verStock");
      },
      errorApi
    );
  }

  function volverAHome() {
    props.history.push({
      pathname: "home",
    });
  }

  // Recibe el pastillero seleccionado del Footer y lo guarda en state
  function establecerPastillero(pastillero) {
    // Una vez que define cuál es el pastillero seleccionado
    // busca los detalles en la API
    accederAPI(
      "GET",
      "droga?pastillero=" + pastillero.id,
      null,
      (respuesta) => {
        const nombreDrogas = [];
        const drogaParaGuardar = {};
        // Crea un array con los detalles de las drogas ingresadas para el pastillero
        respuesta.drogas.forEach(function (droga, index) {
          drogaParaGuardar.label = droga.nombre;
          drogaParaGuardar.value = droga.id;
          nombreDrogas.push(Object.assign({}, drogaParaGuardar));
        });
        setDrogasParaMostrar(nombreDrogas);
        setPastillero(respuesta);
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
        {userInfo && <Header volver={volverAHome} logoChico={true} />}
        <div className="content">
          {!loader && (
            <>
              <p>Agrega una compra a tu stock</p>
              <p>
                Selecciona una droga de la lista. Sólo se muestran las drogas
                que son parte de tus dosis diarias.
              </p>
              <Select
                className="pretty-input"
                value={drogaSeleccionada}
                onChange={setDrogaSeleccionada}
                options={drogasParaMostrar}
                placeholder="Droga..."
              />
              <p> Ingresa la concentración en mg de cada comprimido</p>
              <input
                name="comprimido"
                type="number"
                ref={comprimidoRef}
                className="pretty-input pretty-text"
              />
              <p> Ingresa cuántos comprimidos están incluídos en la compra</p>
              <input
                name="cantidad"
                type="number"
                ref={cantidadRef}
                className="pretty-input pretty-text"
              />
              <div className="nav-buttons" onClick={ingresarCompra}>
                <div className="nav-button">
                  <div className="nav-icon chico nav-icon-check"></div>
                  <span className="single-line">ingresar</span>
                  <span>compra</span>
                </div>
              </div>
            </>
          )}
        </div>
        {userInfo && (
          <Footer
            pastilleros={userInfo.pastilleros}
            navegarAHome={volverAHome}
            establecerPastillero={establecerPastillero}
          />
        )}
      </div>
    </div>
  );
}
