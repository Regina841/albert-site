const realityButton = document.querySelector(".hero__button");
const hero = document.querySelector(".hero");
const realityImagePath = "assets/images/albert-reality.jpg";

if (hero && realityButton) {
  const realityImage = new Image();
  const hoverQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

  realityImage.addEventListener("load", () => {
    hero.classList.add("has-reality");
  });

  realityImage.src = realityImagePath;

  const showReality = () => {
    if (!hero.classList.contains("has-reality")) {
      return;
    }

    realityButton.classList.add("is-hovered");
    hero.classList.add("is-reality-preview");
  };

  const hideReality = () => {
    realityButton.classList.remove("is-hovered");
    hero.classList.remove("is-reality-preview");
  };

  realityButton.addEventListener("pointerenter", () => {
    if (hoverQuery.matches) {
      showReality();
    }
  });

  realityButton.addEventListener("pointerleave", () => {
    if (hoverQuery.matches) {
      hideReality();
    }
  });

  realityButton.addEventListener("click", (event) => {
    event.preventDefault();

    if (hoverQuery.matches || !hero.classList.contains("has-reality")) {
      return;
    }

    if (hero.classList.contains("is-reality-preview")) {
      hideReality();
      return;
    }

    showReality();
  });
}
