import { useState } from "react";

import BarChart from "./BarChart";
import AreaChart from "./AreaChart";
import Wrapper from "../assets/wrappers/ChartsContainer";

const ChartsContainer = ({ data }) => {
  const [barChart, setBarChart] = useState(true); // toggle bar chart ili area chart

  return (
    <Wrapper>
      <h4>Monthly Applications</h4>
      <button type="button" onClick={() => setBarChart(!barChart)}>
        {" "}
        {/* postavljamo suprotno, dakle defaultno je area chart , isto dolje, ako je true displaya se Area chart*/}
        {barChart ? "Area Chart" : "Bar Chart"}
      </button>
      {barChart ? <BarChart data={data} /> : <AreaChart data={data} />}{" "}
      {/* klik na button displaya ono kaj je displayano na buttonu, suprotno od logike gore */}
    </Wrapper>
  );
};

export default ChartsContainer;
