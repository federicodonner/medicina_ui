/*
Componente modal para usar en cualquier sección. Recibe la siguiente configuración:
defaultButtons (boolean): en true los botones del modal son cancel y confirm. En false se deben especificar los botones a usar.
mostrarModal (boolean): muestra o esconde el modal
cerrarModal (funcion): callback al presionar el botón "cancelar"
titulo (string): título en el modal
submitModal (funcion): callback al presionar "aceptar"
campos (array): campos del modal con los siguientes parámetros:
  tipo (string): "select" o "texto" soportados por ahora
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

import React from "react";
import InputModal from "./InputModal";
import "./modal.css";

class Modal extends React.Component {
  state: {};

  // callback ejecutado cuando cambia algún campo
  cambioInput = (data) => {
    var campos = this.state.campos;
    // Recorre todos los campos buscando el editado
    campos.forEach((campo) => {
      // Cuando lo encuentra, actualiza los datos
      if (campo.etiqueta == data.etiqueta) {
        campo.value = data.value;
      }
    });
    this.setState({ campos });
  };

  // Función ejecutada cuando se acepta el modal
  submitModal = () => {
    // Recorre todos los campos verificando que los obligatorios estén completos
    // Si alguno tiene un regex para verificar, lo hace
    var camposCompletos = true;
    var campos = this.state.campos;
    var datos = {};
    this.state.campos.forEach((campo) => {
      if (campo.obligatorio && !campo.value) {
        camposCompletos = false;
      }
      if (campo.regexValidate && !campo.regexValidate.test(campo.value)) {
        camposCompletos = false;
      }
      datos[campo.nombre] = campo.value;
    });

    if (camposCompletos) {
      this.props.submitModal(datos);
    } else {
      alert(
        "Verifica los campos. Debes completar todos los obligatorios o el formato de alguno puede ser incorrecto."
      );
    }
  };

  // Función ejecutada al cerrar el modal
  // Primero cambia el flag en state para mostrar la animación
  // después llama al callback del padre
  cerrarModal = () => {
    this.setState({ mostrarModal: false });
    setTimeout(() => {
      this.props.cerrarModal();
    }, 700);
  };

  componentDidMount() {
    // Recibe la información del componente padre
    var campos = this.props.campos;
    // Le asigna un número único a cada campo
    var cuenta = 0;
    campos.forEach((campo) => {
      campo.key = cuenta;
      cuenta++;
      // Para los campos select, marca el default como seleccionado
      if (campo.tipo == "select") {
        campo.value = campo.seleccionado.value;
      }
    });
    if (this.props.navButtons && !this.props.defaultNavButtons) {
      var navButtons = this.props.navButtons;
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
    this.setState({ campos, navButtons });

    setTimeout(() => {
      this.setState({ mostrarModal: true });
    }, 100);
  }

  // prende el loader antes de cargar el componente
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <div
          className={
            "modal-cover " + (this.state.mostrarModal ? "show" : "hidden")
          }
          onClick={this.cerrarModal}
        />
        <div className={"modal " + (this.state.mostrarModal ? "show" : "")}>
          <h1>{this.props.titulo}</h1>

          {this.state &&
            this.state.campos &&
            this.state.campos.map((campo) => {
              return (
                <InputModal
                  key={campo.key}
                  etiqueta={campo.etiqueta}
                  value={campo.value}
                  tipo={campo.tipo}
                  opciones={campo.opciones}
                  seleccionado={campo.seleccionado}
                  cambioInput={this.cambioInput}
                />
              );
            })}

          {this.props.defaultNavButtons && (
            <div className="nav-buttons">
              <div className="nav-button" onClick={this.cerrarModal}>
                <div className="nav-icon chico nav-icon-cross"></div>
                <span className="single-line">cancelar</span>
              </div>
              <div className="nav-button" onClick={this.submitModal}>
                <div className="nav-icon chico nav-icon-check"></div>
                <span className="single-line">guardar</span>
              </div>
            </div>
          )}
          {this.state &&
            this.state.navButtons &&
            !this.props.defaultNavButtons && (
              <div
                className={
                  this.state.navButtons.length % 3 == 0
                    ? "nav-buttons tres"
                    : "nav-buttons"
                }
              >
                {this.props.navButtons.map((boton) => {
                  return (
                    <div
                      className="nav-button"
                      onClick={
                        boton.esCerrar
                          ? this.cerrarModal
                          : boton.esAceptar
                          ? this.submitModal
                          : boton.funcion
                      }
                      key={boton.key}
                    >
                      <div
                        className={"chico nav-icon" + " " + boton.tipo}
                      ></div>
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
}

export default Modal;
