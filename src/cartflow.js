(function (global, factory) {
  if (typeof module === "object" && typeof module.exports === "object") {
    module.exports = factory();
    /* global define */
  } else if (typeof define === "function" && define.amd) {
    define(factory);
  } else {
    global.CartFlow = factory();
  }
})(typeof window !== "undefined" ? window : this, function () {
  "use strict";

  class CartFlow {
    /**
     * Initialize the CartFlow library
     * @param {Object} options - Configuration options
     */
    constructor(options = {}) {
      this.DEFAULTS = {
        cartSelector: "cart",
        imageSelector: "img",
        buttonSelector: "button",
        animationDuration: 1000,
        easing: "ease-in-out",
        keepClassAttributes: false,
        useCustomImageSize: true,
        setWidthImage: 250,
        setHeightImage: 250,
        cartEffect: "pop",
        onComplete: null,
        onCartEffect: null,
      };

      this.settings = { ...this.DEFAULTS, ...options };

      this.cartElement = this.settings.cartSelector;
      if (!(this.cartElement instanceof HTMLElement)) {
        this.cartElement = document.querySelector(this.settings.cartSelector);
      }

      if (!this.cartElement && this.settings.cartSelector !== "cart") {
        throw new Error(
          `Cart element not found: ${this.settings.cartSelector}`
        );
      }

      this.imageElement = this.settings.imageSelector;
      if (!(this.imageElement instanceof HTMLElement)) {
        this.imageElement = document.querySelector(this.settings.imageSelector);
      }

      if (!this.imageElement && this.settings.imageElement !== "img") {
        throw new Error(
          `Image element not found: ${this.settings.imageElement}`
        );
      }

      this.buttonElement = this.settings.buttonSelector;
      if (!(this.buttonElement instanceof HTMLElement)) {
        this.buttonElement = document.querySelector(
          this.settings.buttonSelector
        );
      }

      if (!this.buttonElement && this.settings.buttonSelector !== "button") {
        throw new Error(
          `Button element not found: ${this.settings.buttonSelector}`
        );
      }
    }

    /**
     * Sets the cart element to the provided selector or HTMLElement.
     * If the provided selector does not resolve to an HTMLElement, it throws an error.
     * @param {string|HTMLElement} selector - The CSS selector or HTMLElement of the cart element.
     * @throws {Error} If the cart element is not found.
     */
    setCartSelector(selector) {
      this.cartElement = selector;
      if (!(this.cartElement instanceof HTMLElement)) {
        this.cartElement = document.querySelector(selector);
      }
      if (!this.cartElement) {
        throw new Error(`Cart element not found: ${selector}`);
      }
    }

    /**
     * Sets the image element to the provided selector or HTMLElement.
     * If the provided selector does not resolve to an HTMLElement, it throws an error.
     * @param {string|HTMLElement} selector - The CSS selector or HTMLElement of the image element.
     * @throws {Error} If the image element is not found.
     */
    setImageSelector(selector) {
      this.imageElement = selector;
      if (!(this.imageElement instanceof HTMLElement)) {
        this.imageElement = document.querySelector(selector);
      }

      if (!this.imageElement) {
        throw new Error(`Image element not found: ${selector}`);
      }
    }

    /**
     * Sets the button element to the provided selector or HTMLElement.
     * If the provided selector does not resolve to an HTMLElement, it throws an error.
     * @param {string|HTMLElement} selector - The CSS selector or HTMLElement of the button element.
     * @throws {Error} If the button element is not found.
     */
    setButtonSelector(selector) {
      this.buttonElement = selector;
      if (!(this.buttonElement instanceof HTMLElement)) {
        this.buttonElement = document.querySelector(selector);
      }

      if (!this.buttonElement) {
        throw new Error(`Button element not found: ${selector}`);
      }
    }

    /**
     * Sets the animation effect of the cart element.
     * @param {string} effect - The animation effect of the cart element. Can be either 'pop' or 'shake'.
     * @throws {Error} If the animation effect is not 'pop' or 'shake'.
     */
    setCartEffect(effect) {
      if (["pop", "shake"].indexOf(effect) === -1) {
        throw new Error(`Invalid animation effect: ${effect}`);
      }
      this.settings.cartEffect = effect;
    }

    /**
     * Triggers the animation of the cart element.
     * Clones the image element and appends it to the body, then animates it to the cart element.
     * If GSAP is available, it uses GSAP for animation, otherwise it falls back to CSS transition.
     * @throws {Error} If the animation effect is not 'pop' or 'shake'.
     */
    startAnimation() {
      const clone = this.imageElement.cloneNode(true);

      const cartRect = this.cartElement.getBoundingClientRect();
      const imageRect = this.imageElement.getBoundingClientRect();
      const buttonRect = this.buttonElement.getBoundingClientRect();

      const computedStyles = window.getComputedStyle(this.imageElement);
      if (!this.settings.keepClassAttributes) {
        clone.removeAttribute("class");
      }
      Object.assign(clone.style, {
        position: "absolute",
        top: `${buttonRect.top + window.scrollY}px`,
        left: `${buttonRect.left + window.scrollX}px`,
        width: `${
          this.settings.useCustomImageSize
            ? this.settings.setWidthImage
            : imageRect.width
        }px`,
        height: `${
          this.settings.useCustomImageSize
            ? this.settings.setHeightImage
            : imageRect.height
        }px`,
        border: computedStyles.border,
        boxShadow: computedStyles.boxShadow,
        filter: computedStyles.filter,
        opacity: 0.8,
        zIndex: 1000000,
        pointerEvents: "none",
      });

      document.body.appendChild(clone);
      /* global gsap */
      if (typeof gsap !== "undefined") {
        // Use GSAP for animation if available
        gsap.to(clone, {
          duration: this.settings.animationDuration / 1000,
          x: cartRect.left - imageRect.left + 10,
          y: cartRect.top - imageRect.top + 10,
          width: 50,
          height: 50,
          opacity: 0,
          ease: this.settings.easing,
          onComplete: () => {
            clone.remove();
            this._finalizeAnimation();
          },
        });
      } else {
        // Fallback animation
        Object.assign(clone.style, {
          transition: `all ${this.settings.animationDuration}ms ${this.settings.easing}`,
        });

        requestAnimationFrame(() => {
          Object.assign(clone.style, {
            top: `${cartRect.top + window.scrollY + 10}px`,
            left: `${cartRect.left + window.scrollX + 10}px`,
            width: "50px",
            height: "50px",
            opacity: 0,
          });
        });

        setTimeout(() => {
          clone.remove();
          this._finalizeAnimation();
        }, this.settings.animationDuration);
      }
    }

    /**
     * Finalizes the animation of the cart element.
     * If the animation effect is 'shake', it adds a shake effect to the cart element.
     * If the animation effect is 'pop', it adds a pop effect to the cart element.
     * @throws {Error} If the animation effect is not 'pop' or 'shake'.
     */
    _finalizeAnimation() {
      this.settings.onComplete?.();

      if (this.settings.cartEffect === "shake") {
        this._shakeCart();
      } else if (this.settings.cartEffect === "pop") {
        this._popCart();
      }
    }

    _shakeCart() {
      if (typeof gsap !== "undefined") {
        // Use GSAP for shake animation
        gsap.fromTo(
          this.cartElement,
          { x: 0 },
          {
            x: -10,
            duration: 0.1,
            repeat: 3,
            yoyo: true,
            onComplete: () => this.settings.onCartEffect?.(this.cartElement),
          }
        );
      } else {
        // Fallback CSS animation
        const keyframes = [
          { transform: "translateX(0)" },
          { transform: "translateX(-10px)" },
          { transform: "translateX(10px)" },
          { transform: "translateX(0)" },
        ];

        this.cartElement.animate(keyframes, {
          duration: 130,
          iterations: 3,
        });

        this.settings.onCartEffect?.(this.cartElement);
      }
    }

    _popCart() {
      if (!this.cartElement) return;

      if (typeof gsap !== "undefined") {
        gsap.fromTo(
          this.cartElement,
          { scale: 1 },
          {
            scale: 1.3,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            onComplete: () => this.settings.onCartEffect?.(this.cartElement),
          }
        );
      } else {
        const keyframes = [
          { transform: "scale(1)" },
          { transform: "scale(1.3)" },
          { transform: "scale(1)" },
        ];
        this.cartElement.animate(keyframes, {
          duration: 350,
          easing: "ease-out",
        });
        this.settings.onCartEffect?.(this.cartElement);
      }
    }
  }

  return CartFlow;
});
