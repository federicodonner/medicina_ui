import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Credits from "./Credits";
import Signup from "./Signup";
import NotFound from "./NotFound";
import SeleccionarPastillero from "./SeleccionarPastillero";
import VerDosis from "./VerDosis";
import ImprimirPastillero from "./ImprimirPastillero";
import EditarDosis from "./EditarDosis";
import AgregarDroga from "./AgregarDroga";
import EditarDroga from "./EditarDroga";
import IngresarCompra from "./IngresarCompra";

class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/credits" component={Credits} />
          <Route path="/signup/:id" component={Signup} />
          <Route
            path="/seleccionarPastillero"
            component={SeleccionarPastillero}
          />
          <Route path="/verDosis" component={VerDosis} />
          <Route path="/imprimirPastillero" component={ImprimirPastillero} />
          <Route path="/editarDosis" component={EditarDosis} />
          <Route path="/agregarDroga" component={AgregarDroga} />
          <Route path="/editarDroga" component={EditarDroga} />
          <Route path="/ingresarCompra" component={IngresarCompra} />
          <Route component={Home} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
