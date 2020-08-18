import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { getData, postData } from "../fetchFunctions";
import { getCurrentDatePlus } from "../dataFunctions";
import variables from "../var/variables.js";

class DescontarStock extends React.Component {
  state: {
    user_info: {},
    loader: true,
    stock: [],
    mensajeLoader: "",
  };

  volverAHome = () => {
    this.props.history.push({
      pathname: "home",
    });
  };

  // Función que llama al endpoint para descontar el stock
  armarPastillero = () => (event) => {
    event.preventDefault();
    // Genera el array para guardar las drogas para las que no tiene suficiente stock
    var drogasFaltaStock = [];
    var mensajeConfirmacion = "";

    // Recorre todas las drogas buscando las que no tiene suficiente stock
    // si encuentra alguna la guarda en el array
    this.state.stock.forEach((droga) => {
      if (droga.dosis_semanal > 0 && droga.dias_disponible < 7) {
        drogasFaltaStock.push(droga.nombre);
      }
    });

    // Si hay drogas cargadas en el array, le pregunto al usuario si quiere continuar
    if (drogasFaltaStock.length) {
      mensajeConfirmacion =
        "No tiene suficiente stock de los siguientes medicamentos: " +
        drogasFaltaStock.join(", ") +
        ". Presione OK para continuar con el armado del pastillero de cualquier manera.";
    } else {
      mensajeConfirmacion =
        "Presione OK para descontar el stock correspondiente a esta semana.";
    }
    if (window.confirm(mensajeConfirmacion)) {
      // Estoy aquí si el cliente presionó OK a la alerta
      // Si todos los datos están correctos, se enciende el loader
      this.setState({
        loader: { encendido: true, texto: "Procesando pastillero." },
      });

      // Procesa el pastillero a través del endpoint
      postData("armarpastillero", {
        pastillero: this.state.pastilleroSeleccionado,
      })
        .then((response) => {
          if (response.status == 200) {
            response.json().then((responseDetalles) => {
              alert(responseDetalles.detail);
              this.volverAHome();
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
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
          this.setState(
            { stock: stock.drogas, pastilleroSeleccionado: pastilleroId },
            () => {
              this.apagarLoader();
            }
          );
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
              mostrarBotonVolver={this.state.userInfo.pastilleros.length > 0}
              volver={this.volverAHome}
              logoChico={true}
            />
          )}
          <div className="content">
            {this.state && !this.state.loader.encendido && (
              <>
                <p>
                  Armado del pastillero de la semana del {getCurrentDatePlus(0)}{" "}
                  al {getCurrentDatePlus(7)}.
                </p>

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
                  <div className="nav-button" onClick={this.armarPastillero()}>
                    <div className="nav-icon chico nav-icon-check"></div>
                    <span className="single-line">aceptar</span>
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

export default DescontarStock;
