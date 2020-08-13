import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import {
  verifyLogin,
  leerDesdeLS,
  fetchDosis,
  getData,
} from "../fetchFunctions";
import variables from "../var/variables.js";

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

  volverAHome = () => {
    this.props.history.push({
      pathname: "home",
    });
  };

  componentDidMount() {
    var userInfo = null;
    // Verifica que el componente anterior le haya pasado los datos del usuario
    if (this.props.location.state && this.props.location.state.userInfo) {
      // Si se los pasó, los gaurda en state
      userInfo = this.props.location.state.userInfo;
    } else {
      // Sino, los va a buscar al servidor
      // Va a buscar los datos del usuario
      getData("usuario")
        .then((response_usuario) => {
          if (response_usuario.status == 200) {
            response_usuario.json().then((respuesta_usuario) => {
              // Guarda la información del usuario
              userInfo = respuesta_usuario;
            });
          } else {
            // Si el request da un error de login, sale
            response_usuario.json().then((respuesta_usuario) => {
              this.signOut();
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }

    // Verifica que haya un pastillero seleccionado en LS
    var pastilleroSeleccionado = JSON.parse(
      leerDesdeLS(variables.LSPastilleroPorDefecto)
    );
    if (pastilleroSeleccionado) {
      // Si hay un pastillero seleccionado, carga los datos del mismo
      getData("pastillero/" + pastilleroSeleccionado).then((respuesta) => {
        respuesta.json().then((pastillero) => {
          this.setState({
            pastillero: pastillero,
            loader: false,
            userInfo: userInfo,
          });
        });
      });
    }
  }

  // prende el loader antes de cargar el componente
  constructor(props) {
    super(props);
    this.state = {
      loader: {
        encendido: true,
        texto: "Cargando datos del pastillero.",
      },
    };
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          {this.state && this.state.loader.encendido && (
            <div className="loader-container">
              <p>
                <img className="loader" src="/images/loader.svg" />
              </p>
              <p className={"negrita"}>{this.state.loader.texto}</p>
            </div>
          )}
          {this.state && this.state.userInfo && (
            <Header
              mostrarBotonVolver={this.state.userInfo.pastilleros.length > 0}
              volverAHome={this.volverAHome}
              logoChico={true}
            />
          )}
          <div className="content">
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
          {this.state && this.state.userInfo && (
            <Footer
              navegarANuevoPastillero={this.navegarANuevoPastillero}
              pastilleros={this.state.userInfo.pastilleros}
              navegarAHome={this.volverAHome}
            />
          )}
        </div>
      </div>
    );
  }
}

export default VerDosis;
