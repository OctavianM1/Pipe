import React, { Dispatch, SetStateAction } from "react";
import "./home.scss";

import IntroductionSection from "./IntroductionSection/IntroductionSection";
import OurFeatures from "./OurFeatures/OurFeatures";
import PostIntroductionSection from "./PostIntroductionSection/PostIntroductionSection";

const Home = ({
  isOpenRegisterModal,
}: {
  isOpenRegisterModal: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <div className="home">
      <IntroductionSection isOpenRegisterModal={isOpenRegisterModal} />
      <OurFeatures />
      <PostIntroductionSection />
    </div>
  );
};

export default Home;
