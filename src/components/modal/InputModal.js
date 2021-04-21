import React, { useRef } from "react";
import Select from "react-select";

export default function InputModal(props) {
  // Cuando cambia el campo actualiza en el padre
  function campoEditado() {
    var data = {
      etiqueta: props.etiqueta,
      value: campoRef.current.value,
    };
    props.cambioInput(data);
  }

  function campoEditadoSelect(seleccion) {
    var data = { etiqueta: props.etiqueta, value: seleccion.value };

    props.cambioInput(data);
  }

  const campoRef = useRef(null);

  return (
    <div>
      {props.etiqueta && (
        <span className="single-line">
          {" "}
          {props.etiqueta}
          {props.obligatorio ? "*" : ""}:{" "}
        </span>
      )}
      {props.tipo === "texto" && (
        <input
          name={props.nombre}
          type="text"
          ref={campoRef}
          className="pretty-input pretty-text"
          defaultValue={props.value}
          onChange={campoEditado}
        />
      )}
      {props.tipo === "password" && (
        <input
          name={props.nombre}
          type="password"
          ref={campoRef}
          className="pretty-input pretty-text"
          defaultValue={props.value}
          onChange={campoEditado}
        />
      )}
      {props.tipo === "select" && (
        <Select
          className="pretty-input"
          onChange={campoEditadoSelect}
          options={props.opciones}
          defaultValue={props.seleccionado}
        />
      )}
    </div>
  );
}
