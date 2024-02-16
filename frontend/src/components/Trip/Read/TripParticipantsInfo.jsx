import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import UserInfo from "../../Mypage/UserInfo";

export default function TripParticipantsInfo({ participants, leaderId }) {
  const [usersInfo, setUsersInfo] = useState({});
  const [balances, setBalances] = useState({});

  const fetchUsersInfo = async () => {
    try {
      for (const participant of participants) {
        const userResponse = await axios.get(
          `${import.meta.env.VITE_USER_REQUEST_URI}/profile/${participant.participantId}`
        );
        const userData = userResponse.data;

        const balanceResponse = await axios.get(
          `${import.meta.env.VITE_PAYMENT_REQUEST_URI}/balance?user_id=${participant.participantId}`
        );
        const balanceData = balanceResponse.data;

        setUsersInfo((prevUsersInfo) => ({
          ...prevUsersInfo,
          [participant.participantId]: userData,
        }));

        setBalances((prevBalances) => ({
          ...prevBalances,
          [participant.participantId]: balanceData,
        }));
      }
    } catch (error) {
      console.error("Error fetching users info:", error);
    }
  };

  useEffect(() => {
    fetchUsersInfo();
  }, [participants]);

  return (
    <Fragment>
      <div>
        {participants &&
          participants.map((participant, idx) => (
            <div
              key={idx}
              className={`grid grid-rows-2 px-2 pt-1 mb-2  rounded-lg ${
                participant.participantId === leaderId
                  ? "bg-amber-300 bg-opacity-20"
                  : "border border-neutral-200"
              }`}
            >
              <div className="row-span-1 mx-2 my-2">
                <div className="grid grid-cols-5">
                  <div className="col-span-1">
                    <img
                      className="inline-block rounded-full w-14 h-14 ring-2 ring-white"
                      src={usersInfo[participant.participantId]?.profile_url}
                      alt=""
                    />
                  </div>

                  <div className="flex flex-col flex-wrap justify-center col-span-4">
                    <div>
                      <p className="text-base font-bold">
                        {usersInfo[participant.participantId]?.nickname}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col row-span-1 mt-1 ml-3 text-left align-middle">
                <div className="flex flex-row my-1">
                  <span className="mx-2 text-xs">
                    {" "}
                    {usersInfo[participant.participantId]?.gender === "male"
                      ? "🧑🏻"
                      : "👧🏻"}
                  </span>
                  <span className="mr-1 text-xs">
                    {usersInfo[participant.participantId]?.gender === "male"
                      ? "남성"
                      : "여성"}
                  </span>
                  <span className="mr-1 text-xs">
                    {usersInfo[participant.participantId]?.ageRange}대
                  </span>
                </div>
                <div className="flex flex-row flex-wrap my-1">
                  <p className="ml-2 mr-1 text-xs">💰</p>
                  <p className="mx-2 text-xs">소유 마일리지 </p>
                  <p className="text-xs">
                    {balances[participant.participantId]} 원
                  </p>
                </div>
              </div>
            </div>
          ))}
      </div>
    </Fragment>
  );
}
