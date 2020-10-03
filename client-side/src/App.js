import React, { useState } from "react";
import "./App.scss";
import Header from "./layout/Header/Header";
import Home from "./layout/Home/Home";
import Login from "./components/Login/Login";
import Footer from "./layout/Footer/Footer";

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
      <Header openLoginModal={() => isOpenLoginModal(true)} isOpenRegisterModal={isOpenRegisterModal}/>
      <Home openLoginModal={() => isOpenLoginModal(true)} isOpenRegisterModal={isOpenRegisterModal}/>
      <Footer />
    </div>
  );
}

export default App;
