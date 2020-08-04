import React from "react";
import Header from "./Header";
import Select from "react-select";
import { verifyLogin, fetchDroga, addCompra } from "../fetchFunctions";

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

  procesarDrogas = (drogas, pastillero) => {
    const nombreDrogas = [];
    const drogaParaGuardar = {};
    // Crea un array con los detalles de las drogas ingresadas para el pastillero
    drogas.forEach(function (droga, index) {
      drogaParaGuardar.label = droga.nombre;
      drogaParaGuardar.value = droga.id;
      nombreDrogas.push(Object.assign({}, drogaParaGuardar));
    });
    this.setState({ drogasParaMostrar: nombreDrogas });
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
    this.setState({ loader: true, mensajeLoader: "Cargando tus compra..." });

    // Genera un objeto vacío con los datos para enviar
    const dataEnviar = {};
    dataEnviar.comprimido = this.comprimidoRef.current.value;
    dataEnviar.cantidad = this.cantidadRef.current.value;
    dataEnviar.droga = this.state.drogaSeleccionada.value;

    // Se agrega la compra a través del endpoint
    addCompra(dataEnviar)
      .then((results) => {
        return results.json();
      })
      .then((response) => {
        alert(response.detail);
        this.setState({
          loader: false,
          drogaSeleccionada: null,
        });
      });
  };

  componentDidMount() {
    this.setState({ loader: true });
    // Verifica si el usuario ya seleccionó el pastillero
    const user_info = verifyLogin();
    if (user_info && user_info.pastillero) {
      //   // Si la tiene, la guarda en el estado
      this.setState({ user_info });

      fetchDroga(user_info.pastillero)
        .then((results) => {
          return results.json();
        })
        .then((response) => {
          this.procesarDrogas(response.drogas, this.state.pastillero);
          this.setState({ loader: false });
        });
    } else {
      // Si no hay data en localstorage, va a la pantalla de selección de pastillero
      this.props.history.push({
        pathname: "/seleccionarPastillero",
      });
    }
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          {this.state && this.state.user_info && <Header />}
          <div className="content">
            {this.state && this.state.loader && (
              <p>
                <img className="loader" src="/images/loader.svg" />
                <span className="single-line">{this.state.mensajeLoader}</span>
              </p>
            )}
            {this.state && !this.state.loader && (
              <>
                <h1>Agrega una compra a tu stock</h1>
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
                    <div className="nav-icon nav-icon-check"></div>
                    <span className="single-line">ingresar</span>
                    <span>compra</span>
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

export default IngresarCompra;
