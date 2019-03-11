import React from "react";
import range from "lodash/range";

const style = {
  overflow: "hidden"
};

export default class Card extends React.PureComponent {
  render() {
    const { id } = this.props;
    return (
      <div className="card" key={id} style={style}>
        <HeavyComponent />
      </div>
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
