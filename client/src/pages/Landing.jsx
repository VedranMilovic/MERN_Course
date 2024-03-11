import styled from "styled-components";
import Wrapper from "../assets/wrappers/LandingPage"; // ime je po želji
import main from "../assets/images/main.svg";
import { Link } from "react-router-dom";
import { Logo } from "../components";

// const StyledBtn = styled.button`
//   font-size: 1.5rem;
//   background: red;
//   color: white;
// `;

const Landing = () => {
  return (
    <Wrapper>
      <nav>
        <Logo />
      </nav>
      <div className="container page">
        <div className="info">
          <h1>
            job <span>tracking </span>app
          </h1>
          <p>
            Yes plz yr cronut cardigan VHS. Biodiesel food truck tofu, bitters
            mixtape synth blackbird spyplane. Next level gluten-free glossier
            sustainable vegan readymade sartorial truffaut lomo health goth
            cloud bread kogi thundercats mustache. Beard neutra ethical, small
            batch drinking vinegar lomo four dollar toast sus YOLO.
          </p>
          <Link to="/register" className="btn register-link">
            Register
          </Link>
          <Link to="/login" className="btn ">
            Login / Demo User
          </Link>
        </div>
        <img src={main} alt="job hunt" className="img main-img" />
      </div>
      {/* <StyledBtn>styled button</StyledBtn> */}
      {/* <div className="content">some content</div> */}
    </Wrapper>
  );
};

export default Landing;
