import React, { useState } from "react";
import ReactDOM from "react-dom";

import Carousel from "./Carousel";
import Card from "./Card";

import "./styles.css";

const listingIDs = ["a", "b", "c", "d"];

function App() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="App">
      <button
        className="next"
        onClick={() => setActiveIndex((activeIndex + 1) % listingIDs.length)}
      >
        Show Next
      </button>
      <div>active Index: {activeIndex}</div>
      <Carousel
        activeIndex={activeIndex}
        onActiveIndexChanged={i => setActiveIndex(i)}
      >
        {listingIDs.map((id, index) => (
          <Card id={id} key={id} />
        ))}
      </Carousel>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
