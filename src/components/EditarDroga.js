import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Select from "react-select";
import variables from "../var/variables.js";
import {
  verifyLogin,
  fetchDosis,
  editDrogaxdosis,
  deleteDrogaxdosis,
  getData,
  postData,
  putData,
  deleteData,
  borrarDesdeLS,
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

  volverAHome = () => {
    this.props.history.push({
      pathname: "home",
    });
  };

  volverAVerDosis = () => {
    this.props.history.push({
      pathname: "verDosis",
    });
  };

  signOut = (event) => {
    if (event) {
      event.preventDefault();
    }
    borrarDesdeLS(variables.LSLoginToken);
    this.props.history.push({ pathname: "login" });
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

    // Enciende el loader
    this.setState(
      { loader: { encendido: true, texto: "Editando la dosis" } },
      () => {
        // Envía la request a la API con el callback para recargar la página
        putData(
          "drogaxdosis/" + this.state.datosModal.drogaxdosis_id,
          dataEditDrogaxdosis
        ).then((response) => {
          if (response.status == 200) {
            response.json().then((responseDetails) => {
              alert(responseDetails.detail);
              this.volverAVerDosis();
            });
          } else {
            alert("Ocurrió un error, inténtalo denuevo más tarde.");
            this.signOut();
          }
        });
      }
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
      // Enciende el loader
      this.setState(
        { loader: { encendido: true, texto: "Eliminando la dosis" } },
        () => {
          // Envía la request a la API con el callback para recargar la página
          deleteData(
            "drogaxdosis/" + this.state.datosModal.drogaxdosis_id
          ).then((response) => {
            if (response.status == 200) {
              response.json().then((responseDetails) => {
                alert(responseDetails.detail);
                this.volverAVerDosis();
              });
            } else {
              alert("Ocurrió un error, inténtalo denuevo más tarde.");
              this.signOut();
            }
          });
        }
      );
    }
  };

  // Función que apaga el loader cuando verifica que
  // todos los componentes terminaron de cargar su parte
  // Cada uno debería invocarlo al terminar
  apagarLoader = () => {
    // Verifica que tenga los datos del pastillero
    // Y del usuario para apagar el loader
    if (this.state.userInfo && this.state.pastillero) {
      var horarios = [];
      var horario = {};
      // Por cada horario del pastillero se carga en el array en state
      this.state.pastillero.dosis.forEach(function (dosis, index) {
        horario.label = dosis.horario;
        horario.value = dosis.id;
        horarios.push(Object.assign({}, horario));
      });
      var datosModal = {};
      datosModal.horarios = horarios;
      // Carga todos los datos procesados en state
      this.setState({
        loader: { encendido: false },
        mostrarModal: false,
        datosModal: datosModal,
      });
    }
  };

  // Recibe el pastillero seleccionado del Footer y lo guarda en state
  establecerPastillero = (pastilleroId) => {
    // Una vez que define cuál es el pastillero seleccionado
    // busca los detalles en la API
    getData("pastillero/" + pastilleroId)
      .then((respuesta) => {
        respuesta.json().then((pastillero) => {
          this.setState({ pastillero }, () => {
            this.apagarLoader();
          });
        });
      })
      .catch((e) => {
        console.log(e);
      });
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
      getData("usuario")
        .then((response_usuario) => {
          if (response_usuario.status == 200) {
            response_usuario.json().then((respuesta_usuario) => {
              // Guarda la información del usuario
              this.setState({ userInfo: respuesta_usuario }, () => {
                this.apagarLoader();
              });
            });
          } else {
            // Si el request da un error de login, sale
            response_usuario.json().then((respuesta_usuario) => {
              this.signOut();
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
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
            <Header
              mostrarBotonVolver={this.state.userInfo.pastilleros.length > 0}
              volver={this.volverAVerDosis}
              logoChico={true}
            />
          )}
          <div className="content">
            {this.state &&
              this.state.datosModal &&
              !this.state.loader.encendido && (
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
                      (this.state.mostrarModal ? "show" : "")
                    }
                  >
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
                        <div className="nav-icon chico nav-icon-check"></div>
                        <span className="single-line">guardar</span> cambios
                      </div>
                      <div
                        className="nav-button"
                        onClick={this.submitEliminarDroga}
                      >
                        <div className="nav-icon chico nav-icon-cross"></div>
                        <span className="single-line">eliminar</span> dosis
                      </div>
                    </div>
                    <div
                      className="modal-boton-cerrar"
                      onClick={this.toggleModal}
                    >
                      Cancelar
                    </div>
                  </div>
                </>
              )}

            {this.state && !this.state.loader.encendido && (
              <>
                <p>Seleccione una dosis para editarla</p>
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

export default EditarDroga;
