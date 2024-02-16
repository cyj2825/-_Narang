import { Droppable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";

import DayPlan from "./DayPlan";

const Plan = ({ isCanModify }) => {
  const list = useSelector((state) => state.schedule).list;

  return (
    <div className="relative w-full flex overflow-x-scroll gap-1 m-1">
      {list.map((data, index) => (
        <div className="flex" key={index}>
          <Droppable droppableId={`list${index}`}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                <DayPlan isCanModify={isCanModify} index={index} key={index} />
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </div>
  );
};

export default Plan;
