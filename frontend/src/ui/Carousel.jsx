import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import TripSummaryMain from "../components/Trip/Read/TripSummaryMain";

// 테스트용 주석입니다.
const CarouselTemplete = ({ list }) => {
  const [transformValue, setTransformValue] = useState(0);
  const [itemWidth, setItemWidth] = useState(0);

  const tmpList = [];
  for (let i = 0; i < list.length; i += 2) {
    tmpList.push(list.slice(i, i + 2));
  }

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  const handleSlide = (currentItem, currentSlide) => {
    // 현재 항목 및 해당 폭을 기반으로 새로운 transform 값을 계산합니다.
    const newTransformValue = -currentItem * itemWidth;
    setTransformValue(newTransformValue);
  };

  const handleResize = () => {
    // 창 크기 조정 시 항목 너비를 업데이트합니다.
    const currentWidth = document.querySelector(".carousel-item").offsetWidth;
    setItemWidth(currentWidth);
  };
  return (
    <div className="h-[40vh]">
      <Carousel
        swipeable={false}
        draggable={true}
        showDots={true}
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={3000}
        keyBoardControl={true}
        customTransition="transform 500ms ease-in-out 0s"
        transitionDuration={500}
        containerClass="carousel-container w-full"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"
      >
        {tmpList.map((tripList, index) => (
          <div key={index} className="h-full">
            {tripList.map((trip, tripIndex) => (
              <TripSummaryMain key={tripIndex} trip={trip} />
            ))}
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default CarouselTemplete;
