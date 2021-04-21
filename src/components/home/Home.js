import React, { useEffect } from "react";
import "./home.css";

export default function Home(props) {
  // Cuando carga el componente le dice a Main que esconda el header
  useEffect(() => {
    props.setMostrarFooter(true);
  }, [props]);

  function navegarASeccion(section, data) {
    props.history.push({
      pathname: section,
    });
  }

  return (
    <>
      <div className="header">
        <div className="logo" />
        <div className={"saludo"}>
          Hola {props.userInfo.nombre + " " + props.userInfo.apellido}
        </div>
        <div
          className="header-boton-usuario"
          onClick={() => {
            navegarASeccion("usuario");
          }}
        ></div>
        <div className="header-boton-notificaciones">
          <span className="con-notificacion" />
        </div>
      </div>

      <div className="content">
        <div className="nav-buttons home">
          <div
            className="nav-button"
            onClick={() => {
              navegarASeccion("editarDroga");
            }}
          >
            <div className="nav-icon nav-icon-ver-dosis"></div>
            <span className="single-line">ver</span>
            <span>mis dosis</span>
          </div>
          <div
            className="nav-button"
            onClick={() => {
              navegarASeccion("verStock");
            }}
          >
            <div className="nav-icon nav-icon-consultar-stock"></div>
            <span className="single-line">consultar</span>
            <span>stock</span>
          </div>
          <div
            className="nav-button"
            onClick={() => {
              navegarASeccion("ingresarCompra");
            }}
          >
            <div className="nav-icon nav-icon-ingresar-compra"></div>
            <span className="single-line">ingresar</span>
            <span>compra</span>
          </div>
        </div>
      </div>
    </>
  );
}
