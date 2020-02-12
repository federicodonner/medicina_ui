import React from "react";
import Header from "./Header";
import { verifyLogin, fetchBook, addReview } from "../fetchFunctions";
import StarRatingComponent from "react-star-rating-component";

class Review extends React.Component {
  state: {
    loading: false,
    user: {},
    rating: 0,
    book: {},
    userEnteredReview: false
  };

  return = event => {
    event.preventDefault();
    this.props.history.goBack();
  };

  reviewRef = React.createRef();

  submitReview = event => {
    // Stop form from submitting
    event.preventDefault();
    const data = {
      id_usuario: this.state.user.user_id,
      id_libro: this.state.book.id,
      estrellas: this.state.rating,
      texto: this.reviewRef.current.value
    };

    this.setState({ loading: true });
    addReview(data, this.state.user.token)
      .then(res => res.json())
      .then(
        function(respuesta) {
          if (respuesta.status == "success") {
            this.props.history.push({
              pathname: "/book/" + this.state.book.id
            });
          } else {
            alert("Ocurrió un error, intenta nuevamente más tarde.");
          }
        }.bind(this)
      );
  };

  onStarClick(nextValue, prevValue, name) {
    this.setState({ rating: nextValue });
  }

  componentDidMount() {
    this.setState({ loading: true });
    this.setState({ rating: 4 });

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
        //state: { prueba: "hoooola" }
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
                  <p>
                    Contale a todos los demás qué te pareció{" "}
                    {this.state.book.titulo}.
                  </p>
                  <p>
                    Ranking:
                    <StarRatingComponent
                      name="rate1"
                      starCount={5}
                      value={this.state.rating}
                      onStarClick={this.onStarClick.bind(this)}
                    />
                  </p>
                  <form className="pretty-form" onSubmit={this.submitReview}>
                    <span className="form-input">
                      Reseña:{" "}
                      <textarea
                        rows="8"
                        name="nombre"
                        type="text"
                        ref={this.reviewRef}
                        className="pretty-input"
                      />
                    </span>
                    <button className="pretty-submit" type="submit">
                      Agregar reseña
                    </button>
                  </form>
                  <p>
                    <a onClick={this.return}>Cancelar</a>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Review;
