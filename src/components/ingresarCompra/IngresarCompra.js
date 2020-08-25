import React from "react";
import Header from "../header/Header";
import Select from "react-select";
import Footer from "../footer/Footer";
import { accederAPI, borrarDesdeLS } from "../../utils/fetchFunctions";
import variables from "../../var/variables.js";

class IngresarCompra extends React.Component {
  state: {
    user_info: {},
    loader: true,
    mensajeLoader: "",
    pastillero: {},
    drogas: [],
    drogaSeleccionada: null,
    drogasParaMostrar: [],
  };

  comprimidoRef = React.createRef();
  cantidadRef = React.createRef();

  volverAHome = () => {
    this.props.history.push({
      pathname: "home",
    });
  };

  procesarDrogas = (drogas) => {
    const nombreDrogas = [];
    const drogaParaGuardar = {};
    // Crea un array con los detalles de las drogas ingresadas para el pastillero
    drogas.drogas.forEach(function (droga, index) {
      drogaParaGuardar.label = droga.nombre;
      drogaParaGuardar.value = droga.id;
      nombreDrogas.push(Object.assign({}, drogaParaGuardar));
    });
    this.setState({ drogasParaMostrar: nombreDrogas }, () => {
      this.apagarLoader();
    });
  };

  // Actualiza la droga seleccionada en state
  seleccionDroga = (drogaSeleccionada) => {
    this.setState({ drogaSeleccionada });
  };

  // Este proceso se ejecuta al ingresar el formulario
  ingresarCompra = (event) => {
    // Previene la navegación automática del botón
    event.preventDefault();

    // Verifica que todos los campos se hayan ingresado
    if (!this.state.drogaSeleccionada) {
      alert("Debes seleccionar una droga");
      return false;
    } else if (!this.comprimidoRef.current.value) {
      alert("Debes ingresar una dosis en miligramos");
      return false;
    } else if (!this.cantidadRef.current.value) {
      alert("Debes ingresar una cantidad de comprimidos");
      return false;
    }

    // Si todos los datos están correctos, se enciende el loader
    this.setState({
      loader: { encendido: true, texto: "Cargando tus compra..." },
    });

    // Genera un objeto vacío con los datos para enviar
    const dataEnviar = {};
    dataEnviar.comprimido = this.comprimidoRef.current.value;
    dataEnviar.cantidad = this.cantidadRef.current.value;
    dataEnviar.droga = this.state.drogaSeleccionada.value;

    // Se agrega la compra a través del endpoint
    accederAPI(
      "POST",
      "compra",
      dataEnviar,
      this.compraConfirmada,
      this.errorApi
    );
  };

  // callback de ingresar compra
  compraConfirmada = (respuesta) => {
    alert(respuesta.detail);
    this.props.history.push("verStock");
  };

  // Función que apaga el loader cuando verifica que
  // todos los componentes terminaron de cargar su parte
  // Cada uno debería invocarlo al terminar
  apagarLoader = () => {
    // Verifica que tenga los datos del pastillero
    // Y del usuario para apagar el loader
    if (this.state.userInfo && this.state.drogasParaMostrar) {
      this.setState({
        loader: { encendido: false },
      });
    }
  };

  // Recibe el pastillero seleccionado del Footer y lo guarda en state
  establecerPastillero = (pastillero) => {
    // Una vez que define cuál es el pastillero seleccionado
    // busca los detalles en la API
    accederAPI(
      "GET",
      "droga?pastillero=" + pastillero.id,
      null,
      this.procesarDrogas,
      this.errorApi
    );
  };

  // Callback de la llamada a la API de userInfo
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
            <Header volver={this.volverAHome} logoChico={true} />
          )}
          <div className="content">
            {this.state && !this.state.loader.encendido && (
              <>
                <p>Agrega una compra a tu stock</p>
                <p>
                  Selecciona una droga de la lista. Sólo se muestran las drogas
                  que son parte de tus dosis diarias.
                </p>
                <Select
                  className="pretty-input"
                  value={this.state.drogaSeleccionada}
                  onChange={this.seleccionDroga}
                  options={this.state.drogasParaMostrar}
                  placeholder="Droga..."
                />
                <p> Ingresa la concentración en mg de cada comprimido</p>
                <input
                  name="comprimido"
                  type="number"
                  ref={this.comprimidoRef}
                  className="pretty-input pretty-text"
                />
                <p> Ingresa cuántos comprimidos están incluídos en la compra</p>
                <input
                  name="cantidad"
                  type="number"
                  ref={this.cantidadRef}
                  className="pretty-input pretty-text"
                />
                <div className="nav-buttons" onClick={this.ingresarCompra}>
                  <div className="nav-button">
                    <div className="nav-icon chico nav-icon-check"></div>
                    <span className="single-line">ingresar</span>
                    <span>compra</span>
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

export default IngresarCompra;
