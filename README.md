# 🎂 Happy Birthday!

A cinematic birthday greeting website featuring a celebrity squad wishing you a happy birthday. Built with pure vanilla HTML, CSS, and JavaScript — no frameworks, no dependencies.

---

## ✨ Features

- **Fullscreen hero** with animated birthday title and canvas confetti
- **Celebrity greeting squad** — 6 video cards with auto-generated thumbnails
- **Cinematic video modal** — click any card to play their greeting in a theater overlay
- **Dark luxury design** — gold + pink accents, Playfair Display typography
- **Fully responsive** — 3-col → 2-col → 1-col grid
- **Reusable** — no hardcoded name, works for any birthday

## 🎬 The Squad

| Guest | Title |
|-------|-------|
| Dwayne "The Rock" Johnson | WWE Legend & Hollywood Star |
| Donald Trump | 45th & 47th President of the USA |
| The Minions | Professional Birthday Crashers |
| Africa | A Very Special Guest |
| Jack Black & Jason Momoa | Hollywood Dream Team |
| Johnny Sins | Man of Many Professions |

## 🛠️ Tech Stack

- Vanilla HTML5 / CSS3 / JavaScript ES6+
- Google Fonts — Playfair Display + Inter
- Canvas API — confetti particles & video thumbnails
- IntersectionObserver — scroll reveal animations
- No build tools. No frameworks. Just vibes.

## 🚀 Usage

1. Clone the repo
2. Drop your `.mp4` greeting videos into `assets/`
3. Update the `SQUAD` array in `script.js` with your video filenames and sender names
4. Open `index.html` in a browser — or deploy to GitHub Pages

```js
// script.js — customize your squad
const SQUAD = [
  { name: 'Your Person', tag: 'Their Title', emoji: '🎉', file: 'assets/yourfile.mp4', gradient: '...' },
  // ...
];
```

## 📁 Structure

```
├── index.html
├── style.css
├── script.js
└── assets/
    └── *.mp4   ← your greeting videos go here
```

## 📄 License

MIT — free to use, remix, and share.
