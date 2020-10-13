import React from "react";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import Modal from "../modal/Modal";
import variables from "../../var/variables.js";
import { accederAPI, borrarDesdeLS } from "../../utils/fetchFunctions";
import "./editarDroga.css";

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

  navigateToSection = (section, data) => (event) => {
    event.preventDefault();
    this.props.history.push(
      {
        pathname: section,
      },
      data
    );
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

  // Arma el objeto e invoca la API para editar la dosis
  submitEditarDroga = (datos) => {
    // Guarda el horario seleccionado en estate para actualizar la lista
    var datosModal = this.state.datosModal;
    datosModal.horario.value = datos["dosis_id"];
    this.setState({ datosModal });

    // Enciende el loader
    this.setState(
      { loader: { encendido: true, texto: "Editando la dosis" } },
      () => {
        // Envía la request a la API con el callback para recargar la página
        accederAPI(
          "PUT",
          "drogaxdosis/" + this.state.datosModal.drogaxdosis_id,
          datos,
          this.editarDrogaEnState,
          this.errorApi
        );
      }
    );
  };

  submitEliminarDroga = () => {
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
          accederAPI(
            "DELETE",
            "drogaxdosis/" + this.state.datosModal.drogaxdosis_id,
            null,
            this.editarDrogaEnState,
            this.errorApi
          );
        }
      );
    }
  };

  // Si se editó una dosis, la edita en state para matchear con la db
  editarDrogaEnState = (drogaxdosisEditado) => {
    var pastillero = this.state.pastillero;
    var horarioSeleccionado = this.state.datosModal.horario.value;
    var drogaxdosisId = this.state.datosModal.drogaxdosis_id;

    // Va a armar los horarios de los datos para el modal
    // Aprovecha que va a recorrer el array de dosis del pastillero
    var datosModal = { horarios: [] };

    // Va a buscar la drogaxdosis eliminada para borrarla
    pastillero.dosis.forEach((dosis) => {
      var horario = {};
      horario.label = dosis.horario;
      horario.value = dosis.id;
      datosModal.horarios.push(Object.assign({}, horario));

      if (dosis.drogas.length >= 0) {
        dosis.drogas.forEach((drogaxdosis, index) => {
          if (drogaxdosis.id == drogaxdosisId) {
            // Cuando encuentra el editado, lo elimina
            dosis.drogas.splice(index, 1);
          }
        });
      }
      // Después de eliminar el encontrado, si fue una edición
      // lo agrega en el horario seleccionado
      // (si fue elmiinada una droga, el objeto de respuesta de la API no tiene id)
      if (dosis.id == horarioSeleccionado && drogaxdosisEditado.id) {
        dosis.drogas.push(drogaxdosisEditado);
      }
    });
    // Guarda el state actualizado
    this.setState({
      pastillero,
      datosModal,
      mostrarModal: false,
      loader: { encendido: false },
    });
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

  // Callback del footer con la información del pastillero
  establecerPastillero = (pastillero) => {
    // Guarda el pastillero en state y apaga el loader
    this.setState({ pastillero }, () => {
      this.apagarLoader();
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
            <Header volver={this.volverAHome} logoChico={true} />
          )}
          <div className="content">
            {this.state &&
              this.state.datosModal &&
              !this.state.loader.encendido && (
                <>
                  {this.state.mostrarModal && (
                    <Modal
                      defaultNavButtons={false}
                      mostrarModal={this.state.mostrarModal}
                      cerrarModal={this.toggleModal}
                      titulo={this.state.datosModal.droga}
                      submitModal={this.submitEditarDroga}
                      campos={[
                        {
                          tipo: "select",
                          etiqueta: "Horario",
                          nombre: "dosis_id",
                          obligatorio: true,
                          opciones: this.state.datosModal.horarios,
                          seleccionado: this.state.datosModal.horario,
                        },
                        {
                          tipo: "texto",
                          etiqueta: "Cantidad (mg)",
                          nombre: "cantidad_mg",
                          value: this.state.datosModal.cantidad_mg,
                          obligatorio: true,
                        },
                        {
                          tipo: "texto",
                          etiqueta: "Notas",
                          nombre: "notas",
                          value: this.state.datosModal.notas,
                          obligatorio: false,
                        },
                      ]}
                      navButtons={[
                        {
                          textoArriba: "Cancelar",
                          tipo: "nav-icon-cross",
                          esCerrar: true,
                        },
                        {
                          textoArriba: "Eliminar",
                          textoAbajo: "dosis",
                          tipo: "nav-icon-alert",
                          funcion: this.submitEliminarDroga,
                        },
                        {
                          textoArriba: "Guardar",
                          textoAbajo: "cambios",
                          tipo: "nav-icon-check",
                          esAceptar: true,
                        },
                      ]}
                    />
                  )}
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
                                  {droga.nombre} - {droga.cantidad_mg} mg
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
                <div className="nav-buttons">
                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("agregarDroga", {
                      userInfo: this.state.userInfo,
                    })}
                  >
                    <div className="nav-icon nav-icon-agregar-dosis chico"></div>
                    <span className="single-line">agregar</span>
                    <span>droga</span>
                  </div>

                  <div
                    className="nav-button"
                    onClick={this.navigateToSection("descontarStock", {
                      userInfo: this.state.userInfo,
                    })}
                  >
                    <div className="nav-icon nav-icon-pastillero chico"></div>
                    <span className="single-line">pastillero</span>
                    <span>armado</span>
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

export default EditarDroga;
