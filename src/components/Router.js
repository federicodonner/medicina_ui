import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import NotFound from "./NotFound";
import VerDosis from "./VerDosis";
import ImprimirPastillero from "./ImprimirPastillero";
import AgregarDroga from "./AgregarDroga";
import EditarDroga from "./EditarDroga";
import IngresarCompra from "./IngresarCompra";
import VerStock from "./VerStock";
import DescontarStock from "./DescontarStock";
import NuevoPastillero from "./Nuevopastillero";
import Login from "./Login";

class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/nuevopastillero" component={NuevoPastillero} />
          <Route path="/verDosis" component={VerDosis} />
          <Route path="/imprimirPastillero" component={NotFound} />
          <Route path="/agregarDroga" component={AgregarDroga} />
          <Route path="/editarDroga" component={EditarDroga} />
          <Route path="/ingresarCompra" component={IngresarCompra} />
          <Route path="/verStock" component={VerStock} />
          <Route path="/descontarStock" component={DescontarStock} />
          <Route path="/login" component={Login} />
          <Route component={Home} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
