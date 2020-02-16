import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Book from "./Book";
import User from "./User";
import Me from "./Me";
import Credits from "./Credits";
import Redirect from "./Redirect";
import Signup from "./Signup";
import AddBook from "./AddBook";
import Review from "./Review";
import Rental from "./Rental";
import Return from "./Return";
import NotFound from "./NotFound";
import SeleccionarPastillero from "./SeleccionarPastillero";
import VerDosis from "./VerDosis";
import ImprimirPastillero from "./ImprimirPastillero";
import EditarDosis from "./EditarDosis";

class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/book/:id" component={Book} />
          <Route path="/book/" component={Redirect} />
          <Route path="/me" component={Me} />
          <Route path="/user/:id" component={User} />
          <Route path="/user" component={Redirect} />
          <Route path="/credits" component={Credits} />
          <Route path="/signup/:id" component={Signup} />
          <Route path="/signup" component={Redirect} />
          <Route path="/review/:id" component={Review} />
          <Route path="/rental/:id" component={Rental} />
          <Route path="/return/:id" component={Return} />
          <Route path="/addbook" component={AddBook} />
          <Route
            path="/seleccionarPastillero"
            component={SeleccionarPastillero}
          />
          <Route path="/verDosis" component={VerDosis} />
          <Route path="/imprimirPastillero" component={ImprimirPastillero} />
            <Route path="/editarDosis" component={EditarDosis} />
          <Route component={Home} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
