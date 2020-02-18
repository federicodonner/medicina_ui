import React from "react";
import Header from "./Header";
import BookName from "./BookName";
import UserName from "./UserName";
import Select from "react-select";
import {
  verifyLogin,
  fetchDosis,
  fetchDroga,
  addDroga
} from "../fetchFunctions";

class AgregarDroga extends React.Component {
  state: {
    user_info: {},
    loader: true,
    pastillero: {},
    drogas: [],
    drogaSeleccionada: null,
    drogasParaMostrar: [],
    horarioSeleccionado: null,
    horariosParaMostrar: []
  };

  drogaRef = React.createRef();
  concentracionRef = React.createRef();

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

  // signupUser = event => {
  //   // Stop form from submitting
  //   event.preventDefault();
  //   const user = {
  //     nombre: this.nameRef.current.value,
  //     email: this.emailRef.current.value
  //   };
  //   this.setState({ loading: true });
  //
  //   signupUser(user, this.props.match.params.id)
  //     .then(res => res.json())
  //     .then(
  //       function(signupResponse) {
  //         if (signupResponse.status == "success") {
  //           console.log(signupResponse);
  //           loginUser(signupResponse.usuario)
  //             .then(res => res.json())
  //             .then(response => {
  //               localStorage.setItem("libroclub_token", response.token);
  //               localStorage.setItem("libroclub_username", user.nombre);
  //               localStorage.setItem("libroclub_id", response.id);
  //               this.props.history.push({ pathname: "/" });
  //             })
  //             .catch(error => console.error("Error:", error));
  //         }
  //       }.bind(this)
  //     );
  // };

  ingresarDroga = event => {
    event.preventDefault();
    const dataEnviar = {}

    if (this.drogaRef.current.value) {
      const nuevaDroga = this.drogaRef.current.value;
      addDroga(nuevaDroga).then(function() {
        fetchDroga()
          .then(results => {
            return results.json();
          })
          .then(response => {
            response.forEach(function(droga, index) {
              if (droga.nombre == nuevaDroga) {
                dataEnviar.droga_id = droga.id;
              }
            });
          });
      });
    }

    // console.log(
    //   "droga seleccionada ",
    //   this.state.drogaSeleccionada.value,
    //   "droga ingresada ",
    //   this.drogaRef.current.value,
    //   "horario seleccionado ",
    //   this.state.horarioSeleccionado.value,
    //   "concentracion ingresada ",
    //   this.concentracionRef.current.value
    // );
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
            fetchDroga()
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
                <a href="#" onClick={this.ingresarDroga}>
                  Imprimir
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
