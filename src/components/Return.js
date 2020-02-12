import React from "react";
import Header from "./Header";
import { verifyLogin, fetchBook, returnBook } from "../fetchFunctions";

class Return extends React.Component {
  state: {
    loading: false,
    partialLoading: false,
    bookReturned: false,
    user: {},
    book: {}
  };

  return = event => {
    event.preventDefault();
    this.props.history.push({
      pathname: "/"
    });
  };

  goToReview = event => {
    event.preventDefault();
    this.props.history.push({
      pathname: "/review/" + this.state.book.id
    });
  };

  returnBook = event => {
    // Stop form from submitting
    event.preventDefault();

    this.setState({ partialLoading: true });
    returnBook(this.state.book.id, this.state.user.token)
      .then(res => res.json())
      .then(
        function(respuesta) {
          if (respuesta.status == "success") {
            this.setState({ partialLoading: false });
            this.setState({ bookReturned: true });
          } else {
            alert("Ocurrió un error, intenta nuevamente más tarde.");
          }
        }.bind(this)
      );
  };

  componentDidMount() {
    this.setState({ loading: true });
    this.setState({ partialLoading: false });
    this.setState({ bookReturned: false });

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
                    this.state.book.alquilerActivo &&
                    this.state.book.usuarioTieneAlquiler && (
                      <>
                        <p>
                          Esperamos que hayas disfrutado de{" "}
                          {this.state.book.titulo}. Cuando te cruces a{" "}
                          {this.state.book.usr_dueno_nombre} podés agradecerle
                          por haberlo traído.
                        </p>
                        <p>Recordá devolverlo a la biblioteca.</p>
                        {!this.state.partialLoading &&
                          !this.state.bookReturned && (
                            <p>
                              <a onClick={this.returnBook}>
                                Confirmar devolución
                              </a>
                            </p>
                          )}
                        {!this.state.partialLoading && this.state.bookReturned && (
                          <>
                            <p>
                              Podés escribir una reseña para que el resto de los
                              usuarios sepan cuánto lo disfrutaste. Te va a
                              llevar sólo un segundo.
                            </p>
                            <p>
                              <a onClick={this.goToReview}>Escribir reseña</a>
                            </p>
                          </>
                        )}
                        {this.state.partialLoading && (
                          <p>
                            <img src="/images/loader.gif" />
                          </p>
                        )}
                        <p>
                          <a onClick={this.return}>Cancelar</a>
                        </p>
                      </>
                    )}
                  {this.state.book &&
                    (!this.state.book.usuarioTieneAlquiler ||
                      !this.state.book.alquilerActivo) && (
                      <>
                        <p>
                          No sabemos cómo llegaste a esta página, parece que no
                          tienes un libro alquilado o el libro que quieres
                          devolver ya está disponible. Presiona volver debajo
                          para volver a la página principal.
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

export default Return;
