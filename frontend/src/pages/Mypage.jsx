import { useState, Fragment } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";

import UserInfo from "../components/Mypage/UserInfo";
import SmallPlan from "../components/Mypage/SmallPlan";
import Mileage from "../components/Mypage/Mileage";
import MyBadge from "../components/Mypage/MyBadge";

const Mypage = () => {

  return (
    <Fragment>
      <div className="grid w-full h-screen grid-cols-9 gap-5">
        <div className="col-span-6">
          <div className="flex flex-col w-full my-3">
            <Fragment>
              <SmallPlan/>
            </Fragment>
          </div>
        </div>
        <div className="col-span-3">
          <div className="flex flex-col mt-10">
            <UserInfo />
            <Mileage />
            <MyBadge />
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Mypage;
