import React from "react";
import "./header.css";

const Header = (props) => {
  return (
    <div className={props.logoChico ? "header chico" : "header"}>
      <div className={props.logoChico ? "logo chico" : "logo"} />
      {props.nombreCompleto && (
        <div className={"saludo"}>Hola {props.nombreCompleto}</div>
      )}
      {props.mostrarBotonVolver && (
        <div className="header-boton-volver" onClick={props.volver}>
          &larr; Volver
        </div>
      )}
      {props.mostrarBotonNotificaciones && (
        <div className="header-boton-notificaciones">
          <span className="con-notificacion" />
        </div>
      )}
    </div>
  );
};

export default Header;
