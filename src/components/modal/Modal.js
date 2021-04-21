/*
Componente modal para usar en cualquier sección. Recibe la siguiente configuración:
defaultButtons (boolean): en true los botones del modal son cancel y confirm. En false se deben especificar los botones a usar.
mostrarModal (boolean): muestra o esconde el modal
cerrarModal (funcion): callback al presionar el botón "cancelar"
titulo (string): título en el modal
submitModal (funcion): callback al presionar "aceptar"
campos (array): campos del modal con los siguientes parámetros:
  tipo (string): "texto", "password" o "select" soportados
  etiqueta (string): nombre del campo para mostrar en la interfaz
  nombre (string): nombre del campo para enviar en el request
  obligatorio (boolean): indica si se debe completar el campo
  opciones (array): sólo para tipo select, las opciones. Los objetos del array deben ser {label:"string", value:int}
  seleccionado (objeto): sólo para tipo select, la opción por defecto. El objeto debe ser {label:"string, value:int"}
  value (string): sólo para tipo texto, valor inicial
  regexValidate (RegExp): expresión regular contra la que validar el campo antes de submit
navButtons (array): configuración de botones en caso de defaultButtons en false. Array de objetos con la siguiente estructura:
  textoArriba (string): primera línea del texto del botón
  textoAbajo (string): segunda línea del texto del botón
  esCerrar (boolean): indica si el botón es el de cancelar. Invoca a cerrarModal al presionarlo
  esAceptar (boolean): indica si el botón es el de aceptar. Invoca a submitModal al presionarlo
  funcion (funcion): función invocada al presionarlo. Debe tener esCerrar y esAceptar en false
  tipo (string): nombre de la clase correspondiente al ícono
*/

import React, { useEffect, useState } from "react";
import InputModal from "./InputModal";
import "./modal.css";

export default function Modal(props) {
  const [mostrarModal, setMostrarModal] = useState(false);

  const [campos, setCampos] = useState(null);
  const [navButtons, setNavButtons] = useState(null);

  useEffect(() => {
    // Recibe la información del componente padre
    var campos = props.campos;
    // Le asigna un número único a cada campo
    var cuenta = 0;
    campos.forEach((campo) => {
      campo.key = cuenta;
      cuenta++;
      // Para los campos select, marca el default como seleccionado
      if (campo.tipo === "select") {
        campo.value = campo.seleccionado.value;
      }
    });
    if (props.navButtons && !props.defaultNavButtons) {
      var navButtons = props.navButtons;
      navButtons.forEach((boton) => {
        boton.key = cuenta;
        cuenta++;
      });
    }
    // Guarda los campos en el state
    // Se cambia mostrarModal como callback para que demore un instante
    // y se muestre la animación de apertura
    // this.setState({ campos: this.props.campos }, () => {
    //   this.setState({ mostrarModal: true });
    // });
    setCampos(campos);
    setNavButtons(navButtons);

    setTimeout(() => {
      setMostrarModal(true);
    }, 100);
  }, []);

  // callback ejecutado cuando cambia algún campo
  function cambioInput(data) {
    // Recorre todos los campos buscando el editado
    campos.forEach((campo) => {
      // Cuando lo encuentra, actualiza los datos
      if (campo.etiqueta === data.etiqueta) {
        campo.value = data.value;
      }
    });
    setCampos(campos);
  }

  // Función ejecutada cuando se acepta el modal
  function submitModal() {
    // Recorre todos los campos verificando que los obligatorios estén completos
    // Si alguno tiene un regex para verificar, lo hace
    var camposCompletos = true;
    var datos = {};
    campos.forEach((campo) => {
      if (campo.obligatorio && !campo.value) {
        camposCompletos = false;
      }
      if (campo.regexValidate && !campo.regexValidate.test(campo.value)) {
        camposCompletos = false;
      }
      datos[campo.nombre] = campo.value;
    });

    if (camposCompletos) {
      props.submitModal(datos);
    } else {
      alert(
        "Verifica los campos. Es posible que no hayas copmletado todos los obligatorios o que el formato de alguno sea incorrecto."
      );
    }
  }

  // Función ejecutada al cerrar el modal
  // Primero cambia el flag en state para mostrar la animación
  // después llama al callback del padre
  function cerrarModal() {
    setMostrarModal(false);
    setTimeout(() => {
      props.cerrarModal();
    }, 700);
  }

  return (
    <>
      <div
        className={"modal-cover " + (mostrarModal ? "show" : "hidden")}
        onClick={cerrarModal}
      />
      <div className={"modal " + (mostrarModal ? "show" : "")}>
        <h1>{props.titulo}</h1>

        {campos &&
          campos.map((campo) => {
            return (
              <InputModal
                key={campo.key}
                etiqueta={campo.etiqueta}
                value={campo.value}
                tipo={campo.tipo}
                opciones={campo.opciones}
                seleccionado={campo.seleccionado}
                cambioInput={cambioInput}
                obligatorio={campo.obligatorio}
              />
            );
          })}

        {props.defaultNavButtons && (
          <div className="nav-buttons">
            <div className="nav-button" onClick={cerrarModal}>
              <div className="nav-icon chico nav-icon-cross"></div>
              <span className="single-line">cancelar</span>
            </div>
            <div className="nav-button" onClick={submitModal}>
              <div className="nav-icon chico nav-icon-check"></div>
              <span className="single-line">guardar</span>
            </div>
          </div>
        )}
        {navButtons && !props.defaultNavButtons && (
          <div
            className={
              navButtons.length % 3 === 0 ? "nav-buttons tres" : "nav-buttons"
            }
          >
            {navButtons.map((boton) => {
              return (
                <div
                  className="nav-button"
                  onClick={
                    boton.esCerrar
                      ? cerrarModal
                      : boton.esAceptar
                      ? submitModal
                      : boton.funcion
                  }
                  key={boton.key}
                >
                  <div className={"chico nav-icon " + boton.tipo}></div>
                  <span className="single-line">{boton.textoArriba}</span>
                  <span>{boton.textoAbajo}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
