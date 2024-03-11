import { Outlet } from "react-router-dom";

const HomeLayout = () => {
  return (
    <>
      <Outlet />
    </>

    // content child pages se displaya tu uz pomoć Outlet!!! Displaya se samo childen content
  );
};

export default HomeLayout;
