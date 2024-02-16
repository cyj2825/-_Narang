import { Fragment, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SlCalender, SlLocationPin, SlPeople, SlBadge } from "react-icons/sl";
import axios from "axios";
import { useSelector } from "react-redux";
import { ModalPortal } from "../../modals/ModalPortal";
import ApplicationModal from "../../modals/ApplicationModal";
import TripUpdateModal from "../../modals/TripUpdateModal";
import DateFormatter from "../../DateFormatter";
import TripParticipantsInfo from "./TripParticipantsInfo";
export default function TripDetail() {
  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isLeader, setIsLeader] = useState(false);
  const [isParticipant, setIsParcitipant] = useState(false);
  const { tripId } = useParams();
  const [tripDetails, setTripDetails] = useState(null);
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  // 신청모달 open
  const OpenApplicationModal = () => {
    setIsApplicationOpen(true);
  };
  // 신청모달 close
  const CloseApplicationModal = () => {
    setIsApplicationOpen(false);
  };
  // 수정모달 open
  const OpenUpdateModal = () => {
    setIsUpdateOpen(true);
  };
  // 수정모달 close
  const CloseUpdateModal = () => {
    setIsUpdateOpen(false);
    fetchData(); // 수정된 정보를 다시 불러오는 함수
  };
  // 취소하기 클릭
  const handleCancelClick = async () => {
    navigate("/applicantList");
  };
  const handleDeleteClick = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_TRIP_REQUEST_URI}/trip`,
        {
          data: {
            tripId: tripDetails.tripId,
            userId: tripDetails.tripLeaderId,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        alert("삭제되었습니다!");
      }
    } catch (error) {
      console.error("삭제 불가능", error);
    }
    navigate("/search");
  };
  // useEffect (여행 상세 정보 로딩)
  const fetchData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_TRIP_REQUEST_URI}/trip/${tripId}`
      );
      // 상세 정보 저장
      setTripDetails(response.data);
      // 날짜 포맷 설정
      setDepartureDate(
        DateFormatter({ dateString: response.data.departureDate })
      );
      setReturnDate(DateFormatter({ dateString: response.data.returnDate }));
      // 모집글 작성자 여부 확인
      setIsLeader(response.data.tripLeaderId === userId);
      // 모집글 참가자 여부 확인
      if (!isLeader) {
        setIsParcitipant(
          response.data.participants.some(
            (participant) => participant.participantId === userId
          )
        );
      }
    } catch (error) {
      console.error("게시판 상세정보를 가져오는 중 에러 발생:", error);
    }
  };
  const OpenPlanDetail = () => {
    navigate(`/makeplan/${tripDetails.tripPlanId}`);
  };
  useEffect(() => {
    fetchData();
  }, [tripId]);
  // useEffect (모달 열렸을 때 스크롤 막기)
  useEffect(() => {
    if (isApplicationOpen || isUpdateOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isApplicationOpen, isUpdateOpen]);
  return (
    <Fragment>
      <div className="grid grid-cols-3 gap-3">
        <div className="col-span-2">
          <div className="px-8 py-4 mx-auto">
            {tripDetails ? (
              <div>
                <img
                  src={tripDetails.tripImgUrl}
                  className="my-1 w-full h-[15rem]"
                />
                <div className="flex justify-between">
                  <p className="my-5 text-lg font-bold text-left">
                    {tripDetails.tripName}
                  </p>
                </div>
                <div>
                  <div className="mr-10 text-sm font-medium text-right text-stone-700">
                    조회수 : {tripDetails.viewCnt}
                  </div>
                </div>
                <div>
                  <p className="my-5 text-base font-bold text-left">
                    여행 일정
                  </p>
                  <div className="p-1 rounded bg-stone-100">
                    <div className="flex flex-row items-center my-3 text-sm">
                      <SlCalender className="mx-3 text-neutral-400" size="24" />
                      <div className="text-neutral-700">
                        {departureDate} ~ {returnDate}
                      </div>
                    </div>
                    <div className="flex flex-row items-center my-3 text-sm">
                      <SlLocationPin
                        className="mx-3 text-neutral-400"
                        size="24"
                      />
                      <div className="text-neutral-700">
                        {tripDetails.continent}, {tripDetails.country},{" "}
                        {tripDetails.city}
                      </div>
                    </div>
                    <div className="flex flex-row items-center my-3 text-sm">
                      <SlPeople className="mx-3 text-neutral-400" size="24" />
                      <div className="text-neutral-700">
                        {" "}
                        {tripDetails.participants.length} /{" "}
                        {tripDetails.tripParticipantsSize}{" "}
                      </div>
                    </div>
                    <div className="flex flex-row items-center my-3 text-sm">
                      <SlBadge className="mx-3 text-neutral-400" size="24" />
                      <div className="flex flex-wrap justify-start">
                        {tripDetails.tripRoles &&
                          tripDetails.tripRoles.map((role, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 m-0.5 text-sm font-medium rounded-full text-neutral-700 bg-stone-100 ring-1 ring-inset ring-stone-500"
                            >
                              {role}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="my-5 text-base font-bold text-left">
                    여행 소개
                  </p>
                  <div className="m-6 text-sm text-left text-wrap ">
                    {tripDetails.tripDesc}
                  </div>
                </div>
              </div>
            ) : (
              <div>Loading...</div>
            )}
            {isApplicationOpen && (
              <ModalPortal>
                <ApplicationModal
                  onClose={CloseApplicationModal}
                  data={tripDetails}
                />
              </ModalPortal>
            )}
            {isUpdateOpen && (
              <ModalPortal>
                <TripUpdateModal
                  onClose={CloseUpdateModal}
                  data={tripDetails}
                />
              </ModalPortal>
            )}
          </div>
        </div>
        <div className="col-span-1">
          <div className="flex justify-center mt-4">
            {isLeader ? (
              <div className="w-full">
                <button
                  className="w-2/5 py-3 mr-2 text-sm font-medium text-yellow-800 bg-yellow-200 rounded-md ring-1 ring-inset ring-yellow-800/10"
                  onClick={OpenUpdateModal}
                >
                  수정하기
                </button>
                <button
                  className="w-2/5 py-3 text-sm font-medium text-red-800 bg-red-200 rounded-md ring-1 ring-inset ring-red-800/10"
                  onClick={handleDeleteClick}
                >
                  삭제하기
                </button>
              </div>
            ) : isParticipant ? (
              <button
                className="w-full py-3 text-sm font-medium text-red-800 bg-red-200 rounded-md ring-1 ring-inset ring-red-800/10"
                onClick={handleCancelClick}
              >
                취소하기
              </button>
            ) : (
              <button
                className="w-full py-3 text-sm font-medium text-indigo-700 rounded-md bg-indigo-50 ring-1 ring-inset ring-indigo-700/10"
                onClick={OpenApplicationModal}
                disabled={isLeader || isParticipant}
              >
                신청하기
              </button>
            )}
          </div>
          {tripDetails ? (
            <div>
              <p className="mt-5 mb-3 text-base font-bold">일정 정보</p>
              <button
                className="w-full py-3 text-sm font-medium rounded-md text-neutral-700 bg-neutral-50 ring-1 ring-inset ring-neutral-700/10"
                onClick={OpenPlanDetail}
              >
                일정 상세 보기
              </button>
              <p className="mt-5 mb-3 text-base font-bold">여행 참여자 정보</p>
              <TripParticipantsInfo
                participants={tripDetails.participants}
                leaderId={tripDetails.tripLeaderId}
              />
            </div>
          ) : (
            <div>loading 💦</div>
          )}
        </div>
      </div>
    </Fragment>
  );
}
