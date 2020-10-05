import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { borrarDesdeLS, accederAPI } from "../../utils/fetchFunctions";
import variables from "../../var/variables.js";
import "./usuario.css";

class Usuario extends React.Component {
  state: {
    user_info: {},
    loader: true,
    pastillero: {},
  };

  nombreRef = React.createRef();
  apellidoRef = React.createRef();
  emailRef = React.createRef();

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

  signOut = (event) => {
    if (event) {
      event.preventDefault();
    }
    borrarDesdeLS(variables.LSLoginToken);
    this.props.history.push({ pathname: "login" });
  };

  // Muestra o esconde el modal de usuario
  toggleModalUsuario = () => {
    var mostrarModalUsuario = this.state.mostrarModalUsuario;
    mostrarModalUsuario = !mostrarModalUsuario;
    this.setState({ mostrarModalUsuario });
  };

  // Función que apaga el loader cuando verifica que
  // todos los componentes terminaron de cargar su parte
  // Cada uno debería invocarlo al terminar
  apagarLoader = () => {
    // Verifica que tenga los datos del usuario
    // para apagar el loader
    if (this.state.userInfo) {
      this.setState({
        loader: { encendido: false },
      });
    }
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
        texto: "Cargando tus datos.",
      },
      mostrarModalUsuario: false,
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
                <div
                  className={
                    "modal-cover " +
                    (this.state.mostrarModalUsuario ? "show" : "hidden")
                  }
                />
                <div
                  className={
                    "editar-usuario-modal " +
                    (this.state.mostrarModalUsuario ? "show" : "")
                  }
                >
                  <h1>Editar datos</h1>
                  <span className="single-line"> Nombre: </span>
                  <input
                    name="nombre"
                    type="text"
                    ref={this.nombreRef}
                    className="pretty-input pretty-text"
                    defaultValue={this.state.userInfo.nombre}
                  />
                  <span className="single-line"> Apellido: </span>
                  <input
                    name="apellido"
                    type="text"
                    ref={this.apellidoRef}
                    className="pretty-input pretty-text"
                    defaultValue={this.state.userInfo.apellido}
                  />
                  <span className="single-line"> Email: </span>
                  <input
                    name="apellido"
                    type="text"
                    ref={this.emailRef}
                    className="pretty-input pretty-text"
                    defaultValue={this.state.userInfo.email}
                  />

                  <div className="nav-buttons">
                    <div
                      className="nav-button"
                      onClick={this.toggleModalUsuario}
                    >
                      <div className="nav-icon chico nav-icon-cross"></div>
                      <span className="single-line">cancelar</span>
                    </div>
                    <div
                      className="nav-button"
                      onClick={this.submitEditarDroga}
                    >
                      <div className="nav-icon chico nav-icon-check"></div>
                      <span className="single-line">guardar</span> cambios
                    </div>
                  </div>
                </div>
              </>
            )}
            {this.state && !this.state.loader.encendido && this.state.userInfo && (
              <>
                <p>Datos personales:</p>
                <p>
                  <span className="newline">
                    Nombre:{" "}
                    {this.state.userInfo.nombre +
                      " " +
                      this.state.userInfo.apellido}
                  </span>
                  <span className="newLine">
                    Email: {this.state.userInfo.email}
                  </span>
                </p>

                <div className="nav-buttons">
                  <div className="nav-button" onClick={this.toggleModalUsuario}>
                    <div className="nav-icon chico nav-icon-edit"></div>
                    <span className="single-line">editar</span>
                    <span>datos</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Usuario;
