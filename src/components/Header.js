import React from "react";

const Header = (props) => {
  return (
    <div className={props.logoChico ? "header chico" : "header"}>
      <div className={props.logoChico ? "logo chico" : "logo"} />
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
