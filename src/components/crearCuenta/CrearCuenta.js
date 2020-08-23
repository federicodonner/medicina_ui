import React from "react";
import Header from "../header/Header";
import { postData, guardarEnLS } from "../../utils/fetchFunctions";
import variables from "../../var/variables.js";
import "./crearCuenta.css";

class CrearCuenta extends React.Component {
  state: {
    loader: true,
  };

  nombreRef = React.createRef();
  apellidoRef = React.createRef();
  emailRef = React.createRef();
  passwordRef = React.createRef();
  passwordConfirmRef = React.createRef();

  navigateToSection = (section, data) => (event) => {
    event.preventDefault();
    this.props.history.push(
      {
        pathname: section,
      },
      data
    );
  };

  volverALogin = () => {
    this.props.history.push("login");
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
      this.passwordRef.current.value &&
      this.passwordConfirmRef.current.value
    ) {
      // Verifica que las contraseñas sean iguales
      if (
        this.passwordRef.current.value == this.passwordConfirmRef.current.value
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

        postData("usuario", data)
          .then((results) => {
            // Verifica que el login haya sido correcto
            if (results.status == 201) {
              // Si el login es correcto, guarda el token y navega
              return results.json().then((respuesta) => {
                guardarEnLS(variables.LSLoginToken, respuesta.token);
                this.props.history.push({
                  pathname: "home",
                });
              });
            } else {
              // Si el login no es correcto, despliega el error
              return results.json().then((respuesta) => {
                alert(respuesta.detail);
                this.setState({
                  loader: {
                    encendido: false,
                  },
                  formIngresada: false,
                });
              });
            }
          })
          .catch((e) => {
            console.log("catch");
            alert(
              "Hubo un error al procesar tu solicitud, por favor inténtalo denuevo más tarde."
            );
            // Apaga el loader
            this.setState({
              loader: {
                encendido: false,
              },
            });
          });
      } else {
        // Si las contraseñas no coinciden las borra
        this.passwordRef.current.value = "";
        this.passwordConfirmRef.current.value = "";
      }
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

          <Header logoChico={true} volver={this.volverALogin} />

          <div
            className={
              this.state && this.state.loader.encendido
                ? "content escondido"
                : "content"
            }
          >
            <p>
              Aquí podrás crear una nueva cuenta y empezar a usar MiDosis
              inmediatamente.
            </p>
            <p>Ingresa tus datos</p>
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
                <div className="nav-button" onClick={this.submitLogin}>
                  <div className="nav-icon chico nav-icon-check"></div>
                  <span className="newLine">Crear</span>
                  <span>cuenta</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default CrearCuenta;
