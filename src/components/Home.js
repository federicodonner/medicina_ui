import React from "react";
import Header from "./Header";
import { verifyLogin, fetchDosis } from "../fetchFunctions";

class Home extends React.Component {
  state: {
    user_info: {},
  };

  navigateToSection = (section) => (event) => {
    event.preventDefault();
    this.props.history.push({
      pathname: section,
    });
  };

  signOut = (event) => {
    event.preventDefault();
    localStorage.clear();
    this.props.history.push({ pathname: "/companyselect" });
  };

  componentDidMount() {
    // Verifica si el usuario ya seleccionó el pastillero
    const user_info = verifyLogin();
    if (user_info && user_info.pastillero) {
      // Si la tiene, la guarda en el estado
      this.setState({ user_info }, function () {});
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
            <div className="nav-buttons">
              <div
                className="nav-button"
                onClick={this.navigateToSection("verDosis")}
              >
                <div className="nav-icon nav-icon-ver-dosis"></div>
                <span className="single-line">ver</span>
                <span>mis dosis</span>
              </div>
              <div
                className="nav-button"
                onClick={this.navigateToSection("editarDosis")}
              >
                <div className="nav-icon nav-icon-editar-dosis"></div>
                <span className="single-line">editar</span>
                <span>mis dosis</span>
              </div>
              <div className="nav-button">
                <div className="nav-icon nav-icon-consultar-stock"></div>
                <span className="single-line">consultar</span>
                <span>stock</span>
              </div>
              <div
                className="nav-button"
                onClick={this.navigateToSection("ingresarCompra")}
              >
                <div className="nav-icon nav-icon-ingresar-compra"></div>
                <span className="single-line">ingresar</span>
                <span>compra</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
