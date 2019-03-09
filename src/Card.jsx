import React from "react";
export default class Card extends React.Component {
  render() {
    const { id } = this.props;
    return <div className="card">Card Id: {id}</div>;
  }
}
