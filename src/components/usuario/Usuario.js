import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { borrarDesdeLS, accederAPI } from "../../utils/fetchFunctions";
import variables from "../../var/variables.js";
import "./usuario.css";

class Usuario extends React.Component {
  state: {
    user_info: {},
    loader: true,
    pastillero: {},
  };

  navigateToSection = (section, data) => (event) => {
    event.preventDefault();
    this.props.history.push(
      {
        pathname: section,
      },
      data
    );
  };

  volverAHome = () => {
    this.props.history.push({
      pathname: "home",
    });
  };

  signOut = (event) => {
    if (event) {
      event.preventDefault();
    }
    borrarDesdeLS(variables.LSLoginToken);
    this.props.history.push({ pathname: "login" });
  };

  // Función que apaga el loader cuando verifica que
  // todos los componentes terminaron de cargar su parte
  // Cada uno debería invocarlo al terminar
  apagarLoader = () => {
    // Verifica que tenga los datos del pastillero
    // Y del usuario para apagar el loader
    if (this.state.userInfo && this.state.pastillero) {
      this.setState({
        loader: { encendido: false },
      });
    }
  };

  // Callback del footer con la información del pastillero
  establecerPastillero = (pastillero) => {
    // Guarda el pastillero en state y apaga el loader
    this.setState({ pastillero }, () => {
      this.apagarLoader();
    });
  };

  // Callback de la llamada a la API cuando el estado es 200
  recibirDatos = (userInfo) => {
    this.setState({ userInfo }, () => {
      this.apagarLoader();
    });
  };

  // callback de la llamada a la API cuando el estado no es 200
  errorApi = (datos) => {
    alert(datos.detail);
    // Error 401 significa sin permisos, desloguea al usuario
    if (datos.status == 401) {
      this.signOut();
      // Error 500+ es un error de la API, lo manda a la pantalla del error
    } else if (datos.status >= 500) {
      this.props.history.push("error");
      // Si el error es de otros tipos, muestra el mensaje de error y navega al home
    } else {
      this.props.history.push("home");
    }
  };

  componentDidMount() {
    var userInfo = null;
    // Verifica que el componente anterior le haya pasado los datos del usuario
    if (this.props.location.state && this.props.location.state.userInfo) {
      // Si se los pasó, los gaurda en state
      this.setState({ userInfo: this.props.location.state.userInfo }, () => {
        this.apagarLoader();
      });
    } else {
      // Sino, los va a buscar al servidor
      // Va a buscar los datos del usuario
      accederAPI("GET", "usuario", null, this.recibirDatos, this.errorApi);
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
            <Header volver={this.volverAHome} logoChico={true} />
          )}
          <div className="content">
            {this.state && !this.state.loader.encendido && (
              <>
                <p>
                  Información de dosis de tu pastillero. Puedes editarlo con los
                  botones debajo.
                </p>
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
                    onClick={this.navigateToSection("agregarDroga", {
                      userInfo: this.state.userInfo,
                    })}
                  >
                    <div className="nav-icon nav-icon-agregar-dosis"></div>
                    <span className="single-line">agregar</span>
                    <span>droga</span>
                  </div>
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("editarDroga", {
                      userInfo: this.state.userInfo,
                    })}
                  >
                    <div className="nav-icon nav-icon-editar-dosis-in"></div>
                    <span className="single-line">editar</span>
                    <span>dosis droga</span>
                  </div>
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("descontarStock", {
                      userInfo: this.state.userInfo,
                    })}
                  >
                    <div className="nav-icon nav-icon-pastillero"></div>
                    <span className="single-line">pastillero</span>
                    <span>armado</span>
                  </div>
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("imprimirPastillero", null)}
                  >
                    <div className="nav-icon nav-icon-imprimir"></div>
                    <span className="single-line">imprimir</span>
                  </div>
                </div>
              </>
            )}
          </div>
          {this.state && this.state.userInfo && (
            <Footer
              pastilleros={this.state.userInfo.pastilleros}
              navegarAHome={this.volverAHome}
              establecerPastillero={this.establecerPastillero}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Usuario;
