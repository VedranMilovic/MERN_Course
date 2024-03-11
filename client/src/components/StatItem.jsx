import Wrapper from "../assets/wrappers/StatItem";

const StatItem = ({ count, title, icon, color, bcgColor }) => {
  return (
    // šaljemo propove iz Wrappera tu! tamo su funkcije
    <Wrapper color={color} bcgColor={bcgColor}>
      <header>
        <span className="count">{count}</span>
        <span className="icon">{icon}</span>
      </header>
      <h5 className="title">{title}</h5>
    </Wrapper>
  );
};

export default StatItem;
