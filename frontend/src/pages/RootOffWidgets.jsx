import { Outlet } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import { Fragment } from "react";
import UpperNavbar from "../components/UpperNavBar";

function RootLayout() {
  return (
    <Fragment>
      <UpperNavbar />
      <MainNavigation />
      <div className="flex justify-center h-screen mt-5 ml-[12rem]">
        <main className="w-10/12 h-screen text-center">
          <Outlet />
        </main>
      </div>
    </Fragment>
  );
}

export default RootLayout;
