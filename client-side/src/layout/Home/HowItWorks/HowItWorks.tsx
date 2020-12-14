import React, { ReactNode, useRef, useState } from "react";
import "./howItWorks.scss";
import Check from "../../../components/Svgs/Check";
import LeftArrow from "../../../components/Svgs/LeftArrow";
import RightArrow from "../../../components/Svgs/RightArrow";
import useDisplayComponent from "../../../Hooks/useDisplayComponent";

const data: any = {
  step1: {
    footer: "Add a board for any activity.",
  },
  step2: {
    footer: "Give it a title, a subject and a body.",
  },
  step3: {
    footer: "Watch your activities and organize them.",
  },
  step4: {
    footer: "Watch your and friends activities and more.",
  },
  step5: {
    footer: "Like and comment the activity, follow users!",
  },
};

const HowItWorks = () => {
  const [step, setStep] = useState(1);

  const onStepClick = (ev: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    ev.preventDefault();
    ev.stopPropagation();
    const el = ev.target as any;
    const newStep = el.getAttribute("data-step");
    setStep(Number(newStep));
  };

  const titleRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayTitle = useDisplayComponent(titleRef, "bottom->top");
  const displayContainer = useDisplayComponent(containerRef, "small->normal");

  const onPreviousStep = (
    ev: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (step === 1) {
      setStep(5);
    } else {
      setStep(step - 1);
    }
  };

  const onNextStep = (
    ev: React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>
  ) => {
    ev.preventDefault();
    ev.stopPropagation();
    if (step === 5) {
      setStep(1);
    } else {
      setStep(step + 1);
    }
  };

  const buttons: ReactNode[] = [];
  for (let i = 0; i < 5; i++) {
    buttons.push(
      <button
        key={`step${i + 1}`}
        data-step={i + 1}
        onClick={onStepClick}
        className={
          step === i + 1
            ? "howItWorks__container__footer__steps__active"
            : "howItWorks__container__footer__steps__pasive"
        }
      >
        &nbsp;
      </button>
    );
  }

  return (
    <section className="howItWorks">
      <div>
        <div
          ref={titleRef}
          className={
            displayTitle
              ? "howItWorks__header"
              : " howItWorks__header hidden__bottom"
          }
        >
          <h1>See how it works</h1>
          <p>
            Go from idea to action in seconds with Pipe’s intuitively simple
            navigation, notification and activity tracking.
          </p>
        </div>
        <div
          style={{
            backgroundImage: "url(/images/home/board-back.jpg)",
          }}
          data-step={step}
          ref={containerRef}
          className={
            displayContainer
              ? `howItWorks__container howItWorks__container__step-${step}`
              : `howItWorks__container howItWorks__container__step-${step} hidden__small`
          }
          onClick={onNextStep}
        >
          <div
            className={`howItWorks__container__overlay howItWorks__container__step-${step}__overlay`}
          >
            <div
              className={`howItWorks__container__overlay__card howItWorks__container__step-${step}__overlay__card`}
            >
              <h2
                className={`howItWorks__container__step-${step}__overlay__card__title`}
              >
                Build Activity
              </h2>
              <div
                className={`howItWorks__container__step-${step}__overlay__card__data`}
              >
                <div
                  className={`howItWorks__container__step-${step}__overlay__card__data__members`}
                >
                  <div
                    className={`howItWorks__container__step-${step}__overlay__card__data__members__title`}
                  >
                    Members
                  </div>
                  <div
                    className={`howItWorks__container__step-${step}__overlay__card__data__members__content`}
                  >
                    <img
                      src="/images/home/user-2.png"
                      alt="user 2"
                      loading="lazy"
                    />
                    <img
                      src="/images/home/user-1.png"
                      alt="user 1"
                      loading="lazy"
                    />
                  </div>
                </div>
                <div
                  className={`howItWorks__container__step-${step}__overlay__card__data__created`}
                >
                  <div
                    className={`howItWorks__container__step-${step}__overlay__card__data__created__title`}
                  >
                    Created Date
                  </div>
                  <div
                    className={`howItWorks__container__step-${step}__overlay__card__data__created__content`}
                  >
                    <Check color="#fff" />
                    <div>14 Dec</div>
                  </div>
                </div>
              </div>
              <div
                className={`howItWorks__container__step-${step}__overlay__card__description`}
              >
                <h3
                  className={`howItWorks__container__step-${step}__overlay__card__description__title`}
                >
                  Description
                </h3>
                <p
                  className={`howItWorks__container__step-${step}__overlay__card__description__body`}
                >
                  Create a nice, modern activity for your portofolio.
                </p>
              </div>
              <div
                className={`howItWorks__container__step-${step}__overlay__card__checklist`}
              >
                <h3
                  className={`howItWorks__container__step-${step}__overlay__card__checklist__title`}
                >
                  Checklist
                </h3>
                <div
                  className={`howItWorks__container__step-${step}__overlay__card__checklist__body`}
                >
                  <p>100% Complete</p>
                  <span>&nbsp;</span>
                </div>
              </div>
              <ul>
                <li>
                  <Check color="#6D8EA2" />
                  <p>Find Pipe Activity that suits your networking needs.</p>
                </li>
                <li>
                  <Check color="#6D8EA2" />
                  <p>Follow new persons every day!</p>
                </li>
                <li>
                  <Check color="#6D8EA2" />
                  <p>Post new activities to follow.</p>
                </li>
              </ul>
              <div
                className={`howItWorks__container__step-${step}__overlay__card__comment`}
              >
                <h2>Add Comment</h2>
                <div></div>
              </div>
            </div>
          </div>
          <div
            className={`howItWorks__container__robot howItWorks__container__step-${step}__robot`}
          >
            <img src="/images/home/robot.png" alt="robot" loading="lazy" />
          </div>
          <button
            className="howItWorks__container__arrow howItWorks__container__arrow__left"
            onClick={onPreviousStep}
          >
            <LeftArrow />
          </button>
          <button
            className="howItWorks__container__arrow howItWorks__container__arrow__right"
            onClick={onNextStep}
          >
            <RightArrow />
          </button>

          <div
            className={`howItWorks__container__header howItWorks__container__step-${step}__header`}
          >
            <h3 className="howItWorks__container__header__title">
              Network Launch
            </h3>
            <div
              className={`howItWorks__container__header__users howItWorks__container__step-${step}__header__users`}
            >
              <img
                className={`howItWorks__container__header__users__user howItWorks__container__header__users__user-1 howItWorks__container__step-${step}__header__users__user-1`}
                src="/images/home/user-1.png"
                alt="user 1"
                loading="lazy"
              />
              <img
                className={`howItWorks__container__header__users__user howItWorks__container__header__users__user-1 howItWorks__container__step-${step}__header__users__user-2`}
                src="/images/home/user-2.png"
                alt="user 2"
                loading="lazy"
              />
              <img
                className={`howItWorks__container__header__users__user howItWorks__container__header__users__user-1 howItWorks__container__step-${step}__header__users__user-3`}
                src="/images/home/user-3.png"
                alt="user 3"
                loading="lazy"
              />
            </div>
          </div>
          <div
            className={`howItWorks__container__body howItWorks__container__step-${step}__body`}
          >
            <div
              className={`howItWorks__container__body__activity howItWorks__container__step-${step}__body__activity`}
            >
              Add an activity...
            </div>
            <div
              className={`howItWorks__container__body__list howItWorks__container__step-${step}__body__list`}
            >
              <div
                className={`howItWorks__container__body__list__card howItWorks__container__step-${step}__body__list__card`}
              >
                <div
                  className={`howItWorks__container__body__list__card__title howItWorks__container__step-${step}__body__list__card__title`}
                >
                  Title
                </div>
                <div
                  className={`howItWorks__container__body__list__card__content howItWorks__container__step-${step}__body__list__card__content`}
                >
                  <div>On Rock Climing</div>
                  <div>Weekend Street Hockey</div>
                </div>
                <div
                  className={`howItWorks__container__body__list__card__footer howItWorks__container__step-${step}__body__list__card__footer`}
                >
                  Add a title...
                </div>
              </div>
              <div
                className={`howItWorks__container__body__list__card howItWorks__container__step-${step}__body__list__card`}
              >
                <div
                  className={`howItWorks__container__body__list__card__title howItWorks__container__step-${step}__body__list__card__title`}
                >
                  Subject
                </div>
                <div
                  className={`howItWorks__container__body__list__card__content howItWorks__container__step-${step}__body__list__card__content`}
                >
                  <img
                    className={`howItWorks__container__body__list__card__content__arrow howItWorks__container__step-${step}__body__list__card__content__arrow`}
                    src="/images/home/arrow-radius.svg"
                    alt="arrow"
                    loading="lazy"
                  />
                  <div>Walking</div>
                  <div
                    className={`howItWorks__container__body__list__card__content__empty howItWorks__container__step-${step}__body__list__card__content__empty`}
                  >
                    &nbsp;
                  </div>
                  <div
                    className={`howItWorks__container__body__list__card__content__select howItWorks__container__step-${step}__body__list__card__content__select`}
                  >
                    Camping
                  </div>
                  <div>Swimming</div>
                  <div>Surfing</div>
                </div>
                <div
                  className={`howItWorks__container__body__list__card__footer howItWorks__container__step-${step}__body__list__card__footer`}
                >
                  Add a subject...
                </div>
              </div>
              <div
                className={`howItWorks__container__body__list__card howItWorks__container__step-${step}__body__list__card`}
              >
                <div
                  className={`howItWorks__container__body__list__card__title howItWorks__container__step-${step}__body__list__card__title`}
                >
                  Body
                </div>
                <div
                  className={`howItWorks__container__body__list__card__content howItWorks__container__step-${step}__body__list__card__content`}
                >
                  <div
                    className={`howItWorks__container__body__list__card__content__empty howItWorks__container__step-${step}__body__list__card__content__empty`}
                  >
                    &nbsp;
                  </div>
                  <div
                    className={`howItWorks__container__step-${step}__body__list__card__content__disappear`}
                  >
                    Outdoor activities are...
                  </div>
                  <div>Teach children to write...</div>
                </div>
                <div
                  className={`howItWorks__container__body__list__card__footer howItWorks__container__step-${step}__body__list__card__footer`}
                >
                  Add a body...
                </div>
              </div>
            </div>
          </div>
          <div className="howItWorks__container__footer">
            <div className="howItWorks__container__footer__text">
              {data[`step${step}`].footer}
            </div>
            <div className="howItWorks__container__footer__steps">
              {buttons}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
