import { Outlet, redirect, useLoaderData, useNavigate } from "react-router-dom"; // nije isto kao i useNavigation!!!!
import Wrapper from "../assets/wrappers/Dashboard";
import { BigSidebar, Navbar, SmallSidebar } from "../components";
import { useState } from "react";
import { createContext } from "react";
import { useContext } from "react";
import { checkDefaultTheme } from "../App";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";

export const loader = async () => {
  // ovo preloada data, prije nego ju koristimo, dakle prije nego se komponenta rendera.
  // is executed during the server-side rendering (SSR) or pre-rendering process on the server.
  try {
    // kad se logiramo, server nam šalje cookie s JWT
    const { data } = await customFetch.get("/users/current-user");
    // console.log("data", data);
    return data;
  } catch (error) {
    return redirect("/"); // ako nešto ne valjda s JWT, user ponavlja proces
  }
};

const DashboardContext = createContext(); // ovo nije nužno

const DashboardLayout = () => {
  const { user } = useLoaderData(); // tu su svi podaci, oni se re-rendriraju (useLoaderData je isto async), pa se cl displaya dvaput
  if (user) {
    // console.log(user);
  }
  const navigate = useNavigate();

  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme);

  //placeholder functions
  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle("dark-theme", newDarkTheme); // vanilla JS, targetiramo cijeli body element
    localStorage.setItem("darkTheme", newDarkTheme);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    navigate("/");
    await customFetch.get("/auth/logout");
    toast.success("Logging out...");
  };

  // // context nije nužan, možemo poslati user,
  //         showSidebar,
  //         isDarkTheme,
  //         toggleDarkTheme,
  //         toggleSidebar,
  //         logoutUser
  // samo kao obične props!!!!!

  return (
    <div>
      <DashboardContext.Provider
        value={{
          user,
          showSidebar,
          isDarkTheme,
          toggleDarkTheme,
          toggleSidebar,
          logoutUser,
        }}
      >
        <Wrapper>
          <main className="dashboard">
            <SmallSidebar />
            <BigSidebar />
            <div>
              <Navbar />
              <div className="dashboard-page">
                <Outlet context={{ user }} />
              </div>
            </div>
          </main>
        </Wrapper>
      </DashboardContext.Provider>
    </div>
    // U Outlet nam je cijeli content
  );
};

export const useDashboardContext = () => useContext(DashboardContext); // custom hook funkcija
export default DashboardLayout;
