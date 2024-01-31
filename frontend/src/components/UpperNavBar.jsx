import { useState } from "react";
import { ModalPortal } from "./modals/ModalPortal";
import LoginModal from "./modals/LoginModal";
import { useDispatch, useSelector } from "react-redux";
import { authAction } from "../store/auth-slice";
import Dropdown from "./Dropdown";

export default function UpperNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const code = useSelector((state) => state.auth.code);
  console.log(code);
  const dispatch = useDispatch();

  const OpenLoginModal = () => {
    setIsOpen(true);
  };

  const CloseLoginModal = () => {
    setIsOpen(false);
  };

  const Logout = () => {
    dispatch(authAction.Logout());
  };

  return (
    <header className="flex justify-between p-4 bg-slate-100">
      <div>나랑</div>
      {code === "" && <div onClick={OpenLoginModal}>Login</div>}
      {code !== "" && (
        <div className="flex justify-between space-x-4">
          <div>🔔</div>
          <div>User</div>
          <Dropdown Logout={Logout} />
        </div>
      )}
      {isOpen && (
        <ModalPortal>
          <LoginModal onClose={CloseLoginModal} />
        </ModalPortal>
      )}
    </header>
  );
}
