import { Fragment } from "react";
import RegisterForm from "../components/Trip/Register/TripRegisterForm";

export default function TripRegisterPage() {
  return (
    <Fragment>
        <div className="my-3">
          <RegisterForm />
        </div>
    </Fragment>
  );
}
