import { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";

const Schedule = (props) => {
  const index = props.data[1];
  const card = props.data[0];
  const data = {
    img: card.img,
    title: card.title,
    time: card.time,
    comment: "",
    loca: [card.loca],
    p: card.padding - 135,
  };

  const time = useSelector((state) => state.time);
  // console.log(time);
  const [height, setHeight] = useState();

  useEffect(() => {
    setHeight(time.blackHeight);
    console.log(height);
  }, height);

  const CSS = `bg-black h-[${height}px]`;

  return (
    <>
      {data.title ? (
        <Draggable
          draggableId={`${props.data[2]}list_item${index}`}
          index={index}
          key={index}
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div className="flex flex-col bg-white w-56 h-24 rounded-xl overflow-hidden">
                <div className="flex">
                  <img
                    className="w-24 h-24 rounded-xl"
                    src={data.img}
                    alt="이미지"
                  />
                  <div>
                    <p>{data.title}</p>
                    <p>{data.time} 분</p>
                    <textarea
                      className="resize-none w-32"
                      name="comment"
                      id="comment"
                      placeholder="간단한 메모"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </Draggable>
      ) : (
        <Draggable
          draggableId={`${props.data[2]}list_item${index}`}
          index={index}
          key={index}
          isDragDisabled
        >
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <div className={CSS}></div>
            </div>
          )}
        </Draggable>
      )}
    </>
  );
};

export default Schedule;
