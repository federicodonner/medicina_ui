import React from "react";
import Header from "./Header";
import { verifyLogin, fetchStock } from "../fetchFunctions";
import { getCurrentDatePlus } from "../dataFunctions";

class DescontarStock extends React.Component {
  state: {
    user_info: {},
    loader: true,
    stock: [],
  };

  componentDidMount() {
    this.setState({ loader: true });
    // Verifica si el usuario ya seleccionó el pastillero
    const user_info = verifyLogin();
    if (user_info && user_info.pastillero) {
      // Si la tiene, la guarda en el estado
      this.setState({ user_info }, function () {
        fetchStock(user_info.pastillero)
          .then((results) => {
            return results.json();
          })
          .then((response) => {
            this.setState({ stock: response });
            this.setState({ loader: false });
          });
      });
    } else {
      // Si no hay data en localstorage, va a la pantalla de selección de pastillero
      this.props.history.push({
        pathname: "/seleccionarPastillero",
      });
    }
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          {this.state && this.state.user_info && <Header />}
          <div className="content">
            {this.state && this.state.loader && (
              <p>
                <img className="loader" src="/images/loader.svg" />
              </p>
            )}
            {this.state && !this.state.loader && (
              <>
                <h1>
                  Armado del pastillero de la semana del {getCurrentDatePlus(0)}{" "}
                  al {getCurrentDatePlus(7)}.
                </h1>
                <p>Se descontarán:</p>
                {this.state && this.state.stock && (
                  <ul className="dosis-armado-pastillero">
                    {this.state.stock.map((droga) => {
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
                  <div className="nav-button">
                    <div className="nav-icon nav-icon-check"></div>
                    <span className="single-line">aceptar</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DescontarStock;
