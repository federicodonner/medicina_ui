import React from "react";

const Header = (props) => {
  return (
    <div className={"header"}>
      <div className={"logo"} />
      {props.nombreCompleto && (
        <div className={"saludo"}>Hola {props.nombreCompleto}</div>
      )}
      {props.mostrarBotonVolver && (
        <div className="header-boton-volver" onClick={props.volverAHome}>
          &larr; Volver
        </div>
      )}
    </div>
  );
};

export default Header;
