import React, {
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import "./App.scss";
import "./components/CSSTransitions/cssTransitions.scss";
import Header from "./layout/Header/Header";
import Home from "./layout/Home/Home";
import Login from "./components/Login/Login";
import Footer from "./layout/Footer/Footer";
import { Route, Switch, useLocation } from "react-router-dom";
import NotFound from "./layout/NotFound/NotFound";
import { Context } from "./context";
import NonAuthenticated from "./layout/Unauthorized/Unauthorized";
import UserActivities from "./layout/UserActivities/UserActivities";
import CreateActivity from "./layout/CreateActivity/CreateActivity";
import EditActivity from "./layout/EditActivity/EditActivity";
import useDisableScroll from "./Hooks/useDisableScroll";
import Following from "./layout/Following/Following";
import SearchUsers from "./layout/SearchUsers/SearchUsers";
import Follows from "./layout/Following/Follows";
import Profile from "./layout/Profile/Profile";
import ConfirmEmail from "./layout/ConfirmEmail/ConfirmEmail";
import RestorePassword from "./layout/RestorePassword/RestorePassword";
import { CSSTransition, TransitionGroup } from "react-transition-group";

function App() {
  const {
    openLoginModal,
    networkError,
    setNetworkError,
  }: {
    openLoginModal: boolean;
    networkError: boolean;
    setNetworkError: Dispatch<SetStateAction<boolean>>;
  } = useContext(Context);
  const [openRegisterModal, isOpenRegisterModal] = useState(false);

  if (networkError) {
    setTimeout(() => {
      setNetworkError(false);
    }, 1000 * 60); // 1 min
  }

  useDisableScroll([openLoginModal]);

  const location = useLocation();

  return (
    <div className="App disable-scroll">
 
      {openLoginModal && <Login openRegisterModal={openRegisterModal} />}
      <Header isOpenRegisterModal={isOpenRegisterModal} />

      {networkError && (
        <div
          style={{ backgroundColor: "rgba(223, 51, 51, 0.9)" }}
          className="network-error"
        >
          <h3>Network error</h3>
          <p>Somethig is temporarily wrong with your network connection.</p>
          <p>Please make sure you are connected to the internet.</p>
        </div>
      )}
      <TransitionGroup>
        <CSSTransition
          key={location.pathname}
          timeout={{ enter: 500, exit: 100 }}
          classNames="page"
          unmountOnExit
        >
          <div>
            <Switch location={location}>
              <Route path="/profile" exact>
                <Profile />
              </Route>
              <Route path="/add-activity" exact>
                <CreateActivity />
              </Route>
              <Route path="/activities/:userId" exact>
                <UserActivities />
              </Route>
              <Route path={`/activities/:userId/edit/:activityId`} exact>
                <EditActivity />
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
              <Route path="/confirmEmail/:token">
                <ConfirmEmail />
              </Route>
              <Route path="/restorePassword/:token">
                <RestorePassword />
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
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
}

export default App;
