import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { accederAPI, errorApi } from "../../utils/fetchFunctions";
import { getCurrentDatePlus } from "../../utils/dataFunctions";
import variables from "../../var/variables.js";

export default function DescontarStock(props) {
  const [userInfo, setUserInfo] = useState(
    props.history.location.state?.userInfo
  );
  const [pastillero, setPastillero] = useState(null);

  // Controla el loader
  const [loader, setLoader] = useState(true);
  const [loaderTexto, setLoaderTexto] = useState(
    "Cargando datos del pastillero"
  );

  const [stock, setStock] = useState(null);

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
    if (userInfo && stock) {
      setLoader(false);
    }
  }, [userInfo, stock]);

  function volverAEditarDroga() {
    props.history.push(
      {
        pathname: "editarDroga",
      },
      { userInfo }
    );
  }

  function volverAHome() {
    props.history.push({
      pathname: "home",
    });
  }

  // Función que llama al endpoint para descontar el stock
  function armarPastillero() {
    // Genera el array para guardar las drogas para las que no tiene suficiente stock
    var drogasFaltaStock = [];
    var mensajeConfirmacion = "";

    // Recorre todas las drogas buscando las que no tiene suficiente stock
    // si encuentra alguna la guarda en el array
    stock.forEach((droga) => {
      if (droga.dosis_semanal > 0 && droga.dias_disponible < 7) {
        drogasFaltaStock.push(droga.nombre);
      }
    });

    // Si hay drogas cargadas en el array, le pregunto al usuario si quiere continuar
    if (drogasFaltaStock.length) {
      mensajeConfirmacion =
        "No tiene suficiente stock de los siguientes medicamentos: " +
        drogasFaltaStock.join(", ") +
        ". Presione OK para continuar con el armado del pastillero de cualquier manera.";
    } else {
      mensajeConfirmacion =
        "Presione OK para descontar el stock correspondiente a esta semana.";
    }
    if (window.confirm(mensajeConfirmacion)) {
      // Estoy aquí si el cliente presionó OK a la alerta
      // Si todos los datos están correctos, se enciende el loader

      setLoaderTexto("Procesando pastillero");
      setLoader(true);

      // Procesa el pastillero a través del endpoint
      accederAPI(
        "POST",
        "armarpastillero",
        {
          pastillero: pastillero.id,
        },
        (respuesta) => {
          alert(respuesta.detail);
          volverAEditarDroga();
        },
        errorApi
      );
    }
  }

  // Callback del footer con la información del pastillero
  function establecerPastillero(pastillero) {
    setPastillero(pastillero);

    // Va a buscar los datos del stock a la API
    accederAPI(
      "GET",
      "stock/" + pastillero.id,
      null,
      (respuesta) => {
        setStock(respuesta.drogas);
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
        {userInfo && <Header volver={volverAEditarDroga} logoChico={true} />}
        <div className="content">
          {!loader && (
            <>
              <p>
                Armado del pastillero de la semana del {getCurrentDatePlus(0)}{" "}
                al {getCurrentDatePlus(7)}.
              </p>

              <p>Se descontarán:</p>
              {stock && (
                <ul className="dosis-armado-pastillero">
                  {stock.map((droga) => {
                    if (droga.dosis_semanal > 0) {
                      return (
                        <li
                          key={"dosis" + droga.id}
                          className="dosis-armado-pastillero"
                        >
                          {droga.nombre} - {droga.dosis_semanal} mg
                          {droga.dias_disponible < 7 &&
                            droga.dias_disponible != 0 && (
                              <span className="notas-dosis">
                                Atención: Stock para {droga.dias_disponible}{" "}
                                días
                              </span>
                            )}
                          {droga.dias_disponible == 0 && (
                            <span className="notas-dosis rojo">
                              Atención: Sin stock
                            </span>
                          )}
                        </li>
                      );
                    }
                  })}
                </ul>
              )}
              <div className="nav-buttons">
                <div className="nav-button" onClick={armarPastillero}>
                  <div className="nav-icon chico nav-icon-check"></div>
                  <span className="single-line">aceptar</span>
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
