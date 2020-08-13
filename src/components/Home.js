import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import {
  getData,
  borrarDesdeLS,
  guardarEnLS,
  leerDesdeLS,
} from "../fetchFunctions";
import variables from "../var/variables.js";

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

  signOut = (event) => {
    if (event) {
      event.preventDefault();
    }
    borrarDesdeLS(variables.LSLoginToken);
    this.props.history.push({ pathname: "/login" });
  };

  // Función que determina el pastillero por defecto y
  // guarda los otros pastilleros para el select
  procesarOtrosPastilleros = (userInfo) => {
    // Verifica que haya recibido UserInfo como parámetro
    // sino la levanta del state (ocurre cuando Footer ejecuta esta función)
    if (!userInfo) {
      userInfo = this.state.userInfo;
    }
    // Verifica que ya haya un pastillero por defecto ya guardado
    var pastilleroActual = JSON.parse(
      leerDesdeLS(variables.LSPastilleroPorDefecto)
    );
    if (pastilleroActual) {
      // Recorre todos los pastilleros guardando los que no son por defecto
      // en un array para seleccionar
      var otrosPastilleros = [];
      userInfo.pastilleros.forEach((pastillero) => {
        if (pastillero.id != pastilleroActual.id) {
          otrosPastilleros.push(pastillero);
        } else {
          // Por más que ya está guardado en LS, lo vuelve a guardar
          // ya que algún proceso puede actualizar el id del pastillero en LS.
          // Al volver a guardarlo se actualiza el resto de la información.
          guardarEnLS(
            variables.LSPastilleroPorDefecto,
            JSON.stringify(pastillero)
          );
          pastilleroActual = pastillero;
        }
      });
      this.setState({
        otrosPastilleros: otrosPastilleros,
        userInfo: userInfo,
        loader: { encendido: false },
        pastilleroActual: pastilleroActual,
      });
    } else {
      // Guarda el último pastillero como pastillero por defecto
      // el LS y en el state
      var pastilleroActual = userInfo.pastilleros.pop();
      guardarEnLS(
        variables.LSPastilleroPorDefecto,
        JSON.stringify(pastilleroActual)
      );
      // Guarda el resto del array para la selección
      this.setState({
        pastilleroActual: pastilleroActual,
        otrosPastilleros: userInfo.pastilleros,
        userInfo: userInfo,
        loader: { encendido: false },
      });
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
      getData("usuario")
        .then((response_usuario) => {
          if (response_usuario.status == 200) {
            response_usuario.json().then((respuesta_usuario) => {
              // Si no tiene pastilleros a su nombre,
              // Navega a la sección de nuevo pastillero
              if (respuesta_usuario.pastilleros.length == 0) {
                this.props.history.push(
                  { pathname: "/nuevopastillero" },
                  { userInfo: respuesta_usuario }
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

                // Procesa los pastilleros para determinar por defecto y el resto
                this.procesarOtrosPastilleros(respuesta_usuario);
              }
            });
          } else {
            response_usuario.json().then((respuesta_usuario) => {
              alert(respuesta_usuario.details);
              this.signOut();
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
    // // Verifica si el usuario ya seleccionó el pastillero
    // const user_info = verifyLogin();
    // if (user_info && user_info.pastillero) {
    //   // Si la tiene, la guarda en el estado
    //   this.setState({ user_info }, function () {});
    // } else {
    //   // Si no hay data en localstorage, va a la pantalla de selección de pastillero
    //   this.props.history.push({
    //     pathname: "/seleccionarPastillero",
    //   });
    // }
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
              />
              <div className="content">
                <div className="nav-buttons home">
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("verDosis", null)}
                  >
                    <div className="nav-icon nav-icon-ver-dosis"></div>
                    <span className="single-line">ver</span>
                    <span>mis dosis</span>
                  </div>
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("verStock", null)}
                  >
                    <div className="nav-icon nav-icon-consultar-stock"></div>
                    <span className="single-line">consultar</span>
                    <span>stock</span>
                  </div>
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("ingresarCompra", null)}
                  >
                    <div className="nav-icon nav-icon-ingresar-compra"></div>
                    <span className="single-line">ingresar</span>
                    <span>compra</span>
                  </div>

                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("nuevopastillero", {
                      userInfo: this.state.userInfo,
                    })}
                  >
                    <div className="nav-icon nav-icon-nuevo-pastillero"></div>
                    <span className="single-line">nuevo</span>
                    <span>pastillero</span>
                  </div>
                </div>
              </div>
              <Footer
                pastilleroActual={this.state.pastilleroActual}
                navegarANuevoPastillero={this.navegarANuevoPastillero}
                otrosPastilleros={this.state.otrosPastilleros}
                procesarOtrosPastilleros={this.procesarOtrosPastilleros}
              />
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
