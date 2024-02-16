import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdClose } from "react-icons/io";

const TripEditModal = ({ data, onClose }) => {
  const modalBG = useRef("");

  const [board, setBoard] = useState({
    title: data.tripName,
    img: "",
    description: data.tripDesc,
  });

  const [imgUrl, setImgUrl] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    setBoard((board) => ({
      ...board,
      img: file,
    }));

    setImgUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    const requestData = {
      ...data,
      tripId: data.tripId,
      tripName: board.title,
      tripDesc: board.description,
    };

    try {
      // 데이터 추가
      formData.append(
        "tripModifyRequest",
        new Blob([JSON.stringify(requestData)], {
          type: "application/json",
        })
      );

      // 이미지 파일이 선택되었을 경우에만 추가
      if (board.img) {
        formData.append("tripImg", board.img);
      }


      // 데이터를 서버로 전송
      const response = await axios.patch(
        `${import.meta.env.VITE_TRIP_REQUEST_URI}/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // 저장 후 모달 닫기
      onClose();
    } catch (error) {
      console.error("서버 응답 에러", error);
    }
  };

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-opacity-60 bg-neutral-300"
      onClick={onClose}
      ref={modalBG}
    >
      <div
        className="z-40 px-10 py-8 bg-white w-[28rem] h-[40rem] rounded-3xl "
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="font-spoqa">
          <div className="flex justify-end mr-1">
            <button
              className="mb-4 text-xl font-semibold hover:text-red-600"
              onClick={onClose}
            >
              <IoMdClose />
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <p className="mb-4 text-base font-semibold">여행 정보 수정</p>
            <label className="text-sm font-medium">제목</label>
            <input
              type="text"
              value={board.title}
              onChange={(e) => setBoard({ ...board, title: e.target.value })}
              className="w-full mb-4 border rounded-sm border-neutral-300 p-1.5 text-neutral-700 placeholder:text-neutral-300 text-sm"
            />
            <label className="text-sm font-medium">이미지</label>
            <div className="mb-4">
              {imgUrl ? (
                <img src={imgUrl} className="h-32 my-1" alt="Selected Image" />
              ) : (
                <img
                  src={data.tripImgUrl}
                  className="h-32 my-1"
                  alt="Default Image"
                />
              )}
              <input
                type="file"
                onChange={handleImageChange}
                className="text-xs"
                accept="image/*"
              />
            </div>
            <label className="text-sm font-medium">설명</label>
            <textarea
              value={board.description}
              onChange={(e) =>
                setBoard({ ...board, description: e.target.value })
              }
              className="w-full text-xs rounded-md resize-none h-32 p-1.5 border border-neutral-300 ext-neutral-700"
              name="description"
            />
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                저장
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 mr-4 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TripEditModal;
