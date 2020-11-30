import React, { Dispatch, SetStateAction } from "react";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import ActivitiesFacade from "./ActivitiesFacade/ActivitiesFacade";
import "./home.scss";
import HowItWorks from "./HowItWorks/HowItWorks";

import IntroductionSection from "./IntroductionSection/IntroductionSection";
import OurFeatures from "./OurFeatures/OurFeatures";
import PostIntroductionSection from "./PostIntroductionSection/PostIntroductionSection";

const Home = ({
  isOpenRegisterModal,
}: {
  isOpenRegisterModal: Dispatch<SetStateAction<boolean>>;
}) => {
  useDocumentTitle("Pipe - Home", []);

  return (
    <div className="home">
      <IntroductionSection isOpenRegisterModal={isOpenRegisterModal} />
      <HowItWorks />
      <ActivitiesFacade />
      <OurFeatures />
      <PostIntroductionSection />
    </div>
  );
};

export default Home;
