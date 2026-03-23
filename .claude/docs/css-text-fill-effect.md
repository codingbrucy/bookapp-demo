# CSS Text Color-Fill Effect — How It Works

This doc explains the "Room 101" hover animation in `globals.css` from the ground up. No prior CSS animation knowledge needed.

---

## What the effect looks like

```
At rest:       Room 101          (dark text, #1a1a1a)
On hover:      Room 101          (letters turn amber left-to-right over 0.5s)
               ████ ███          ← amber fills in like a progress bar
Still hovered: Room 101          (fully amber, #F4A261)
Mouse leaves:  Room 101          (snaps back to dark instantly)
```

---

## The 4 CSS concepts involved

### 1. `background` on text (the canvas)

Every HTML element can have a background color or image. Text elements are no different — you can put a gradient behind "Room 101". Normally you'd never see it because the text sits on top. But what if the text *became* the window into the background?

### 2. `background-clip: text` (the stencil)

This is the magic property. Normally a background fills the entire element's box. `background-clip: text` says: "only show the background where there are letters." Everything outside the letterforms is clipped away.

```
Normal background:          background-clip: text:

┌─────────────────┐         ┌─────────────────┐
│█████████████████│         │                 │
│█████████████████│         │ Room 101        │  ← background only
│█████████████████│         │                 │     visible through
│█████████████████│         │                 │     the letters
└─────────────────┘         └─────────────────┘
```

But you'd still see the text color on top of the clipped background. So you also need:

### 3. `color: transparent` (remove the paint)

Text has two layers: the fill color (what you normally see) and the background behind it. Setting `color: transparent` removes the fill, letting the clipped background show through. Now the letters are "colored" by whatever background is behind them.

We also set `-webkit-text-fill-color: transparent` because some WebKit browsers (Chrome, Safari) use that property instead of `color` for text fill.

```
With color: transparent + background-clip: text:

The letters "Room 101" are now colored by the background gradient.
The background is a gradient, so the text can show multiple colors.
```

### 4. `@keyframes` animation (the motion)

CSS animations let you change any property over time. You define named keyframes (snapshots at specific points in time), and the browser smoothly transitions between them.

```css
@keyframes room-color-fill {
  from { background-position: 100% center; }   /* start here */
  to   { background-position: 0% center; }     /* end here */
}
```

`from` = the state at 0% of the animation (the very start).
`to` = the state at 100% (the very end).
The browser interpolates all the in-between frames.

---

## How these combine in our effect

### Step 1: The gradient

```css
background: linear-gradient(90deg, #F4A261 49%, #1a1a1a 51%);
```

