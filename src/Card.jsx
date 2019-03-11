import React from "react";
import range from "lodash/range";

const style = {
  overflow: "hidden"
};

export default class Card extends React.PureComponent {
  render() {
    const { id } = this.props;
    return (
      <button className="card" key={id} style={style}>
        Card {id}
      </button>
    );
  }
}

function HeavyComponent() {
  return (
    <>
      {range(100).map(i => (
        <div>{i}</div>
      ))}
    </>
  );
}
