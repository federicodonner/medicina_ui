/* ---------
------

COMPONENTE NO TERMINADO

------
--------- */

import React from "react";
import Header from "../header/Header";
import { accederAPI, guardarEnLS } from "../../utils/fetchFunctions";
import variables from "../../var/variables.js";
import "./editarUsuario.css";

class EditarUsuario extends React.Component {
  state: {
    loader: true,
  };

  nombreRef = React.createRef();
  apellidoRef = React.createRef();
  emailRef = React.createRef();
  passwordRef = React.createRef();

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

  // Función utilizada para actualizar el state y esconder
  // el cartel de falta de input cuando el usuario ingresa algo
  actualizarState = () => () => {
    if (this.state) {
      var formIngresada = this.state.formIngresada;
      this.setState({ formIngresada });
    }
  };

  submitLogin = (event) => {
    event.preventDefault();

    // Indica que fue ingresado el formulario
    this.setState({
      formIngresada: true,
    });

    // Verifica que se hayan ingresados ambos campos
    if (
      this.nombreRef.current.value &&
      this.apellidoRef.current.value &&
      this.emailRef.current.value &&
      this.passwordRef.current.value
    ) {
      // Prende el loader
      this.setState({
        loader: {
          encendido: true,
          texto: "Enviando información de registro.",
        },
      });

      // Genera el objeto de datos para el login
      var data = {
        nombre: this.nombreRef.current.value,
        apellido: this.apellidoRef.current.value,
        email: this.emailRef.current.value,
        password: this.passwordRef.current.value,
      };

      accederAPI("POST", "usuario", data, this.usuarioEditado, this.errorApi);
    }
  };

  // callback de usuario editado
  editarUsuario = () => {
    console.log("usuario editado");
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
    this.setState({ loader: { encendido: false } });
  }

  // prende el loader antes de cargar el componente
  constructor(props) {
    super(props);
    this.state = {
      loader: {
        encendido: true,
        texto: "Cargando.",
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

          <Header logoChico={true} volver={this.volverAHome} />

          <div
            className={
              this.state && this.state.loader.encendido
                ? "content escondido"
                : "content"
            }
          >
            <p>Editar tus datos</p>
            <form onSubmit={this.submitLogin}>
              <div className={"login-form"}>
                <span className="label">Nombre:</span>
                <input
                  rows="8"
                  name="nombre"
                  type="text"
                  ref={this.nombreRef}
                  className="login-input"
                  onChange={this.actualizarState()}
                />
                {this.state &&
                  this.state.formIngresada &&
                  this.nombreRef.current &&
                  !this.nombreRef.current.value && (
                    <span className="login-error">
                      Debes completar tu nombre.
                    </span>
                  )}
              </div>
              <div className={"login-form"}>
                <span className="label">Apellido:</span>
                <input
                  rows="8"
                  name="apellido"
                  type="text"
                  ref={this.apellidoRef}
                  className="login-input"
                  onChange={this.actualizarState()}
                />
                {this.state &&
                  this.state.formIngresada &&
                  this.apellidoRef.current &&
                  !this.apellidoRef.current.value && (
                    <span className="login-error">
                      Debes completar tu apellido.
                    </span>
                  )}
              </div>
              <div className={"login-form"}>
                <span className="label">Email:</span>
                <input
                  rows="8"
                  name="email"
                  type="text"
                  ref={this.emailRef}
                  className="login-input"
                  onChange={this.actualizarState()}
                />
                {this.state &&
                  this.state.formIngresada &&
                  this.emailRef.current &&
                  !this.emailRef.current.value && (
                    <span className="login-error">
                      Debes completar tu email.
                    </span>
                  )}
              </div>
              <p>
                Si no deseas cambiar tu contraseña puedes dejar los siguientes
                campos en blanco
              </p>
              <div className={"login-form"}>
                <span className="label">Contraseña:</span>
                <input
                  rows="8"
                  name="password"
                  type="password"
                  ref={this.passwordRef}
                  className="login-input"
                  onChange={this.actualizarState()}
                />
                {this.state &&
                  this.state.formIngresada &&
                  this.passwordRef.current &&
                  !this.passwordRef.current.value && (
                    <span className="login-error">
                      Debes completar tu contraseña.
                    </span>
                  )}
              </div>
              <div className={"login-form ultimo-campo"}>
                <span className="label">Confirmar contraseña:</span>
                <input
                  rows="8"
                  name="password"
                  type="password"
                  ref={this.passwordConfirmRef}
                  className="login-input"
                  onChange={this.actualizarState()}
                />
                {this.state &&
                  this.state.formIngresada &&
                  this.passwordRef.current &&
                  !this.passwordConfirmRef.current.value && (
                    <span className="login-error">
                      Debes confirmar tu contraseña.
                    </span>
                  )}
                {this.state &&
                  this.state.formIngresada &&
                  this.passwordRef.current &&
                  this.passwordConfirmRef.current.value &&
                  this.passwordRef.current.value !=
                    this.passwordConfirmRef.current.value && (
                    <span className="login-error">
                      Las contraseñas no coinciden.
                    </span>
                  )}
              </div>
              <div className="nav-buttons">
                <div className="nav-button" onClick={this.actialzarDatos}>
                  <div className="nav-icon chico nav-icon-check"></div>
                  <span className="newLine">actualizar</span>
                  <span>datos</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default EditarUsuario;
