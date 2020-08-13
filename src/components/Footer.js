import React from "react";
import Header from "./Header";
import { guardarEnLS } from "../fetchFunctions";
import variables from "../var/variables.js";

import * as Fitty from "fitty/dist/fitty.min";

class Footer extends React.Component {
  state = {};

  // Invierte el flag de agrandado para que aparezcan
  // el resto de las opciones
  toggleTamaño = (toggle) => (event) => {
    event.preventDefault();
    this.setState({ agrandado: toggle });
  };

  navegarANuevoPastillero = () => (event) => {
    this.props.navegarANuevoPastillero();
  };

  // Función ejecutada cuando se selecciona un pastillero nuevo
  // Actualiza el id en LS y ejecuta la función de home que lo actualiza en state
  seleccionPastillero = (event) => {
    var pastilleroParaLS = { id: event.target.value };
    guardarEnLS(
      variables.LSPastilleroPorDefecto,
      JSON.stringify(pastilleroParaLS)
    );
    this.props.procesarOtrosPastilleros();
    event.target.value = 0;
    // Cierra el modal
    this.setState({ agrandado: false });
  };

  componentDidMount() {
    Fitty(".fit", { maxSize: 22 });
    // Establece el flag de agrandado en false
    this.setState({ agrandado: false });
  }

  render() {
    return (
      <div className={this.state.agrandado ? "footer agrandado" : "footer"}>
        <div className="titulo-footer">
          {this.props.pastilleroActual && (
            <span className="fit" onClick={this.toggleTamaño(true)}>
              Pastillero de{" "}
              <span className="negrita">
                {this.props.pastilleroActual.paciente_apellido +
                  " " +
                  this.props.pastilleroActual.paciente_nombre}
              </span>
            </span>
          )}
          {!this.props.pastilleroActual && (
            <span className="fit" onClick={this.toggleTamaño(true)}>
              Sin pastillero. <span className="negrita">Selecciona uno</span>.
            </span>
          )}
        </div>
        <div className="modal-seleccion-pastillero">
          {this.props.otrosPastilleros.length > 0 && (
            <div>
              <p>Selecciona otro pastillero:</p>
              <select
                defaultValue="0"
                className="seleccion-pastillero"
                onChange={this.seleccionPastillero}
              >
                <option disabled value="0">
                  {" "}
                  -- Tus pastilleros --{" "}
                </option>
                {this.props.otrosPastilleros.map((pastillero) => {
                  return (
                    <option value={pastillero.id} key={pastillero.id}>
                      {pastillero.paciente_nombre +
                        " " +
                        pastillero.paciente_apellido}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
          {this.props.otrosPastilleros.length < 1 && (
            <div className="texto-sin-pastilleros-footer">
              <p>
                No tiene otros pastilleros, presiona{" "}
                <span
                  className="negrita"
                  onClick={this.navegarANuevoPastillero()}
                >
                  aquí
                </span>{" "}
                para crear uno nuevo.
              </p>
            </div>
          )}
          <span className="negrita" onClick={this.toggleTamaño(false)}>
            Cerrar
          </span>
        </div>
      </div>
    );
  }
}

export default Footer;
