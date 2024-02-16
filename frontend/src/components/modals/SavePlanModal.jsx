import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useMemo } from "react";
import { useEffect } from "react";
import { IoMdClose } from "react-icons/io";

import { scheduleActions } from "../../store/scheduleSlice";
import { useNavigate } from "react-router-dom";

const SavePlanModal = (props) => {
  const modalBG = useRef(null);
  const state = useSelector((state) => state.schedule);
  const userState = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);

  const savePlan = async () => {
    const base64Incoding = window.btoa(
      encodeURIComponent(JSON.stringify(state))
    );
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PLAN_REQUEST_URI}/create`,
        {
          planId: "",
          planName: title,
          planDesc: desc,
          lastModifiedDate: "",
          ownerId: userState.userId,
          participantIds: [],
          planInfo: base64Incoding,
        }
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    navigate("/Myplan");
    props.onClose();
  };

  useMemo(() => {
    dispatch(scheduleActions.setTitle(title));
  }, [dispatch, title]);

  useEffect(() => {
    setTitle(state.title);
  }, [state.title]);

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeDesc = (e) => {
    setDesc(e.target.value);
  };

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-70"
      onClick={props.onClose}
      ref={modalBG}
    >
      <div
        className="z-10 px-10 py-4 bg-white rounded-3xl w-96 h-82"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex justify-end">
          <button
            className="mb-4 text-xl font-semibold hover:text-red-600"
            onClick={props.onClose}
          >
            <IoMdClose />
          </button>
        </div>
        <div className="flex flex-col justify-center gap-2 pb-4">
          <div className="flex justify-center gap-4">
            <label className="text-lg">계획이름 : </label>
            <input
              className="rounded-md py-1.5 text-gray-900 ring-2 ring-gray-400 focus:outline-none focus:ring-3 focus:ring-yellow-500 caret-transparent"
              type="text"
              value={title}
              onChange={onChangeTitle}
              maxLength="14"
            />
          </div>
          <label className="text-lg">간단한 계획 소개</label>
          <textarea
            className="rounded-md py-1.5 text-gray-900 ring-2 ring-gray-400 focus:outline-none focus:ring-3 focus:ring-yellow-500 caret-transparent"
            value={desc}
            onChange={onChangeDesc}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="inline-flex items-center px-4 py-2 text-sm font-semibold text-yellow-700 rounded-md bg-yellow-300 ring-1 ring-inset ring-blue-700/10"
            onClick={savePlan}
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SavePlanModal;
