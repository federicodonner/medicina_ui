import React from "react";
import Header from "./Header";
import UserName from "./UserName";
import {
  verifyLogin,
  fetchBook,
  enableBook,
  getBookCover
} from "../fetchFunctions";

class Book extends React.Component {
  state: {
    user: {},
    book: {},
    loading: true,
    cover: ""
  };

  writeReview = event => {
    event.preventDefault();

    this.props.history.push({
      pathname: "/review/" + this.props.match.params.id
    });
  };

  rentBook = event => {
    event.preventDefault();
    this.props.history.push({
      pathname: "/rental/" + this.state.book.id
    });
  };

  // Enable or disable the book
  // Enable is a boolean that indicates if the book has to be enabled
  // or disabled in the db
  sendEnableBook = (enable, book_id) => event => {
    event.preventDefault();
    const loading = true;
    this.setState({ loading });
    enableBook(enable, book_id, this.state.user.token)
      .then(res => res.json())
      .then(
        function(response) {
          // if the query is successful, modify the status of the book in status
          if (response.status == "success") {
            const book = this.state.book;
            enable ? (book.activo = "1") : (book.activo = "0");

            this.setState(
              { book },
              function() {
                const loading = false;
                this.setState({ loading });
              }.bind(this)
            );
          } else {
            alert("Hubo un error, inténtalo denuevo más tarde");
            const loading = false;
            this.setState({ loading });
          }
        }.bind(this)
      );
  };

  componentDidMount() {
    // Verify if the user has logged in before
    const loading = true;
    this.setState({ loading });
    const user = verifyLogin();
    if (user) {
      // If it has, store the information in state
      this.setState({ user }, function() {
        fetchBook(this.state.user.token, this.props.match.params.id)
          .then(res => res.json())
          .then(book =>
            this.setState(
              { book },
              function() {
                const loading = false;
                this.setState({ loading });
                // Get the book cover image
                getBookCover(
                  this.state.book.titulo + " " + this.state.book.autor
                )
                  .then(res => res.json())
                  .then(response =>
                    this.setState({ cover: response.items[0].link })
                  );
              }.bind(this)
            )
          );
      });

      // this.setState({ user }, function() {
      //   // Fetch the rest of the user information
      //   fetchActiveUser(this.state.user.token)
      //     .then(res => res.json())
      //     .then(activeUser => this.setState({ activeUser }, function() {}));
      //   // Load the available books
      //   fetchBooks(this.state.user.token, "true")
      //     .then(res => res.json())
      //     .then(availableBooks => this.setState({ availableBooks }));
      // });
    } else {
      // If there is no data in localStorage, go back to user select screen
      // this.props.history.push(`/userselect`);
      this.props.history.push({
        pathname: "/userselect"
        //state: { prueba: "hoooola" }
      });
    }

    //getBookCover('daniel pink drive').then(res => res.json()).then(response => console.log(response.items[0].pagemap.scrapped[0].image_link));
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          {this.state && this.state.user && (
            <Header
              logoType="blackLogo"
              withGreeting={true}
              username={this.state.user.username}
            />
          )}
          <div className="content">
            {this.state && (!this.state.book || this.state.loading) && (
              <p>
                <img className="loader" src="/images/loader.gif" />
              </p>
            )}
            {this.state && this.state.book && !this.state.loading && (
              <>
                <p>
                  {this.state.book.titulo} - {this.state.book.autor} -{" "}
                  {this.state.book.ano}
                  {this.state &&
                    this.state.user &&
                    this.state.book &&
                    this.state.book.usr_dueno != this.state.user.user_id && (
                      <span className="newLine">
                        Lo trajo{" "}
                        <UserName
                          id={this.state.book.usr_dueno}
                          name={this.state.book.usr_dueno_nombre}
                          navigation={this.props.history}
                        />
                      </span>
                    )}
                </p>

                <img className="bookCover" src={this.state.cover} />

                <p>{this.state.book.resumen}</p>

                {this.state &&
                  this.state.book &&
                  !this.state.book.alquilerActivo &&
                  this.state.book.usr_dueno != this.state.user.user_id &&
                  !this.state.book.usuarioTieneAlquiler && (
                    <>
                      <img className="separador" src="/images/separador.png" />
                      <p>
                        Este libro está disponible,{" "}
                        <a onClick={this.rentBook}>¡llevátelo!</a>
                      </p>
                    </>
                  )}
                {this.state &&
                  this.state.book &&
                  this.state.book.alquilerActivo &&
                  this.state.book.alquilerActivo.id_usuario !=
                    this.state.user.user_id && (
                    <>
                      <img className="separador" src="/images/separador.png" />
                      <p>
                        Este libro no está disponible, lo tiene{" "}
                        <UserName
                          id={this.state.book.alquilerActivo.id_usuario}
                          name={this.state.book.alquilerActivo.nombre}
                          navigation={this.props.history}
                        />
                        .
                      </p>
                    </>
                  )}
                {this.state &&
                  this.state.book &&
                  this.state.book.alquilerActivo &&
                  this.state.book.alquilerActivo.id_usuario ==
                    this.state.user.user_id && (
                    <>
                      <img className="separador" src="/images/separador.png" />
                      <p>
                        Este libro no está disponible, lo tenés vos. Si ya lo
                        devolviste <a>clickeá aqui</a>
                      </p>
                    </>
                  )}

                {this.state &&
                  this.state.book &&
                  !this.state.book.alquilerActivo &&
                  this.state.book.activo == "1" &&
                  this.state.book.usr_dueno == this.state.user.user_id && (
                    <>
                      <img className="separador" src="/images/separador.png" />
                      <p>
                        Este libro es tuyo y está disponible.
                        <span className="newLine">
                          <a
                            onClick={this.sendEnableBook(
                              false,
                              this.state.book.id
                            )}
                          >
                            Quiero sacarlo de libroclub.
                          </a>
                        </span>
                      </p>
                    </>
                  )}

                {this.state &&
                  this.state.book &&
                  !this.state.book.alquilerActivo &&
                  this.state.book.activo == "0" &&
                  this.state.book.usr_dueno == this.state.user.user_id && (
                    <>
                      <img className="separador" src="/images/separador.png" />
                      <p>
                        Este libro es tuyo y está disponible pero lo retiraste
                        de Libroclub.
                        <span className="newLine">
                          <a
                            onClick={this.sendEnableBook(
                              true,
                              this.state.book.id
                            )}
                          >
                            Volver a traerlo.
                          </a>
                        </span>
                      </p>
                    </>
                  )}
                <img className="separador" src="/images/separador.png" />
                <ul className="libros">
                  {this.state.book.reviews.map(obj => {
                    return (
                      <li key={obj.id}>
                        <p>
                          <UserName
                            id={obj.id_usuario}
                            name={obj.nombre}
                            navigation={this.props.history}
                          />{" "}
                          le dio {obj.estrellas} estrellas y dijo:
                          <span className="newLine">"{obj.texto}"</span>
                        </p>
                      </li>
                    );
                  })}
                </ul>
                {this.state &&
                  this.state.book &&
                  !this.state.book.reviewDelUsuario && (
                    <p>
                      Si lo leíste,{" "}
                      <a onClick={this.writeReview}>escribí una reseña</a>
                    </p>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Book;
