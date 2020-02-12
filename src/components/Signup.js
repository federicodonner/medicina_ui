import React from "react";
import Header from "./Header";
import { signupUser, loginUser } from "../fetchFunctions";

class Signup extends React.Component {
  state: {
    loading: false
  };

  return = () => event => {
    event.preventDefault();
    this.props.history.goBack();
  };

  nameRef = React.createRef();
  emailRef = React.createRef();

  signupUser = event => {
    // Stop form from submitting
    event.preventDefault();
    const user = {
      nombre: this.nameRef.current.value,
      email: this.emailRef.current.value
    };
    this.setState({ loading: true });

    signupUser(user, this.props.match.params.id)
      .then(res => res.json())
      .then(
        function(signupResponse) {
          if (signupResponse.status == "success") {
            console.log(signupResponse);
            loginUser(signupResponse.usuario)
              .then(res => res.json())
              .then(response => {
                localStorage.setItem("libroclub_token", response.token);
                localStorage.setItem("libroclub_username", user.nombre);
                localStorage.setItem("libroclub_id", response.id);
                this.props.history.push({ pathname: "/" });
              })
              .catch(error => console.error("Error:", error));
          }
        }.bind(this)
      );
  };

  componentDidMount() {
    this.setState({ loading: false });
  }

  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          <Header withGradient={false} />
          <div className="content">
            <p>
              Aquí podés registrarte para empezar a utilizar Libroclub con tu
              grupo. Recordá que para que funcione, es bueno que traigas libros
              para compartir con los otros usuarios. Una vez que completes el
              registro podrás ingresar los libros que trajiste.
            </p>
            <p>
              Libroclub utiliza tu dirección de mail para hacerte acordar de los
              libros que tenés y por si el dueño de alguno lo necesita devuelta.
              Nunca vas a recibir un correo distinto a esos, por favor ingresá
              una dirección real y asegurate de que los mails no terminen en
              spam.
            </p>
            <div>
              {this.state && this.state.loading && (
                <p>
                  <img src="/images/loader.gif" />
                </p>
              )}
              {this.state && !this.state.loading && (
                <form className="pretty-form" onSubmit={this.signupUser}>
                  <span className="form-input">
                    <span class='label'>Nombre:</span>
                    <input
                      name="nombre"
                      type="text"
                      ref={this.nameRef}
                      className="pretty-input"
                    />
                  </span>
                  <span className="form-input">
                    <span class='label'>Email:</span>
                    <input
                      name="email"
                      type="text"
                      ref={this.emailRef}
                      className="pretty-input"
                    />
                  </span>
                  <button className="pretty-submit" type="submit">
                    Registrame
                  </button>
                </form>
              )}
            </div>
            <p>
              <a onClick={this.return()}>Cancelar</a>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
