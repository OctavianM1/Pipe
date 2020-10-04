import React, { useState } from "react";
import "./App.scss";
import Header from "./layout/Header/Header";
import Home from "./layout/Home/Home";
import Login from "./components/Login/Login";
import Footer from "./layout/Footer/Footer";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NotFound from "./layout/NotFound/NotFound";
import Features from "./layout/Features/Features";

function App() {
  const [openLoginModal, isOpenLoginModal] = useState(false);
  const [openRegisterModal, isOpenRegisterModal] = useState(false);
  return (
    <div className="App">
      {openLoginModal && (
        <Login
          isOpenLoginModal={isOpenLoginModal}
          openRegisterModal={openRegisterModal}
        />
      )}
      <Header
        openLoginModal={() => isOpenLoginModal(true)}
        isOpenRegisterModal={isOpenRegisterModal}
      />

      <Router>
        <Switch>
          <Route path="/features" exact>
            <Features />
          </Route>
          <Route path="/docs" exact>
            <h1>Docs</h1>
          </Route>
          <Route path="/" exact>
            <Home
              openLoginModal={() => isOpenLoginModal(true)}
              isOpenRegisterModal={isOpenRegisterModal}
            />
          </Route>
          <Route path="/">
            <NotFound />
          </Route>
        </Switch>
      </Router>

      <Footer />
    </div>
  );
}

export default App;
