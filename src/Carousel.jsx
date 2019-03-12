import range from "lodash/range";
import React from "react";

export default class Carousel extends React.Component {
  container = null;
  cardRefs = [];
  state = {};
  transient = false;

  static defaultProps = {
    activeIndex: 0,
    onActiveIndexChanged: () => undefined
  };

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
    if (prevProps.activeIndex !== this.props.activeIndex) {
      this.transient = true;
      const cardRef = this.cardRefs[this.props.activeIndex];
      cardRef.scrollIntoView({
        behavior: "smooth",
        inline: "center"
      });
    }

    // if (prevState.activeIndex !== this.state.activeIndex) {
    //   const cardRef = this.cardRefs[this.state.activeIndex];
    //   cardRef.scrollIntoView({
    //     behavior: "smooth",
    //     inline: "center"
    //   });
    // }
  }

  handleIntersect = entries => {
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
      const visibleIndex = Number(entry.target.getAttribute("data-index"));
      const { activeIndex } = this.props;
      if (this.transient) {
        if (visibleIndex === activeIndex) {
          this.transient = false;
        }
      } else {
        if (visibleIndex !== activeIndex) {
          this.props.onActiveIndexChanged(visibleIndex);
        }
        // this.transient = true;
      }
    }

    // if (entry.isIntersecting) {
    // const { activeIndex } = this.state;
    //   const visibleIndex = Number(entry.target.getAttribute("data-index"));
    //   if (this.transient && visibleIndex === activeIndex) {
    //     //arrive the destination index
    //     this.transient = false;
    //   } else if (!this.transient && visibleIndex !== activeIndex) {
    //     //user is scrolling
    //     this.setState({ activeIndex: visibleIndex });
    //   }
    // }
  };

  // handleShowNext = () => {
  //   const count = React.Children.count(this.props.children);
  //   this.transient = true;
  //   this.setState(({ activeIndex }) => ({
  //     activeIndex: (activeIndex + 1) % count
  //   }));
  // };

  render() {
    const { children } = this.props;
    return (
      <>
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
