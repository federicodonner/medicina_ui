import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import {
  accederAPI,
  borrarDesdeLS,
  guardarEnLS,
  leerDesdeLS,
} from "../../utils/fetchFunctions";
import variables from "../../var/variables.js";
import "./home.css";

import * as PusherPushNotifications from "@pusher/push-notifications-web";

class Home extends React.Component {
  state: {
    userInfo: {},
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

  navegarANuevoPastillero = () => {
    this.props.history.push(
      {
        pathname: "nuevoPastillero",
      },
      { userInfo: this.state.userInfo }
    );
  };

  navegarAUsuario = () => {
    this.props.history.push(
      {
        pathname: "usuario",
      },
      { userInfo: this.state.userInfo }
    );
  };

  signOut = (event) => {
    if (event) {
      event.preventDefault();
    }
    borrarDesdeLS(variables.LSLoginToken);
    this.props.history.push({ pathname: "/login" });
  };

  // Callback de la llamada a la API cuando el estado es 200
  recibirDatos = (userInfo) => {
    if (userInfo.pastilleros.length == 0) {
      this.props.history.push(
        { pathname: "/nuevopastillero" },
        { userInfo: userInfo }
      );
    } else {
      // ------------------------------------
      // Registrar push notifications
      // const beamsClient = new PusherPushNotifications.Client({
      //   instanceId: "f1746db2-2f5b-47ab-9398-750bc69edb88",
      // });
      //
      // beamsClient
      //   .start()
      //   .then(() => beamsClient.addDeviceInterest("hello"))
      //   .then(() =>
      //     console.log("Successfully registered and subscribed!")
      //   )
      //   .catch(console.error);

      // -------------------------

      // Guarda los datos en state y apaga el loader
      this.setState({
        userInfo: userInfo,
        loader: { encendido: false },
      });
    }
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
      // Si el error es de otros tipos, muestra el mensaje de error y apaga el loader
    } else {
      this.setState({ loader: { encendido: false } });
    }
  };

  componentDidMount() {
    // Verifica que el componente anterior le haya pasado los datos del usuario
    if (this.props.location.state && this.props.location.state.userInfo) {
      // Si se los pasó, verifica que tenga pastilleros,
      // si no tiene navega

      if (this.props.location.state.userInfo.pastilleros.length == 0) {
        this.props.history.push(
          { pathname: "/nuevopastillero" },
          { userInfo: this.props.location.state.userInfo }
        );
      } else {
        // Si tiene pastilleros, se queda
        this.setState({
          userInfo: this.props.location.state.userInfo,
          loader: { encendido: false },
        });
      }
    } else {
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
        texto: "Verificando login.",
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
          {this.state && !this.state.loader.encendido && (
            <>
              <Header
                nombreCompleto={
                  this.state.userInfo.nombre +
                  " " +
                  this.state.userInfo.apellido
                }
                mostrarBotonNotificaciones={true}
                navegarAUsuario={this.navegarAUsuario}
              />
              <div className="content">
                <div className="nav-buttons home">
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("editarDroga", {
                      userInfo: this.state.userInfo,
                    })}
                  >
                    <div className="nav-icon nav-icon-ver-dosis"></div>
                    <span className="single-line">ver</span>
                    <span>mis dosis</span>
                  </div>
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("verStock", {
                      userInfo: this.state.userInfo,
                    })}
                  >
                    <div className="nav-icon nav-icon-consultar-stock"></div>
                    <span className="single-line">consultar</span>
                    <span>stock</span>
                  </div>
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("ingresarCompra", {
                      userInfo: this.state.userInfo,
                    })}
                  >
                    <div className="nav-icon nav-icon-ingresar-compra"></div>
                    <span className="single-line">ingresar</span>
                    <span>compra</span>
                  </div>
                </div>
              </div>
              <Footer
                navegarANuevoPastillero={this.navegarANuevoPastillero}
                pastilleros={this.state.userInfo.pastilleros}
                cambioPastilleroHabilitado={true}
              />
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
