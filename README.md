# SEMIRA
### Islamic Nasheed & Audio Player
> **"Listen. Reflect. Remember."**

---

## ✦ About SEMIRA

**SEMIRA** (سَمِيرَا) is a modern, responsive, and spiritually respectful Islamic nasheed and audio player web application. Designed around peace, contemplation, and elegance, SEMIRA provides an immersive listening experience with a distinctive visual and cultural identity inspired by Ethiopian Islamic heritage and sacred vocal traditions.

This project was built as part of the **CodeAlpha Frontend Development Internship** for **Task 4: Music Player using JavaScript**. It satisfies every requirement of the core internship assignment while extending significantly beyond basic audio players to incorporate sophisticated Web Audio API visualizers, dynamic queue management, local persistence, responsive multi-view navigation, and keyboard accessibility.

---

## ✦ Key Features

- **Pristine Audio Engine (HTML5 Audio API)**:
  - Real-time Play, Pause, Next, and Previous controls.
  - **Intelligent Previous Track Logic**: Restarts current track if playback is past 3 seconds; otherwise loads the previous track.
  - **Autoplay & Continuous Playback**: Automatically advances through the queue or loops the catalog.
  - **Accurate Dynamic Progress Scrubbing**: Shows true `00:00 / 00:00` timestamps computed from actual audio metadata (never hard-coded), with click & drag seeking.
  - **Volume & Mute Controls**: Smooth slider with memory restoration upon unmute, persisted via `localStorage`.
  - **Shuffle & 3-State Repeat Modes**: Repeat Off, Repeat Playlist, and Repeat Current Track (with visual badge).
  - **Adjustable Playback Speed**: 0.75x, 1x, 1.25x, 1.5x, and 2x speeds via `audio.playbackRate`.

- **Web Audio API Visualizer**:
  - Soft, serene frequency spectrum built with `AudioContext` and `AnalyserNode`.
  - Designed with warm gold tones and gentle decay physics (avoiding loud nightclub visualizer effects).
  - **Graceful Fallback**: Automatically adapts to ambient harmonic synchronization if browser security restricts local `file://` cross-origin connections.

- **Ethiopian & Islamic Aesthetic**:
  - Palette composed of deep charcoal (`#0e1014`), warm gold accents (`#d4af37`), and soft cream typography (`#f7f4ed`).
  - Subtle Ethiopian geometric lattice, diamond rosettes, and Islamic 8-point stars (*Rub el Hizb*) in artwork and backgrounds.
  - Dedicated **"Ethiopian Nasheeds"** section celebrating Ethiopian devotional vocal modes (*Tizita*, *Ambassel*, *Bayati*).

- **Multi-View Navigation (SPA Architecture)**:
  - **Home**: Hero banner, quick category filters, featured nasheeds, Ethiopian collection, and full spiritual library.
  - **Explore**: Filter by category, sort by title/artist/category, and real-time live search.
  - **Favorites**: Locally persisted collection of favorited tracks (♡ / ♥) with one-click "Play All Favorites".
  - **Up Next Queue**: Interactive playlist queue displaying currently playing track and upcoming items.
  - **Recently Played**: Automatic history tracking (up to 10 unique tracks, newest first).

- **Dual Theme Support (Dark & Light Mode)**:
  - **Dark Charcoal Mode** (Primary): Deep charcoal, warm obsidian, muted gold, cream text.
  - **Warm Ivory Mode**: Ivory, beige, dark charcoal text, antique gold.
  - Theme choice is automatically saved in `localStorage`.

- **Sleep Timer**:
  - Options: Off, 10 min, 20 min, 30 min, 45 min, 60 min, or "End of Current Track".
  - Live countdown displayed in the top header and mini player.
  - Gently pauses playback upon expiration.

- **Album Art Animation**:
  - Gentle pulsing breathing halo and subtle rotation aura when audio is actively playing; stops smoothly when paused.

- **Docked Mini Player**:
  - Persistent, compact bottom bar with track thumbnail, play/pause/prev/next controls, progress track, volume, and quick action shortcuts.

- **Keyboard Shortcuts**:
  - `Space`: Play / Pause
  - `Arrow Right` ($\rightarrow$): Seek forward 5 seconds
  - `Arrow Left` ($\leftarrow$): Seek backward 5 seconds
  - `Arrow Up` ($\uparrow$): Increase volume (+5%)
  - `Arrow Down` ($\downarrow$): Decrease volume (-5%)
  - `M`: Mute / Unmute
  - `S`: Toggle Shuffle
  - `R`: Cycle Repeat modes
  - `?`: Open Keyboard Shortcuts cheat sheet
  - `Esc`: Close modals and drawers
  - *(Intelligently bypassed when typing inside the search input)*

