import debounce from "lodash/debounce";
import React from "react";

const ItemWidthPercent = 0.8;
const itemWidth = containerWidth => ItemWidthPercent * containerWidth; //80% width of container, including margin
//the padding in the begining and end of the carousel
const edgePadding = containerWidth =>
  (containerWidth * (1 - ItemWidthPercent)) / 2;

export default class Carousel extends React.Component {
  container = null;
  cardRefs = [];
  touched = false;
  currentActiveIndex = 0;
  static defaultProps = {
    activeIndex: 0
  };

  componentDidUpdate(prevProps) {
    if (prevProps.activeIndex !== this.props.activeIndex) {
      //prevent any previous debounced methods
      this.handleScroll.cancel();
      const cardRef = this.cardRefs[this.props.activeIndex];
      cardRef.scrollIntoView({
        behavior: "smooth",
        inline: "center"
      });
    }
  }

  handleTouchStart = () => {
    this.touched = true;
  };

  handleTouchEnd = () => {
    this.touched = false;
  };

  handleScroll = debounce(left => {
    //if user is still scrolling, don't change active index yet
    if (this.touched) {
      return;
    }
    const containerWidth = this.container.clientWidth;

    // // find the card that is closest to the center of container
    // // e.g. find i, so abs(center of i-th card - center of container) is minimal
    // // => abs (i* ItemWidth + ItemWidth/2 + EdgePadding - left - ContainerWidth/2)
    // // => abs( ItemWidth*(i+0.5) + EdgePadding - left - ContainerWidth/2 )
    const count = React.Children.count(this.props.children);
    const distances = new Array(count).fill(null).map((_, index) => ({
      dis: Math.abs(
        itemWidth(containerWidth) * (index + 0.5) +
          edgePadding(containerWidth) -
          left -
          containerWidth / 2
      ),
      index
    }));

    const min = distances.reduce(
      (prev, cur) => {
        return prev.dis > cur.dis ? cur : prev;
      },
      { dis: Number.POSITIVE_INFINITY, index: 0 }
    );
    this.props.onActiveIndexChanged(min.index);
  }, 300);

  render() {
    const { children } = this.props;

    return (
      <div
        className="container"
        id="swipeable"
        ref={el => {
          this.container = el;
        }}
        onTouchStart={this.handleTouchStart}
        onTouchEnd={this.handleTouchEnd}
        onScroll={e => this.handleScroll(e.target.scrollLeft)}
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className="card-wrapper"
            data-index={index}
            ref={el => (this.cardRefs[index] = el)}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }
}
