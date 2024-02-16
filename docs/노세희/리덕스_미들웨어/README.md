# 리덕스 미들웨어

- 리액션이 디스패치 된 다음, 리듀서에 해당 액션을 받아와서 업데이트 하기 전에 추가적인 작업 가능

- 보통, 비동기 작업(백엔드 API를 연동해야 된다면)처리 할 때, 미들웨어 사용해서 처리
- 비동기 작업에 관련된 미들웨어 라이브러리
    
     [redux-thunk](https://github.com/reduxjs/redux-thunk), [redux-saga](https://github.com/redux-saga/redux-saga), [redux-observable](https://redux-observable.js.org/), [redux-promise-middleware](https://www.npmjs.com/package/redux-promise-middleware) 
    

## redux-thunk

`npm install redux-thunk`
- 비동기 작업을 처리할 때 가장 많이 사용하는 미들웨어
- 액션 객체가 아닌 함수를 디스패치 할 수 있음!

### **redux-thunk로 프로미스 다루기**

- `Promise 객체` 비동기 작업이 맞이할 미래의 완료 또는 실패와 그 결과 값
- 대기(*pending)*: 이행하지도, 거부하지도 않은 초기 상태.
- 이행(*fulfilled)*: 연산이 성공적으로 완료됨.
- 거부(*rejected)*: 연산이 실패함.