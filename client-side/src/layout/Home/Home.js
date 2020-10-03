import React from "react";
import "./home.scss";

import IntroductionSection from "./IntroductionSection/IntroductionSection";
import OurFeatures from "./OurFeatures/OurFeatures";
import PostIntroductionSection from "./PostIntroductionSection/PostIntroductionSection";

const Home = ({ openLoginModal, isOpenRegisterModal }) => {
  return (
    <div className="home">
      <IntroductionSection
        openLoginModal={openLoginModal}
        isOpenRegisterModal={isOpenRegisterModal}
      />
      <OurFeatures />
      <PostIntroductionSection />
    </div>
  );
};

export default Home;
