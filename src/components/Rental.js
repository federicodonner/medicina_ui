import React from "react";
import Header from "./Header";
import { verifyLogin, fetchBook, rentBook } from "../fetchFunctions";

class Rental extends React.Component {
  state: {
    loading: false,
    user: {},
    book: {}
  };

  return = event => {
    event.preventDefault();
    this.props.history.push({
      pathname: "/"
    });
  };

  rentBook = event => {
    // Stop form from submitting
    event.preventDefault();

    const data = {
      id_libro: this.state.book.id,
      id_usuario: this.state.user.user_id
    };

    this.setState({ loading: true });
    rentBook(data, this.state.user.token)
      .then(res => res.json())
      .then(
        function(respuesta) {
          if (respuesta.status == "success") {
            this.props.history.push({
              pathname: "/"
            });
          } else {
            alert("Ocurrió un error, intenta nuevamente más tarde.");
          }
        }.bind(this)
      );
  };

  componentDidMount() {
    this.setState({ loading: true });

    // Verify if the user has logged in before
    const user = verifyLogin();
    if (user) {
      // If it has, store the information in state
      this.setState({ user }, function() {
        fetchBook(this.state.user.token, this.props.match.params.id)
          .then(res => res.json())
          .then(book =>
            this.setState({ book }, function() {
              this.setState({ loading: false });
            })
          );
      });
    } else {
      // If there is no data in localStorage, go back to user select screen
      // this.props.history.push(`/userselect`);
      this.props.history.push({
        pathname: "/userselect"
      });
    }
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          {this.state && this.state.user && (
            <Header
              withGradient={false}
              withGreeting={true}
              username={this.state.user.username}
            />
          )}
          <div className="content">
            <div>
              {this.state && this.state.loading && (
                <p>
                  <img src="/images/loader.gif" />
                </p>
              )}
              {this.state && !this.state.loading && (
                <>
                  {this.state.book &&
                    !this.state.book.alquilerActivo &&
                    !this.state.book.usuarioTieneAlquiler && (
                      <>
                        <p>
                          Asegurate de que {this.state.book.titulo} está
                          disponible en la estantería de tu organización. En
                          caso de que esté puedes confirmar el alquiler debajo.
                        </p>
                        <p>
                          Recuerda respetar los libros que te lleves cuidándolos
                          como si fueran tuyos. Si terminaste de leerlo o
                          decidisite no seguir, por favor recordá devolverlo
                          rápidamente. Cuando lo devuelvas puedes cancelar el
                          alquiler desde la app.
                        </p>
                        <p>
                          <a onClick={this.rentBook}>Confirmar alquiler</a>
                        </p>
                        <p>
                          En caso de que no encuentres el libro en la
                          estantería, puedes hablar con{" "}
                          {this.state.book.usr_dueno_nombre}.
                        </p>
                        <p>
                          <a onClick={this.return}>Cancelar</a>
                        </p>
                      </>
                    )}
                  {this.state.book && this.state.book.usuarioTieneAlquiler && (
                    <>
                      <p>
                        {" "}
                        No sabemos cómo llegaste a esta página, parece que tenés
                        un libro alquilado en este momento. Libroclub no permite
                        que un usuario tenga varios libros alquilados
                        simultáneamente.
                      </p>
                      <p>
                        Para devolver el libro, vuelve a la página principal y
                        ahí tendrás instrucciones.
                      </p>
                      <p>
                        <a onClick={this.return}>Volver</a>
                      </p>
                    </>
                  )}
                  {this.state.book && this.state.book.alquilerActivo && (
                    <>
                      <p>
                        {" "}
                        No sabemos cómo llegaste a esta página, parece que{" "}
                        {this.state.book.titulo} está alquilado, lo tiene{" "}
                        {this.state.book.alquilerActivo.nombre}. Si querés
                        llevártelo podés pedirle que lo devuelva y luego
                        alquilarlo.
                      </p>
                      <p>
                        {" "}
                        Tal vez {this.state.book.alquilerActivo.nombre} olvidó
                        registrar la devolución en la app.
                      </p>
                      <p>
                        <a onClick={this.return}>Volver</a>
                      </p>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Rental;
