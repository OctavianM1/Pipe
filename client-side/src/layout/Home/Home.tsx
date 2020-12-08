import React, { Dispatch, SetStateAction } from "react";
import "./home.scss";
import ScrollToTopArrowUp from "../../components/ScrollToTopArrowUp/ScrollToTopArrowUp";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import ActivitiesFacade from "./ActivitiesFacade/ActivitiesFacade";
import HowItWorks from "./HowItWorks/HowItWorks";
import IntroductionSection from "./IntroductionSection/IntroductionSection";
import OurFeatures from "./OurFeatures/OurFeatures";
import PostIntroductionSection from "./PostIntroductionSection/PostIntroductionSection";

const Home = ({
  isOpenRegisterModal,
}: {
  isOpenRegisterModal: Dispatch<SetStateAction<boolean>>;
}) => {
  useDocumentTitle("Pipe - Home");

  return (
    <div className="home">
      <IntroductionSection isOpenRegisterModal={isOpenRegisterModal} />
      <HowItWorks />
      <ActivitiesFacade />
      <OurFeatures />
      <PostIntroductionSection />

      <ScrollToTopArrowUp />
    </div>
  );
};

export default Home;
 