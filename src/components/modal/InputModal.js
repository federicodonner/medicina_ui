import React from "react";
import Select from "react-select";

class InputModal extends React.Component {
  state: {};

  // Cuando cambia el campo actualiza en el padre
  campoEditado = (ev) => {
    var data = {
      etiqueta: this.props.etiqueta,
      value: this.campoRef.current.value,
    };
    this.props.cambioInput(data);
  };

  campoEditadoSelect = (seleccion) => {
    var data = { etiqueta: this.props.etiqueta, value: seleccion.value };

    this.props.cambioInput(data);
  };

  campoRef = React.createRef();

  componentDidMount() {
    // var props = this.props;
    // props.entries().forEach((key, value) => {
    //   console.log(key, value);
    // });
    // var props = this.props;
    // this.setState({ props });
  }

  // prende el loader antes de cargar el componente
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.etiqueta && (
          <span className="single-line"> {this.props.etiqueta}: </span>
        )}
        {this.props.tipo == "texto" && (
          <input
            name={this.props.nombre}
            type="text"
            ref={this.campoRef}
            className="pretty-input pretty-text"
            defaultValue={this.props.value}
            onChange={this.campoEditado}
          />
        )}
        {this.props.tipo == "select" && (
          <Select
            className="pretty-input"
            onChange={this.campoEditadoSelect}
            options={this.props.opciones}
            defaultValue={this.props.seleccionado}
          />
        )}
      </div>
    );
  }
}

export default InputModal;
