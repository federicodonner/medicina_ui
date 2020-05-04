import React from "react";
import Header from "./Header";
import Select from "react-select";
import {
  verifyLogin,
  fetchDosis,
  editDrogaxdosis,
  deleteDrogaxdosis,
} from "../fetchFunctions";

class EditarDroga extends React.Component {
  state: {
    user_info: {},
    loader: true,
    pastillero: {},
    mostrarModal: false,
    datosModal: {
      dosis: null,
      droga: null,
      cantidad_mg: null,
      notas: null,
      horarios: null,
    },
    horariosParaMostrar: [],
    datosModal: {},
  };

  cantidadRef = React.createRef();
  notasRef = React.createRef();

  cargarHorariosIniciales = () => {
    var user_info = this.state.user_info;
    fetchDosis(user_info.pastillero)
      .then((results) => {
        return results.json();
      })
      .then((response) => {
        this.setState({
          pastillero: response,
        });
        this.setState({
          mostrarModal: false,
        });
        this.setState({
          loader: false,
        });
        this.setState({
          datosModal: {
            horarios: [],
          },
        });
        this.procesarHorarios();
      });
  };

  // Función necesaria para mostrar el combobox de horarios del modal
  procesarHorarios = () => {
    var horarios = [];
    var horario = {};
    // Por cada horario del pastillero se carga en el array en state
    this.state.pastillero.dosis.forEach(function (dosis, index) {
      horario.label = dosis.horario;
      horario.value = dosis.id;
      horarios.push(Object.assign({}, horario));
    });
    var datosModal = this.state.datosModal;
    datosModal.horarios = horarios;
    this.setState({ datosModal });
  };

  // Muestra o esconde el modal
  toggleModal = () => {
    var mostrarModal = this.state.mostrarModal;
    mostrarModal = !mostrarModal;
    this.setState({ mostrarModal });
  };

  // Carga los datos en el modal y lo muestra
  loadModal = (drogaSeleccionada) => (event) => {
    var datosModal = drogaSeleccionada;
    var horarios = this.state.datosModal.horarios;
    datosModal.horarios = horarios;
    this.setState({ datosModal }, function () {
      this.toggleModal();
    });
  };

  // Funcion que corre al cambiar la selección de horario del modal
  seleccionHorario = (horarioSeleccionado) => {
    var datosModal = this.state.datosModal;
    datosModal.horario = horarioSeleccionado;
    this.setState({ datosModal });
  };

  // Arma el objeto e invoca la API para editar la dosis
  submitEditarDroga = (event) => {
    var dataEditDrogaxdosis = {};
    dataEditDrogaxdosis.droga_id = this.state.datosModal.droga_id;
    dataEditDrogaxdosis.dosis_id = this.state.datosModal.horario.value;
    dataEditDrogaxdosis.cantidad_mg = this.cantidadRef.current.value;
    dataEditDrogaxdosis.notas = this.notasRef.current.value;

    // Apaga el modal y enciende el loader
    this.toggleModal();
    this.setState({ loader: true });

    // Envía le request a la API con el callback para recargar la página
    editDrogaxdosis(
      dataEditDrogaxdosis,
      this.state.datosModal.drogaxdosis_id,
      this.cargarHorariosIniciales
    );
  };

  submitEliminarDroga = (event) => {
    if (
      window.confirm(
        "¿Seguro que desea eliminar la dósis de " +
          this.state.datosModal.droga +
          "?"
      )
    ) {
      // Apaga el modal y enciende el loader
      this.toggleModal();
      this.setState({ loader: true });

      // Envía la request a la API con el callback para recargar la página
      deleteDrogaxdosis(
        this.state.datosModal.drogaxdosis_id,
        this.cargarHorariosIniciales
      );
    }
  };

  componentDidMount() {
    this.setState({
      loader: true,
    });
    // Verifica si el usuario ya seleccionó el pastillero
    const user_info = verifyLogin();
    if (user_info && user_info.pastillero) {
      // Si la tiene, la guarda en el estado
      this.setState(
        {
          user_info,
        },
        function () {
          this.cargarHorariosIniciales();
        }
      );
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
                  <div
                    className="modal-boton-cerrar"
                    onClick={this.toggleModal}
                  >
                    X
                  </div>
                  <h1>{this.state.datosModal.droga}</h1>
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
                    defaultValue={this.state.datosModal.cantidad_mg}
                  />
                  <span className="single-line"> Notas: </span>
                  <input
                    name="notas"
                    type="textr"
                    ref={this.notasRef}
                    className="pretty-input pretty-text"
                    defaultValue={this.state.datosModal.notas}
                  />

                  <div className="nav-buttons">
                    <div
                      className="nav-button"
                      onClick={this.submitEditarDroga}
                    >
                      <div className="nav-icon nav-icon-check"></div>
                      <span className="single-line">aceptar</span>
                    </div>
                    <div
                      className="nav-button"
                      onClick={this.submitEliminarDroga}
                    >
                      <div className="nav-icon nav-icon-cross"></div>
                      <span className="single-line">eliminar</span>
                    </div>
                  </div>
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
                <h1>Seleccione una dosis para editarla</h1>
                {this.state && this.state.pastillero && (
                  <ul className="dosis-horario">
                    {this.state.pastillero.dosis.map((dosis) => {
                      return (
                        <li key={"dosis" + dosis.id} className="dosis-horario">
                          {dosis.horario}
                          <ul className="dosis-droga">
                            {dosis.drogas.map((droga) => {
                              return (
                                <li
                                  key={droga.id}
                                  className="dosis-droga"
                                  onClick={this.loadModal({
                                    horario: {
                                      value: dosis.id,
                                      label: dosis.horario,
                                    },
                                    droga: droga.nombre,
                                    drogaxdosis_id: droga.id,
                                    droga_id: droga.droga_id,
                                    cantidad_mg: droga.cantidad_mg,
                                    notas: droga.notas,
                                    horarios: [],
                                  })}
                                >
                                  {droga.nombre} - {droga.cantidad_mg}
                                  mg
                                  {droga.notas && (
                                    <span className="notas-dosis">
                                      {droga.notas}
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
