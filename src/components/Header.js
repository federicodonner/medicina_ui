import React from "react";

const Header = (props) => {
  return (
    <div className={"header"}>
      <a href="/">
        <div className={"logo"} />
      </a>
      {props.nombreCompleto && (
        <div className={"saludo"}>Hola {props.nombreCompleto}.</div>
      )}
    </div>
  );
};

export default Header;
