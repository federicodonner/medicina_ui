import React from "react";
import Header from "./Header";
import { verifyLogin, fetchStock, processStock } from "../fetchFunctions";
import { getCurrentDatePlus } from "../dataFunctions";

class DescontarStock extends React.Component {
  state: {
    user_info: {},
    loader: true,
    stock: [],
    mensajeLoader: "",
  };

  // Función que llama al endpoint para descontar el stock
  armarPastillero = () => (event) => {
    event.preventDefault();
    // Genera el array para guardar las drogas para las que no tiene suficiente stock
    var drogasFaltaStock = [];
    var mensajeConfirmacion = "";

    // Recorre todas las drogas buscando las que no tiene suficiente stock
    // si encuentra alguna la guarda en el array
    this.state.stock.forEach((droga) => {
      if (droga.dosis_semanal > 0 && droga.dias_disponible < 7) {
        drogasFaltaStock.push(droga.nombre);
      }
    });

    // Si hay drogas cargadas en el array, le pregunto al usuario si quiere continuar
    if (drogasFaltaStock.length) {
      mensajeConfirmacion =
        "No tiene suficiente stock de los siguientes medicamentos: " +
        drogasFaltaStock.join(", ") +
        ". Presione OK para continuar con el armado del pastillero de cualquier manera.";
    } else {
      mensajeConfirmacion =
        "Presione OK para descontar el stock correspondiente a esta semana.";
    }
    if (window.confirm(mensajeConfirmacion)) {
      // Estoy aquí si el cliente presionó OK a la alerta
      // Si todos los datos están correctos, se enciende el loader
      this.setState({
        loader: true,
        mensajeLoader: "Procesando pastillero...",
      });

      // Procesa el pastillero a través del endpoint
      processStock({ pastillero: this.state.user_info.pastillero }).then(
        function () {
          alert("Stock actualizado correctamente");
          this.props.history.push({
            pathname: "/verStock",
          });
          // ACÁ VA EL CÓDIGO PARA REFRESCAR LA PÁGINA Y CONFIRMAR LA CREACIÓN DEL PASTILLERO
        }.bind(this)
      );
    }
  };

  componentDidMount() {
    this.setState({ loader: true });
    // Verifica si el usuario ya seleccionó el pastillero
    const user_info = verifyLogin();
    if (user_info && user_info.pastillero) {
      // Si la tiene, la guarda en el estado
      this.setState({ user_info }, function () {
        fetchStock(user_info.pastillero)
          .then((results) => {
            return results.json();
          })
          .then((response) => {
            this.setState({ stock: response.drogas, loader: false });
          });
      });
    } else {
      // Si no hay data en localstorage, va a la pantalla de selección de pastillero
      this.props.history.push({
        pathname: "/seleccionarPastillero",
      });
    }
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          {this.state && this.state.user_info && <Header />}
          <div className="content">
            {this.state && this.state.loader && (
              <p>
                <img className="loader" src="/images/loader.svg" />
                <span className="single-line">{this.state.mensajeLoader}</span>
              </p>
            )}
            {this.state && !this.state.loader && (
              <>
                <p>
                  Armado del pastillero de la semana del {getCurrentDatePlus(0)}{" "}
                  al {getCurrentDatePlus(7)}.
                </p>

                <p>Se descontarán:</p>
                {this.state && this.state.stock && (
                  <ul className="dosis-armado-pastillero">
                    {this.state.stock.map((droga) => {
                      if (droga.dosis_semanal > 0) {
                        return (
                          <li
                            key={"dosis" + droga.id}
                            className="dosis-armado-pastillero"
                          >
                            {droga.nombre} - {droga.dosis_semanal} mg
                            {droga.dias_disponible < 7 &&
                              droga.dias_disponible != 0 && (
                                <span className="notas-dosis">
                                  Atención: Stock para {droga.dias_disponible}{" "}
                                  días
                                </span>
                              )}
                            {droga.dias_disponible == 0 && (
                              <span className="notas-dosis rojo">
                                Atención: Sin stock
                              </span>
                            )}
                          </li>
                        );
                      }
                    })}
                  </ul>
                )}
                <div className="nav-buttons">
                  <div className="nav-button" onClick={this.armarPastillero()}>
                    <div className="nav-icon nav-icon-check"></div>
                    <span className="single-line">aceptar</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DescontarStock;
