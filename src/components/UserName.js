import React from "react";

class UserName extends React.Component {
  goToUser = event => {
    event.preventDefault();
    this.props.navigation.push(`/user/${this.props.id}`);
  };

  // selectBook() needs to run on page refresh to
  // navigate to the selected book
  render() {
    return (
      <a href="#" onClick={this.goToUser}>
        {this.props.name}
      </a>
    );
  }
}

export default UserName;
