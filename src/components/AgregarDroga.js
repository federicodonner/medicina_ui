import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Select from "react-select";
import {
  verifyLogin,
  fetchDosis,
  fetchDroga,
  addDroga,
  addDrogaxdosis,
  borrarDesdeLS,
  leerDesdeLS,
  getData,
  postData,
} from "../fetchFunctions";
import variables from "../var/variables.js";

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

  navigateToSection = (section) => (event) => {
    event.preventDefault();
    this.props.history.push({
      pathname: section,
    });
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

  volverAVerDosis = () => {
    this.props.history.push({ pathname: "/verdosis" });
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

    // Si todos los datos están correctos, se enciende el loader
    this.setState({
      loader: { encendido: true, texto: "Cargando el medicamento" },
    });

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
        const nuevaDroga = {
          nombre: this.drogaRef.current.value,
          pastillero: this.state.pastillero.id,
        };
        // Se agrega la droga a través del endpoint
        postData("droga", nuevaDroga)
          .then(() => {
            getData("droga?pastillero=" + this.state.pastillero.id).then(
              (results) => {
                results.json().then((resultsDetalles) => {
                  // Si la carga fue correcta, se hace una consulta de las drogas,
                  // se selecciona la nueva y se carga en el objeto a enviar
                  resultsDetalles.drogas.forEach((droga) => {
                    if (droga.nombre == nuevaDroga.nombre) {
                      // Resuelve la promesa pasando el id de la droga creada
                      resolve(droga.id);
                    }
                  });
                });
              }
            );
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        // Resuelve la promesa pasando el id de la droga seleccionada
        resolve(this.state.drogaSeleccionada.value);
      }
    });

    // Función llamada luego de resolver la promesa de creación de droga
    // recibe el id de la droga creada o seleccionada
    promesaCrearDroga.then((droga_id) => {
      dataEnviar.droga_id = droga_id;
      // Se agrega la dosis a través del endpoint
      postData("drogaxdosis", dataEnviar)
        .then((response) => {
          if (response.status == 201) {
            response.json().then((responseDetalles) => {
              alert(responseDetalles.detail);
              getData("droga?pastillero=" + this.state.pastillero.id).then(
                (responseDrogas) => {
                  responseDrogas.json().then((responseDrogasDetalles) => {
                    this.procesarDrogas(
                      responseDrogasDetalles.drogas,
                      this.state.pastillero
                    );
                    this.setState({
                      loader: { encendido: false },
                      drogaSeleccionada: null,
                      horarioSeleccionado: null,
                    });
                  });
                }
              );
            });
          } else {
            // Si el request da un error de login, sale
            response.json().then((responseDetalles) => {
              alert(responseDetalles.detail);
              this.signOut();
            });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    });
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

    // Una vez que define cuál es el pastillero seleccionado
    // busca las drogas correspondientes en la API
    getData("droga?pastillero=" + pastilleroId)
      .then((respuesta) => {
        respuesta.json().then((drogas) => {
          this.setState({ drogas: drogas.drogas }, () => {
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
      this.setState({ userInfo: this.props.location.state.userInfo });
    } else {
      // Sino, los va a buscar al servidor
      // Va a buscar los datos del usuario
      getData("usuario")
        .then((response_usuario) => {
          if (response_usuario.status == 200) {
            response_usuario.json().then((respuesta_usuario) => {
              // Guarda la información del usuario
              this.setState({ userInfo: respuesta_usuario });
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
            {this.state && !this.state.loader.encendido && (
              <>
                <h1>Agrega droga a tus dosis</h1>
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
                    <div className="nav-icon nav-icon-check"></div>
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
