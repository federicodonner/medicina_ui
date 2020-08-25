import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { accederAPI } from "../../utils/fetchFunctions";
import { getCurrentDatePlus } from "../../utils/dataFunctions";
import variables from "../../var/variables.js";

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
      accederAPI(
        "POST",
        "armarpastillero",
        {
          pastillero: this.state.pastillero.id,
        },
        this.stockDescontado,
        this.errorApi
      );
    }
  };

  // Callback del post de pastillero armado
  stockDescontado = (respuesta) => {
    alert(respuesta.detail);
    this.volverAHome();
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
        this.errorApi
      );
    });
  };

  // Callback de la llamada a la API de stock
  guardarStock = (stock) => {
    this.setState({ stock: stock.drogas });
    this.apagarLoader();
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
