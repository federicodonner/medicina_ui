import React from "react";
import Header from "./Header";
import { verifyLogin, fetchDosis } from "../fetchFunctions";

class VerDosis extends React.Component {
  state: {
    user_info: {},
    loader: true,
    pastillero: {},
  };

  navigateToSection = (section) => (event) => {
    event.preventDefault();
    this.props.history.push({
      pathname: section,
    });
  };

  componentDidMount() {
    this.setState({ loader: true });
    // Verifica si el usuario ya seleccionó el pastillero
    const user_info = verifyLogin();
    if (user_info && user_info.pastillero) {
      // Si la tiene, la guarda en el estado
      this.setState({ user_info }, function () {
        fetchDosis(user_info.pastillero)
          .then((results) => {
            return results.json();
          })
          .then((response) => {
            this.setState({ pastillero: response });
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
                {this.state && this.state.pastillero && (
                  <ul className="dosis-horario">
                    {this.state.pastillero.dosis.map((dosis) => {
                      return (
                        <li key={"dosis" + dosis.id} className="dosis-horario">
                          {dosis.horario}
                          <ul className="dosis-droga">
                            {dosis.drogas.map((droga) => {
                              return (
                                <li key={droga.id} className="dosis-droga">
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
                    onClick={this.navigateToSection("descontarStock")}
                  >
                    <div className="nav-icon nav-icon-ver-dosis"></div>
                    <span className="single-line">pastillero</span>
                    <span>armado</span>
                  </div>
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("imprimirPastillero")}
                  >
                    <div className="nav-icon nav-icon-imprimir"></div>
                    <span className="single-line">imprimir</span>
                  </div>
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("agregarDroga")}
                  >
                    <div className="nav-icon nav-icon-agregar-dosis"></div>
                    <span className="single-line">agregar</span>
                    <span>droga</span>
                  </div>
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("editarDroga")}
                  >
                    <div className="nav-icon nav-icon-editar-dosis-in"></div>
                    <span className="single-line">editar</span>
                    <span>dosis droga</span>
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

export default VerDosis;
