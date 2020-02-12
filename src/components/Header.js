import React from "react";
import * as classNames from "classnames";

const Header = props => {
  var logoClasses = "";
  var greetingClasses = "";
  var userName = "";

  if (props.withGradient) {
    logoClasses = classNames("logo", "blackLogo");
    greetingClasses = classNames("whiteGreeting");
    userName = classNames("blue");
  } else {
    logoClasses = classNames("logo", "whiteLogo");
    greetingClasses = classNames("whiteGreeting");
  }
  const headerClasses = classNames("header", {
    withGradient: props.withGradient
  });

  return (
    <div className={headerClasses}>
      <a href="/">
        <div className={logoClasses} />
      </a>
      <div className={greetingClasses}>
        {props.withGreeting && (
          <>
            Hola, <span className={userName}>{props.username}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
