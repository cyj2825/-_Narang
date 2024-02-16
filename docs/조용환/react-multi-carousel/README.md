# react-multi-carousel

carousel 인데 2x2 등의 멀티 아이템을 구현하기 위해 사용한 라이브러리, 자체 구현의 경우 div 속에 div를 넣으면서 img 가 깨지는 현상이 심하게 일어나 사용하게 된 라이브러리.

react-responsive-carousel같은 경우는 사용할 수 있는 옵션은 비슷하게 많지만, example 코드가 빈약해 적용이 힘들어 react-mulit-carousel을 사용하게 되었다. 이를 이용해 infinite loop, autoplay, 그리고 3x2, 2x2 등 그리드 개념의 캐러셀을 움직이도록 만들 수 있게 되었다.

```jsx
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};
<Carousel
  swipeable={false}
  draggable={false}
  showDots={true}
  responsive={responsive}
  ssr={true} // means to render carousel on server-side.
  infinite={true}
  autoPlay={this.props.deviceType !== "mobile" ? true : false}
  autoPlaySpeed={1000}
  keyBoardControl={true}
  customTransition="all .5"
  transitionDuration={500}
  containerClass="carousel-container"
  removeArrowOnDeviceType={["tablet", "mobile"]}
  deviceType={this.props.deviceType}
  dotListClass="custom-dot-list-style"
  itemClass="carousel-item-padding-40-px"
>
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
  <div>Item 4</div>
</Carousel>;
```

swipable : 탭, 드래그로 슬라이드 변경 가능 여부

draggable: 마우스 드래그 슬라이드 변경 여부

showDots: 하단 도트 표시 여부

responsive : 반응형 디자인을 위한 설정

ssr: ssr 사용여부

infinite : 무한 루프 사용 여부

autoPlay : 자동재생 활성화 여부

autoPlaySpeed: 키브도 컨트롤 허용 여부

customTransition : “transitionProperty transitionDuration [transitionTimingFunction] [transitionDelay]” 로 이루어짐. ex) customTransition=”all 0.5s ease-in-out 0s”

transitionDuration : 트랜지션의 지속 시간 밀리초 단위 지정

containerClass: 컨테이너 적용 사용자 지정 클래스 

removeArrowOnDeviceType : 특정 디바이스 유형에서 화살표 숨길지 여부 

deviceType: 현재 사용 중인 디바이스 유형

dotListClass : 도트 리스트 적용되는 사용자 지정 클래스 지정

itemClass : 각 슬라이드 아이템에 적용되는 사용자 지정 클래스를 지정합니다.