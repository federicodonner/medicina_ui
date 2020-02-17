import React from "react";
import Header from "./Header";
import BookName from "./BookName";
import UserName from "./UserName";
import { verifyLogin, fetchDosis, fetchDroga } from "../fetchFunctions";

class AgregarDroga extends React.Component {
  state: {
    user_info: {},
    loader: true,
    pastillero: {},
    drogas: [],
    suggestions: [],
    value: ""
  };

  navigateToSection = section => event => {
    event.preventDefault();
    this.props.history.push({
      pathname: section
    });
  };

  componentDidMount() {
    this.setState({ loader: true });
    // Verifica si el usuario ya seleccionó el pastillero
    const user_info = verifyLogin();
    if (user_info && user_info.pastillero) {
      // Si la tiene, la guarda en el estado
      this.setState({ user_info }, function() {
        fetchDosis(user_info.pastillero)
          .then(results => {
            return results.json();
          })
          .then(response => {
            this.setState({ pastillero: response });
            fetchDroga()
              .then(results => {
                return results.json();
              })
              .then(response => {
                this.setState({ drogas: response });
                this.setState({ loader: false });
              });
          });
      });
    } else {
      // Si no hay data en localstorage, va a la pantalla de selección de pastillero
      this.props.history.push({
        pathname: "/seleccionarPastillero"
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
              </p>
            )}
            {this.state && !this.state.loader && (
              <>
                <h1>Agregar droga a tus dosis</h1>
                <p>Escribe la droga, puedes seleccionarla de las sugerencias</p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default AgregarDroga;
