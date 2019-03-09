import React from "react";
import debounce from "lodash/debounce";

const defaultProps = {
  onScroll: () => null
};

export default class Swipeable extends React.PureComponent {
  static defaultProps = defaultProps;

  source = React.createRef();
  pointerDown = false;

  handleScroll = debounce(left => {
    //prevent firing onScroll if users are still swiping
    //on desktop you will notice the issue: while your are still scrolling, the carousel still force to the next one
    !this.pointerDown && this.props.onScroll(left);
  }, 300);

  render() {
    const { children, id } = this.props;
    return (
      <div
        ref={el => {
          this.source.current = el;
          this.props.containerRef(el);
        }}
        className="container"
        id={id}
        onTouchStart={() => (this.pointerDown = true)}
        onTouchEnd={() => (this.pointerDown = false)}
        onScroll={e => this.handleScroll(e.target.scrollLeft)}
      >
        {children}
      </div>
    );
  }
}
