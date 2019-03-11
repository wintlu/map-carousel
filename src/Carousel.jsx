import debounce from "lodash/debounce";
import range from "lodash/range";
import React from "react";

export default class Carousel extends React.Component {
  container = null;
  cardRefs = [];
  static defaultProps = {
    activeIndex: 0,
    ignoreIntersectionsForASecond: false,
    onActiveIndexChanged: () => null
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

  componentDidUpdate(prevProps) {
    if (prevProps.activeIndex !== this.props.activeIndex) {
      // this.handleIntersect.cancel();
      const cardRef = this.cardRefs[this.props.activeIndex];
      cardRef.scrollIntoView({
        behavior: "smooth",
        inline: "center"
      });
    }
  }

  //small debounce value would cause bug:
  //1. You are at the last card, and you click 'Show Next' to go to the first card
  //2. The scroll animation happens, the 3rd card appear first, and the handleIntersect() happens
  //3. In handleIntersect(), we cannot know if current intersection is a transition as a result of step1,
  //   Or if user wants to scroll here, so the scrolling would stop at 3rd card.
  //   (we cannot check if user is touching, because the scroll has inertia)

  //large debounce value would also cause bug:
  //1. you are at first card (App.activeIndex === 0), and you click 'Show Next' to go the second one. (App.activeIndex === 1)
  //2. Carousel.componentDidUpdate() called,second card is scrolled into view.
  //2. the second one triggered intersection event, but the handleIntersect is not called yet, because it is debounced
  //3. you click 'Show Next' button again, (App.activeIndex === 2), Carousel.componentDidUpdate() called, third card is scrolling into view.
  //4. now the handleIntersect() is called from step 2, which calls onActiveIndexChanged(1);
  //   this will set App.activeIndex===1, and will call Carousel.componentDidUpdate() and set activeIndex === 1,
  //   This means, your click in step 3 doesn't work!
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
      const activeIndex = Number(entry.target.getAttribute("data-index"));

      requestAnimationFrame(() => {
        this.props.onActiveIndexChanged(activeIndex);
      });
    }
  };

  render() {
    const { children } = this.props;

    return (
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
    );
  }
}
