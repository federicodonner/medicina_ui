import React from "react";
import Header from "../header/Header";
import { guardarEnLS, accederAPI } from "../../utils/fetchFunctions";
import "./login.css";
import variables from "../../var/variables.js";

class Login extends React.Component {
  state: {
    loader: {},
    formIngresada: {},
  };

  loginRef = React.createRef();
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

  // Callback de la llamada a la API cuando el estado es 200
  usuarioLogueado = (userInfo) => {
    // Si entra en esta función es porque el usuario ya estaba logueado
    // lo manda a home
    this.props.history.push({ pathname: "/home" }, { userInfo: userInfo });
  };

  // callback de la llamada a la API cuando el estado no es 200
  usuarioNoLogueado = (datos) => {
    // Error 500+ es un error de la API, lo manda a la pantalla del error
    if (datos.status >= 500) {
      this.props.history.push("error");
      // Si el error es de otros tipos, muestra el mensaje de error y apaga el loader
    } else {
      this.setState({ loader: { encendido: false } });
    }
  };

  // Callback de post a oauth correcto
  loginCorrecto = (data) => {
    guardarEnLS(variables.LSLoginToken, data.token);
    this.props.history.push({
      pathname: "home",
    });
  };

  // Callback de error de post a oauth
  errorDeLogin = (data) => {
    // Verifica si es un error de la API o un problema de oauth
    if (data.status >= 500) {
      alert("Ocurrió un error, por favor inténtalo denuevo más tarde.");
    } else {
      alert(data.detail);
      this.setState({ loader: { encendido: false }, formIngresada: false });
    }
  };

  componentDidMount() {
    // Va a buscar los datos del usuario
    // Si los encuentra, entra a la app y le pasa los datos al componente
    accederAPI(
      "GET",
      "usuario",
      null,
      this.usuarioLogueado,
      this.usuarioNoLogueado
    );
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

      accederAPI("POST", "oauth", data, this.loginCorrecto, this.errorDeLogin);
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
                <div
                  className={"pretty-olvido"}
                  onClick={this.navigateToSection("crearCuenta", null)}
                >
                  Crear una cuenta
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }
}

export default Login;
