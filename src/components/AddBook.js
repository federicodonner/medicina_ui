import React from "react";
import Header from "./Header";
import { verifyLogin, addBook } from "../fetchFunctions";

class AddBook extends React.Component {
  state: {
    loading: false,
    user: {},
    response: {},
    bookAdded: false
  };

  navigateBack = () => event => {
    event.preventDefault();
    console.log(this.props.history);
    this.props.history.goBack();
  };

  resetState = () => event => {
    event.preventDefault();
    this.setState({
      loading: false,
      response: {},
      bookAdded: false
    });
  };

  titleRef = React.createRef();
  authorRef = React.createRef();
  summaryRef = React.createRef();
  yearRef = React.createRef();
  languageRef = React.createRef();

  addBook = event => {
    // Stop form from submitting
    event.preventDefault();
    const book = {
      titulo: this.titleRef.current.value,
      autor: this.authorRef.current.value,
      resumen: this.summaryRef.current.value,
      ano: this.yearRef.current.value,
      idioma: this.languageRef.current.value
    };
    this.setState({ loading: true });

    event.currentTarget.reset();
    addBook(book, this.state.user.user_id, this.state.user.token)
      .then(res => res.json())
      .then(
        function(respuesta) {
          if (respuesta.status == "success") {
            this.setState({
              response: { addSuccessful: true, bookTitle: book.titulo },
              bookAdded: true,
              loading: false
            });
          } else {
            this.setState({
              response: { addSuccessful: false },
              bookAdded: true,
              loading: false
            });
          }
        }.bind(this)
      );
  };

  componentDidMount() {
    this.setState({ loading: false });
    const user = verifyLogin();
    if (user) {
      this.setState({ user });
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
            {this.state && !this.state.user && (
              <p>
                <img className="loader" src="/images/loader.gif" />
              </p>
            )}
            {this.state && this.state.user && (
              <>
                <p>
                  Ingresá un libro para que los demás disfruten.Todos los campos
                  son obligatorios, intentá completar la mayor cantidad posible.
                </p>

                {this.state && this.state.loading && (
                  <p>
                    <img src="/images/loader.gif" />
                  </p>
                )}
                {this.state && !this.state.loading && !this.state.bookAdded && (
                  <>
                    <form className="pretty-form" onSubmit={this.addBook}>
                      <span className="form-input">
                        <span class='label'>Titulo:</span>
                        <input
                          name="nombre"
                          type="text"
                          ref={this.titleRef}
                          className="pretty-input"
                        />
                      </span>
                      <span className="form-input">
                        <span class='label'>Autor:</span>
                        <input
                          name="autor"
                          type="text"
                          ref={this.authorRef}
                          className="pretty-input"
                        />
                      </span>
                      <span className="form-input">
                        <span class='label'>Resumen:</span>
                        <textarea
                          name="resumen"
                          type="text"
                          ref={this.summaryRef}
                          className="pretty-input"
                          rows="4"
                        />
                      </span>
                      <span className="form-input">
                        <span class='label'>Año:</span>
                        <input
                          name="ano"
                          type="text"
                          ref={this.yearRef}
                          className="pretty-input"
                        />
                      </span>
                      <span className="form-input">
                        <span class='label'>Idioma:</span>
                        <input
                          name="idioma"
                          type="text"
                          ref={this.languageRef}
                          className="pretty-input"
                        />
                      </span>
                      <button className="pretty-submit" type="submit">
                        Agregar libro
                      </button>
                    </form>
                    <p>
                      <a onClick={this.navigateBack()}>Cancelar</a>
                    </p>
                  </>
                )}
              </>
            )}
            {this.state &&
              this.state.bookAdded &&
              this.state.response.addSuccessful && (
                <>
                  <p>
                    {this.state.response.bookTitle} fue agregado exitosamente.
                  </p>
                  <p>
                    <a onClick={this.navigateBack()}>Volver</a>
                  </p>
                  <p>
                    <a onClick={this.resetState()}>Agregar otro</a>
                  </p>
                </>
              )}
            {this.state &&
              this.state.bookAdded &&
              !this.state.response.addSuccessful && (
                <>
                  <p>
                    Ocurrió un error al agregar el libro. Te pedimos disculpas,
                    intentalo nuevamente más tarde.
                  </p>
                  <p>
                    <a>Volver</a>
                  </p>
                </>
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default AddBook;
