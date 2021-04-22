/* Configuración:
Recibe un objeto en props llamado configuracionMensaje. En ese objeto vienen los siguientes campos:
-- textoMensaje (string, obligatorio): texto que va a mostrar el mensaje.
-- tipoMensaje (string, opcional): indica el color de fondo del mensaje. Soportados: "alerta": amarillo, "error": rojo.
-- callbackOK (función, opcional): si lo recibe, muestra los botones de aceptar y cancelar. Al presionar aceptar, ejecuta la función. Si no lo recibe, el cartel desaparece solo a los 5 segundos. Si lo recibe, queda hasta que el usuario lo saque.
*/

import React, { useState, useEffect } from "react";
import "./mensajeAlerta.css";

export default function MensajeAlerta(props) {
  // Texto y color de fondo del mensaje
  const [textoMensaje, setTextoMensaje] = useState(null);
  const [tipoMensaje, setTipoMensaje] = useState("alerta");

  const [mostrarMensaje, setMostrarMensaje] = useState(false);

  useEffect(() => {
    // Si recibe un texto de mensaje desde props muestra el mensaje
    if (props.configuracionMensaje.textoMensaje) {
      setTipoMensaje(
        props.configuracionMensaje.tipoMensaje
          ? props.configuracionMensaje.tipoMensaje
          : "alerta"
      );
      // El resto de los props no tienen un condicional porque se guarda
      // null si viene null
      setTextoMensaje(props.configuracionMensaje.textoMensaje);
    }
  }, [props.configuracionMensaje]);

  // Cuando cambia el texto del mensaje se muestra el mensaje
  useEffect(() => {
    if (textoMensaje) {
      // Si no tengo callbacks, significa que el mensaje es informativo
      // Lo muestro y lo escondo
      setMostrarMensaje(true);
      if (!props.configuracionMensaje.callbackOK) {
        var timeoutMensaje = setTimeout(() => {
          limpiarMensaje();
        }, 5000);
      }
    }
    // Limpio el timeout por si el usuario saca el cartel prematuramente
    return () => {
      clearTimeout(timeoutMensaje);
    };
  }, [textoMensaje]);

  // Llama al useState de Main para limpiar el mensaje
  function limpiarMensaje() {
    setMostrarMensaje(false);
    setTextoMensaje(null);
    props.setConfiguracionMensaje({});
  }

  return (
    <>
      <div
        className={
          mostrarMensaje
            ? "alertarMensaje mostrar " + tipoMensaje
            : "alertarMensaje " + tipoMensaje
        }
        onClick={limpiarMensaje}
      >
        {textoMensaje}

        {props.configuracionMensaje.callbackOK && (
          <div className="nav-buttons mensaje">
            <div
              className="nav-button"
              onClick={() => {
                props.configuracionMensaje.callbackOK();
                limpiarMensaje();
              }}
            >
              <div className="nav-icon chico nav-icon-check"></div>
            </div>
            <div className="nav-button" onClick={limpiarMensaje}>
              <div className="nav-icon chico nav-icon-cross"></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
