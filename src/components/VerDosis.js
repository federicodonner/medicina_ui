import React from "react";
import Header from "./Header";
import { verifyLogin, fetchDosis } from "../fetchFunctions";

class VerDosis extends React.Component {
  state: {
    user_info: {},
    loader: true,
    pastillero: {}
  };

  componentDidMount() {
    this.setState({ loader: true });
    // Verifica si el usuario ya seleccionó el pastillero
    const user_info = verifyLogin();
    if (user_info && user_info.pastillero) {
      // Si la tiene, la guarda en el estado
      this.setState({ user_info }, function() {
        fetchDosis(user_info.pastillero)
          .then(results => {
            return results.json();
          })
          .then(response => {
            this.setState({ pastillero: response });
            this.setState({ loader: false });
          });
      });
    } else {
      // Si no hay data en localstorage, va a la pantalla de selección de pastillero
      this.props.history.push({
        pathname: "/seleccionarPastillero"
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
                {this.state && this.state.pastillero && (
                  <ul className="dosis-horario">
                    {this.state.pastillero.dosis.map(dosis => {
                      return (
                        <li key={"dosis" + dosis.id} className="dosis-horario">
                          {dosis.horario}
                          <ul className="dosis-droga">
                            {dosis.drogas.map(droga => {
                              return (
                                <li key={droga.id} className="dosis-droga">
                                  {droga.nombre} - {droga.cantidad_mg} mg
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
                  Imprimir
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default VerDosis;
