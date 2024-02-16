# react-calendar

앞으로 있을 미래 여행 계획을 확인하고, 일정 짜는 것에 도움이 되기 위한 캘린더가 필요해 해당 라이브러리를 사용.

ex)

```jsx
import Calendar from "react-calendar";

export default function CalendarCp() {

return (
    <div>
      <h1>{`현재 표시된 날짜 : ${moment(value).format("YYYY-MM-DD")}`}</h1>
      <Calendar
        calendarType="gregory"
        onChange={setValue}
        value={value}
        minDate={new Date(2024, 0, 1)}
        tileContent={addContent}
        onClickDay={onClickDayHandler}
      />
    </div>
  );
}
```

calendarType : 주의 시작을 어느 요일로 할지

onChange : 값 변화 연동 함수

value : onChange와 세트로 사용. useState의 value, setValue와 같은 관계

minDate : 설정할 수 있는 최소 날짜

titleContent : 캘린더 내부(날짜)아래에 넣을 수 있는 컨텐츠

onClickDay : 날짜 클릭시 실행되는 함수 설정

- 비슷하게 쓸 수 있는 라이브러리
    - react-big-calendar : 캘린더 자체가 메인 기능은 아니었기에 사용  x
    - react-datepicker : 항상 캘린더를 띄워놔야했기에 다른 옵션을 사용.