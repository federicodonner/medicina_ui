import React from "react";
import Header from "./Header";
import Select from "react-select";
import { verifyLogin, fetchDosis } from "../fetchFunctions";

class EditarDroga extends React.Component {
  state: {
    user_info: {},
    loader: true,
    pastillero: {},
    mostrarModal: false,
    datosModal: {
      horario: null,
      droga: null,
      cantidad: null,
      notas: null,
      horarios: null
    },
    horariosParaMostrar: [],
    datosModal: {}
  };

  cantidadRef = React.createRef();


  // Función necesaria para mostrar el combobox de horarios del modal
  procesarHorarios = () => {
    var horarios = [];
    var horario = {};
    // Por cada horario del pastillero se carga en el array en state
    this.state.pastillero.dosis.forEach(function(dosis, index) {
      horario.label = dosis.horario;
      horario.value = dosis.id;
      horarios.push(Object.assign({}, horario));
    });
    var datosModal = this.state.datosModal;
    datosModal.horarios = horarios;
    this.setState({ datosModal });
  };

  // Funcion que corre al cambiar la selección de horario del modal
  seleccionHorario = horarioSeleccionado => {
    var datosModal = this.state.datosModal;
    datosModal.horario = horarioSeleccionado;
    this.setState({ datosModal });
  };

  componentDidMount() {
    this.setState({
      loader: true
    });
    // Verifica si el usuario ya seleccionó el pastillero
    const user_info = verifyLogin();
    if (user_info && user_info.pastillero) {
      // Si la tiene, la guarda en el estado
      this.setState(
        {
          user_info
        },
        function() {
          fetchDosis(user_info.pastillero)
            .then(results => {
              return results.json();
            })
            .then(response => {
              this.setState({
                pastillero: response
              });
              this.setState({
                mostrarModal: true
              });
              this.setState({
                loader: false
              });
              this.setState({
                datosModal: {
                  horario: { value: 3, label: "un horario" },
                  droga: "Tacrolimus",
                  cantidad: 100,
                  notas: "las notas",
                  horarios: []
                }
              });
              this.procesarHorarios();
            });
        }
      );
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
            {this.state && this.state.datosModal && (
              <>
                <div
                  className={
                    "modal-cover " +
                    (this.state.mostrarModal ? "show" : "hidden")
                  }
                />
                <div
                  className={
                    "editar-droga-modal " +
                    (this.state.mostrarModal ? "show" : "hidden")
                  }
                >
                  <h1> Editar dosis </h1>
                  <span className="single-line">
                    Droga {this.state.datosModal.droga}
                  </span>
                  <span className="single-line"> Horario: </span>
                  <Select
                    className="pretty-input"
                    value={this.state.datosModal.horario}
                    onChange={this.seleccionHorario}
                    options={this.state.datosModal.horarios}
                    placeholder="Horario..."
                  />
                  <span className="single-line"> Cantidad (mg): </span>
                  <input
                    name="cantidad"
                    type="number"
                    ref={this.cantidadRef}
                    className="pretty-input pretty-text"
                    defaultValue={this.state.datosModal.cantidad}
                  />
                </div>
              </>
            )}
            {this.state && this.state.loader && (
              <p>
                <img className="loader" src="/images/loader.svg" />
              </p>
            )}
            {this.state && !this.state.loader && (
              <>
                {this.state && this.state.pastillero && (
                  <ul className="dosis-horario">
                    {this.state.pastillero.dosis.map(dosis => {
                      return (
                        <li key={"dosis" + dosis.id} className="dosis-horario">
                          {dosis.horario}
                          <ul className="dosis-droga">
                            {dosis.drogas.map(droga => {
                              return (
                                <li key={droga.id} className="dosis-droga">
                                  {droga.nombre} - {droga.cantidad_mg}
                                  mg
                                  {droga.notas && (
                                    <span className="notas-dosis">
                                      -{droga.notas}
                                    </span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default EditarDroga;
