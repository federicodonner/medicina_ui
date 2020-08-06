import React from "react";
import Header from "./Header";
import { fetchDosis, getData, borrarDesdeLS } from "../fetchFunctions";

import * as PusherPushNotifications from "@pusher/push-notifications-web";

class Home extends React.Component {
  state: {
    userInfo: {},
  };

  navigateToSection = (section) => (event) => {
    event.preventDefault();
    this.props.history.push({
      pathname: section,
    });
  };

  signOut = (event) => {
    if (event) {
      event.preventDefault();
    }
    borrarDesdeLS("midosis_logintoken");
    this.props.history.push({ pathname: "/login" });
  };

  componentDidMount() {
    // Verifica que el usuario esté logueado
    getData("verificarlogin")
      .then((response) => {
        // Si el status es 200, encontró el usuario
        if (response.status == 200) {
          response.json().then((respuesta) => {
            // Va a buscar los datos del usuario
            getData("usuario").then((response_usuario) => {
              if (response_usuario.status == 200) {
                response_usuario.json().then((respuesta_usuario) => {
                  // Registrar push notifications
                  const beamsClient = new PusherPushNotifications.Client({
                    instanceId: "f1746db2-2f5b-47ab-9398-750bc69edb88",
                  });

                  beamsClient
                    .start()
                    .then(() => beamsClient.addDeviceInterest("hello"))
                    .then(() =>
                      console.log("Successfully registered and subscribed!")
                    )
                    .catch(console.error);

                  // Guarda la información del usuario en el state
                  // y apaga el loader
                  this.setState({
                    userInfo: respuesta_usuario,
                    loader: { encendido: false },
                  });
                });
              } else {
                this.signOut();
              }
            });
          });
        } else {
          response.json().then((respuesta) => {
            this.signOut();
          });
        }
      })
      .catch((e) => {
        console.log(e);
      });

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
            <>
              <p>
                <img className="loader" src="/images/loader.svg" />
              </p>
              <p className={"centrado negrita"}>{this.state.loader.texto}</p>
            </>
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
                    onClick={this.navigateToSection("verDosis")}
                  >
                    <div className="nav-icon nav-icon-ver-dosis"></div>
                    <span className="single-line">ver</span>
                    <span>mis dosis</span>
                  </div>
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("verStock")}
                  >
                    <div className="nav-icon nav-icon-consultar-stock"></div>
                    <span className="single-line">consultar</span>
                    <span>stock</span>
                  </div>
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("ingresarCompra")}
                  >
                    <div className="nav-icon nav-icon-ingresar-compra"></div>
                    <span className="single-line">ingresar</span>
                    <span>compra</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Home;
