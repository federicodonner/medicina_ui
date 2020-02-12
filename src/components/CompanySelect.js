import React from "react";
import Header from "./Header";
import { fetchCompanies, verifyLogin } from "../fetchFunctions";

class CompanySelect extends React.Component {
  state = {
    empresas: []
  };

  companySelect = companyId => event => {
    event.preventDefault();
    this.props.history.push({
      pathname: "/userSelect/" + companyId
    });
  };

  goToCredits = () => event => {
    event.preventDefault();
    this.props.history.push({
      pathname: "/credits"
    });
  };

  componentDidMount() {
    var user = verifyLogin();
    if (user) {
      this.props.history.push({
        pathname: "/"
      });
    }

    fetchCompanies()
      .then(results => {
        return results.json();
      })
      .then(response => {
        this.setState({ empresas: response.empresas });
      });
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          <Header withGradient={false} />
          <div className="content">
            {this.state && this.state.empresas.length == 0 && (
              <p>
                <img className="loader" src="/images/loader.gif" />
              </p>
            )}
            {this.state && this.state.empresas.length != 0 && (
              <>
                <p>¡Bienvenid@ a Libroclub!</p>
                <p>
                  No estás logueado en libroclub. Por favor seleccioná tu grupo:
                </p>
                <ul className="usuarios">
                  {this.state.empresas.map(obj => {
                    return (
                      <li key={obj.id}>
                        <a href="#" onClick={this.companySelect(obj.id)}>
                          {obj.nombre}
                        </a>
                      </li>
                    );
                  })}
                </ul>
                <p className="marginTop">
                  Quiero empezar a usar Libroclub con un grupo propio,{" "}
                  <span className="newLine">
                    <a onClick={this.goToCredits()}>¿cómo puedo hacer?</a>
                  </span>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default CompanySelect;
