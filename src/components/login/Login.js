import React from "react";
import Header from "../header/Header";
import { getData, postData, guardarEnLS } from "../../utils/fetchFunctions";
import "./login.css";

class Login extends React.Component {
  state: {
    loader: {},
    formIngresada: {},
  };

  loginRef = React.createRef();
  passwordRef = React.createRef();

  // Función utilizada para actualizar el state y esconder
  // el cartel de falta de input cuando el usuario ingresa algo
  actualizarState = () => () => {
    if (this.state) {
      var formIngresada = this.state.formIngresada;
      this.setState({ formIngresada });
    }
  };

  // prende el loader antes de cargar el componente
  // formIngresada indica si se deben mostrar alertas del formulario de login
  constructor(props) {
    super(props);
    this.state = {
      loader: {
        encendido: true,
        texto: "Verificando login.",
      },
      formIngresada: false,
    };
  }

  componentDidMount() {
    // Va a buscar los datos del usuario
    // Si los encuentra, entra a la app y le pasa los datos al componente
    getData("usuario")
      .then((response_usuario) => {
        if (response_usuario.status == 200) {
          response_usuario.json().then((respuesta_usuario) => {
            this.props.history.push(
              {
                pathname: "home",
              },
              { userInfo: respuesta_usuario }
            );
          });
        } else {
          // Si no los encuentra o hay un error en el request
          // apaga el loader y permite el login
          this.setState({
            loader: {
              encendido: false,
            },
          });
        }
      })
      .catch((e) => {
        this.setState({
          loader: {
            encendido: false,
          },
        });
      });
  }

  submitLogin = (event) => {
    event.preventDefault();

    // Indica que fue ingresado el formulario
    this.setState({
      formIngresada: true,
    });

    // Verifica que se hayan ingresados ambos campos
    if (this.loginRef.current.value && this.passwordRef.current.value) {
      // Prende el loader
      this.setState({
        loader: {
          encendido: true,
          texto: "Enviando información de login.",
        },
      });
      // Genera el objeto de datos para el login
      var data = {
        username: this.loginRef.current.value,
        access: this.passwordRef.current.value,
        grant_type: "password",
      };

      postData("oauth", data)
        .then((results) => {
          // Verifica que el login haya sido correcto
          if (results.status == 200) {
            // Si el login es correcto, guarda el token y navega
            return results.json().then((respuesta) => {
              guardarEnLS("midosis_logintoken", respuesta.token);
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
    }
  };

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
              <Header />
              <div className="content">
                <p>
                  Bienvenido a MiDosis la plataforma online de gestión de
                  medicamentos.
                </p>
                <p>Para ingresar debes loguearte con tus credenciales.</p>
                <form onSubmit={this.submitLogin}>
                  <div className={"login-form"}>
                    <span className="label">Nombre de usuario:</span>
                    <input
                      rows="8"
                      name="nombre"
                      type="text"
                      ref={this.loginRef}
                      className="login-input"
                      onChange={this.actualizarState()}
                    />
                    {this.state &&
                      this.state.formIngresada &&
                      this.loginRef.current &&
                      !this.loginRef.current.value && (
                        <span className="login-error">
                          Debes completar tu nombre de usuario.
                        </span>
                      )}
                  </div>
                  <div className={"login-form"}>
                    <span className="label">Contraseña:</span>
                    <input
                      rows="8"
                      name="nombre"
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
                  <button className="login-submit" type="submit">
                    Ingresar
                  </button>
                </form>
                <div className={"pretty-olvido"}>Olvidé mi contraseña</div>
                <div className={"pretty-olvido"}>Crear una cuenta</div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Login;
