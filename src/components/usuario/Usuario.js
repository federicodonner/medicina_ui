import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Modal from "../modal/Modal";
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

  // Muestra o esconde el modal del pastillero
  toggleModalPastillero = () => {
    var mostrarModalPastillero = this.state.mostrarModalPastillero;
    mostrarModalPastillero = !mostrarModalPastillero;
    this.setState({ mostrarModalPastillero });
  };

  // Función que apaga el loader cuando verifica que
  // todos los componentes terminaron de cargar su parte
  // Cada uno debería invocarlo al terminar
  apagarLoader = () => {
    // Verifica que tenga los datos del usuario
    // para apagar el loader
    if (this.state.userInfo && this.state.pastilleroDeUsuario) {
      this.setState({
        loader: { encendido: false },
      });
    }
  };

  // Callback de la llamada a la API cuando el estado es 200
  recibirDatos = (userInfo) => {
    // Antes de guardar los datos verifico que tenga algún pastillero
    // en el que el usaurio sea el paciente
    var pastilleros = userInfo.pastilleros;
    var pastilleroEncontrado = false;
    if (pastilleros) {
      // Recorre los pastilleros, cuando encuentra el del usuario
      // lo separa para guardarlo en state
      pastilleros.forEach((pastillero) => {
        if (!pastilleroEncontrado) {
          if ((pastillero.paciente_id = userInfo.id)) {
            pastilleroEncontrado = true;
            accederAPI(
              "GET",
              "pastillero/" + pastillero.id,
              null,
              this.recibirPastillero,
              this.errorApi
            );
          }
        }
      });
    }

    this.setState({ userInfo }, () => {
      this.apagarLoader();
    });
  };

  // Función que recibe el pastillero del usuario desde la API
  // lo guarda en state y llama a apagar loader
  recibirPastillero = (pastilleroDeUsuario) => {
    // Le agrega hasta 6 dósis por si el cliente quiere agregar más
    var nuevaDosis = { horario: null };
    for (var i = pastilleroDeUsuario.dosis.length; i < 6; i++) {
      pastilleroDeUsuario.dosis[i] = nuevaDosis;
    }

    this.setState({ pastilleroDeUsuario });
    this.apagarLoader();
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
      // Si el error es de otros tipos, muestra el mensaje de error
    } else {
    }
  };

  // Función ejecutada al actualizar los datos del usuario
  submitEditarUsuario = (datos) => {
    // Cierro el modal y prendo el loader
    this.setState({
      loader: { encendido: true, texto: "Enviado datos." },
      mostrarModalUsuario: false,
    });

    accederAPI(
      "PUT",
      "usuario",
      datos,
      this.datosEditadosExitosamente,
      this.errorApi
    );
  };

  // Entra a esta función si editó los datos correctamente
  datosEditadosExitosamente = () => {
    alert("Datos editados exitosamente");
    //Va a buscar los datos
    accederAPI("GET", "usuario", null, this.recibirDatos, this.errorApi);
  };

  componentDidMount() {
    var userInfo = null;
    // Verifica que el componente anterior le haya pasado los datos del usuario
    if (this.props.location.state && this.props.location.state.userInfo) {
      // Si se los pasó, los gaurda en state
      // this.setState({ userInfo: this.props.location.state.userInfo }, () => {
      //
      //   this.apagarLoader();
      this.recibirDatos(this.props.location.state.userInfo);
      // });
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
                {this.state.mostrarModalUsuario && (
                  <Modal
                    defaultNavButtons={true}
                    mostrarModal={this.state.mostrarModalUsuario}
                    cerrarModal={this.toggleModalUsuario}
                    titulo={"Editar datos"}
                    submitModal={this.submitEditarUsuario}
                    campos={[
                      {
                        tipo: "texto",
                        etiqueta: "Nombre",
                        nombre: "nombre",
                        value: this.state.userInfo.nombre,
                        obligatorio: true,
                      },
                      {
                        tipo: "texto",
                        etiqueta: "Apellido",
                        nombre: "apellido",
                        value: this.state.userInfo.apellido,
                        obligatorio: true,
                      },
                      {
                        tipo: "texto",
                        etiqueta: "Email",
                        nombre: "email",
                        value: this.state.userInfo.email,
                        obligatorio: true,
                        regexValidate: RegExp(
                          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
                        ),
                      },
                    ]}
                  />
                )}
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

                {this.state && this.state.pastilleroDeUsuario && (
                  <p>Tienes un pastillero ingresado</p>
                )}

                <div className="nav-buttons tres">
                  <div className="nav-button" onClick={this.toggleModalUsuario}>
                    <div className="nav-icon chico nav-icon-edit"></div>
                    <span className="single-line">editar</span>
                    <span>datos</span>
                  </div>
                  <div className="nav-button">
                    <div className="nav-icon chico nav-icon-password"></div>
                    <span className="single-line">cambiar</span>
                    <span>contraseña</span>
                  </div>
                  {this.state && this.state.pastilleroDeUsuario && (
                    <div
                      className="nav-button"
                      onClick={this.toggleModalPastillero}
                    >
                      <div className="nav-icon chico nav-icon-pastillero"></div>
                      <span className="single-line">editar tu</span>
                      <span>pastillero</span>
                    </div>
                  )}
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
