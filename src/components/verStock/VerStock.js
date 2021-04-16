import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import {
  accederAPI,
  borrarDesdeLS,
  errorApi,
} from "../../utils/fetchFunctions";
import { translateStock } from "../../utils/dataFunctions";
import variables from "../../var/variables.js";
import "./verStock.css";

export default function VerStock(props) {
  const [userInfo, setUserInfo] = useState(
    props.history.location.state?.userInfo
  );

  const [loader, setLoader] = useState(true);

  const [stock, setStock] = useState(null);

  const [pastillero, setPastillero] = useState(null);

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
    if (userInfo && stock && pastillero) {
      setLoader(false);
    }
  }, [userInfo, stock, pastillero]);

  function navegarASeccion(section) {
    props.history.push(
      {
        pathname: section,
      },
      { userInfo }
    );
  }

  // Callback del footer con la información del pastillero
  function establecerPastillero(pastillero) {
    // Guarda el pastillero en state y apaga el loader
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
            <p className={"negrita"}>Cargando datos del pastillero.</p>
          </div>
        )}
        {userInfo && (
          <Header
            volver={() => {
              navegarASeccion("home");
            }}
            logoChico={true}
          />
        )}
        <div className="content">
          {!loader && (
            <>
              <p>Stock actual de pastillas</p>
              {stock && (
                <ul className="dosis-horario">
                  {stock.map((droga) => {
                    return (
                      <li key={"dosis" + droga.id} className="dosis-horario">
                        {droga.nombre}

                        {droga.dias_disponible > 6 && (
                          <span className="dias-stock verde">
                            - {droga.dias_disponible} días
                          </span>
                        )}
                        {droga.dias_disponible < 7 &&
                          droga.dias_disponible > 0 && (
                            <span className="dias-stock amarillo">
                              - {droga.dias_disponible} día
                              {droga.dias_disponible != 1 ? "s" : ""}
                            </span>
                          )}

                        {droga.dias_disponible == 0 && (
                          <span className="dias-stock rojo single-line">
                            sin stock
                          </span>
                        )}

                        {droga.dias_disponible < 0 && (
                          <span className="dias-stock gris">- sin dosis</span>
                        )}

                        <ul className="dosis-droga">
                          {droga.stocks.map((stock) => {
                            return (
                              <li key={stock.id} className="dosis-droga">
                                {stock.comprimido}mg -{" "}
                                {translateStock(stock.cantidad_doceavos)}
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
                <div className="nav-button">
                  <div className="nav-icon nav-icon-edit chico"></div>
                  <span className="single-line">ajustar</span>
                  <span>stock</span>
                </div>
                <div
                  className="nav-button"
                  onClick={() => {
                    navegarASeccion("ingresarCompra");
                  }}
                >
                  <div className="nav-icon nav-icon-ingresar-compra chico"></div>
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
