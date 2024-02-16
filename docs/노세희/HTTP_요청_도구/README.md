서버와 데이터를 주고받기 위해서는 HTTP 통신을 해야 함

React에는 HTTP Client(HTTP 상에서 커뮤니케이션을 하는 자바 기반 컴포넌트) 내장 클래스가 존재하지 않음

따라서 React에서 AJAX(Asynchronous Javascript And XML)를 구현하려면 JavaScript 내장객체인 XMLRequest를 사용하거나, 다른 HTTP Client를 사용

`AJAX : 서버와 통신하기 위해 XMLHttpRequest 객체를 사용하는 것으로, JSON, XML, HTML 그리고 일반 텍스트 형식 등을 포함한 다양한 포맷을 비동기로 주고받을 수 있다.`

HTTP Client 라이브러리에는 **Fetch API, Axios**가 있는데, 사용하는 형태에 약간 차이가 있음!

## 💥 Axios

- **GET**: 데이터 조회, **POST**: 데이터 등록, **PUT**: 데이터 수정, **DELETE**: 데이터 제거
- 비동기로 서버에 요청, 응답이 오면 받아서 성공/실패 시를 구분해서 처리
- 서버 요청 후 응답이 오기까지 시간이 걸리기 때문에 요청은 비동기 처리
    
    응답을 처리하는 부분은 `then` 이나 `await`  사용
    
- 더 편리한 API 기능을 제공, **프로미스 기반으로 비동기 작업을 처리하는데 있어서 직관적**
- 웹 브라우저 호환성, 보완성이 높음 → 보안성, 장기성, 큰 프로젝트를 사용하기 위해서 추천

### **1. Axios 설치**

`npm install axios`

### **2. Axios 사용하기**

### ✅ useState와 useEffect로 데이터 로딩하기

- useState를 사용하여 요청 상태를 관리, useEffect를 사용하여 컴포넌트가 렌더링되는 시점에 요청을 시작

```jsx
// 상태 관리는 (요청의 결과, 로딩상태, 에러) 3가지 상태를 관리!

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      // 요청이 시작 할 때에는 error 와 users 를 초기화하고
      setError(null);
      setUsers(null);
      // loading 상태를 true 로 바꿉니다.
      setLoading(true);
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users'
      );
      setUsers(response.data); // 데이터는 response.data 안에 
    } catch (e) {
      setError(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return null;
  return (
    <>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={fetchUsers}>다시 불러오기</button>
    </>
  );
}

export default Users;
```

### ✅ useReducer로 요청 상태 관리하기

- `useState`의 setState 함수를 여러 번 사용하지 않아도 되고, 리듀서로 로직 분리했으니 재사용성 증가!!

```jsx
import React, { useEffect, useReducer } from 'react';
import axios from 'axios';

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null
      };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null
      };
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function Users() {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: null
  });

  const fetchUsers = async () => {
    dispatch({ type: 'LOADING' });
    try {
      const response = await axios.get(
        'https://jsonplaceholder.typicode.com/users'
      );
      dispatch({ type: 'SUCCESS', data: response.data });
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const { loading, data: users, error } = state; // state.data 를 users 키워드로 조회

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return null;
  return (
    <>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={fetchUsers}>다시 불러오기</button>
    </>
  );
}

export default Users;
```

### ✅ **useAsync 커스텀 Hook 만들어서 사용**

- 데이터를 요청할 때마다 리듀서를 작성하는 것은 번거로운 일 → 쉽게 재사용
- 첫번째 파라미터 `API 요청을 시작하는 함수`, 두번째 파라미터 `deps`

