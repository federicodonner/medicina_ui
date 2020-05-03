import React from "react";
import Header from "./Header";
import { verifyLogin, fetchStock } from "../fetchFunctions";

class VerStock extends React.Component {
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
                <h1>Stock actual de pastillas</h1>
                {this.state && this.state.stock && (
                  <ul className="dosis-horario">
                    {this.state.stock.map((droga) => {
                      return (
                        <li key={"dosis" + droga.id} className="dosis-horario">
                          {droga.nombre}

                          {droga.dias_disponible > 7 && (
                            <span className="dias-stock verde">
                              - {droga.dias_disponible} días de stock
                            </span>
                          )}
                          {droga.dias_disponible < 8 &&
                            droga.dias_disponible > 0 && (
                              <span className="dias-stock amarillo">
                                - {droga.dias_disponible} días de stock
                              </span>
                            )}

                          {droga.dias_disponible == 0 && (
                            <span className="dias-stock rojo">- sin stock</span>
                          )}

                          {droga.dias_disponible < 0 && (
                            <span className="dias-stock gris">
                              - no ingresada en el pastillero
                            </span>
                          )}

                          <ul className="dosis-droga">
                            {droga.stocks.map((stock) => {
                              return (
                                <li key={stock.id} className="dosis-droga">
                                  {stock.comprimido}mg - {stock.cantidad}{" "}
                                  comprimidos
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <a href="/imprimirPastillero" target="_blank">
                  Ajustar stock
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default VerStock;
