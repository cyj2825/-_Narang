import { Fragment, useEffect, useState } from "react";
import colors from "tailwindcss/colors";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

import { mainConceptDescriptions } from "../data/concepts";
import TripList from "../components/TripList";
import Concept from "../components/Concept";

const HomePage = () => {
  const [lineColor, setLineColor] = useState(colors.teal["400"]);
  const { concept, conceptColor } = useSelector((state) => state.concept);
  const mainConceptDescription = mainConceptDescriptions[concept];
  const [className, setClassName] = useState(`bg-${conceptColor}-500`);

  useEffect(() => {
    // conceptColor가 변경될 때마다 className 상태를 업데이트
    const newClassName = `w-full h-[20%] bg-${conceptColor}-500 rounded-3xl flex text-white items-center justify-center transition-colors duration-700`;
    setClassName(newClassName);
    setLineColor(colors[conceptColor]["400"]);
  }, [conceptColor]);

  const textAnimation = {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
    exit: {
      x: 100,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Fragment>
      <div className="h-screen">
        <div className={`${className} text-center`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={concept}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={textAnimation}
              className="text-2xl"
            >
              {mainConceptDescription.map((des, index) => {
                return <div key={index}>{des}</div>;
              })}
            </motion.div>
          </AnimatePresence>
        </div>
        <div
          className="mt-2"
          style={{
            height: "5px",
            backgroundRepeat: "repeat-x",
            backgroundImage: `linear-gradient(to right, ${lineColor} 33%, rgba(0, 0, 0, 0) 0%)`,
            backgroundSize: "40px 2px",
          }}
        ></div>
        <Concept />
        <div
          className="mt-2"
          style={{
            height: "5px",
            backgroundRepeat: "repeat-x",
            backgroundImage: `linear-gradient(to right, ${lineColor} 33%, rgba(0, 0, 0, 0) 0%)`,
            backgroundSize: "40px 2px",
          }}
        ></div>
        <TripList />
      </div>
    </Fragment>
  );
};

export default HomePage;
