import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Route, Routes, useNavigate } from "react-router-dom";

import Navbars from "./components/Navbars";
import PrivateRoute from "./components/PrivateRoute";
import PrivateRouteAdmin from "./components/PrivateRouteAdmin";

import { UserContext } from "./context/userContext";

import PageNotFound from "./pages/Error";

import Home from "./pages/Home";
import DetailProperty from "./pages/DetailProperty";
import Profile from "./pages/Profile";
import MyBooking from "./pages/MyBooking";
import History from "./pages/History";

import HomeOwner from "./pages/owner/HomeOwner";
import HistoryIncome from "./pages/owner/HistoryIncome";
import AddProperty from "./pages/owner/AddProperty";

import { API, setAuthToken } from "./config/api";
import Booking from "./pages/Booking";
import { RoomsContextProvider } from "./context/roomsContext";

function App() {
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    if (!isLoading) {
      if (state.isLogin === false) {
        navigate("/");
      } else {
        if (localStorage.role === "Owner") {
          navigate("/owner");
        } else if (localStorage.role === "Tenant") {
          navigate("/");
        }
      }
    }
    // Redirect Auth
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");

      if (response.status === 404) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      let payload = response.data.data;

      payload.token = localStorage.token;

      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.token) {
      checkUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <RoomsContextProvider>
        <Navbars />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/detail-property/:id" element={<DetailProperty />} />

          <Route path="/" element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/booking/:id" element={<MyBooking />} />
            <Route path="/history" element={<History />} />
            <Route path="/mybooking" element={<Booking />} />
          </Route>

          <Route path="/owner" element={<PrivateRouteAdmin />}>
            <Route path="/owner" element={<HomeOwner />} />
            <Route path="/owner/profile" element={<Profile />} />
            <Route path="/owner/history-income" element={<HistoryIncome />} />
            <Route path="/owner/add-property" element={<AddProperty />} />
          </Route>
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </RoomsContextProvider>
    </>
  );
}

export default App;
