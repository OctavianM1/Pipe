import React, {
  useContext,
  useState,
  Dispatch,
  SetStateAction,
  createContext,
  useRef,
  RefObject,
  useEffect,
  lazy,
  Suspense,
} from "react";
import "./App.scss";
import Header from "./layout/Header/Header";
import { Route, Switch, useLocation } from "react-router-dom";
import { Context } from "./context";
import useDisableScroll from "./Hooks/useDisableScroll";
import { CSSTransition, TransitionGroup } from "react-transition-group";

const Profile = lazy(() => import("./layout/Profile/Profile"));
const SearchUsers = lazy(() => import("./layout/SearchUsers/SearchUsers"));
const CreateActivity = lazy(
  () => import("./layout/CreateActivity/CreateActivity")
);
const Following = lazy(() => import("./layout/Following/Following"));
const Follows = lazy(() => import("./layout/Following/Follows"));
const ConfirmEmail = lazy(() => import("./layout/ConfirmEmail/ConfirmEmail"));
const EditActivity = lazy(() => import("./layout/EditActivity/EditActivity"));
const UserActivities = lazy(
  () => import("./layout/UserActivities/UserActivities")
);
const RestorePassword = lazy(
  () => import("./layout/RestorePassword/RestorePassword")
);
const Footer = lazy(() => import("./layout/Footer/Footer"));
const Home = lazy(() => import("./layout/Home/Home"));
const Login = lazy(() => import("./components/Login/Login"));
const NotFound = lazy(() => import("./layout/NotFound/NotFound"));
const NonAuthenticated = lazy(
  () => import("./layout/Unauthorized/Unauthorized")
);

export const AppContext = createContext<RefObject<HTMLDivElement> | null>(null);

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

  const appRef = useRef<HTMLDivElement>(null);

  if (networkError) {
    setTimeout(() => {
      setNetworkError(false);
    }, 1000 * 60); // 1 min
  }

  useDisableScroll([openLoginModal]);

  const location = useLocation();

  useEffect(() => {
    const ref = appRef.current;
    if (location.pathname.startsWith("/activities") && ref) {
      setTimeout(() => {
        ref.classList.remove("overflow-hidden");
      }, 450);
    }
    return () => {
      if (ref) {
        ref.classList.add("overflow-hidden");
      }
    };
  }, [location.pathname]);

  return (
    <div className="App disable-scroll overflow-hidden" ref={appRef}>
      <AppContext.Provider value={appRef}>
        {openLoginModal && (
          <Suspense fallback={<div />}>
            <Login openRegisterModal={openRegisterModal} />
          </Suspense>
        )}

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
              <Suspense fallback={<div />}>
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
              </Suspense>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </AppContext.Provider>
    </div>
  );
}

export default App;
