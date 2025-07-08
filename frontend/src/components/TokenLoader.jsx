import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUserData, setIsLoaded } from "../redux/userSlice";

const TokenLoader = ({ children }) => {
  const dispatch = useDispatch();
  const isLoaded = useSelector((state) => state.user.isLoaded);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token) {
      dispatch(setToken(token));
    }

    if (user) {
      try {
        dispatch(setUserData(JSON.parse(user)));
      } catch (err) {
        console.error("Failed to parse user from localStorage");
      }
    }

    dispatch(setIsLoaded(true));
  }, [dispatch]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
};

export default TokenLoader;
