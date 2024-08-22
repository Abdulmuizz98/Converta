import { useEffect } from "react";
import Platform from "./components/pages/Platform";
import Pixel from "./components/pages/Pixel";
import Header from "./components/layout/Header";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import { getUser } from "./store/authSlice";
import { useAppSelector, useAppDispatch } from "./store/hooks";
import Dashboard from "./components/pages/Dashboard";
import Home from "./components/pages/Home";
import "./css/App.css";
import { resetError } from "./store/authSlice";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Preline from "./components/Preline";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getApiKey } from "./store/apiKeysSlice";

function App() {
  const auth = useAppSelector((state) => state.auth);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    isAuthenticated && dispatch(getApiKey("converta"));
  }, [isAuthenticated]);

  useEffect(() => {
    if (auth.error) {
      toast.error(auth.error);
      dispatch(resetError());
    }
  }, [auth.error, dispatch]);

  return (
    <BrowserRouter>
      <Preline />
      <Header />
      <ToastContainer />
      <main className="bg-white  dark:bg-gray-800">
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Login />}
          />
          <Route
            path="/platform/:platform"
            element={isAuthenticated ? <Platform /> : <Login />}
          />
          <Route
            path="/pixel/:platform/:pixelId"
            element={isAuthenticated ? <Pixel /> : <Login />}
          />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path='/documentation' element={<DocumentationPage />} /> */}
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
