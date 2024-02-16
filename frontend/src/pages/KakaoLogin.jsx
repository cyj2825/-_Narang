import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store/authSlice";
import { useEffect } from "react";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let auth = "";
  let refreshAuth = "";
  useEffect(() => {
    const params = new URL(document.URL).searchParams;
    const code = params.get("code");
    (async () => {
      try {
        const res = await axios.post(
          `${
            import.meta.env.VITE_USER_REQUEST_URI
          }/login/oauth/kakao?code=${code}`
        );
        auth = res.headers["authorization"];
        refreshAuth = res.headers["authorization-refresh"];
        try {
          const userRes = await axios.get(
            `${import.meta.env.VITE_USER_REQUEST_URI}/getuser`,
            {
              headers: {
                Authorization: auth,
                "Authorization-refresh": refreshAuth,
              },
            }
          );

          dispatch(
            authActions.Setting({
              token: res.headers.authorization,
              refreshToken: res.headers["authorization-refresh"],
              userId: userRes.data.id,
              nickname: userRes.data.nickname,
            })
          );
        } catch (error) {
          console.error("유저받아오면서 문제생김 : ", error);
        }

        navigate("/");
      } catch (error) {
        console.error("Error during POST request:", error);
      }
    })();
  }, []);

  return <></>;
};

export default Login;
