import range from "lodash/range";
import React from "react";

export default class Carousel extends React.Component {
  container = null;
  cardRefs = [];
  transitioning = false;
  visibleIndex = 0;

  static defaultProps = {
    activeIndex: 0,
    onActiveIndexChanged: () => undefined
  };

  componentDidMount() {
    this.observer = new IntersectionObserver(entries => {
      const inViewEntries = entries.filter(e => e.isIntersecting);
      if (inViewEntries.length === 0) {
        return;
      }
      const entry = inViewEntries[0];
      this.onVisible(Number(entry.target.getAttribute("data-index")));
    }, {
        root: this.container,
        threshold: 1.0
      });
    const count = React.Children.count(this.props.children);
    range(count).forEach(index => this.observer.observe(this.cardRefs[index]));

    this.updateScroll();
  }

  componentWillUnmount() {
    const count = React.Children.count(this.props.children);
    range(count).forEach(index =>
      this.observer.unobserve(this.cardRefs[index])
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeIndex !== this.props.activeIndex) {
      this.updateScroll();
    }
  }

  updateScroll(){
    if (this.visibleIndex === this.props.activeIndex) {
      this.transitioning = false;
    } else {
      this.transitioning = true;
      const cardRef = this.cardRefs[this.props.activeIndex];
      cardRef.scrollIntoView({
        behavior: "smooth",
        inline: "center"
      });
    }
  }

  onVisible(i) {
    this.visibleIndex = i;
    if (this.transitioning) {
      if (this.visibleIndex === this.props.activeIndex) {
        this.transitioning = false;
      }
    } else {
      if (this.visibleIndex !== this.props.activeIndex) {
        this.props.onActiveIndexChanged(this.visibleIndex);
      }
    }
  }

  render() {
    const { children } = this.props;
    return (
      <>
        <div
          className="container"
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
