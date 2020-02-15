import React from "react";
import Header from "./Header";
import BookName from "./BookName";
import UserName from "./UserName";
import { verifyLogin, fetchActiveUser, fetchBooks } from "../fetchFunctions";
import { convertDate } from "../dataFunctions";

class Home extends React.Component {
  state: {
    user_info: {},
    activeUser: {},
    availableBooks: {}
  };

  goToAddBook = () => event => {
    event.preventDefault();
    this.props.history.push({
      pathname: "/addbook"
    });
  };

  goToPersonalDetails = event => {
    event.preventDefault();
    this.props.history.push({
      pathname: "/me"
    });
  };

  goToReturnBook = event => {
    event.preventDefault();
    this.props.history.push({
      pathname: "/return/" + this.state.activeUser.alquilerActivo.id_libro
    });
  };

  signOut = event => {
    event.preventDefault();
    localStorage.clear();
    this.props.history.push({ pathname: "/companyselect" });
  };

  componentDidMount() {
    // Verifica si el usuario ya seleccionó el pastillero
    const user_info = verifyLogin();
    if (user_info && user_info.pastillero) {
      // If it has, store the information in state
      this.setState({ user_info }, function() {
      //   // Fetch the rest of the user information
      //   fetchActiveUser(this.state.user.token)
      //     .then(res => res.json())
      //     .then(activeUser => this.setState({ activeUser }, function() {}));
      //   // Load the available books
      //   fetchBooks(this.state.user.token, "true")
      //     .then(res => res.json())
      //     .then(availableBooks => this.setState({ availableBooks }));
      });
    } else {
      // Si no hay data en localstorage, va a la pantalla de selección de pastillero
      // this.props.history.push(`/userselect`);
      this.props.history.push({
        pathname: "/seleccionarPastillero"
        //state: { prueba: "hoooola" }
      });
    }
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          {this.state && this.state.user_info && (
            <Header/>
          )}
          <div className="content">
            {this.state && !this.state.activeUser && (
              <p>
                <img className="loader" src="/images/loader.gif" />
              </p>
            )}

            {this.state &&
              this.state.activeUser &&
              this.state.activeUser.libros.length == 0 && (
                <p>
                  Para poder sumarte al Libroclub de tu grupo es necesario que
                  traigas por lo menos un libro. Podés ingresarlos{" "}
                  <a onClick={this.goToAddBook()}>haciendo click aquí</a>.
                </p>
              )}

            {this.state &&
              this.state.activeUser &&
              this.state.activeUser.libros.length > 0 && (
                <>
                  {this.state &&
                    this.state.activeUser &&
                    !this.state.activeUser.alquilerActivo && (
                      <p>
                        No tenés ningún libro alquilado.
                        <span className="newLine">
                          Estos están disponibles para que te lleves:
                        </span>
                      </p>
                    )}

                  {this.state &&
                    this.state.activeUser &&
                    this.state.activeUser.alquilerActivo && (
                      <>
                        <p>
                          Tenes{" "}
                          <BookName
                            id={this.state.activeUser.alquilerActivo.id_libro}
                            name={
                              this.state.activeUser.alquilerActivo.nombre_libro
                            }
                            navigation={this.props.history}
                          />{" "}
                          desde el{" "}
                          {convertDate(
                            this.state.activeUser.alquilerActivo.fecha_salida
                          )}
                          .
                          <span className="newLine">
                            Si ya lo devolviste,{" "}
                            <a onClick={this.goToReturnBook}>
                              finaliza el alquiler
                            </a>
                            .
                          </span>
                        </p>
                        <img
                          className="separador"
                          src="/images/separador.png"
                        />
                        <p>
                          Estos son los libros que podés disfrutar cuando
                          termines{" "}
                          <BookName
                            id={this.state.activeUser.alquilerActivo.id_libro}
                            name={
                              this.state.activeUser.alquilerActivo.nombreLibro
                            }
                            navigation={this.props.history}
                          />
                          :
                        </p>
                      </>
                    )}

                  {this.state && this.state.availableBooks && (
                    <ul className="libros">
                      {this.state.availableBooks.map(obj => {
                        return (
                          <li key={obj.id}>
                            <BookName
                              id={obj.id}
                              name={obj.titulo}
                              navigation={this.props.history}
                            />{" "}
                            - {obj.autor}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  <img className="separador" src="/images/separador.png" />
                  <p>
                    {" "}
                    Ver mis{" "}
                    <a onClick={this.goToPersonalDetails}>datos personales</a>
                  </p>
                  <img className="separador" src="/images/separador.png" />
                  <p>
                    <a onClick={this.signOut}>Salir de Libroclub</a>
                  </p>
                </>
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