This creates a horizontal gradient that is:
- Amber (#F4A261) on the left half (0% to 49%)
- Dark (#1a1a1a) on the right half (51% to 100%)
- A very thin blend zone in between (49% to 51%) so it's almost a hard line

Think of it as a paint strip:

```
|◄─────── amber ────────►|◄─────── dark ────────►|
0%                    49% 51%                   100%
```

### Step 2: Make the gradient wider than the text

```css
background-size: 200% 100%;
```

The gradient image is now **twice as wide** as the text box. This means at any moment, you can only see half the gradient. The other half is offscreen.

```
                    ┌─ visible area (text box) ─┐
                    │                           │
|◄── amber ──►|◄── dark ──►|◄── offscreen ──►  │
              │             │                   │
              └─────────────┘
```

By sliding the gradient left or right, you control which half is visible.

### Step 3: Position it so dark is showing

```css
background-position: 100% center;
```

`100%` pushes the gradient to the right. The visible window now shows the **dark** right half. The amber left half is offscreen to the left.

```
At rest (background-position: 100%):

Offscreen          Visible (text box)
|◄── amber ──►|   |◄─── dark ───►|
               ↑
          this edge is at the left side of the text
```

**Result: text looks plain dark.** You can't tell there's a gradient at all.

### Step 4: Animate to show amber

```css
animation: room-color-fill 0.5s ease-out forwards;
```

The animation slides `background-position` from `100%` to `0%` over 0.5 seconds.

As it slides, the dividing line between amber and dark sweeps **left to right** through the text:

```
t=0.0s:  |dark dark dark|    (position: 100%)
         Room 101

t=0.1s:  |am|dark dark  |    (position: ~80%)
         Ro om 101

t=0.25s: |amber|dark    |    (position: 50%)
         Room  101

t=0.4s:  |amber ambe|dk |    (position: ~20%)
         Room 10 1

t=0.5s:  |amber amber am|    (position: 0%)
         Room 101
```

Each letter progressively "fills" with amber from left to right.

### Step 5: Stay amber (`forwards`)

```css
animation-fill-mode: forwards;
```

Without this, the animation would snap back to the initial state after finishing. `forwards` tells the browser: "after the animation ends, keep the final frame." So the text stays amber while you're hovering.

### Step 6: Revert on un-hover

The entire gradient setup only exists inside `.group:hover .room-number`. The moment you stop hovering, all those properties disappear and the element falls back to:

```css
.room-number {
  color: #1a1a1a;    /* plain dark text, no gradient, no clip */
}
```

The text snaps back to dark instantly.

---

## The full CSS, annotated

```css
/* The animation: slide background-position from right to left */
@keyframes room-color-fill {
  from { background-position: 100% center; }   /* dark visible */
  to   { background-position: 0% center; }     /* amber visible */
}

/* At rest: completely plain text. No gradient, no clip. */
.room-number {
  color: #1a1a1a;
}

/* On hover: everything activates at once */
.group:hover .room-number {
  /* 1. The two-tone gradient */
  background: linear-gradient(90deg, #F4A261 49%, #1a1a1a 51%);

  /* 2. Make it 2x wider so we can slide it */
  background-size: 200% 100%;

  /* 3. Start position: dark half showing (matches animation's "from") */
  background-position: 100% center;

  /* 4. Only show background through the letter shapes */
  -webkit-background-clip: text;
  background-clip: text;

  /* 5. Remove the text's own color so the background shows through */
  color: transparent;
  -webkit-text-fill-color: transparent;

  /* 6. Slide it: 0.5s, smooth deceleration, play once, keep end state */
  animation: room-color-fill 0.5s ease-out forwards;
}
```

---

## Why `background-position: 100%` in *both* the rule and the keyframe

When hover first triggers, there's a single frame before the animation kicks in. During that frame, the browser renders the element with the hover styles but no animation yet. If the default `background-position` in the rule were `0%` (amber), you'd see a brief orange flash before the animation starts sliding from dark.

By setting it to `100%` (dark) in the rule — matching the animation's `from` keyframe — that first frame also shows dark text. No flash.

---

## The `.group` class

Tailwind's `group` utility marks a parent element. Child elements can then use `group-hover:` (in Tailwind) or `.group:hover .child` (in CSS) to react when the *parent* is hovered.

In our case:
- `.group` is on the room card `<div>` (the whole card)
- `.room-number` is on the `<p>` tag inside it

So hovering anywhere on the card triggers the text effect — not just hovering on the text itself.

---

## Knobs you can turn

| What | Where | Effect |
|---|---|---|
| Fill color | `#F4A261` in the gradient | Change amber to any color |
| Speed | `0.5s` in the animation | Slower = more dramatic, faster = snappier |
| Edge softness | `49%` / `51%` gap | Wider gap (e.g. `40%`/`60%`) = softer blend; `50%`/`50%` = razor sharp |
| Easing | `ease-out` | `linear` = constant speed; `ease-in` = starts slow; `ease-in-out` = slow at both ends |
| Stay or revert | `forwards` | Remove `forwards` to snap back to dark after animation ends (even while still hovered) |
| Direction | Swap `from`/`to` values | `from: 0%` + `to: 100%` = fills right-to-left instead |

---

## Common pitfalls

1. **Text looks weird at rest**: Make sure `.room-number` at rest has NO `background-clip`, NO gradient, NO `color: transparent`. All of that belongs exclusively inside the `:hover` rule.

2. **Flash of color on hover start**: The default `background-position` in the hover rule must match the animation's `from` value. Both should be `100%`.

3. **Text reverts mid-animation**: Missing `forwards`. Without it, the animation plays then the properties snap back to the hover rule's static values.

4. **Effect doesn't trigger**: Make sure the parent card has `class="group"` and the text has `class="room-number"`.

5. **`-webkit-text-fill-color`**: Safari and Chrome use this instead of `color` for text fill. Always set both `color: transparent` and `-webkit-text-fill-color: transparent` to cover all browsers.
