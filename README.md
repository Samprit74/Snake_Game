# 🐍 Snake Game

A simple and fun browser-based Snake Game built with HTML, CSS,
and JavaScript.

---

## 🎮 Game Features

- Canvas-based movement  
- Randomized starting snake position  
- Food that changes color (between green and grey) to attract attention  
- Sound effects for eating, game over, and win  
- Score tracking with persistent high score using localStorage  
- Game Over and Win overlays with messages  

---

## 🚀 How the Game Works

### ▶ Snake Movement

- The snake is drawn as a set of connected blocks on a grid-based canvas.
- Arrow keys control the direction (UP, DOWN, LEFT, RIGHT).
- The snake continues moving in the current direction unless a new direction is given.

### 📍 Snake Position Logic

When the game starts (or restarts), the `generateRandomSnake()` function creates a random starting position for the snake based on the previous high score saved in localStorage.

Logic Overview:  
- Uses the value of `localStorage.getItem('high-score-amount')` as a seed to randomize direction (horizontal or vertical).  
- The head of the snake is placed randomly, and the rest of the body follows in a straight line.  
- Ensures the snake doesn’t spawn too close to the canvas edge.  

This prevents repetitive gameplay and adds variety every time.

---

## 🍎 Food Color Animation

- The food item changes its color between green and ash-grey every 1 second (1000ms) using a blinking logic.
- It enhances the visibility and makes the gameplay more dynamic.

---

## 🔊 Sound Effects

- Eating food: `snake-sound.wav` is played.
- Winning (New High Score): `game_win.wav` is played.
- Losing: `game_over.wav` is played.
- Audio is embedded via `<audio>` tags and triggered in `script.js`.

---

## 💾 Scoring and High Score

- The current score is incremented by 1 for each food eaten.
- The highest score is stored in the browser's localStorage under the key `high-score-amount`.
- If the player beats the high score, a special New High Score screen is shown.

---

## 💀 Game Over & 🏆 Win Screens

Both screens are overlay `<div>` elements shown when:

- Snake hits wall or its own body → Game Over screen
- Player breaks the high score → New High Score screen

Each shows the final score, high score, and a Play Again button.

---

## 🛠 Technologies Used

- HTML5 Canvas
- Vanilla JavaScript (No libraries)
- CSS Flexbox for layout
- localStorage for high score
- `<audio>` tag for sound playback

---

## 📁 Folder Structure


---

## 🧠 Author Notes

- Inspired by the classic Snake game with modern touches.
- Ideal for practicing canvas, animation, and DOM manipulation basics.
- Can be extended with difficulty levels, leaderboard, or mobile controls.

---

Happy Coding!
