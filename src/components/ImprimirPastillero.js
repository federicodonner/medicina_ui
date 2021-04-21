import React from "react";
import {} from "../utils/fetchFunctions";
import { convertDate } from "../utils/dataFunctions";

class ImprimirPastillero extends React.Component {
  state: {
    user_info: {},
    loader: true,
    pastillero: {},
    fecha: "",
  };

  componentDidMount() {
    // this.setState({
    //   loader: true
    // });
    // // Verifica si el usuario ya seleccionó el pastillero
    // const user_info = verifyLogin();
    // if (user_info && user_info.pastillero) {
    //   // Si la tiene, la guarda en el estado
    //   this.setState(
    //     {
    //       user_info
    //     },
    //     function() {
    //       fetchDosis(user_info.pastillero)
    //         .then(results => {
    //           return results.json();
    //         })
    //         .then(response => {
    //           this.setState({
    //             pastillero: response
    //           });
    //           var timestamp = Math.round(new Date().getTime() / 1000);
    //           this.setState({
    //             fecha: convertDate(timestamp)
    //           });
    //           this.setState({
    //             loader: false
    //           });
    //         });
    //     }
    //   );
    // } else {
    //   // Si no hay data en localstorage, va a la pantalla de selección de pastillero
    //   this.props.history.push({
    //     pathname: "/seleccionarPastillero"
    //   });
    // }
  }

  render() {
    return (
      <div className="app-view cover no-background">
        {this.state && this.state.loader && (
          <p>
            <img className="loader" src="/images/loader.svg" />
          </p>
        )}
        {this.state && !this.state.loader && (
          <>
            {this.state && this.state.pastillero && (
              <>
                <h1>
                  Este es el pastillero de{" "}
                  <span className="negro">{this.state.pastillero.dueno}</span>{" "}
                  al <span className="negro">{this.state.fecha}</span>.
                </h1>
                <ul className="dosis-horario">
                  {this.state.pastillero.dosis.map((dosis) => {
                    return (
                      <li key={"dosis" + dosis.id} className="dosis-horario">
                        {dosis.horario}
                        <ul className="dosis-droga">
                          {dosis.drogas.map((droga) => {
                            return (
                              <li key={droga.id} className="dosis-droga">
                                {droga.nombre} - {droga.cantidad_mg} mg -{" "}
                                {droga.notas}
                              </li>
                            );
                          })}
                        </ul>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </>
        )}
      </div>
    );
  }
}

export default ImprimirPastillero;
