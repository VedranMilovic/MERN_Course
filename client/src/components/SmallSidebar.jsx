import { FaTimes } from "react-icons/fa";
import Wrapper from "../assets/wrappers/SmallSidebar";
import { useDashboardContext } from "../pages/DashboardLayout";
import Logo from "./Logo";
import links from "../utils/Links";
import { NavLink } from "react-router-dom";
import NavLinks from "./NavLinks";

const SmallSidebar = () => {
  // posvuda isti classnames, nema clash zbog styled components

  const { showSidebar, toggleSidebar } = useDashboardContext(); // default za showSidebar je false => ne vidi se, ali ga togglamo u navbar
  // console.log(data);
  return (
    // uz pomoć CSS-a, nema veze dal imamo show-sidebar (bez show-sidebar nestaje) ili ne, mičemo ga kad dođemo na big screen!
    <Wrapper>
      <div
        className={
          showSidebar ? "sidebar-container show-sidebar" : "sidebar-container"
        }
      >
        <div className="content">
          <button type="button" className="close-btn" onClick={toggleSidebar}>
            <FaTimes />
          </button>
          <header>
            <Logo />
          </header>
          <div className="nav-links">
            {links.map((link) => {
              const { text, path, icon } = link;

              return (
                <NavLink
                  to={path}
                  key={text}
                  className="nav-link"
                  onClick={toggleSidebar}
                  // will discuss in a second
                  end
                >
                  <span className="icon">{icon}</span>
                  {text}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default SmallSidebar;
