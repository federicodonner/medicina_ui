import React from "react";
import * as classNames from "classnames";

const Header = props => {
  var logoClasses = "";

  logoClasses = classNames("logo");

  const headerClasses = classNames("header", {
    withGradient: props.withGradient
  });

  return (
    <div className={headerClasses}>
      <div className={logoClasses} />
    </div>
  );
};

export default Header;
