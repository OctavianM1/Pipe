import React, { useContext, useState } from "react";
import "./App.scss";
import Header from "./layout/Header/Header";
import Home from "./layout/Home/Home";
import Login from "./components/Login/Login";
import Footer from "./layout/Footer/Footer";

import { Route, Switch } from "react-router-dom";
import NotFound from "./layout/NotFound/NotFound";
import { Context } from "./context";
import NonAuthenticated from "./layout/Unauthorized/Unauthorized";
import UserActivities from "./layout/UserActivities/UserActivities";
import CreateActivity from "./layout/CreateActivity/CreateActivity";
import EditActivity from "./layout/UserActivities/EditActivity";
import useDisableScroll from "./Hooks/useDisableScroll";
import Following from "./layout/Following/Following";
import SearchUsers from "./layout/SearchUsers/SearchUsers";
import Follows from "./layout/Following/Follows";

function App() {
  const { openLoginModal } = useContext(Context);
  const [openRegisterModal, isOpenRegisterModal] = useState(false);

  useDisableScroll([openLoginModal]);

  return (
    <div className="App disable-scroll">
      {openLoginModal && <Login openRegisterModal={openRegisterModal} />}
      <Header isOpenRegisterModal={isOpenRegisterModal} />

      <Switch>
        <Route path="/profile" exact>
          <h1>Profile</h1>
        </Route>
        <Route path="/add-activity" exact>
          <CreateActivity />
        </Route>
        <Route path="/activities/:userId" exact>
          <UserActivities />
        </Route>
        <Route path={`/activities/:userId/edit/:activityId`}>
          <EditActivity exact />
        </Route>
        <Route path="/following" exact>
          <Following />
        </Route>
        <Route path="/followers" exact>
          <Follows />
        </Route>
        <Route path="/search-users" exact>
          <SearchUsers />
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
