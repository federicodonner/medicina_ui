import React from "react";
import Header from "./Header";
import { verifyLogin } from "../fetchFunctions";

class Redirect extends React.Component {
  componentDidMount() {
    var user = verifyLogin();
    if (user) {
      this.props.history.push({
        pathname: "/"
      });
    } else {
      this.props.history.push({
        pathname: "companySelect"
      });
    }
  }

  // selectBook() needs to run on page refresh to
  // navigate to the selected book
  render() {
    return (
      <div className="app-view cover">
        <div className="scrollable">
          <Header logoType="blackLogo" withGradient={true} />
          <div className="content">
            <p>
              <img className="loader" src="/images/loader.gif" />
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Redirect;
