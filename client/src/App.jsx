import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import Foo from "./pages/Foo"

import {
  Error,
  HomeLayout,
  DashboardLayout,
  Register,
  Login,
  Landing,
  AddJob,
  Stats,
  AllJobs,
  Profile,
  Admin,
  EditJob,
} from "./pages";

import { action as registerAction } from "./pages/Register";
import { action as loginAction } from "./pages/Login";
import { loader as dashboardLoader } from "./pages/DashboardLayout";
import { action as addJobAction } from "./pages/AddJob";
import { loader as allJobsLoader } from "./pages/AllJobs";
import { loader as editJobLoader } from "./pages/EditJob";
import { action as editJobAction } from "./pages/EditJob";
import { action as deleteJobAction } from "./pages/DeleteJob";
import { loader as adminLoader } from "./pages/Admin";
import { action as profileAction } from "./pages/Profile";
import { loader as statsLoader } from "./pages/Stats";

export const checkDefaultTheme = () => {
  // pokreće se kad se mounta komponenta => themeToggle
  const isDarkTheme = localStorage.getItem("darkTheme") === "true"; // treba biti string, jer je string pohranjen u local storage
  document.body.classList.toggle("dark-theme", isDarkTheme);
  return isDarkTheme;
};

const isDarkThemeEnabled = checkDefaultTheme(); // ????

const router = createBrowserRouter([
  // {
  //   path: `/foo`,
  //   element: <Foo />,
  // },
  {
    path: `/`, // home page.
    element: <HomeLayout />,
    errorElement: <Error />, // tu može ići i sami element koji želimo provjeriti
    children: [
      { index: true, element: <Landing /> }, // ovo se displaya kad idemo na ./ rutu, "početna"
      {
        path: `register`, // route relativna prema home page, maknuli slash jer je u parentu  =>(/register)
        element: <Register />, // ovo je element koji se displaya u  home layout pomoću Outlet
        // action: () => {
        //   // svaki put kad submitamo Form, zove se ova funkcija
        //   console.log("hello there");
        //   return null; // uvijek treba biti neki return (value)
        // },
        action: registerAction,
      },
      {
        path: `login`,
        element: <Login />,
        action: loginAction,
      },
      {
        path: `dashboard`,
        element: <DashboardLayout isDarkThemeEnabled={isDarkThemeEnabled} />,
        loader: dashboardLoader,
        children: [
          {
            index: true,
            element: <AddJob />,
            action: addJobAction,
          },
          {
            path: "stats",
            element: <Stats />,
            loader: statsLoader,
          },
          {
            path: "all-jobs",
            element: <AllJobs />,
            loader: allJobsLoader,
          },
          {
            path: "profile",
            element: <Profile />,
            action: profileAction,
          },
          {
            path: "admin",
            element: <Admin />,
            loader: adminLoader,
          },
          {
            path: "edit-job/:id",
            element: <EditJob />,
            loader: editJobLoader, // tu dobivamo podatke o pojedinom poslu
            action: editJobAction, //
          },
          {
            path: "delete-job/:id", // nemamo jsx, pa nema element!!!!
            action: deleteJobAction,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
