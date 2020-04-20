import React from "react";
import Header from "./Header";
import Select from "react-select";
import {
  verifyLogin,
  fetchDosis,
  fetchDroga,
  addDroga,
  addDrogaxdosis
} from "../fetchFunctions";

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
    horariosParaMostrar: []
  };

  drogaRef = React.createRef();
  concentracionRef = React.createRef();
  notasRef = React.createRef();

  navigateToSection = section => event => {
    event.preventDefault();
    this.props.history.push({
      pathname: section
    });
  };

  procesarDrogas = (drogas, pastillero) => {
    const nombreDrogas = [];
    const drogaParaGuardar = {};
    drogas.forEach(function(droga, index) {
      drogaParaGuardar.label = droga.nombre;
      drogaParaGuardar.value = droga.id;
      nombreDrogas.push(Object.assign({}, drogaParaGuardar));
    });
    this.setState({ drogasParaMostrar: nombreDrogas });
    const nombreHorarios = [];
    const horarioParaGuardar = {};
    pastillero.dosis.forEach(function(dosis, index) {
      horarioParaGuardar.label = dosis.horario;
      horarioParaGuardar.value = dosis.id;
      nombreHorarios.push(Object.assign({}, horarioParaGuardar));
    });
    this.setState({ horariosParaMostrar: nombreHorarios });
  };

  seleccionDroga = drogaSeleccionada => {
    this.setState({ drogaSeleccionada });
  };

  seleccionHorario = horarioSeleccionado => {
    this.setState({ horarioSeleccionado });
  };

  // Este proceso se ejecuta al ingresar el formulario
  ingresarDroga = event => {
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

    // Si todos los datos están correctos, se enciende el loader
    this.setState({ loader: true, mensajeLoader: "Cargando tus datos..." });

    // Genera un objeto vacío con los datos para enviar
    const dataEnviar = {};
    dataEnviar.dosis_id = this.state.horarioSeleccionado.value;
    dataEnviar.cantidad_mg = this.concentracionRef.current.value;

    // Si el usuario ingresó notas, se cargan en el objeto a enviar
    if (this.notasRef && this.notasRef.current) {
      dataEnviar.notas = this.notasRef.current.value;
    }

    // Esta promesa resuelve la creación de la nueva droga si es necesario antes
    // de actualizar la dosis
    let promesaCrearDroga = new Promise((resolve, reject) => {
      // Si el usuario ingresó el nombre de una droga en lugar de seleccionarla
      // de la lista se debe ingresar a la db
      if (
        this.drogaRef &&
        this.drogaRef.current &&
        this.drogaRef.current.value
      ) {
        const nuevaDroga = this.drogaRef.current.value;
        // Se agrega la droga a través del endpoint
        addDroga(nuevaDroga).then(function() {
          fetchDroga()
            .then(results => {
              return results.json();
            })
            .then(response => {
              // Si la carga fue correcta, se hace una consulta de las drogas,
              // se selecciona la nueva y se carga en el objeto a enviar
              response.forEach(function(droga, index) {
                if (droga.nombre == nuevaDroga) {
                  // Resuelve la promesa pasando el id de la droga creada
                  resolve(droga.id);
                }
              });
            });
        });
      } else {
        // Resuelve la promesa pasando el id de la droga seleccionada
        resolve(this.state.drogaSeleccionada.value);
      }
    });

    // Función llamada luego de resolver la promesa de creación de droga
    // recibe el id de la droga creada o seleccionada
    promesaCrearDroga.then(
      function(droga_id) {
        dataEnviar.droga_id = droga_id;
        // Se agrega la dosis a través del endpoint
        addDrogaxdosis(dataEnviar)
          .then(results => {
            return results.json();
          })
          .then(response => {
            alert("Dosis agregada exitosamente");
            fetchDroga()
              .then(results => {
                return results.json();
              })
              .then(response => {
                this.setState({ drogas: response });
                this.procesarDrogas(this.state.drogas, this.state.pastillero);
                this.setState({
                  loader: false,
                  drogaSeleccionada: null,
                  horarioSeleccionado: null
                });
              });
          });
      }.bind(this)
    );
  };

  componentDidMount() {
    this.setState({ loader: true });
    // Verifica si el usuario ya seleccionó el pastillero
    const user_info = verifyLogin();
    if (user_info && user_info.pastillero) {
      // Si la tiene, la guarda en el estado
      this.setState({ user_info }, function() {
        fetchDosis(user_info.pastillero)
          .then(results => {
            return results.json();
          })
          .then(response => {
            this.setState({ pastillero: response });
            fetchDroga(user_info.pastillero)
              .then(results => {
                return results.json();
              })
              .then(response => {
                this.setState({ drogas: response });
                this.procesarDrogas(this.state.drogas, this.state.pastillero);
                this.setState({ loader: false });
              });
          });
      });
    } else {
      // Si no hay data en localstorage, va a la pantalla de selección de pastillero
      this.props.history.push({
        pathname: "/seleccionarPastillero"
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
                <h1>Agregar droga a tus dosis</h1>
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
                <p> Si quieres puedes escribir notas para la aplicación.</p>
                <input
                  name="notas"
                  type="text"
                  ref={this.notasRef}
                  className="pretty-input pretty-text"
                />
                <a href="#" onClick={this.ingresarDroga}>
                  Ingresar
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default AgregarDroga;
