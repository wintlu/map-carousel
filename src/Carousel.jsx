import debounce from "lodash/debounce";
import React from "react";
import Swipeable from "./Swipeable";
import Observer from "@researchgate/react-intersection-observer";

const ItemWidthPercent = 0.8;
const itemWidth = containerWidth => ItemWidthPercent * containerWidth; //80% width of container, including margin
const edgePadding = containerWidth =>
  (containerWidth * (1 - ItemWidthPercent)) / 2;

export default class Carousel extends React.Component {
  container = null;

  componentDidUpdate(prevProps) {
    if (prevProps.activeIndex !== this.props.activeIndex) {
      const elementId = "card-wrapper-" + this.props.activeIndex;
      document.getElementById(elementId).scrollIntoView({
        behavior: "smooth",
        inline: "center"
      });
    }
  }

  // handleScroll = left => {
  //   const containerWidth = this.container.clientWidth;

  //   // // find the card that is closest to the center of container
  //   // // e.g. find i, so abs(center of i-th card - center of container) is minimal
  //   // // => abs (i* ItemWidth + ItemWidth/2 + EdgePadding - left - ContainerWidth/2)
  //   // // => abs( ItemWidth*(i+0.5) + EdgePadding - left - ContainerWidth/2 )
  //   const count = React.Children.count(this.props.children);
  //   const distances = new Array(count).fill(null).map((_, index) => ({
  //     dis: Math.abs(
  //       itemWidth(containerWidth) * (index + 0.5) +
  //         edgePadding(containerWidth) -
  //         left -
  //         containerWidth / 2
  //     ),
  //     index
  //   }));

  //   const min = distances.reduce(
  //     (prev, cur) => {
  //       return prev.dis > cur.dis ? cur : prev;
  //     },
  //     { dis: Number.POSITIVE_INFINITY, index: 0 }
  //   );
  //   this.props.onActiveIndexChanged(min.index);
  // };

  onVisibleChange = debounce((e, index) => {
    if (e.isIntersecting) {
      this.props.onActiveIndexChanged(index);
    }
  }, 1000);

  render() {
    const { children, activeIndex } = this.props;

    return (
      <Swipeable
        id="swipeable"
        containerRef={el => {
          this.container = el;
        }}
      >
        {React.Children.map(children, (child, index) => (
          <div
            key={index}
            className="card-wrapper"
            id={"card-wrapper-" + index}
          >
            <Observer
              onChange={e => this.onVisibleChange(e, index)}
              root="#swipeable"
              threshold={[1]}
            >
              {child}
            </Observer>
          </div>
        ))}
      </Swipeable>
    );
  }
}
