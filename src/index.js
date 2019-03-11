import React, { useState } from "react";
import ReactDOM from "react-dom";

import Carousel from "./Carousel";
import Card from "./Card";

import "./styles.css";

const listingIDs = ["a", "b", "c", "d"];

function App() {
  return (
    <div className="App">
      <Carousel>
        {listingIDs.map((id, index) => (
          <Card id={id} key={id} />
        ))}
      </Carousel>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
