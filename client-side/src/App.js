import React, { useContext, useState } from "react";
import "./App.scss";
import Header from "./layout/Header/Header";
import Home from "./layout/Home/Home";
import Login from "./components/Login/Login";
import Footer from "./layout/Footer/Footer";

import { Route, Switch } from "react-router-dom";
import NotFound from "./layout/NotFound/NotFound";
import Features from "./layout/Features/Features";
import { Context } from "./context";
import NonAuthenticated from "./layout/Unauthorized/Unauthorized";

function App() {
  const { openLoginModal } = useContext(Context);
  const [openRegisterModal, isOpenRegisterModal] = useState(false);

  return (
    <div className="App">
      {openLoginModal && <Login openRegisterModal={openRegisterModal} />}
      <Header isOpenRegisterModal={isOpenRegisterModal} />

      <Switch>
        <Route path="/features" exact>
          <Features />
        </Route>
        <Route path="/docs" exact>
          <h1>Docs</h1>
        </Route>
        <Route path="/unauthorized" exact>
          <NonAuthenticated />
        </Route>
        <Route path="/" exact>
          <Home isOpenRegisterModal={isOpenRegisterModal} />
        </Route>
        <Route path="/">
          <NotFound />
        </Route>
      </Switch>

      <Footer />
    </div>
  );
}

export default App;
