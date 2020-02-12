import React from "react";

class BookName extends React.Component {
  // // If the parent component reloads and this component
  // // has navigate enabled, it will go to the book page
  // state = {
  //   navigate: false
  // };
  //
  // // The navigation button enables navigation in the component
  // enableNavigation = event => {
  //   event.preventDefault();
  //   this.setState({
  //     navigate: true
  //   });
  // };
  //
  // // If the navigation flag is set, it navigates
  // // to the book specified in the props
  // selectBook = () => {
  //   if (this.state.navigate) {
  //     return <Redirect to={"/book/" + this.props.id} />;
  //   }
  // };

  // ALL THIS WAS COMMENTED BEACUSE I FOUND A BETTER WAY
  // INSIDE THE RETURN, THIS NEEDS TO BE ADDED:

  // <Fragment>
  //{this.selectBook()}
  //(...)
  // </Fragment>

  goToBook = event => {
    event.preventDefault();
    this.props.navigation.push({
      pathname: "/book/" + this.props.id,
      state: { bookid: this.props.id }
    });
  };

  // selectBook() needs to run on page refresh to
  // navigate to the selected book
  render() {
    return (
      <a href="#" onClick={this.goToBook}>
        {this.props.name}
      </a>
    );
  }
}

export default BookName;