- **Accessibility & Robust Error Handling**:
  - Semantic HTML5 structure (`<aside>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<header>`).
  - Strict adherence to `<button>` elements with `aria-label` attributes and visible `:focus-visible` states.
  - Graceful error notifications: If an audio file or cover image is missing, the player does NOT crash—it displays a polite notification toast: *"Audio unavailable. Add the required audio file to the assets/audio folder."* and renders a fallback geometric artwork.

---

## ✦ Technologies Used

- **HTML5**: Semantic tags, accessible landmarks, and native `<audio>` element.
- **CSS3**: CSS Custom Properties (Variables), Flexbox, CSS Grid, Fluid Typography (`clamp()`), and smooth transitions.
- **Vanilla JavaScript (ES6+)**: Modular functions, event delegation, audio state engine, zero external frameworks or libraries.
- **HTML5 Audio API**: Dynamic audio streaming, buffered states, and rate manipulation.
- **Web Audio API**: `AudioContext`, `AnalyserNode`, and 60fps HTML5 Canvas rendering.
- **localStorage**: Client-side persistence for favorites, volume level, theme choice, and recent history.

---

## ✦ Ethiopian Nasheed Support & Content Policy

SEMIRA is architected with a cultural foundation honoring Ethiopian Islamic vocal traditions. 

> [!IMPORTANT]
> **Content & Copyright Notice**:
> This repository uses **placeholder, demo synthesized audio files and procedural geometric artwork**. No copyrighted commercial audio is included or distributed. Users are expected to add their own licensed, royalty-free, or permission-based Ethiopian nasheeds and spiritual recordings for personal listening.

---

## ✦ Project Structure

```text
SEMIRA/
│
├── index.html          # Semantic HTML5 markup, navigation, and player structure
├── style.css           # Pure CSS3 styling, custom properties, dark/light themes
├── script.js           # Vanilla JavaScript audio engine, state, and UI logic
├── README.md           # Project documentation and developer guide
│
└── assets/
    ├── audio/          # Audio files (MP3 format)
    │   ├── song1.mp3   # Demo track 1: Path of Light (Noor)
    │   ├── song2.mp3   # Demo track 2: Morning Remembrance (Subh)
    │   ├── song3.mp3   # Demo track 3: Breeze of Ramadan (Naseem)
    │   ├── song4.mp3   # Demo track 4: Tears of Repentance (Tawbah)
    │   └── song5.mp3   # Demo track 5: Joy of Eid (Farha)
    │
    └── images/         # Album cover art (800x800 JPG format)
        ├── cover1.jpg  # Cover art for Track 1
        ├── cover2.jpg  # Cover art for Track 2
        ├── cover3.jpg  # Cover art for Track 3
        ├── cover4.jpg  # Cover art for Track 4
        └── cover5.jpg  # Cover art for Track 5
```

---

## ✦ How to Run Locally

Because SEMIRA is crafted using pure HTML, CSS, and vanilla JavaScript, **no build step, bundler, or package installation is required**.

### Method 1: Direct File Opening
Double-click `index.html` in your file explorer or open it in any modern browser (Chrome, Edge, Firefox, Safari).

### Method 2: Local HTTP Server (Recommended for Web Audio API)
To experience the Web Audio API spectrum visualizer at its highest fidelity without browser `file://` restrictions:

```bash
# Using Python 3
python -m http.server 8000

# OR using Node (npx)
npx serve .
```

Then open your browser to:
```text
http://localhost:8000
```

---

## ✦ Adding Your Own Audio & Artwork

To expand SEMIRA with your own nasheed library:

1. **Add Your Audio Files**:
   Place your audio tracks (in `.mp3` format) inside `assets/audio/` (e.g. `assets/audio/my_nasheed.mp3`).
2. **Add Your Artwork**:
   Place corresponding album artwork inside `assets/images/` (e.g. `assets/images/my_cover.jpg`).
3. **Update the Songs Array in `script.js`**:
   Open `script.js` and edit or append new objects to the `songs` array:

```javascript
{
  id: 6,
  title: "Your Nasheed Title",
  artist: "Nasheed Artist Name",
  category: "Ethiopian Nasheeds", // or "Spiritual", "Ramadan", "Eid", "Peaceful"
  country: "Ethiopia",
  src: "assets/audio/my_nasheed.mp3",
  cover: "assets/images/my_cover.jpg",
  description: "Devotional vocal nasheed in traditional melody.",
  isFeatured: true
}
```

The application will automatically render the new track in the home catalog, explore tab, category filters, and queue!

---

## ✦ CodeAlpha Internship Verification

- **Organization**: CodeAlpha
- **Track**: Frontend Development Internship
- **Task**: Task 4 — *Music Player using JavaScript*
- **Developer**: SEMIRA Frontend Project
- **Status**: Completed & Portfolio-Ready

---

*“Listen. Reflect. Remember.”*
