import { useSelector } from "react-redux";
import { Draggable, Droppable } from "react-beautiful-dnd";

const PlaceCard = () => {
  const searchResults = useSelector((state) => state.places);

  return (
    <Droppable droppableId="PlaceCard">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="w-56"
        >
          {searchResults.map((place, index) => (
            <Draggable
              draggableId={`draggable_${index}`}
              index={index}
              key={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <div className="flex justify-center my-2 overflow-hidden bg-white border rounded-lg border-neutral-200">
                    <div className="flex-col text-left">
                      <img className="h-20 rounded-lg w-60" src={place.photo} />
                      <div className="ml-2 text-sm font-semibold">
                        {place.name}
                      </div>
                      <div className="mx-2 my-1 border border-neutral-200"></div>
                      <div className="ml-2 text-xs">{place.businessStatus}</div>
                      <div className="mx-2 my-1 border border-neutral-200"></div>

                      <div className="ml-2 text-xs">
                        {place.formattedAddress}
                      </div>
                      <div className="mx-2 my-1 border border-neutral-200"></div>

                      <div className="mb-1 ml-2 text-xs">⭐ {place.rating}</div>
                    </div>
                  </div>
                </div>
              )}
            </Draggable>
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default PlaceCard;
