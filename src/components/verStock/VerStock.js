import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { getData, borrarDesdeLS } from "../../utils/fetchFunctions";
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

  // Recibe el pastillero seleccionado del Footer y lo guarda en state
  establecerPastillero = (pastilleroId) => {
    // Una vez que define cuál es el pastillero seleccionado
    // busca los detalles en la API
    getData("stock/" + pastilleroId)
      .then((respuesta) => {
        respuesta.json().then((stock) => {
          this.setState({ stock: stock.drogas }, () => {
            this.apagarLoader();
          });
        });
      })
      .catch((e) => {
        console.log(e);
      });
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
      getData("usuario")
        .then((response_usuario) => {
          if (response_usuario.status == 200) {
            response_usuario.json().then((respuesta_usuario) => {
              // Guarda la información del usuario
              this.setState({ userInfo: respuesta_usuario }, () => {
                this.apagarLoader();
              });
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
              volver={this.volverAHome}
              logoChico={true}
            />
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
                            <span className="dias-stock rojo">- sin stock</span>
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
                    <div className="nav-icon nav-icon-edit"></div>
                    <span className="single-line">ajustar</span>
                    <span>stock</span>
                  </div>
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("ingresarCompra", {
                      userInfo: this.state.userInfo,
                    })}
                  >
                    <div className="nav-icon  nav-icon-ingresar-compra"></div>
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
