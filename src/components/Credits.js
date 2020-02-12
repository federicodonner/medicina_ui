import React from "react";
import Header from "./Header";

class Credits extends React.Component {
  return = () => event => {
    event.preventDefault();
    this.props.history.goBack() || this.props.history.push('/');
  };

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          <Header withGradient={false} />
          <div className="content">
            <p>
              Creado por Federico Donner en base a una idea de Martin Silveira
              charlando con Daniel Marotta.
            </p>
            <p>
              Si querés empezar a usar Libroclub en tu empresa, departamento o
              grupo de amigos, enviá un mail a federico.donner@gmail.com.
            </p>
            <p>Gracias por usar Libroclub :)</p>
            <p>
              <a onClick={this.return()}>Volver</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Credits;
