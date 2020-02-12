import React from "react";
import Header from "./Header";
import BookName from "./BookName";
import { verifyLogin, fetchUser } from "../fetchFunctions";
import { convertDate } from "../dataFunctions";

class User extends React.Component {
  state: {
    user: {},
    selectedUser: {}
  };

  componentDidMount() {
    const user = verifyLogin();
    if (user) {
      this.setState({ user }, function() {
        fetchUser(this.state.user.token, this.props.match.params.id)
          .then(res => res.json())
          .then(
            function(selectedUser) {
              if ((this.state.user.user_id == selectedUser.id)) {
                this.props.history.push({ pathname: "/me" });
              } else {
                this.setState({ selectedUser });
              }
            }.bind(this)
          );
      });
    } else {
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
            <Header withGreeting={true} username={this.state.user.username} />
          )}
          <div className="content">
            {this.state && !this.state.selectedUser && (
              <p>
                <img className="loader" src="/images/loader.gif" />
              </p>
            )}
            {this.state && this.state.selectedUser && (
              <>
                {this.state.selectedUser.alquilerActivo &&
                  this.state.selectedUser.alquilerActivo.id_dueno ==
                    this.state.user.user_id && (
                    <p>
                      {this.state.selectedUser.nombre} tiene un libro tuyo:{" "}
                      <BookName
                        id={this.state.selectedUser.alquilerActivo.id_libro}
                        name={
                          this.state.selectedUser.alquilerActivo.nombre_libro
                        }
                        navigation={this.props.history}
                      />{" "}
                      desde{" "}
                      {convertDate(
                        this.state.selectedUser.alquilerActivo.fecha_salida
                      )}
                      .
                    </p>
                  )}

                {this.state.selectedUser.alquilerActivo &&
                  this.state.selectedUser.alquilerActivo.id_dueno !=
                    this.state.user.user_id && (
                    <p>
                      {this.state.selectedUser.nombre} tiene{" "}
                      <BookName
                        id={this.state.selectedUser.alquilerActivo.id_libro}
                        name={
                          this.state.selectedUser.alquilerActivo.nombre_libro
                        }
                        navigation={this.props.history}
                      />{" "}
                      desde{" "}
                      {convertDate(
                        this.state.selectedUser.alquilerActivo.fecha_salida
                      )}
                      .
                    </p>
                  )}

                {this.state.selectedUser.alquileres.length == 0 &&
                  !this.state.selectedUser.alquilerActivo && (
                    <p>
                      {this.state.selectedUser.nombre} todavía no se llevó
                      ningún libro. ¡Recomendale alguno!
                    </p>
                  )}
                {this.state.selectedUser.alquileres.length != 0 &&
                  !this.state.selectedUser.alquilerActivo && (
                    <p>
                      {this.state.selectedUser.nombre} no tiene ningún libro
                      ahora.
                    </p>
                  )}
                {this.state.selectedUser.alquileres.length != 0 && (
                  <>
                    <img className="separador" src="/images/separador.png" />

                    <p>{this.state.selectedUser.nombre} leyó estos libros:</p>

                    <ul className="libros">
                      {this.state.selectedUser.alquileres.map(obj => {
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

                {this.state.selectedUser.libros.length == 0 && (
                  <>
                    <img className="separador" src="/images/separador.png" />
                    <p>
                      {this.state.selectedUser.nombre} no trajo ningún libro.
                    </p>
                  </>
                )}

                {this.state.selectedUser.libros.length != 0 && (
                  <>
                    <img className="separador" src="/images/separador.png" />
                    <p>{this.state.selectedUser.nombre} trajo estos libros:</p>
                    <ul className="libros">
                      {this.state.selectedUser.libros.map(obj => {
                        return (
                          <li key={obj.id}>
                            <p>
                              <BookName
                                id={obj.id}
                                name={obj.titulo}
                                navigation={this.props.history}
                              />{" "}
                              - {obj.autor}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default User;
