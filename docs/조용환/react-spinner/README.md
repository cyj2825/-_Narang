# react-spinners

사용자 경험을 좋게 만들기 위해 로딩 스피너의 필요성을 느꼈고, 다양한 로딩 스피너 라이브러리 중 하나인 react-spinners를 사용했다. react로 개발했기에 react에서 사용하기 편한 라이브러리가 필요해서 사용하게 되었다

ex)

```jsx
import ClipLoader from "react-spinners/ClipLoader";

export default function LoadingSpinner () {
	return <ClipLoader color="d3d3d3" />
}
```