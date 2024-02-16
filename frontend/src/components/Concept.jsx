import { conceptList, conceptButtonColorObject } from "../data/concepts";
import { useSelector, useDispatch } from "react-redux";
import { conceptActions } from "../store/conceptSlice";
import ButtonConcept from "../ui/ButtonConcept";

export default function Concept() {
  const dispatch = useDispatch();
  const { concept: selectedConcept } = useSelector((state) => state.concept);
  const { conceptColor: selectedConceptColor } = useSelector(
    (state) => state.concept
  );
  const clickHandler = (concept) => {
    dispatch(conceptActions.changeConcept({ concept: concept }));
  };

  return (
    <div className="flex justify-between mx-4 mt-3">
      {conceptList.map((concept) => {
        const colorClass = conceptButtonColorObject[concept];
        const isSelected = concept === selectedConcept;
        return (
          <ButtonConcept
            onClick={() => clickHandler(concept)}
            className={`m-1 w-16 min-w-10 h-16 rounded-lg ${colorClass} ${
              isSelected
                ? "neon-" +
                  selectedConceptColor +
                  " shadow-none -translate-y-2 transition duration-300"
                : ""
            }`}
            key={concept}
          >
            {concept}
          </ButtonConcept>
        );
      })}
    </div>
  );
}
