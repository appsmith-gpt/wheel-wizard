# Wheel Wizard (Web)

Wheel Wizard is a simple web application that lets users create their own spinning wheels for random selection. You can add as many labels as you like, spin the wheel to select a random label, and celebrate with a small confetti animation. A dark mode toggle is included, and your labels are saved in your browser so they persist across sessions.

## Features

- **Custom labels:** Add or remove labels to personalise your spinning wheel.
- **Spinning animation:** Click the **Spin** button to animate the wheel and pick a random label.
- **Confetti effect:** When the wheel stops, confetti flies across the canvas to celebrate the result.
- **Result display:** The selected label is shown below the wheel after each spin.
- **Dark mode:** Toggle the dark/light theme using the button in the top right corner.
- **Persistent data:** Labels and theme preference are stored in `localStorage` and loaded when you return.

## Running the app

1. **Open `index.html`** in your browser. No build process is required — it’s a static site.
2. Start adding labels in the text field and click **Add** to populate the wheel.
3. Click **Spin** to rotate the wheel and select a random label.
4. Toggle between dark and light mode via the 🌙/☀️ button.

## Customising and deploying

This project is framework‑free and uses only vanilla HTML, CSS and JavaScript, making it easy to host on any static hosting platform (Replit, GitHub Pages, Netlify, Vercel, etc.). You can also use it as a starting point for more complex features such as advertising integration, payment buttons, or analytics.
