import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./home/Home";
import NotFound from "./NotFound";
import VerDosis from "./verDosis/VerDosis";
import ImprimirPastillero from "./ImprimirPastillero";
import AgregarDroga from "./agregarDroga/AgregarDroga";
import EditarDroga from "./editarDroga/EditarDroga";
import IngresarCompra from "./ingresarCompra/IngresarCompra";
import VerStock from "./verStock/VerStock";
import DescontarStock from "./descontarStock/DescontarStock";
import NuevoPastillero from "./nuevoPastillero/Nuevopastillero";
import Login from "./login/Login";
import CrearCuenta from "./crearCuenta/CrearCuenta";
import EditarUsuario from "./editarUsuario/EditarUsuario";
import Error from "./error/Error";

class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route exact path="/nuevopastillero" component={NuevoPastillero} />
          <Route path="/verDosis" component={VerDosis} />
          <Route path="/imprimirPastillero" component={Error} />
          <Route path="/agregarDroga" component={AgregarDroga} />
          <Route path="/editarDroga" component={EditarDroga} />
          <Route path="/ingresarCompra" component={IngresarCompra} />
          <Route path="/verStock" component={VerStock} />
          <Route path="/descontarStock" component={DescontarStock} />
          <Route path="/login" component={Login} />
          <Route path="/crearCuenta" component={CrearCuenta} />
          <Route path="/editarUsuario" component={EditarUsuario} />
          <Route component={Error} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
