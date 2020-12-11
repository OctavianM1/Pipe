import React, { Dispatch, SetStateAction } from "react";
import "./home.scss";
import ScrollToTopArrowUp from "../../components/ScrollToTopArrowUp/ScrollToTopArrowUp";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import IntroductionSection from "./IntroductionSection/IntroductionSection";
import LoadOnDemand from "../../components/LoadOnDemand/LoadOnDemand";

const HowItWorks = React.lazy(() => import("./HowItWorks/HowItWorks"));
const ActivitiesFacade = React.lazy(
  () => import("./ActivitiesFacade/ActivitiesFacade")
);
const OurFeatures = React.lazy(() => import("./OurFeatures/OurFeatures"));
const PostIntroductionSection = React.lazy(
  () => import("./PostIntroductionSection/PostIntroductionSection")
);

const Home = ({
  isOpenRegisterModal,
}: {
  isOpenRegisterModal: Dispatch<SetStateAction<boolean>>;
}) => {
  useDocumentTitle("Pipe - Home");

  return (
    <div className="home">
      <IntroductionSection isOpenRegisterModal={isOpenRegisterModal} />
      <LoadOnDemand>
        <HowItWorks />
      </LoadOnDemand>
      <LoadOnDemand>
        <ActivitiesFacade />
      </LoadOnDemand>
      <LoadOnDemand>
        <OurFeatures />
      </LoadOnDemand>
      <LoadOnDemand>
        <PostIntroductionSection />
      </LoadOnDemand>

      <ScrollToTopArrowUp />
    </div>
  );
};

export default Home;
