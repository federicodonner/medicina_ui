import React from "react";
import Header from "./Header";
import {} from "../fetchFunctions";

class Footer extends React.Component {
  state = {};

  componentDidMount() {}

  render() {
    return (
      <div className="footer">
        {this.props.pastilleroSeleccionado && (
          <div>
            Estás viendo el pastillero de{" "}
            <span className="negrita" onClick={this.props.navegar}>
              {this.props.pastilleroSeleccionado.nombre}
            </span>
            .
          </div>
        )}
        {!this.props.pastilleroSeleccionado && (
          <div>
            Sin pastillero seleccionado.{" "}
            <span className="negrita" onClick={this.props.navegar}>
              Crear nuevo
            </span>
            .
          </div>
        )}
      </div>
    );
  }
}

export default Footer;
