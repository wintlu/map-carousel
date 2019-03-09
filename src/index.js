import React, { useState } from "react";
import ReactDOM from "react-dom";

import Swipeable from "./Swipeable";
import Carousel from "./Carousel";
import Card from "./Card";

import "./styles.css";

const listingIDs = [1, 2, 3, 4];
const ItemCount = listingIDs.length;

function App() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="App">
      <Carousel
        activeIndex={activeIndex}
        onActiveIndexChanged={a => setActiveIndex(a)}
      >
        {listingIDs.map((id, index) => (
          <Card id={id} key={id} />
        ))}
      </Carousel>

      <button
        onClick={() => {
          setActiveIndex((activeIndex + 1) % ItemCount);
        }}
      >
        Show Next
      </button>
      <div>active id: {listingIDs[activeIndex]}</div>
      <div>active Index: {activeIndex}</div>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
