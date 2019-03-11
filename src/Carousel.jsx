import range from "lodash/range";
import React from "react";

export default class Carousel extends React.Component {
  container = null;
  cardRefs = [];
  state = {};

  componentDidMount() {
    this.observer = new IntersectionObserver(this.handleIntersect, {
      root: this.container,
      threshold: 1.0
    });
    const count = React.Children.count(this.props.children);
    range(count).forEach(index => this.observer.observe(this.cardRefs[index]));
  }

  componentWillUnmount() {
    const count = React.Children.count(this.props.children);
    range(count).forEach(index =>
      this.observer.unobserve(this.cardRefs[index])
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeIndex !== this.state.activeIndex) {
      // this.handleIntersect.cancel();
      const cardRef = this.cardRefs[this.state.activeIndex];
      cardRef.scrollIntoView({
        behavior: "smooth",
        inline: "center"
      });
    }
  }

  handleIntersect = entries => {
    const { activeIndex: priorActiveIndex, ignoreUntilComplete } = this.state;

    // card width is 80% of container, so there's only one entry whose isIntersecting=== true
    const inViewEntries = entries.filter(e => e.isIntersecting);
    if (inViewEntries.length === 0) {
      return;
    }
    if (inViewEntries.length > 1) {
      console.warn("interesection entryies wrong");
    }

    const entry = inViewEntries[0];

    if (entry.isIntersecting) {
      const activeIndex = Number(entry.target.getAttribute("data-index"));
      if (ignoreUntilComplete && activeIndex === priorActiveIndex) {
        this.setState({ ignoreUntilComplete: false });
      } else if (!ignoreUntilComplete && activeIndex !== priorActiveIndex) {
        this.setState({ activeIndex });
      }
    }
  };

  handleShowNext = () => {
    const count = React.Children.count(this.props.children);
    this.setState(({ activeIndex }) => ({
      activeIndex: (activeIndex + 1) % count,
      ignoreUntilComplete: true
    }));
  };

  render() {
    const { children } = this.props;
    const { activeIndex } = this.state;
    return (
      <>
        <button className="next" onClick={this.handleShowNext}>
          Show Next
        </button>
        <div>active Index: {activeIndex}</div>
        <div
          className="container"
          id="swipeable"
          ref={el => {
            this.container = el;
          }}
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
      </>
    );
  }
}
