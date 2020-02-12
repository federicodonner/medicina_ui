import React from "react";
import Header from "./Header";
import BookName from "./BookName";
import UserName from "./UserName";
import { verifyLogin, fetchActiveUser, enableBook } from "../fetchFunctions";
import { convertDate } from "../dataFunctions";

class Me extends React.Component {
  state: {
    user: {},
    activeUser: {},
    loading: true
  };

  addBook = () => event => {
    this.props.history.push({ pathname: "/addbook" });
  };

  goToReturn = event => {
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
            const activeUser = this.state.activeUser;
            activeUser.libros.forEach(function(libro, index) {
              if (libro.id == book_id) {
                libro.activo = enable ? 1 : 0;
              }
            });
            this.setState(
              { activeUser },
              function() {
                const loading = false;
                this.setState({ loading });
              }.bind(this)
            );
          } else {
            alert("Hubo un error, inténtalo denuevo más tarde");
          }
        }.bind(this)
      );
  };

  componentDidMount() {
    const loading = true;
    this.setState({ loading });
    const user = verifyLogin();
    if (user) {
      this.setState({ user }, function() {
        fetchActiveUser(this.state.user.token)
          .then(res => res.json())
          .then(activeUser =>
            this.setState(
              { activeUser },
              function() {
                const loading = false;
                this.setState({ loading });
              }.bind(this)
            )
          );
      });
    } else {
      this.props.history.push({
        pathname: "/companyselect"
      });
    }
  }
  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          {this.state && this.state.user && (
            <Header withGreeting={true} username={this.state.user.username} />
          )}
          <div className="content">
            {this.state && (!this.state.activeUser || this.state.loading) && (
              <p>
                <img className="loader" src="/images/loader.gif" />
              </p>
            )}
            {this.state && this.state.activeUser && !this.state.loading && (
              <>
                <p>
                  En esta sección podés administrar tus libros y ver tu
                  historial de alquileres.
                </p>
                {this.state &&
                  this.state.activeUser &&
                  this.state.activeUser.alquilerActivo && (
                    <>
                      <p className="titulo">Alquiler activo:</p>
                      <p>
                        Tenés{" "}
                        <BookName
                          id={this.state.activeUser.alquilerActivo.id_libro}
                          name={
                            this.state.activeUser.alquilerActivo.nombre_libro
                          }
                          navigation={this.props.history}
                        />{" "}
                        desde{" "}
                        {convertDate(
                          this.state.activeUser.alquilerActivo.fecha_salida
                        )}
                        . Si ya lo terminaste,{" "}
                        <a onClick={this.goToReturn}>devolvelo</a>.
                      </p>
                      <img className="separador" src="/images/separador.png" />
                    </>
                  )}
                {this.state &&
                  this.state.activeUser &&
                  this.state.activeUser.libros.length > 0 && (
                    <>
                      <p className="titulo">Tus libros:</p>
                      <ul className="libros">
                        {this.state.activeUser.libros.map(obj => {
                          return (
                            <li key={obj.id}>
                              <BookName
                                id={obj.id}
                                name={obj.titulo}
                                navigation={this.props.history}
                              />{" "}
                              - {obj.autor}
                              {obj.activo == 1 && !obj.alquilerActivo && (
                                <span className="newLine">
                                  <a
                                    onClick={this.sendEnableBook(false, obj.id)}
                                  >
                                    Sacarlo de Libroclub
                                  </a>
                                </span>
                              )}
                              {obj.activo != 1 && !obj.alquilerActivo && (
                                <>
                                  <span className="newLine">
                                    Este libro no está disponible.{" "}
                                  </span>
                                  <span className="newLine">
                                    <a
                                      onClick={this.sendEnableBook(
                                        true,
                                        obj.id
                                      )}
                                    >
                                      Volver a traerlo
                                    </a>
                                  </span>
                                </>
                              )}
                              {obj.activo == 1 && obj.alquilerActivo && (
                                <>
                                  <span className="newLine">
                                    Este libro está alquilado, lo tiene{" "}
                                    <UserName
                                      id={obj.alquilerActivo.detallesUsuario.id}
                                      name={
                                        obj.alquilerActivo.detallesUsuario
                                          .nombre
                                      }
                                      navigation={this.props.history}
                                    />{" "}
                                  </span>
                                </>
                              )}
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                <img className="separador" src="/images/separador.png" />
                <p>
                  <a onClick={this.addBook()}>Agregar un libro nuevo</a>
                </p>

                {this.state &&
                  this.state.activeUser &&
                  this.state.activeUser.alquileres.length > 0 && (
                    <>
                      <img className="separador" src="/images/separador.png" />
                      <p className="titulo">Historial de alquileres:</p>
                      <ul className="libros">
                        {this.state.activeUser.alquileres.map(obj => {
                          return (
                            <li key={obj.id}>
                              <p>
                                <BookName
                                  id={obj.id_libro}
                                  name={obj.nombre_libro}
                                  navigation={this.props.history}
                                />{" "}
                                - {obj.autor_libro}
                                <span className="rentalDates">
                                  Del {convertDate(obj.fecha_salida)} al{" "}
                                  {convertDate(obj.fecha_devolucion)}
                                </span>
                              </p>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
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

export default Me;
