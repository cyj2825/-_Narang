import ReactDOM from "react-dom";

export const ModalPortal = ({ children }) => {
  const el = document.getElementById("modal_root");
  return ReactDOM.createPortal(children, el);
};
