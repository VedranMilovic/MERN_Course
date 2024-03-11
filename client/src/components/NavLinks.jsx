import { useDashboardContext } from "../pages/DashboardLayout";
import links from "../utils/Links";
import { NavLink } from "react-router-dom";

const NavLinks = ({ isBigSidebar }) => {
  const { toggleSidebar, user } = useDashboardContext();
  return (
    <div className="nav-links">
      {links.map((link) => {
        const { text, path, icon } = link; // tri properties iz links
        const { role } = user;
        if (path === "admin" && role !== "admin") {
          return;
        }
        return (
          // navlink je komponenta react routera
          <NavLink
            to={path}
            key={text}
            className="nav-link"
            onClick={isBigSidebar ? null : toggleSidebar} //mičemo sidebar, isto i na gornjem clicku
            end // miče da je parent link (add Job) stalno active (jer je parent)
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
};

export default NavLinks;
