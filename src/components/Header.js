import React from "react";

const Header = (props) => {
  return (
    <div className={"header"}>
      <div className={"logo"} />
      {props.nombreCompleto && (
        <div className={"saludo"}>Hola {props.nombreCompleto}</div>
      )}
    </div>
  );
};

export default Header;
