import React from "react";
import "./header.css";

export default function Header(props) {
  return (
    <div className="header chico">
      <div className="logo chico" />
      {props.volver && (
        <div className="header-boton-volver" onClick={props.volver}>
          &larr; Volver
        </div>
      )}
      {props.cerrarSesion && (
        <div className="header-boton-cerrarsesion" onClick={props.cerrarSesion}>
          Cerrar sesión
        </div>
      )}
    </div>
  );
}
