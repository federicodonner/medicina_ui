import React from "react";
import Header from "./Header";
import { fetchPastilleros, verifyLogin } from "../fetchFunctions";

class SeleccionarPastillero extends React.Component {
  state = {
    pastilleros: [],
    loader: true,
  };

  seleccionarPastillero = (pastilleroId) => (event) => {
    // Frena la navegación automática cuando se submitea el form
    event.preventDefault();

    // Prende el loader para que el usuario sepa que está procesando
    this.setState({ loader: true });

    localStorage.setItem("midosis_pastillero", pastilleroId);
    this.props.history.push({
      pathname: "/",
    });
  };

  componentDidMount() {
    this.setState({ loader: true });
    var user_info = verifyLogin();
    if (user_info && user_info.pastillero) {
      this.props.history.push({
        pathname: "/",
      });
    }

    fetchPastilleros()
      .then((results) => {
        return results.json();
      })
      .then((response) => {
        this.setState({ pastilleros: response.pastilleros, loader: false });
      });
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          <Header withGradient={false} />
          <div className="content">
            {this.state && this.state.loader && (
              <p>
                <img className="loader" src="/images/loader.svg" />
              </p>
            )}
            {this.state && !this.state.loader && (
              <>
                <p>¡Bienvenid@ a mi dosis</p>
                <p>Selecciona tu pastillero</p>
                <ul className="usuarios">
                  {this.state.pastilleros.map((obj) => {
                    return (
                      <li key={obj.id}>
                        <span onClick={this.seleccionarPastillero(obj.id)}>
                          {obj.dueno}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default SeleccionarPastillero;
