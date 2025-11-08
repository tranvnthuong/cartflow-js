# CartFlowJS

**CartFlowJS** is an enhanced, lightweight, and pure JavaScript version of the original [CartFlow](https://github.com/nassiry/cartflow).  
It provides a smooth **"fly-to-cart"** animation effect with flexible customization.

---

## Features

- 💡 Clone an "image" from the "button" position and then it will fly to the "cart" element 
- 🚀 **Pure Vanilla JavaScript** – no external dependency required  
- 🎬 **Optional GSAP support** for ultra-smooth animations 
- 🖼️ Customizable flying image size (`setWidthImage`, `setHeightImage`)  
- 💫 Multiple cart effects: `pop` or `shake`  
- 🎨 Option to keep or remove image class attributes (`keepClassAttributes`)  
- 🪄 Flexible callbacks: `onComplete`, `onCartEffect`  
- ⚡ Clean modular structure, easy to integrate into any project
- 🧱 **No DOM hierarchy required** - CartFlow JS works with independent elements across the page.
You can place the cart in the header, the button inside a product card,
and the product image anywhere else — it will still work perfectly.

---

## Installation

### Via NPM
```bash
npm install cartflow-js
```

### Via CDN
```html
<script src="https://cdn.jsdelivr.net/gh/tranvnthuong/cartflow-js/src/cartflow.js"></script>
```

### Usage Example
```html
<div id="cartIcon"><i>🛒</i></div>
<img id="product-img" src="product.jpg" alt="Product">
<button class="add-to-cart">Add to Cart</button>

<script>
  import CartFlow from "cartflow-js";

  const cartFlow = new CartFlow({
    cartSelector: '#cartIcon',
    imageSelector: '.product-img',
    buttonSelector: '.add-to-cart',
    setWidthImage: 200,
    setHeightImage: 200,
    onComplete: () => console.log('Animation completed!'),
    onCartEffect: (cart) => console.log('Cart effect triggered:', cart)
  });

  document.querySelector('.add-to-cart').addEventListener('click', () => {
    cartFlow.startAnimation();
  });
</script>
```

---

## Options
| Option  |   Default |   Description |
|-------|-------|-------|
| cartSelector    |   'cart'  |   CSS selector or HTMLElement of the cart icon |
| imageSelector | 'img' | Product image element |
| buttonSelector | 'button' | Button that triggers the animation |
| animationDuration | 1000 | Duration of the animation in milliseconds |
| easing | 'ease-in-out'  |   Animation easing function |
| keepClassAttributes |   false   |   Whether to keep class attributes on the cloned image |
| useCustomImageSize | true | Use custom image dimensions for the animation |
| setWidthImage   |   250 |   Width of the flying image |
| setHeightImage  |   250 |   Height of the flying image |
| cartEffect  |   'pop'   |   Cart effect after animation (pop or shake) |
| onComplete  |   null    |   Callback executed after animation completes |
| onCartEffect    |   null    |   Callback executed after cart effect completes |

---

## Technical Notes

- If GSAP is available, it will be used automatically for animation.
- Otherwise, the library falls back to native Web Animation API or CSS transitions.
- The library is completely standalone and can run in any browser without frameworks.

---

## Demo

- A working demo can be viewed at:
[Live demo](https://tranvnthuong.github.io/cartflow-js/)