import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./home/Home";
import ImprimirPastillero from "./ImprimirPastillero";
import AgregarDroga from "./agregarDroga/AgregarDroga";
import EditarDroga from "./editarDroga/EditarDroga";
import IngresarCompra from "./ingresarCompra/IngresarCompra";
import VerStock from "./verStock/VerStock";
import DescontarStock from "./descontarStock/DescontarStock";
import NuevoPastillero from "./nuevoPastillero/Nuevopastillero";
import CompartirPastillero from "./compartirPastillero/CompartirPastillero";
import AgregarPastillero from "./agregarPastillero/AgregarPastillero";
import Usuario from "./usuario/Usuario";
import Error from "./error/Error";

class Router extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <Home
                {...props}
                userInfo={this.props.userInfo}
                setMostrarFooter={this.props.setMostrarFooter}
              />
            )}
          />
          <Route
            exact
            path="/nuevopastillero"
            render={(props) => (
              <NuevoPastillero
                {...props}
                setMostrarFooter={this.props.setMostrarFooter}
                cargarUsuario={this.props.cargarUsuario}
              />
            )}
          />
          <Route path="/imprimirPastillero" component={Error} />
          <Route
            path="/agregarDroga"
            render={(props) => (
              <AgregarDroga
                {...props}
                userInfo={this.props.userInfo}
                setMostrarFooter={this.props.setMostrarFooter}
                pastillero={this.props.pastillero}
                seleccionPastillero={this.props.seleccionPastillero}
                setConfiguracionMensaje={this.props.setConfiguracionMensaje}
              />
            )}
          />
          <Route
            path="/editarDroga"
            render={(props) => (
              <EditarDroga
                {...props}
                userInfo={this.props.userInfo}
                pastillero={this.props.pastillero}
                setMostrarFooter={this.props.setMostrarFooter}
                setConfiguracionMensaje={this.props.setConfiguracionMensaje}
              />
            )}
          />
          <Route
            path="/ingresarCompra"
            render={(props) => (
              <IngresarCompra
                {...props}
                userInfo={this.props.userInfo}
                pastillero={this.props.pastillero}
                setMostrarFooter={this.props.setMostrarFooter}
                setConfiguracionMensaje={this.props.setConfiguracionMensaje}
              />
            )}
          />
          <Route
            path="/verStock"
            render={(props) => (
              <VerStock
                {...props}
                userInfo={this.props.userInfo}
                pastillero={this.props.pastillero}
                setMostrarFooter={this.props.setMostrarFooter}
              />
            )}
          />
          <Route
            path="/descontarStock"
            render={(props) => (
              <DescontarStock
                {...props}
                userInfo={this.props.userInfo}
                pastillero={this.props.pastillero}
                setMostrarFooter={this.props.setMostrarFooter}
                setConfiguracionMensaje={this.props.setConfiguracionMensaje}
              />
            )}
          />
          <Route
            path="/usuario"
            render={(props) => (
              <Usuario
                {...props}
                userInfo={this.props.userInfo}
                pastillero={this.props.pastillero}
                setMostrarFooter={this.props.setMostrarFooter}
                cargarUsuario={this.props.cargarUsuario}
                setConfiguracionMensaje={this.props.setConfiguracionMensaje}
              />
            )}
          />
          <Route
            path="/compartirpastillero"
            render={(props) => (
              <CompartirPastillero
                {...props}
                userInfo={this.props.userInfo}
                setMostrarFooter={this.props.setMostrarFooter}
              />
            )}
          />

          <Route
            path="/agregarpastillero"
            render={(props) => (
              <AgregarPastillero
                {...props}
                userInfo={this.props.userInfo}
                setMostrarFooter={this.props.setMostrarFooter}
                cargarUsuario={this.props.cargarUsuario}
                setConfiguracionMensaje={this.props.setConfiguracionMensaje}
              />
            )}
          />
          <Route
            render={(props) => (
              <Error
                {...props}
                setMostrarFooter={this.props.setMostrarFooter}
              />
            )}
          />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default Router;
