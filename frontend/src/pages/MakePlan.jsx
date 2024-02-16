import { DragDropContext } from "react-beautiful-dnd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useMemo, Fragment } from "react";
import axios from "axios";

import { scheduleActions } from "../store/scheduleSlice";
import { ModalPortal } from "../components/modals/ModalPortal";
import Plan from "../components/Planning/Plan";
import Map from "../components/GoogleMap/Map";
import SavePlanModal from "../components/modals/SavePlanModal";
import ShowTime from "../components/Planning/ShowTime";

const MakePlanPage = () => {
  let list = useSelector((state) => state.schedule);
  const card = useSelector((state) => state.places);
  //
  const curUserId = useSelector((state) => state.auth).userId;
  const [isSavePlanOpen, setIsSavePlanOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isCanModify, setIsCanModify] = useState(true);
  const [checkuser, setCheckuser] = useState(false);
  const [res, setRes] = useState();

  const { planId } = useParams();

  useEffect(() => {
    const tmpList = window.sessionStorage.getItem("tmpPlan");
    if (tmpList !== null) {
      dispatch(scheduleActions.setSchedule(JSON.parse(tmpList)));
    }
    return () => {
      window.sessionStorage.removeItem("tmpPlan");
    };
  }, []);

  useEffect(() => {
    window.sessionStorage.setItem("tmpPlan", JSON.stringify(list));
  }, [list]);

  const setInitSchedule = async () => {
    if (planId !== undefined) {
      setIsCanModify(false);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_PLAN_REQUEST_URI}/plan/${planId}`
        );
        setRes(response);
        dispatch(
          scheduleActions.setSchedule(
            JSON.parse(decodeURIComponent(window.atob(response.data.planInfo)))
          )
        );
        if (response.data.ownerId === curUserId) setCheckuser(true);
        for (let i = 0; i < response.data.participantIds.length; i++) {
          if (response.data.participantIds[i].participantId === curUserId)
            setCheckuser(true);
        }
      } catch (error) {
        alert("삭제되었거나 없는 계획입니다.");
        navigate(-1);
      }
    }
  };

  useEffect(() => {
    setInitSchedule();
  }, [planId]);

  useMemo(async () => {
    let tmplist = list.list;
    let modifiedList = JSON.parse(JSON.stringify(tmplist));
    for (let i = 0; i < tmplist.length; i++) {
      let prevLoca = null;
      let prevIdx = 0;
      for (let j = 0; j < tmplist[i].length; j++) {
        if (tmplist[i][j].title !== null && tmplist[i][j].title !== undefined) {
          let curLoca = tmplist[i][j].loca;
          modifiedList[i][j].distance = undefined;
          let curIdx = j;
          if (prevLoca !== null) {
            const minute = await getDuration(prevLoca, curLoca);
            modifiedList[i][prevIdx].distance = Math.ceil(minute / 60);
            const cnt = Math.ceil(minute / 600);
            if (curIdx - prevIdx - 1 < cnt) {
              for (let k = 0; k < cnt - (curIdx - prevIdx - 1); k++) {
                if (modifiedList[i][curIdx + k + 1].title === undefined) {
                  modifiedList[i].splice(curIdx + k + 1, 1);
                } else {
                  modifiedList[i].pop();
                }
                modifiedList[i].splice(prevIdx + 1, 0, []);
              }
            }
          }
          prevLoca = curLoca;
          prevIdx = curIdx;
        }
      }
    }

    dispatch(scheduleActions.setList(modifiedList));

    async function getDuration(pl, cl) {
      return new Promise((resolve, reject) => {
        const directionsService =
          new window.google.maps.DistanceMatrixService();
        directionsService.getDistanceMatrix(
          {
            origins: [new window.google.maps.LatLng(pl[0], pl[1])],
            destinations: [new window.google.maps.LatLng(cl[0], cl[1])],
            travelMode: "TRANSIT",
          },
          (response, status) => {
            if (status === "OK") {
              resolve(response.rows[0].elements[0].duration.value);
            } else {
              console.log("Error:", status);
              reject(new Error("Error:" + status));
            }
          }
        );
      });
    }
  }, [JSON.stringify(list.list)]);

  const onDragStart = (start) => {
    if (!isCanModify) {
      start.preventDefault();
    }
  };

  const onDragEnd = async ({ source, destination }) => {
    // console.log(source);
    // console.log(destination);
    if (!destination) return; // 범위밖일 때 드래그 취소
    const idx = Number(destination.droppableId.substr(4));
    if (source.droppableId === "PlaceCard") {
      // 추가;
      const schedule = {
        img: card[source.index].photo,
        title: card[source.index].name,
        loca: card[source.index].loca,
        time: "120",
        distance: "",
        comment: "",
      };
      dispatch(
        scheduleActions.addSchedule({
          schedule: schedule,
          index: destination.index,
          day: idx,
        })
      );
    } else {
      // 이동
      const idx2 = Number(source.droppableId.substr(4));
      dispatch(
        scheduleActions.moveSchedule({
          start: { day: idx2, index: source.index },
          end: { day: idx, index: destination.index },
        })
      );
    }
  };

  const doModifyPlan = async () => {
    const base64Incoding = window.btoa(
      encodeURIComponent(JSON.stringify(list))
    );
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PLAN_REQUEST_URI}/update`,
        {
          planId: planId,
          planName: res.data.planName,
          planDesc: res.data.planDesc,
          lastModifiedDate: "",
          ownerId: res.data.ownerId,
          participantIds: res.data.participantIds,
          planInfo: base64Incoding,
        }
      );
    } catch (error) {
      console.error("수정 Error : ", error);
    }
  };

  // 계획 저장하기 모달
  const savePlan = () => {
    if (planId !== undefined) {
      doModifyPlan();
      setIsCanModify(false);
      setCheckuser(true);
    } else {
      setIsSavePlanOpen(true);
    }
  };
  const CloseSavePlanModal = () => {
    setIsSavePlanOpen(false);
  };

  const modifyPlan = () => {
    setIsCanModify(true);
    setCheckuser(false);
  };

  const deletePlan = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_PLAN_REQUEST_URI}/plan/${planId}`
      );
    } catch (error) {
      console.error("삭제중 Error: ", error);
    }
    navigate(-1);
  };

  useEffect(() => {
    // 모달이 열렸을 때 스크롤 막기 위함
    if (isSavePlanOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSavePlanOpen]);

  return (
    <div className="h-full">
      <ShowTime />
      <div className="relative h-full pl-10">
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
          <div className="flex h-full">
            <Plan isCanModify={isCanModify} />
            <Map isCanModify={isCanModify} />
          </div>
        </DragDropContext>
        {isCanModify && (
          <button
            className="absolute top-0 right-0 px-2 py-1 text-xl text-white bg-yellow-400 border-2 border-yellow-600 rounded-md"
            onClick={savePlan}
          >
            저장하기
          </button>
        )}
        {checkuser && (
          <div className="absolute top-0 right-0 flex gap-2">
            <button
              className="px-2 py-1 text-xl text-white bg-yellow-400 border-2 border-yellow-600 rounded-md"
              onClick={modifyPlan}
            >
              수정하기
            </button>
            <button
              className="px-2 py-1 text-xl text-white bg-red-400 border-2 border-red-600 rounded-md"
              onClick={deletePlan}
            >
              삭제하기
            </button>
          </div>
        )}
        {isSavePlanOpen && (
          <ModalPortal>
            <SavePlanModal onClose={CloseSavePlanModal} planId={planId} />
          </ModalPortal>
        )}
      </div>
    </div>
  );
};

export default MakePlanPage;
