import React, { useState, useEffect } from "react";
import Header from "../header/Header";
import { accederAPI, errorApi } from "../../utils/fetchFunctions";
import { translateStock } from "../../utils/dataFunctions";
import "./verStock.css";

export default function VerStock(props) {
  const [loader, setLoader] = useState(true);

  const [stock, setStock] = useState(null);

  // Función ejecutada en la primera carga del componente
  useEffect(() => {
    props.setMostrarFooter(true);
    // Si el usuario no tiene pastilleros, vuelvo a home
    if (props.userInfo.pastilleros?.length < 1) {
      alert(
        "No tienes un pastillero ingresado, configura uno en la sección de usuario"
      );
      navegarASeccion("/");
    }
    if (props.pastillero) {
      // Va a buscar los datos del stock a la API
      accederAPI(
        "GET",
        "stock/" + props.pastillero.id,
        null,
        (respuesta) => {
          setStock(respuesta.drogas);
        },
        errorApi
      );
    }
  }, [props]);

  // Función que apaga el loader cuando verifica que
  // todos los componentes terminaron de cargar su parte
  useEffect(() => {
    if (stock) {
      setLoader(false);
    }
  }, [stock]);

  function navegarASeccion(section) {
    props.history.push({
      pathname: section,
    });
  }

  return (
    <div className="app-view cover">
      <div className="scrollable">
        {loader && (
          <div className="loader-container">
            <p>
              <img className="loader" src="/images/loader.svg" alt="loader" />
            </p>
            <p className={"negrita"}>Cargando datos del pastillero.</p>
          </div>
        )}

        <div className="content">
          <Header
            volver={() => {
              navegarASeccion("/");
            }}
          />
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
                              {droga.dias_disponible !== 1 ? "s" : ""}
                            </span>
                          )}

                        {droga.dias_disponible === 0 && (
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
      </div>
    </div>
  );
}
