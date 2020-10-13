import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Select from "react-select";
import { borrarDesdeLS, accederAPI } from "../../utils/fetchFunctions";
import variables from "../../var/variables.js";

class AgregarDroga extends React.Component {
  state: {
    user_info: {},
    loader: true,
    mensajeLoader: "",
    pastillero: {},
    drogas: [],
    drogaSeleccionada: null,
    drogasParaMostrar: [],
    horarioSeleccionado: null,
    horariosParaMostrar: [],
  };

  drogaRef = React.createRef();
  concentracionRef = React.createRef();
  notasRef = React.createRef();

  volverAEditarDroga = () => {
    this.props.history.push(
      {
        pathname: "editarDroga",
      },
      { userInfo: this.state.userInfo }
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
    this.props.history.push({ pathname: "/login" });
  };

  procesarDrogas = (drogas, pastillero) => {
    const nombreDrogas = [];
    const drogaParaGuardar = {};
    drogas.forEach((droga) => {
      drogaParaGuardar.label = droga.nombre;
      drogaParaGuardar.value = droga.id;
      nombreDrogas.push(Object.assign({}, drogaParaGuardar));
    });
    this.setState({ drogasParaMostrar: nombreDrogas });
    const nombreHorarios = [];
    const horarioParaGuardar = {};
    pastillero.dosis.forEach((dosis) => {
      horarioParaGuardar.label = dosis.horario;
      horarioParaGuardar.value = dosis.id;
      nombreHorarios.push(Object.assign({}, horarioParaGuardar));
    });
    this.setState({ horariosParaMostrar: nombreHorarios });
  };

  seleccionDroga = (drogaSeleccionada) => {
    this.setState({ drogaSeleccionada });
  };

  seleccionHorario = (horarioSeleccionado) => {
    this.setState({ horarioSeleccionado });
  };

  // Este proceso se ejecuta al ingresar el formulario
  ingresarDroga = (event) => {
    // Previene la navegación automática del botón
    event.preventDefault();

    // Verifica que todos los campos se hayan ingresado
    if (!this.state.drogaSeleccionada && !this.drogaRef.current.value) {
      alert("Debes ingresar o seleccionar una droga");
      return false;
    } else if (!this.state.horarioSeleccionado) {
      alert("Debes seleccionar un horario para la dosis");
      return false;
    } else if (!this.concentracionRef.current.value) {
      alert("Debes ingresar una dosis en miligramos");
      return false;
    }

    // Genera un objeto vacío con los datos para enviar
    const dataEnviar = {};
    dataEnviar.dosis_id = this.state.horarioSeleccionado.value;
    dataEnviar.cantidad_mg = this.concentracionRef.current.value;

    // Si el usuario ingresó notas, se cargan en el objeto a enviar
    if (this.notasRef && this.notasRef.current) {
      dataEnviar.notas = this.notasRef.current.value;
    }

    // Si el usuario ingresó el nombre de una droga en lugar de seleccionarla
    // de la lista se debe ingresar a la db
    if (this.drogaRef && this.drogaRef.current && this.drogaRef.current.value) {
      const nuevaDroga = {
        nombre: this.drogaRef.current.value,
        pastillero: this.state.pastillero.id,
      };
      this.setState(
        {
          dataEnviar,
          loader: { encendido: true, texto: "Cargando el medicamento." },
        },
        () => {
          // Se agrega la droga a través del endpoint
          accederAPI(
            "POST",
            "droga",
            nuevaDroga,
            this.agregarDroga,
            this.errorApi
          );
        }
      );
    } else {
      this.setState(
        {
          dataEnviar,
          loader: { encendido: true, texto: "Cargando el medicamento." },
        },
        () => {
          // Resuelve la promesa pasando el id de la droga seleccionada
          this.agregarDroga({ id: this.state.drogaSeleccionada.value });
        }
      );
    }
  };

  // Callback del POST de crear droga
  agregarDroga = (droga) => {
    // Carga los datos listos para enviar y le agrega los datos de la droga
    const dataEnviar = this.state.dataEnviar;
    dataEnviar.droga_id = droga.id;

    // Se agrega la dosis a través del endpoint
    accederAPI(
      "POST",
      "drogaxdosis",
      dataEnviar,
      this.volverAEditarDroga,
      this.errorApi
    );
  };

  // Función que apaga el loader cuando verifica que
  // todos los componentes terminaron de cargar su parte
  // Cada uno debería invocarlo al terminar
  apagarLoader = () => {
    // Verifica que tenga los datos del pastillero
    // Y del usuario para apagar el loader
    if (this.state.userInfo && this.state.pastillero && this.state.drogas) {
      this.procesarDrogas(this.state.drogas, this.state.pastillero);
      this.setState({
        loader: { encendido: false },
      });
    }
  };

  // Recibe las drogas del pastillero y las guarda en state
  establecerDrogas = (drogas) => {
    this.setState({ drogas: drogas.drogas }, () => {
      this.apagarLoader();
    });
  };

  // Recibe el pastillero seleccionado del Footer y lo guarda en state
  establecerPastillero = (pastillero) => {
    // Una vez que define cuál es el pastillero seleccionado
    // busca las drogas correspondientes en la API
    this.setState({ pastillero }, () => {
      accederAPI(
        "GET",
        "droga?pastillero=" + pastillero.id,
        null,
        this.establecerDrogas,
        this.errorApi
      );
    });
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
            <Header volver={this.volverAEditarDroga} logoChico={true} />
          )}
          <div className="content">
            {this.state && !this.state.loader.encendido && (
              <>
                <p>Agrega droga a tus dosis</p>
                <p>
                  Si quieres agregar una dosis de una droga ya ingresada,
                  selecciónala de la lista.
                </p>
                <Select
                  className="pretty-input"
                  value={this.state.drogaSeleccionada}
                  onChange={this.seleccionDroga}
                  options={this.state.drogasParaMostrar}
                  placeholder="Droga..."
                />
                {this.state && !this.state.drogaSeleccionada && (
                  <>
                    <p> Sino, escribe el nombre debajo y será agregada.</p>
                    <input
                      name="droga"
                      type="text"
                      ref={this.drogaRef}
                      className="pretty-input pretty-text"
                    />
                  </>
                )}
                <p>Selecciona en qué momento del día se debe consumir.</p>
                <Select
                  className="pretty-input"
                  value={this.state.horarioSeleccionado}
                  onChange={this.seleccionHorario}
                  options={this.state.horariosParaMostrar}
                  placeholder="Horario..."
                />
                <p> Ingresa la concentración en mg.</p>
                <input
                  name="concentracion"
                  type="number"
                  ref={this.concentracionRef}
                  className="pretty-input pretty-text"
                />
                <p>
                  {" "}
                  Si quieres puedes escribir notas para la toma del medicamento.
                </p>
                <input
                  name="notas"
                  type="text"
                  ref={this.notasRef}
                  className="pretty-input pretty-text"
                />

                <div className="nav-buttons" onClick={this.ingresarDroga}>
                  <div className="nav-button">
                    <div className="nav-icon chico nav-icon-check"></div>
                    <span className="single-line">agregar</span>
                    <span>droga</span>
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

export default AgregarDroga;
