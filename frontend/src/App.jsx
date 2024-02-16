import { RouterProvider, createBrowserRouter } from "react-router-dom";

import HomePage from "./pages/Home";
import RootLayout from "./pages/Root";
import RootLayoutOffWidgets from "./pages/RootOffWidgets";
import ErrorPage from "./pages/Error";
import SearchPage from "./pages/Search";
import MakePlanPage from "./pages/MakePlan";
import ApplicantList from "./pages/ApplicantList";
import TripRegisterPage from "./pages/TripResgister";
import TripDetailPage from "./pages/TripDetail";
import KakaoLogin from "./pages/KakaoLogin";
import NaverLogin from "./pages/NaverLogin";
import Mypage from "./pages/Mypage";
import MyPlan from "./pages/MyPlan";

const router = createBrowserRouter([
  {
    path: "",
    element: <RootLayoutOffWidgets />,
    children: [
      {
        path: "/makeplan",
        element: <MakePlanPage />,
      },
      {
        path: "/makeplan/:planId",
        element: <MakePlanPage />,
      },
      {
        path: "/Mypage",
        element: <Mypage />,
      },
      {
        path: "/register",
        element: <TripRegisterPage />,
      },
      {
        path: "/detail/:tripId",
        element: <TripDetailPage />,
      },
      {
        path: "/search",
        element: <SearchPage />,
      },
    ],
  },

  {
    path: "/",
    element: <RootLayout />,
    // errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: "/MyPlan",
        element: <MyPlan />,
      },
      {
        path: "login/oauth2/code/kakao",
        element: <KakaoLogin />,
      },
      {
        path: "login/oauth2/code/naver",
        element: <NaverLogin />,
      },
      {
        path: "/applicantList",
        element: <ApplicantList />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="font-spoqa">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
