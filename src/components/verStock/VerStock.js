import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { accederAPI, borrarDesdeLS } from "../../utils/fetchFunctions";
import { translateStock } from "../../utils/dataFunctions";
import variables from "../../var/variables.js";
import "./verStock.css";

class VerStock extends React.Component {
  state: {
    user_info: {},
    loader: true,
    stock: [],
  };

  volverAHome = () => {
    this.props.history.push({
      pathname: "home",
    });
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

  // Función que apaga el loader cuando verifica que
  // todos los componentes terminaron de cargar su parte
  // Cada uno debería invocarlo al terminar
  apagarLoader = () => {
    // Verifica que tenga los datos del pastillero
    // Y del usuario para apagar el loader
    if (this.state.userInfo && this.state.stock) {
      this.setState({
        loader: { encendido: false },
      });
    }
  };

  // Callback del footer con la información del pastillero
  establecerPastillero = (pastillero) => {
    // Guarda el pastillero en state y apaga el loader
    this.setState({ pastillero }, () => {
      // Va a buscar los datos del stock a la API
      accederAPI(
        "GET",
        "stock/" + pastillero.id,
        null,
        this.guardarStock,
        this.errorAPI
      );
    });
  };

  // Callback de la llamada a la API de userInfo
  recibirDatos = (userInfo) => {
    this.setState({ userInfo }, () => {
      this.apagarLoader();
    });
  };

  // Callback de la llamada a la API de stock
  guardarStock = (stock) => {
    this.setState({ stock: stock.drogas });
    this.apagarLoader();
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
      accederAPI("GET", "usuario", null, this.recibirDatos, this.errorAPI);
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
                <p>Stock actual de pastillas</p>
                {this.state && this.state.stock && (
                  <ul className="dosis-horario">
                    {this.state.stock.map((droga) => {
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
                                - {droga.dias_disponible} días
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
                    onClick={this.navigateToSection("ingresarCompra", {
                      userInfo: this.state.userInfo,
                    })}
                  >
                    <div className="nav-icon nav-icon-ingresar-compra chico"></div>
                    <span className="single-line">ingresar</span>
                    <span>compra</span>
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

export default VerStock;
