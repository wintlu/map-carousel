import React, { useState } from "react";
import ReactDOM from "react-dom";

import Carousel from "./Carousel";
// import Carousel from "./CarouselUsingScroll";
import Card from "./Card";

import "./styles.css";

const listingIDs = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r"
];
const ItemCount = listingIDs.length;

function App() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="App">
      <Carousel
        activeIndex={activeIndex}
        onActiveIndexChanged={a => {
          setActiveIndex(a);
        }}
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