```jsx
// uesAsync.js
import { useReducer, useEffect } from 'react';

function reducer(state, action) {
  switch (action.type) {
    case 'LOADING':
      return {
        loading: true,
        data: null,
        error: null
      };
    case 'SUCCESS':
      return {
        loading: false,
        data: action.data,
        error: null
      };
    case 'ERROR':
      return {
        loading: false,
        data: null,
        error: action.error
      };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

function useAsync(callback, deps = []) {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    data: null,
    error: false
  });

  const fetchData = async () => {
    dispatch({ type: 'LOADING' });
    try {
      const data = await callback();
      dispatch({ type: 'SUCCESS', data });
    } catch (e) {
      dispatch({ type: 'ERROR', error: e });
    }
  };

  useEffect(() => {
    fetchData();
    // eslint 설정을 다음 줄에서만 비활성화
    // eslint-disable-next-line
  }, deps);

  return [state, fetchData];
}

export default useAsync;

// user.js
import React from 'react';
import axios from 'axios';
import useAsync from './useAsync';

// useAsync 에서는 Promise 의 결과를 바로 data 에 담기 때문에,
// 요청을 한 이후 response 에서 data 추출하여 반환하는 함수를 따로 생성
async function getUsers() {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/users'
  );
  return response.data;
}

function Users() {
  const [state, refetch] = useAsync(getUsers, []);

  const { loading, data: users, error } = state; // state.data 를 users 키워드로 조회

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return null;
  return (
    <>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={refetch}>다시 불러오기</button>
    </>
  );
}

export default Users;
```

### ✅ API에 파라미터가 필요한 경우

```jsx
// user.js
import React from 'react';
import axios from 'axios';
import useAsync from './useAsync';

async function getUser(id) {
  const response = await axios.get(
    `https://jsonplaceholder.typicode.com/users/${id}`
  );
  return response.data;
}

function User({ id }) {
  const [state] = useAsync(() => getUser(id), [id]);
  const { loading, data: user, error } = state;

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!user) return null;

  return (
    <div>
      <h2>{user.username}</h2>
      <p>
        <b>Email:</b> {user.email}
      </p>
    </div>
  );
}

export default User;

// Users.js
import React, { useState } from 'react';
import axios from 'axios';
import useAsync from './useAsync';
import User from './User';

// useAsync 에서는 Promise 의 결과를 바로 data 에 담기 때문에,
// 요청을 한 이후 response 에서 data 추출하여 반환하는 함수를 따로 생성
async function getUsers() {
  const response = await axios.get(
    'https://jsonplaceholder.typicode.com/users'
  );
  return response.data;
}

function Users() {
  const [userId, setUserId] = useState(null);
  const [state, refetch] = useAsync(getUsers, [], true);

  const { loading, data: users, error } = state; // state.data 를 users 키워드로 조회

  if (loading) return <div>로딩중..</div>;
  if (error) return <div>에러가 발생했습니다</div>;
  if (!users) return <button onClick={refetch}>불러오기</button>;
  return (
    <>
      <ul>
        {users.map(user => (
          <li
            key={user.id}
            onClick={() => setUserId(user.id)}
            style={{ cursor: 'pointer' }}
          >
            {user.username} ({user.name})
          </li>
        ))}
      </ul>
      <button onClick={refetch}>다시 불러오기</button>
      {userId && <User id={userId} />}
    </>
  );
}

export default Users;
```

## 💥 Fetch API

### 장점

- 자바스크립트의 내장 라이브러리 이므로 별도로 import 할 필요가 없음
- `Promise` 기반으로 만들어졌기 때문에 데이터를 다루기 편리
- 내장 라이브러리이기 때문에 업데이트에 따른 에러 방지가 가능

### 단점

- 지원하지 않는 브라우저가 존재 (IE11...)
- 네트워크 에러 발생 시 response timeout이 없어 기다려야 함
- JSON으로 변환해주는 과정 필요
- 상대적으로 axios에 비해 기능이 부족

```jsx
const url ='<http://localhost3000/test`>
const option ={
   method:'POST',
   header:{
     'Accept':'application/json',
     'Content-Type':'application/json';charset=UTP-8'
  },
  body:JSON.stringify({ // body 부분에 stringify()
  	name:'name',
    age:20
  })

  fetch(url, options) // url이 인자로 들어감
  	.then(response => console.log(response))
    ```