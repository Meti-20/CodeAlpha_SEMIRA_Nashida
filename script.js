/**
 * ==========================================================================
 * SEMIRA - Islamic Nasheed & Audio Player
 * "Listen. Reflect. Remember."
 * CodeAlpha Frontend Development Internship Task 4: Music Player using JavaScript
 *
 * Technologies: HTML5, CSS3, Vanilla JavaScript, HTML5 Audio API,
 *               Web Audio API, localStorage
 * ==========================================================================
 */

"use strict";

// ==========================================================================
// 1. SONG DATABASE & DATA STRUCTURE
// ==========================================================================
/**
 * Initial Nasheed Catalog.
 * Designed with a focus on Ethiopian Islamic nasheeds and spiritual categories.
 * Placeholder audio and artwork are included for demonstration purposes.
 * Users may replace these with authorized/permission-based recordings.
 */
const songs = [
  {
    id: 1,
    title: "ወደ ማንነት (Wede Maninet)",
    artist: "Demo Ethiopian Nasheed Artist",
    category: "Ethiopian Nasheeds",
    country: "Ethiopia",
    src: "assets/audio/song 1.m4a",
    cover: "assets/images/cover 1.png",
    description:
      "ምርኩዝ 21 || ወደ ማንነት || New Best Ethiopian Nesheed || Minber TV.",
    isFeatured: true,
  },
  {
    id: 2,
    title: "ያ ረሒም (Ya Rahim)",
    artist: "Demo Ethiopian Nasheed Artist",
    category: "Ethiopian Nasheeds",
    country: "Ethiopia",
    src: "assets/audio/song 2.m4a",
    cover: "assets/images/cover 2.png",
    description:
      "የታጠፉ ገጾች ምርኩዝ 24 | BEST ETHIOPIA NEW NESHID | Minber Records ሚንበር ሪከርድስ .",
    isFeatured: true,
  },
    {
    id: 5,
    title: "Maher Zain - Eidun Mubarak",
    artist: "Awakening Music",
    category: "Eid",
    country: "International",
    src: "assets/audio/song 3.m4a",
    cover: "assets/images/cover 3.png",
    description:
      "An uplifting, peaceful nasheed expressing gratitude, spiritual communion, and joyful celebration on Eid.",
    isFeatured: false,
  },
  {
    id: 4,
    title: "Save Me From Myself",
    artist: "Harris J",
    category: "Peaceful",
    country: "International",
    src: "assets/audio/song 5.m4a",
    cover: "assets/images/cover 5.png",
    description:
      "Solemn, heartfelt spiritual nasheed drawing from the international scale for sincere reflection and remembrance.",
    isFeatured: true,
  },
    {
    id: 3,
    title: "Maher Zain - Ramadan",
    artist: "Awakening Music",
    category: "Ramadan",
    country: "International",
    src: "assets/audio/song 4.m4a",
    cover: "assets/images/cover 4.png",
    description:
      "A reflective, peaceful nasheed evoking the tranquility and spiritual reverence of Ramadan evenings.",
    isFeatured: false,
  },
];

// ==========================================================================
// 2. PLAYER STATE MANAGEMENT & LOCAL STORAGE
// ==========================================================================
const PlayerState = {
  currentSongIndex: 0,
  isPlaying: false,
  isShuffle: false,
  repeatMode: "all", // 'off' | 'all' | 'one'
  volume: 0.8,
  previousVolume: 0.8,
  isMuted: false,
  playbackRate: 1.0,
  queue: [...songs],
  favorites: new Set(),
  recentlyPlayed: [],
  activeCategory: "All",
  searchQuery: "",
  currentView: "home",
  sleepTimer: {
    id: null,
    totalSeconds: 0,
    remainingSeconds: 0,
    mode: "off", // 'off' | 'time' | 'end-track'
  },
  audioContext: null,
  analyser: null,
  isVisualizerReady: false,
};

// Storage Keys
const STORAGE_KEYS = {
  THEME: "semira_theme",
  VOLUME: "semira_volume",
  MUTED: "semira_muted",
  FAVORITES: "semira_favorites",
  RECENT: "semira_recent",
  LAST_SONG_ID: "semira_last_song_id",
};

// ==========================================================================
// 3. DOM ELEMENT REFERENCES
// ==========================================================================
const DOM = {
  // Audio Element
  audio: document.getElementById("audioPlayer"),

  // Navigation & Views
  sidebar: document.getElementById("sidebar"),
  mobileNavBackdrop: document.getElementById("mobileNavBackdrop"),
  mobileMenuToggle: document.getElementById("mobileMenuToggle"),
  navButtons: document.querySelectorAll(".nav-item[data-view]"),
  categoryNavItems: document.querySelectorAll(".cat-item[data-category]"),
  viewPanels: document.querySelectorAll(".view-panel"),
  favCountBadge: document.getElementById("favCountBadge"),
  queueCountBadge: document.getElementById("queueCountBadge"),

  // Header & Search
  searchInput: document.getElementById("searchInput"),
  searchClearBtn: document.getElementById("searchClearBtn"),
  activeFilterBadge: document.getElementById("activeFilterBadge"),
  activeFilterText: document.getElementById("activeFilterText"),
  filterResetBtn: document.getElementById("filterResetBtn"),
  themeToggleBtn: document.getElementById("themeToggleBtn"),
  topThemeBtn: document.getElementById("topThemeBtn"),
  themeLabel: document.getElementById("themeLabel"),
  sleepTimerPill: document.getElementById("sleepTimerPill"),
  sleepTimerCountdown: document.getElementById("sleepTimerCountdown"),
  shortcutsBtn: document.getElementById("shortcutsBtn"),
  topShortcutsBtn: document.getElementById("topShortcutsBtn"),

  // Home View Elements
  categoryChips: document.querySelectorAll(".category-chips-bar .chip"),
  homeFeaturedSection: document.getElementById("homeFeaturedSection"),
  homeEthiopianSection: document.getElementById("homeEthiopianSection"),
  homeLibrarySection: document.getElementById("homeLibrarySection"),
  libraryHeading: document.getElementById("libraryHeading"),
  librarySubtitle: document.getElementById("librarySubtitle"),
  featuredCardsGrid: document.getElementById("featuredCardsGrid"),
  ethiopianCardsGrid: document.getElementById("ethiopianCardsGrid"),
  allTracksCardsGrid: document.getElementById("allTracksCardsGrid"),
  heroPlayNowBtn: document.getElementById("heroPlayNowBtn"),
  heroExploreEthiopianBtn: document.getElementById("heroExploreEthiopianBtn"),
  heroHighlightCard: document.getElementById("heroHighlightCard"),
  heroHighlightImg: document.getElementById("heroHighlightImg"),
  heroHighlightTitle: document.getElementById("heroHighlightTitle"),
  heroHighlightArtist: document.getElementById("heroHighlightArtist"),
  heroHighlightPlayBtn: document.getElementById("heroHighlightPlayBtn"),
  sortSelect: document.getElementById("sortSelect"),

  // Explore View
  exploreCardsGrid: document.getElementById("exploreCardsGrid"),
  exploreFilterPills: document.querySelectorAll(
    ".explore-filter-pills .filter-pill",
  ),
  searchResultsInfo: document.getElementById("searchResultsInfo"),
  searchResultsCount: document.getElementById("searchResultsCount"),
  resetSearchFromExplore: document.getElementById("resetSearchFromExplore"),

  // Favorites View
  favoritesEmptyState: document.getElementById("favoritesEmptyState"),
  favoritesTableWrap: document.getElementById("favoritesTableWrap"),
  favoritesTrackList: document.getElementById("favoritesTrackList"),
  playAllFavoritesBtn: document.getElementById("playAllFavoritesBtn"),

  // Queue View
  queueTrackList: document.getElementById("queueTrackList"),
  queueCurrentCard: document.getElementById("queueCurrentCard"),
  clearQueueBtn: document.getElementById("clearQueueBtn"),

  // Recently Played View
  recentEmptyState: document.getElementById("recentEmptyState"),
  recentTableWrap: document.getElementById("recentTableWrap"),
  recentTrackList: document.getElementById("recentTrackList"),
  clearRecentBtn: document.getElementById("clearRecentBtn"),

  // Central Now Playing Showcase
  showcaseSection: document.getElementById("nowPlayingShowcase"),
  artworkWrap: document.getElementById("artworkWrap"),
  showcaseCover: document.getElementById("showcaseCover"),
  showcaseCategory: document.getElementById("showcaseCategory"),
  showcaseCountryText: document.getElementById("showcaseCountryText"),
  showcaseFavBtn: document.getElementById("showcaseFavBtn"),
  showcaseTitle: document.getElementById("showcaseTitle"),
  showcaseArtist: document.getElementById("showcaseArtist"),
  showcaseDesc: document.getElementById("showcaseDesc"),
  currentTimeLabel: document.getElementById("currentTimeLabel"),
  totalDurationLabel: document.getElementById("totalDurationLabel"),
  progressBarContainer: document.getElementById("progressBarContainer"),
  progressBarFill: document.getElementById("progressBarFill"),
  progressBarHandle: document.getElementById("progressBarHandle"),
  mainPlayPauseBtn: document.getElementById("mainPlayPauseBtn"),
  mainPlayIcon: document.getElementById("mainPlayIcon"),
  mainPauseIcon: document.getElementById("mainPauseIcon"),
  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  shuffleBtn: document.getElementById("shuffleBtn"),
  repeatBtn: document.getElementById("repeatBtn"),
  repeatBadge: document.getElementById("repeatBadge"),
  volumeMuteBtn: document.getElementById("volumeMuteBtn"),
  volIconHigh: document.getElementById("volIconHigh"),
  volIconLow: document.getElementById("volIconLow"),
  volIconMuted: document.getElementById("volIconMuted"),
  volumeSlider: document.getElementById("volumeSlider"),
  speedPills: document.querySelectorAll(".speed-pill"),
  visualizerCanvas: document.getElementById("visualizerCanvas"),
  visualizerModeLabel: document.getElementById("visualizerModeLabel"),

  // Mini Player
  miniPlayer: document.getElementById("miniPlayer"),
  miniProgressContainer: document.getElementById("miniProgressContainer"),
  miniProgressFill: document.getElementById("miniProgressFill"),
  miniCover: document.getElementById("miniCover"),
  miniTitle: document.getElementById("miniTitle"),
  miniArtist: document.getElementById("miniArtist"),
  miniFavBtn: document.getElementById("miniFavBtn"),
  miniPrevBtn: document.getElementById("miniPrevBtn"),
  miniPlayPauseBtn: document.getElementById("miniPlayPauseBtn"),
  miniPlayIcon: document.getElementById("miniPlayIcon"),
  miniPauseIcon: document.getElementById("miniPauseIcon"),
  miniNextBtn: document.getElementById("miniNextBtn"),
  miniCurrentTime: document.getElementById("miniCurrentTime"),
  miniDuration: document.getElementById("miniDuration"),
  miniVolumeBtn: document.getElementById("miniVolumeBtn"),
  miniVolumeSlider: document.getElementById("miniVolumeSlider"),
  miniSpeedBtn: document.getElementById("miniSpeedBtn"),
  miniSleepTimerBtn: document.getElementById("miniSleepTimerBtn"),
  scrollToPlayerBtn: document.getElementById("scrollToPlayerBtn"),

  // Modals
  sleepTimerModal: document.getElementById("sleepTimerModal"),
  closeSleepModalBtn: document.getElementById("closeSleepModalBtn"),
  sidebarSleepTimerBtn: document.getElementById("sidebarSleepTimerBtn"),
  sidebarSleepStatus: document.getElementById("sidebarSleepStatus"),
  sleepOptionBtns: document.querySelectorAll(".sleep-option-btn"),

  sidebarSpeedBtn: document.getElementById("sidebarSpeedBtn"),
  sidebarSpeedStatus: document.getElementById("sidebarSpeedStatus"),

  shortcutsModal: document.getElementById("shortcutsModal"),
  closeShortcutsModalBtn: document.getElementById("closeShortcutsModalBtn"),

  // Notifications
  toastContainer: document.getElementById("toastContainer"),
};

// ==========================================================================
// 4. UTILITY FUNCTIONS
// ==========================================================================
/**
 * Format seconds into mm:ss format.
 * Returns '00:00' if input is invalid or NaN.
 */
function formatTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

/**
 * Display a graceful toast notification.
 */
function showToast(message, type = "info", duration = 3500) {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.setAttribute("role", "alert");

  const msgSpan = document.createElement("span");
  msgSpan.className = "toast-msg";
  msgSpan.textContent = message;

  const closeBtn = document.createElement("button");
  closeBtn.className = "toast-close";
  closeBtn.setAttribute("aria-label", "Dismiss alert");
  closeBtn.innerHTML = "&times;";
  closeBtn.onclick = () => toast.remove();

  toast.appendChild(msgSpan);
  toast.appendChild(closeBtn);
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-10px)";
    setTimeout(() => toast.remove(), 250);
  }, duration);
}

/**
 * Fallback image generator for missing artwork.
 */
function getFallbackImage(title) {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%231a1d25"/><circle cx="200" cy="200" r="100" fill="none" stroke="%23d4af37" stroke-width="2" opacity="0.4"/><text x="200" y="208" fill="%23d4af37" font-size="20" font-family="sans-serif" text-anchor="middle">SEMIRA</text></svg>`;
}

// ==========================================================================
// 5. CORE AUDIO ENGINE & PLAYBACK CONTROLS
// ==========================================================================

/**
 * Load a song into the HTML5 Audio player by its queue index.
 */
function loadSong(index, shouldPlay = false) {
  if (index < 0 || index >= PlayerState.queue.length) return;

  PlayerState.currentSongIndex = index;
  const currentSong = PlayerState.queue[index];

  // Set audio source
  DOM.audio.src = currentSong.src;
  DOM.audio.playbackRate = PlayerState.playbackRate;

  // Update UI Elements across views
  updateNowPlayingUI(currentSong);
  updateActiveCardHighlights(currentSong.id);
  updateQueueView();

  // Save last played song to localStorage
  localStorage.setItem(STORAGE_KEYS.LAST_SONG_ID, currentSong.id);

  if (shouldPlay) {
    playAudio();
  }
}

/**
 * Play audio safely with browser promise handling.
 */
function playAudio() {
  // Initialize Web Audio API on first user gesture
  initWebAudio();

  const playPromise = DOM.audio.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        PlayerState.isPlaying = true;
        updatePlayPauseIcons(true);
        DOM.artworkWrap.classList.add("playing");
        addToRecentlyPlayed(PlayerState.queue[PlayerState.currentSongIndex].id);
      })
      .catch((error) => {
        console.warn("Audio playback interrupted or blocked:", error);
        PlayerState.isPlaying = false;
        updatePlayPauseIcons(false);
        DOM.artworkWrap.classList.remove("playing");
      });
  }
}

/**
 * Pause audio playback.
 */
function pauseAudio() {
  DOM.audio.pause();
  PlayerState.isPlaying = false;
  updatePlayPauseIcons(false);
  DOM.artworkWrap.classList.remove("playing");
}

/**
 * Toggle Play / Pause state.
 */
function togglePlayPause() {
  if (PlayerState.isPlaying) {
    pauseAudio();
  } else {
    playAudio();
  }
}

/**
 * Handle "Previous" track.
 * CodeAlpha / Requirement 12: If current song has played for > 3 seconds, restart current track.
 * Otherwise, move to previous track.
 */
function handlePreviousTrack() {
  if (DOM.audio.currentTime > 3.0) {
    DOM.audio.currentTime = 0;
    if (!PlayerState.isPlaying) playAudio();
  } else {
    let prevIndex = PlayerState.currentSongIndex - 1;
    if (prevIndex < 0) {
      prevIndex = PlayerState.queue.length - 1;
    }
    loadSong(prevIndex, true);
  }
}

/**
 * Handle "Next" track with shuffle support.
 */
function handleNextTrack() {
  if (PlayerState.queue.length === 0) return;

  let nextIndex;

  if (PlayerState.isShuffle) {
    // Avoid immediately repeating current song if possible
    if (PlayerState.queue.length > 1) {
      do {
        nextIndex = Math.floor(Math.random() * PlayerState.queue.length);
      } while (nextIndex === PlayerState.currentSongIndex);
    } else {
      nextIndex = 0;
    }
  } else {
    nextIndex = PlayerState.currentSongIndex + 1;
    if (nextIndex >= PlayerState.queue.length) {
      nextIndex = 0;
    }
  }

  loadSong(nextIndex, true);
}

/**
 * Handle song completion / autoplay logic.
 */
function handleSongEnded() {
  // Check if sleep timer is set to end of current track
  if (PlayerState.sleepTimer.mode === "end-track") {
    pauseAudio();
    cancelSleepTimer();
    showToast("Sleep timer completed: Audio paused.", "info");
    return;
  }

  if (PlayerState.repeatMode === "one") {
    DOM.audio.currentTime = 0;
    playAudio();
  } else if (PlayerState.repeatMode === "all") {
    handleNextTrack();
  } else {
    // Repeat Off: stop if we reached the end of the playlist
    if (PlayerState.currentSongIndex === PlayerState.queue.length - 1) {
      pauseAudio();
      loadSong(0, false);
      DOM.audio.currentTime = 0;
    } else {
      handleNextTrack();
    }
  }
}

/**
 * Seek audio by percentage (0 to 1).
 */
function seekAudioToPercent(percent) {
  if (!DOM.audio.duration || isNaN(DOM.audio.duration)) return;
  const clampedPercent = Math.max(0, Math.min(1, percent));
  DOM.audio.currentTime = clampedPercent * DOM.audio.duration;
  updateProgressUI();
}

// ==========================================================================
// 6. VOLUME, SHUFFLE, REPEAT & SPEED CONTROLS
// ==========================================================================

/**
 * Set and persist audio volume (0.0 to 1.0).
 */
function setVolume(val, persist = true) {
  const clamped = Math.max(0, Math.min(1, parseFloat(val)));
  PlayerState.volume = clamped;
  DOM.audio.volume = clamped;

  if (clamped > 0) {
    PlayerState.isMuted = false;
    PlayerState.previousVolume = clamped;
  }

  // Update UI inputs
  DOM.volumeSlider.value = clamped;
  DOM.miniVolumeSlider.value = clamped;

  updateVolumeIcons(clamped);

  if (persist) {
    localStorage.setItem(STORAGE_KEYS.VOLUME, clamped.toString());
    localStorage.setItem(
      STORAGE_KEYS.MUTED,
      PlayerState.isMuted ? "true" : "false",
    );
  }
}

/**
 * Toggle Mute / Unmute and restore previous volume.
 */
function toggleMute() {
  if (PlayerState.isMuted || PlayerState.volume === 0) {
    // Unmute: restore previous non-zero volume
    const restoreVal =
      PlayerState.previousVolume > 0 ? PlayerState.previousVolume : 0.8;
    setVolume(restoreVal);
  } else {
    // Mute: save current volume and set to 0
    PlayerState.previousVolume = PlayerState.volume;
    PlayerState.isMuted = true;
    DOM.audio.volume = 0;
    DOM.volumeSlider.value = 0;
    DOM.miniVolumeSlider.value = 0;
    updateVolumeIcons(0);
    localStorage.setItem(STORAGE_KEYS.MUTED, "true");
  }
}

/**
 * Update volume icon state based on current level.
 */
function updateVolumeIcons(level) {
  if (level === 0 || PlayerState.isMuted) {
    DOM.volIconHigh.hidden = true;
    DOM.volIconLow.hidden = true;
    DOM.volIconMuted.hidden = false;
  } else if (level < 0.5) {
    DOM.volIconHigh.hidden = true;
    DOM.volIconLow.hidden = false;
    DOM.volIconMuted.hidden = true;
  } else {
    DOM.volIconHigh.hidden = false;
    DOM.volIconLow.hidden = true;
    DOM.volIconMuted.hidden = true;
  }
}

/**
 * Toggle shuffle mode.
 */
function toggleShuffle() {
  PlayerState.isShuffle = !PlayerState.isShuffle;
  DOM.shuffleBtn.classList.toggle("active", PlayerState.isShuffle);
  DOM.shuffleBtn.setAttribute(
    "aria-pressed",
    PlayerState.isShuffle ? "true" : "false",
  );
  showToast(
    PlayerState.isShuffle ? "Shuffle enabled" : "Shuffle disabled",
    "info",
    1800,
  );
}

/**
 * Cycle through repeat modes:
 * Off -> Repeat Playlist ('all') -> Repeat Current Song ('one') -> Off
 */
function cycleRepeatMode() {
  if (PlayerState.repeatMode === "off") {
    PlayerState.repeatMode = "all";
    DOM.repeatBtn.classList.add("active");
    DOM.repeatBadge.hidden = true;
    DOM.repeatBtn.setAttribute("title", "Repeat Mode: Playlist");
    showToast("Repeat Playlist enabled", "info", 1800);
  } else if (PlayerState.repeatMode === "all") {
    PlayerState.repeatMode = "one";
    DOM.repeatBtn.classList.add("active");
    DOM.repeatBadge.hidden = false;
    DOM.repeatBtn.setAttribute("title", "Repeat Mode: Current Track");
    showToast("Repeat Current Track enabled", "info", 1800);
  } else {
    PlayerState.repeatMode = "off";
    DOM.repeatBtn.classList.remove("active");
    DOM.repeatBadge.hidden = true;
    DOM.repeatBtn.setAttribute("title", "Repeat Mode: Off");
    showToast("Repeat Off", "info", 1800);
  }
}

/**
 * Change audio playback speed.
 */
function setPlaybackSpeed(speed) {
  const numericSpeed = parseFloat(speed);
  PlayerState.playbackRate = numericSpeed;
  DOM.audio.playbackRate = numericSpeed;

  // Update pills active state
  DOM.speedPills.forEach((pill) => {
    pill.classList.toggle(
      "active",
      parseFloat(pill.dataset.speed) === numericSpeed,
    );
  });

  DOM.miniSpeedBtn.textContent = `${numericSpeed}x`;
  DOM.sidebarSpeedStatus.textContent = `${numericSpeed}x`;
  showToast(`Playback speed: ${numericSpeed}x`, "info", 1500);
}

// ==========================================================================
// 7. SLEEP TIMER LOGIC
// ==========================================================================

function openSleepTimerModal() {
  DOM.sleepTimerModal.hidden = false;
}

function closeSleepTimerModal() {
  DOM.sleepTimerModal.hidden = true;
}

function setSleepTimer(minutes) {
  cancelSleepTimer();

  if (minutes === "end-track") {
    PlayerState.sleepTimer.mode = "end-track";
    DOM.sidebarSleepStatus.textContent = "End of Track";
    DOM.sleepTimerPill.hidden = false;
    DOM.sleepTimerCountdown.textContent = "End of Track";
    showToast("Sleep timer set: Audio will pause after current track.", "info");
    closeSleepTimerModal();
    return;
  }

  const mins = parseInt(minutes, 10);
  if (mins <= 0 || isNaN(mins)) {
    cancelSleepTimer();
    showToast("Sleep timer turned off.", "info");
    closeSleepTimerModal();
    return;
  }

  PlayerState.sleepTimer.mode = "time";
  PlayerState.sleepTimer.totalSeconds = mins * 60;
  PlayerState.sleepTimer.remainingSeconds = mins * 60;

  DOM.sidebarSleepStatus.textContent = `${mins}m`;
  DOM.sleepTimerPill.hidden = false;
  updateSleepTimerDisplay();

  PlayerState.sleepTimer.id = setInterval(() => {
    PlayerState.sleepTimer.remainingSeconds--;

    if (PlayerState.sleepTimer.remainingSeconds <= 0) {
      pauseAudio();
      cancelSleepTimer();
      showToast("Sleep timer expired. Audio paused.", "info");
    } else {
      updateSleepTimerDisplay();
    }
  }, 1000);

  showToast(`Sleep timer set for ${mins} minutes.`, "info");
  closeSleepTimerModal();
}

function updateSleepTimerDisplay() {
  const s = PlayerState.sleepTimer.remainingSeconds;
  DOM.sleepTimerCountdown.textContent = formatTime(s);
  DOM.sidebarSleepStatus.textContent = formatTime(s);
}

function cancelSleepTimer() {
  if (PlayerState.sleepTimer.id) {
    clearInterval(PlayerState.sleepTimer.id);
    PlayerState.sleepTimer.id = null;
  }
  PlayerState.sleepTimer.mode = "off";
  PlayerState.sleepTimer.remainingSeconds = 0;
  DOM.sleepTimerPill.hidden = true;
  DOM.sidebarSleepStatus.textContent = "Off";

  // Reset active state in modal
  DOM.sleepOptionBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.minutes === "0");
  });
}

// ==========================================================================
// 8. FAVORITES & RECENTLY PLAYED MANAGEMENT
// ==========================================================================

function toggleFavorite(songId) {
  const id = parseInt(songId, 10);
  let isFav = false;

  if (PlayerState.favorites.has(id)) {
    PlayerState.favorites.delete(id);
    isFav = false;
    showToast("Removed from favorites", "info", 1500);
  } else {
    PlayerState.favorites.add(id);
    isFav = true;
    showToast("Saved to favorites", "success", 1500);
  }

  // Save to localStorage
  localStorage.setItem(
    STORAGE_KEYS.FAVORITES,
    JSON.stringify(Array.from(PlayerState.favorites)),
  );

  // Update UI across all views
  updateFavoriteButtonsUI(id, isFav);
  updateFavoritesView();
  DOM.favCountBadge.textContent = PlayerState.favorites.size;
}

function updateFavoriteButtonsUI(songId, isFav) {
  // Update in central showcase if active
  const currentSong = PlayerState.queue[PlayerState.currentSongIndex];
  if (currentSong && currentSong.id === songId) {
    DOM.showcaseFavBtn.classList.toggle("is-favorite", isFav);
    DOM.miniFavBtn.classList.toggle("is-favorite", isFav);
    DOM.showcaseFavBtn.innerHTML = getHeartIconSvg(isFav);
    DOM.miniFavBtn.innerHTML = getHeartIconSvg(isFav);
  }

  // Update all card favorite buttons
  const cardFavBtns = document.querySelectorAll(
    `.card-fav-btn[data-id="${songId}"]`,
  );
  cardFavBtns.forEach((btn) => {
    btn.classList.toggle("is-favorite", isFav);
    btn.innerHTML = getHeartIconSvg(isFav);
  });
}

function getHeartIconSvg(isFav) {
  return `<svg viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" class="fav-icon-svg" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>`;
}

function addToRecentlyPlayed(songId) {
  const id = parseInt(songId, 10);
  // Remove if exists to avoid duplicate entries
  PlayerState.recentlyPlayed = PlayerState.recentlyPlayed.filter(
    (item) => item !== id,
  );
  // Prepend current
  PlayerState.recentlyPlayed.unshift(id);
  // Limit to 10 tracks
  if (PlayerState.recentlyPlayed.length > 10) {
    PlayerState.recentlyPlayed = PlayerState.recentlyPlayed.slice(0, 10);
  }
  localStorage.setItem(
    STORAGE_KEYS.RECENT,
    JSON.stringify(PlayerState.recentlyPlayed),
  );
  updateRecentlyPlayedView();
}

// ==========================================================================
// 9. WEB AUDIO API & SERENE VISUALIZER
// ==========================================================================

/**
 * Initialize Web Audio API AudioContext and AnalyserNode.
 * Wrapped in safe try/catch for browser compatibility.
 */
function initWebAudio() {
  if (PlayerState.isVisualizerReady) return;

  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    if (!PlayerState.audioContext) {
      PlayerState.audioContext = new AudioCtx();
    }

    if (PlayerState.audioContext.state === "suspended") {
      PlayerState.audioContext.resume();
    }

    // Connect audio element if not already connected
    if (!DOM.audio._sourceNode) {
      DOM.audio._sourceNode = PlayerState.audioContext.createMediaElementSource(
        DOM.audio,
      );
      PlayerState.analyser = PlayerState.audioContext.createAnalyser();
      PlayerState.analyser.fftSize = 64;
      PlayerState.analyser.smoothingTimeConstant = 0.85;

      DOM.audio._sourceNode.connect(PlayerState.analyser);
      PlayerState.analyser.connect(PlayerState.audioContext.destination);
    }

    PlayerState.isVisualizerReady = true;
    startVisualizerLoop();
  } catch (err) {
    // If browser blocks CORS on local file:// URLs, graceful fallback runs smoothly
    console.info(
      "Web Audio API AudioContext fell back to ambient harmonic mode:",
      err.message,
    );
    PlayerState.isVisualizerReady = true;
    DOM.visualizerModeLabel.textContent = "Harmonic Sync";
    startVisualizerLoop(true); // run in fallback harmonic mode
  }
}

/**
 * 60fps peaceful visualizer canvas loop.
 * Renders elegant, thin, golden/cream harmonic bars with soft easing.
 */
function startVisualizerLoop(isFallbackMode = false) {
  const canvas = DOM.visualizerCanvas;
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const bufferLength = PlayerState.analyser
    ? PlayerState.analyser.frequencyBinCount
    : 32;
  const dataArray = new Uint8Array(bufferLength);

  let phase = 0;

  function renderFrame() {
    requestAnimationFrame(renderFrame);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const barCount = 28;
    const barWidth = 4;
    const gap = (canvas.width - barCount * barWidth) / (barCount - 1);

    if (PlayerState.isPlaying) {
      if (!isFallbackMode && PlayerState.analyser) {
        PlayerState.analyser.getByteFrequencyData(dataArray);
      } else {
        // Fallback harmonic rhythm simulation
        phase += 0.08;
        for (let j = 0; j < barCount; j++) {
          const wave = Math.sin(phase + j * 0.3) * 0.5 + 0.5;
          const harmonic = Math.cos(phase * 0.5 + j * 0.15) * 0.3 + 0.7;
          dataArray[j] = Math.floor((wave * 140 + 40) * harmonic);
        }
      }
    } else {
      // Gentle flatline with tiny baseline shimmer when paused
      for (let j = 0; j < barCount; j++) {
        dataArray[j] = 8;
      }
    }

    for (let i = 0; i < barCount; i++) {
      const value = dataArray[i] || 0;
      const percent = value / 255;
      const barHeight = Math.max(3, percent * (canvas.height - 4));
      const x = i * (barWidth + gap);
      const y = canvas.height - barHeight;

      // Golden gradient for bars
      const grad = ctx.createLinearGradient(0, y, 0, canvas.height);
      grad.addColorStop(0, "#f1db99");
      grad.addColorStop(1, "#9e8022");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barHeight, [2, 2, 0, 0]);
      ctx.fill();
    }
  }

  renderFrame();
}

// ==========================================================================
// 10. UI UPDATES & RENDERING
// ==========================================================================

/**
 * Update the central Now Playing showcase with song details.
 */
function updateNowPlayingUI(song) {
  // Update showcase
  DOM.showcaseCover.src = song.cover;
  DOM.showcaseCover.alt = `${song.title} album artwork`;
  DOM.showcaseTitle.textContent = song.title;
  DOM.showcaseArtist.textContent = song.artist;
  DOM.showcaseCategory.textContent = song.category;
  DOM.showcaseCountryText.textContent = song.country;
  DOM.showcaseDesc.textContent = song.description || "";

  // Update Mini Player
  DOM.miniCover.src = song.cover;
  DOM.miniCover.alt = song.title;
  DOM.miniTitle.textContent = song.title;
  DOM.miniArtist.textContent = song.artist;

  // Update hero banner preview
  DOM.heroHighlightImg.src = song.cover;
  DOM.heroHighlightTitle.textContent = song.title;
  DOM.heroHighlightArtist.textContent = song.artist;

  // Update favorite hearts
  const isFav = PlayerState.favorites.has(song.id);
  DOM.showcaseFavBtn.classList.toggle("is-favorite", isFav);
  DOM.miniFavBtn.classList.toggle("is-favorite", isFav);
  DOM.showcaseFavBtn.innerHTML = getHeartIconSvg(isFav);
  DOM.miniFavBtn.innerHTML = getHeartIconSvg(isFav);

  // Fallback for image error
  DOM.showcaseCover.onerror = () => {
    DOM.showcaseCover.src = getFallbackImage(song.title);
  };
  DOM.miniCover.onerror = () => {
    DOM.miniCover.src = getFallbackImage(song.title);
  };
}

/**
 * Update Play/Pause button icons across the app.
 */
function updatePlayPauseIcons(isPlaying) {
  // Showcase button
  DOM.mainPlayIcon.hidden = isPlaying;
  DOM.mainPauseIcon.hidden = !isPlaying;
  DOM.mainPlayPauseBtn.setAttribute(
    "aria-label",
    isPlaying ? "Pause audio" : "Play audio",
  );

  // Mini player button
  DOM.miniPlayIcon.hidden = isPlaying;
  DOM.miniPauseIcon.hidden = !isPlaying;
  DOM.miniPlayPauseBtn.setAttribute(
    "aria-label",
    isPlaying ? "Pause audio" : "Play audio",
  );

  // Hero play button icon
  DOM.heroHighlightPlayBtn.innerHTML = isPlaying
    ? `<svg viewBox="0 0 24 24" fill="currentColor" class="icon-play" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="currentColor" class="icon-play" aria-hidden="true"><polygon points="6 4 19 12 6 20 6 4"/></svg>`;

  // Update all card play button overlays
  const activeSong = PlayerState.queue[PlayerState.currentSongIndex];
  if (activeSong) {
    document.querySelectorAll(".card-play-overlay").forEach((btn) => {
      const card = btn.closest(".nasheed-card");
      const cardId = parseInt(card?.dataset.id, 10);
      if (cardId === activeSong.id && isPlaying) {
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>`;
      } else {
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6 4 20 12 6 20 6 4"/></svg>`;
      }
    });
  }
}

/**
 * Highlight active playing card across grids.
 */
function updateActiveCardHighlights(activeId) {
  document.querySelectorAll(".nasheed-card").forEach((card) => {
    const cardId = parseInt(card.dataset.id, 10);
    card.classList.toggle("active-playing", cardId === activeId);
  });
}

/**
 * Update time display and progress bars.
 */
function updateProgressUI() {
  const current = DOM.audio.currentTime || 0;
  const duration = DOM.audio.duration || 0;

  DOM.currentTimeLabel.textContent = formatTime(current);
  DOM.miniCurrentTime.textContent = formatTime(current);

  if (!isNaN(duration) && duration > 0) {
    DOM.totalDurationLabel.textContent = formatTime(duration);
    DOM.miniDuration.textContent = formatTime(duration);

    const percent = (current / duration) * 100;
    DOM.progressBarFill.style.width = `${percent}%`;
    DOM.miniProgressFill.style.width = `${percent}%`;

    DOM.progressBarContainer.setAttribute("aria-valuenow", Math.round(percent));
    DOM.miniProgressContainer.setAttribute(
      "aria-valuenow",
      Math.round(percent),
    );
  } else {
    DOM.totalDurationLabel.textContent = "00:00";
    DOM.miniDuration.textContent = "00:00";
    DOM.progressBarFill.style.width = "0%";
    DOM.miniProgressFill.style.width = "0%";
  }
}

/**
 * Generate HTML string for a nasheed card.
 */
function createCardHTML(song) {
  const isFav = PlayerState.favorites.has(song.id);
  const isCurrent =
    PlayerState.queue[PlayerState.currentSongIndex]?.id === song.id;

  return `
    <article class="nasheed-card ${isCurrent ? "active-playing" : ""}" data-id="${song.id}" tabindex="0" role="region" aria-label="${song.title}">
      <div class="card-artwork-wrap">
        <img src="${song.cover}" alt="${song.title}" class="card-artwork" loading="lazy" onerror="this.src='${getFallbackImage(song.title)}'">
        <button class="card-play-overlay" data-action="play" aria-label="Play ${song.title}">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="6 4 20 12 6 20 6 4"/>
          </svg>
        </button>
        <button class="card-fav-btn ${isFav ? "is-favorite" : ""}" data-action="fav" data-id="${song.id}" aria-label="Toggle favorite">
          ${getHeartIconSvg(isFav)}
        </button>
      </div>

      <div class="card-content">
        <div class="card-category-row">
          <span class="card-category">${song.category}</span>
        </div>
        <h3 class="card-title" title="${song.title}">${song.title}</h3>
        <p class="card-artist">${song.artist}</p>
        
        <div class="card-footer">
          <span class="card-country-badge">
            <span class="cat-dot ${song.country === "Ethiopia" ? "ethiopian-dot" : ""}"></span>
            ${song.country}
          </span>
        </div>
      </div>
    </article>
  `;
}

// ==========================================================================
// 10. UNIFIED CATEGORY FILTERING & SEARCH PIPELINE
// ==========================================================================

/**
 * Normalize category string to handle capitalization, singular/plural, and aliases.
 */
function normalizeCategory(cat) {
  if (!cat) return "All";
  const clean = cat.toString().trim().toLowerCase();
  if (clean === "all" || clean === "all nasheeds" || clean === "all tracks")
    return "All";
  if (clean.includes("ethiopian")) return "Ethiopian Nasheeds";
  if (clean.startsWith("spirit")) return "Spiritual";
  if (clean.startsWith("ramadan")) return "Ramadan";
  if (clean.startsWith("eid")) return "Eid";
  if (clean.startsWith("peace")) return "Peaceful";
  return cat.trim();
}

/**
 * Check whether a song belongs to the specified category.
 */
function songMatchesCategory(song, targetCategory) {
  const target = normalizeCategory(targetCategory);
  if (target === "All") return true;

  const songCat = normalizeCategory(song.category);
  if (target === "Ethiopian Nasheeds") {
    return (
      songCat === "Ethiopian Nasheeds" ||
      (song.country && song.country.toLowerCase().includes("ethiopia"))
    );
  }
  return songCat.toLowerCase() === target.toLowerCase();
}

/**
 * Single source of truth for filtered songs (Category + Search).
 */
function getFilteredSongs() {
  return songs.filter((song) => {
    // 1. Check category filter
    if (!songMatchesCategory(song, PlayerState.activeCategory)) {
      return false;
    }

    // 2. Check search query if present
    if (PlayerState.searchQuery && PlayerState.searchQuery.trim()) {
      const q = PlayerState.searchQuery.trim().toLowerCase();
      const inTitle = (song.title || "").toLowerCase().includes(q);
      const inArtist = (song.artist || "").toLowerCase().includes(q);
      const inCategory = (song.category || "").toLowerCase().includes(q);
      const inCountry = (song.country || "").toLowerCase().includes(q);
      const inDesc = (song.description || "").toLowerCase().includes(q);
      return inTitle || inArtist || inCategory || inCountry || inDesc;
    }

    return true;
  });
}

/**
 * Set active category and synchronize all UI buttons across the app.
 */
function setCategory(category) {
  const normalized = normalizeCategory(category);
  PlayerState.activeCategory = normalized;

  // 1. Synchronize Home category chips
  if (DOM.categoryChips) {
    DOM.categoryChips.forEach((chip) => {
      const isMatch = normalizeCategory(chip.dataset.category) === normalized;
      chip.classList.toggle("active", isMatch);
      chip.setAttribute("aria-selected", isMatch ? "true" : "false");
    });
  }

  // 2. Synchronize Explore filter pills
  if (DOM.exploreFilterPills) {
    DOM.exploreFilterPills.forEach((pill) => {
      const isMatch = normalizeCategory(pill.dataset.filter) === normalized;
      pill.classList.toggle("active", isMatch);
      pill.setAttribute("aria-selected", isMatch ? "true" : "false");
    });
  }

  // 3. Synchronize Sidebar category items
  if (DOM.categoryNavItems) {
    DOM.categoryNavItems.forEach((item) => {
      const isMatch = normalizeCategory(item.dataset.category) === normalized;
      item.classList.toggle("active", isMatch);
      item.setAttribute("aria-current", isMatch ? "true" : "false");
    });
  }

  // 4. Update Header Active Filter Indicator
  updateHeaderFilterBadge();

  // 5. If not in home or explore, switch to home to show results
  if (
    PlayerState.currentView !== "home" &&
    PlayerState.currentView !== "explore"
  ) {
    switchView("home");
  }

  // 6. Re-render the active view
  renderFilteredContent();
}

/**
 * Update Header Active Filter Badge.
 */
function updateHeaderFilterBadge() {
  const hasCategory = PlayerState.activeCategory !== "All";
  const hasSearch =
    PlayerState.searchQuery && PlayerState.searchQuery.trim() !== "";

  if (hasCategory && hasSearch) {
    DOM.activeFilterBadge.hidden = false;
    DOM.activeFilterText.textContent = `${PlayerState.activeCategory} • "${PlayerState.searchQuery.trim()}"`;
  } else if (hasCategory) {
    DOM.activeFilterBadge.hidden = false;
    DOM.activeFilterText.textContent = PlayerState.activeCategory;
  } else if (hasSearch) {
    DOM.activeFilterBadge.hidden = false;
    DOM.activeFilterText.textContent = `Search: "${PlayerState.searchQuery.trim()}"`;
  } else {
    DOM.activeFilterBadge.hidden = true;
  }
}

/**
 * Handle live search input.
 */
function handleSearch(query) {
  PlayerState.searchQuery = query;

  if (query.trim()) {
    DOM.searchClearBtn.hidden = false;
  } else {
    DOM.searchClearBtn.hidden = true;
  }

  updateHeaderFilterBadge();
  renderFilteredContent();
}

/**
 * Render all filtered content across views.
 */
function renderFilteredContent() {
  const filtered = getFilteredSongs();

  // Apply sorting if sortSelect exists
  const sort = DOM.sortSelect ? DOM.sortSelect.value : "default";
  const sorted = [...filtered];
  if (sort === "title") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sort === "artist") {
    sorted.sort((a, b) => a.artist.localeCompare(b.artist));
  } else if (sort === "category") {
    sorted.sort((a, b) => a.category.localeCompare(b.category));
  }

  const isDefaultView =
    PlayerState.activeCategory === "All" && !PlayerState.searchQuery.trim();

  // ----- RENDER HOME VIEW -----
  if (DOM.homeFeaturedSection) {
    DOM.homeFeaturedSection.hidden = !isDefaultView;
  }
  if (DOM.homeEthiopianSection) {
    DOM.homeEthiopianSection.hidden = !isDefaultView;
  }

  // Update Featured and Ethiopian sections when in default view
  if (isDefaultView) {
    if (DOM.featuredCardsGrid) {
      const featured = songs.filter((s) => s.isFeatured);
      DOM.featuredCardsGrid.innerHTML = featured
        .map((s) => createCardHTML(s))
        .join("");
    }
    if (DOM.ethiopianCardsGrid) {
      const ethiopian = songs.filter((s) =>
        songMatchesCategory(s, "Ethiopian Nasheeds"),
      );
      DOM.ethiopianCardsGrid.innerHTML = ethiopian
        .map((s) => createCardHTML(s))
        .join("");
    }
  }

  // Update Library section header
  if (DOM.libraryHeading && DOM.librarySubtitle) {
    if (isDefaultView) {
      DOM.libraryHeading.textContent = "Spiritual Library";
      DOM.librarySubtitle.textContent =
        "Browse full collection of peaceful audio";
    } else if (
      PlayerState.searchQuery.trim() &&
      PlayerState.activeCategory !== "All"
    ) {
      DOM.libraryHeading.textContent = `${PlayerState.activeCategory} • "${PlayerState.searchQuery.trim()}"`;
      DOM.librarySubtitle.textContent = `Found ${sorted.length} nasheed${sorted.length === 1 ? "" : "s"}`;
    } else if (PlayerState.searchQuery.trim()) {
      DOM.libraryHeading.textContent = `Search Results: "${PlayerState.searchQuery.trim()}"`;
      DOM.librarySubtitle.textContent = `Found ${sorted.length} nasheed${sorted.length === 1 ? "" : "s"}`;
    } else {
      DOM.libraryHeading.textContent = `${PlayerState.activeCategory} Nasheeds`;
      DOM.librarySubtitle.textContent = `Showing ${sorted.length} nasheed${sorted.length === 1 ? "" : "s"} in this collection`;
    }
  }

  // Render cards in #allTracksCardsGrid
  if (DOM.allTracksCardsGrid) {
    if (sorted.length > 0) {
      DOM.allTracksCardsGrid.innerHTML = sorted
        .map((s) => createCardHTML(s))
        .join("");
    } else {
      DOM.allTracksCardsGrid.innerHTML = `
        <div class="empty-state-card" style="grid-column: 1 / -1;">
          <div class="empty-icon-wrap" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <h3 class="empty-title">No Nasheeds Found</h3>
          <p class="empty-desc">No nasheeds match your current selection in ${PlayerState.activeCategory}. Try another category or search.</p>
          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:14px;">
            ${PlayerState.searchQuery ? '<button class="empty-action-btn" id="emptyClearSearchBtn">Clear Search</button>' : ""}
            <button class="empty-action-btn" id="emptyClearFilterBtn">Show All Nasheeds</button>
          </div>
        </div>
      `;
    }
  }

  // ----- RENDER EXPLORE VIEW -----
  if (DOM.exploreCardsGrid) {
    if (sorted.length > 0) {
      DOM.exploreCardsGrid.innerHTML = sorted
        .map((s) => createCardHTML(s))
        .join("");
    } else {
      DOM.exploreCardsGrid.innerHTML = `
        <div class="empty-state-card" style="grid-column: 1 / -1;">
          <div class="empty-icon-wrap" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>
          <h3 class="empty-title">No Nasheeds Found</h3>
          <p class="empty-desc">No nasheeds match your current filter. Try another category or search query.</p>
          <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-top:14px;">
            ${PlayerState.searchQuery ? '<button class="empty-action-btn" id="emptyClearSearchBtn">Clear Search</button>' : ""}
            <button class="empty-action-btn" id="emptyClearFilterBtn">Show All Nasheeds</button>
          </div>
        </div>
      `;
    }
  }

  // Update Explore view search results bar
  if (DOM.searchResultsInfo && DOM.searchResultsCount) {
    if (
      PlayerState.searchQuery.trim() ||
      PlayerState.activeCategory !== "All"
    ) {
      DOM.searchResultsInfo.hidden = false;
      const label =
        PlayerState.activeCategory !== "All"
          ? `${sorted.length} nasheed${sorted.length === 1 ? "" : "s"} in ${PlayerState.activeCategory}`
          : `${sorted.length} nasheed${sorted.length === 1 ? "" : "s"} found`;
      DOM.searchResultsCount.textContent = label;
    } else {
      DOM.searchResultsInfo.hidden = true;
    }
  }

  // Sync play icons for current song across all newly rendered cards
  const activeSong = PlayerState.queue[PlayerState.currentSongIndex];
  if (activeSong) {
    updateActiveCardHighlights(activeSong.id);
    updatePlayPauseIcons(PlayerState.isPlaying);
  }
}

function renderGrids() {
  renderFilteredContent();
}

/**
 * Card click event listener setup using reliable event delegation.
 */
function setupCardGridDelegation(container) {
  if (!container) return;
  container.addEventListener("click", (e) => {
    const isFavClick = e.target.closest('[data-action="fav"]');
    const isPlayClick = e.target.closest('[data-action="play"]');
    const card = e.target.closest(".nasheed-card");

    if (isFavClick) {
      e.stopPropagation();
      const songId = parseInt(isFavClick.dataset.id, 10);
      toggleFavorite(songId);
      return;
    }

    if (card) {
      const songId = parseInt(card.dataset.id, 10);
      const queueIndex = PlayerState.queue.findIndex((s) => s.id === songId);
      if (queueIndex !== -1) {
        if (PlayerState.currentSongIndex === queueIndex) {
          if (PlayerState.isPlaying) {
            pauseAudio();
          } else {
            playAudio();
          }
        } else {
          loadSong(queueIndex, true);
        }
      } else {
        const found = songs.find((s) => s.id === songId);
        if (found) {
          PlayerState.queue.push(found);
          loadSong(PlayerState.queue.length - 1, true);
        }
      }
    }
  });

  // Keyboard accessibility: Enter or Space on focused card
  container.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      if (
        e.target.matches(".card-fav-btn") ||
        e.target.closest(".card-fav-btn")
      )
        return;
      const card = e.target.closest(".nasheed-card");
      if (card) {
        e.preventDefault();
        const songId = parseInt(card.dataset.id, 10);
        const queueIndex = PlayerState.queue.findIndex((s) => s.id === songId);
        if (queueIndex !== -1) {
          if (PlayerState.currentSongIndex === queueIndex) {
            if (PlayerState.isPlaying) pauseAudio();
            else playAudio();
          } else {
            loadSong(queueIndex, true);
          }
        }
      }
    }
  });
}

/**
 * Render Favorites View.
 */
function updateFavoritesView() {
  const favSongs = songs.filter((s) => PlayerState.favorites.has(s.id));
  DOM.favCountBadge.textContent = favSongs.length;

  if (favSongs.length === 0) {
    DOM.favoritesEmptyState.hidden = false;
    DOM.favoritesTableWrap.hidden = true;
    DOM.playAllFavoritesBtn.hidden = true;
  } else {
    DOM.favoritesEmptyState.hidden = true;
    DOM.favoritesTableWrap.hidden = false;
    DOM.playAllFavoritesBtn.hidden = false;

    DOM.favoritesTrackList.innerHTML = favSongs
      .map((song, i) => {
        const isCurrent =
          PlayerState.queue[PlayerState.currentSongIndex]?.id === song.id;
        return `
        <div class="track-row ${isCurrent ? "active-playing" : ""}" data-id="${song.id}">
          <div class="track-col-index">${i + 1}</div>
          <div class="track-col-cover">
            <img src="${song.cover}" alt="${song.title}" class="track-cover-img" onerror="this.src='${getFallbackImage(song.title)}'">
          </div>
          <div class="track-col-main">
            <div class="track-row-title">${song.title}</div>
            <div class="track-row-artist">${song.artist}</div>
          </div>
          <div class="track-col-category">${song.category}</div>
          <div class="track-col-duration">${song.country}</div>
          <div class="track-col-action">
            <button class="track-row-play-btn" data-action="play-row" aria-label="Play ${song.title}">
              <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
            </button>
          </div>
        </div>
      `;
      })
      .join("");

    // Attach row play events
    DOM.favoritesTrackList.querySelectorAll(".track-row").forEach((row) => {
      row.onclick = () => {
        const id = parseInt(row.dataset.id, 10);
        const idx = PlayerState.queue.findIndex((s) => s.id === id);
        if (idx !== -1) {
          loadSong(idx, true);
        }
      };
    });
  }
}

/**
 * Render Queue View.
 */
function updateQueueView() {
  DOM.queueCountBadge.textContent = PlayerState.queue.length;

  const currentSong = PlayerState.queue[PlayerState.currentSongIndex];
  if (currentSong) {
    DOM.queueCurrentCard.innerHTML = `
      <div class="mini-cover-wrap" style="width: 54px; height: 54px;">
        <img src="${currentSong.cover}" alt="${currentSong.title}" class="mini-cover" onerror="this.src='${getFallbackImage(currentSong.title)}'">
      </div>
      <div>
        <h4 style="font-size: 1rem; color: var(--gold-light); font-weight: 600;">${currentSong.title}</h4>
        <p style="font-size: 0.82rem; color: var(--text-secondary);">${currentSong.artist} • ${currentSong.country}</p>
      </div>
    `;
  }

  // Render upcoming tracks
  const upcoming = PlayerState.queue
    .map((song, index) => ({ song, index }))
    .filter((item) => item.index !== PlayerState.currentSongIndex);

  DOM.queueTrackList.innerHTML = upcoming
    .map(
      ({ song, index }) => `
    <div class="track-row" data-queue-index="${index}">
      <div class="track-col-index">${index + 1}</div>
      <div class="track-col-cover">
        <img src="${song.cover}" alt="${song.title}" class="track-cover-img" onerror="this.src='${getFallbackImage(song.title)}'">
      </div>
      <div class="track-col-main">
        <div class="track-row-title">${song.title}</div>
        <div class="track-row-artist">${song.artist}</div>
      </div>
      <div class="track-col-category">${song.category}</div>
      <div class="track-col-duration">${song.country}</div>
      <div class="track-col-action">
        <button class="track-row-play-btn" aria-label="Play ${song.title}">
          <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
        </button>
      </div>
    </div>
  `,
    )
    .join("");

  DOM.queueTrackList.querySelectorAll(".track-row").forEach((row) => {
    row.onclick = () => {
      const qIdx = parseInt(row.dataset.queueIndex, 10);
      loadSong(qIdx, true);
    };
  });
}

/**
 * Render Recently Played View.
 */
function updateRecentlyPlayedView() {
  if (PlayerState.recentlyPlayed.length === 0) {
    DOM.recentEmptyState.hidden = false;
    DOM.recentTableWrap.hidden = true;
    DOM.clearRecentBtn.hidden = true;
  } else {
    DOM.recentEmptyState.hidden = true;
    DOM.recentTableWrap.hidden = false;
    DOM.clearRecentBtn.hidden = false;

    const recentSongs = PlayerState.recentlyPlayed
      .map((id) => songs.find((s) => s.id === id))
      .filter(Boolean);

    DOM.recentTrackList.innerHTML = recentSongs
      .map(
        (song, i) => `
      <div class="track-row" data-id="${song.id}">
        <div class="track-col-index">${i + 1}</div>
        <div class="track-col-cover">
          <img src="${song.cover}" alt="${song.title}" class="track-cover-img" onerror="this.src='${getFallbackImage(song.title)}'">
        </div>
        <div class="track-col-main">
          <div class="track-row-title">${song.title}</div>
          <div class="track-row-artist">${song.artist}</div>
        </div>
        <div class="track-col-category">${song.category}</div>
        <div class="track-col-duration">${song.country}</div>
        <div class="track-col-action">
          <button class="track-row-play-btn" aria-label="Play ${song.title}">
            <svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"/></svg>
          </button>
        </div>
      </div>
    `,
      )
      .join("");

    DOM.recentTrackList.querySelectorAll(".track-row").forEach((row) => {
      row.onclick = () => {
        const id = parseInt(row.dataset.id, 10);
        const idx = PlayerState.queue.findIndex((s) => s.id === id);
        if (idx !== -1) {
          loadSong(idx, true);
        }
      };
    });
  }
}

/**
 * Switch Active View (SPA Navigation).
 */
function switchView(viewName) {
  PlayerState.currentView = viewName;

  // Update panels
  DOM.viewPanels.forEach((panel) => {
    panel.classList.toggle(
      "active",
      panel.id === `view${capitalize(viewName)}`,
    );
  });

  // Update sidebar active buttons
  DOM.navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });

  // Close mobile sidebar if open
  closeMobileSidebar();

  // Scroll to top of content
  document
    .getElementById("contentArea")
    .scrollTo({ top: 0, behavior: "smooth" });

  // Refresh view specific data
  if (viewName === "favorites") updateFavoritesView();
  if (viewName === "queue") updateQueueView();
  if (viewName === "recent") updateRecentlyPlayedView();
  if (viewName === "explore" || viewName === "home") renderFilteredContent();
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==========================================================================
// 11. SEARCH & CATEGORY FILTERING COMPATIBILITY ALIASES
// ==========================================================================

function handleCategoryFilter(category) {
  setCategory(category);
}

// ==========================================================================
// 12. THEME CONTROLS & LOCAL STORAGE
// ==========================================================================

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEYS.THEME, theme);

  if (theme === "dark") {
    DOM.themeLabel.textContent = "Dark Charcoal";
  } else {
    DOM.themeLabel.textContent = "Warm Ivory";
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme") || "dark";
  const newTheme = current === "dark" ? "light" : "dark";
  setTheme(newTheme);
  showToast(
    `Switched to ${newTheme === "dark" ? "Dark Charcoal" : "Warm Ivory"} theme`,
    "info",
    1800,
  );
}

// ==========================================================================
// 13. MOBILE NAVIGATION DRAWER
// ==========================================================================

function openMobileSidebar() {
  DOM.sidebar.classList.add("open");
  DOM.mobileNavBackdrop.classList.add("open");
  DOM.mobileMenuToggle.setAttribute("aria-expanded", "true");
}

function closeMobileSidebar() {
  DOM.sidebar.classList.remove("open");
  DOM.mobileNavBackdrop.classList.remove("open");
  DOM.mobileMenuToggle.setAttribute("aria-expanded", "false");
}

// ==========================================================================
// 14. KEYBOARD SHORTCUTS
// ==========================================================================

function handleKeyShortcuts(e) {
  // Ignore if user is currently typing in input or select
  const activeTag = document.activeElement
    ? document.activeElement.tagName.toLowerCase()
    : "";
  if (
    activeTag === "input" ||
    activeTag === "textarea" ||
    activeTag === "select"
  ) {
    return;
  }

  switch (e.code) {
    case "Space":
      e.preventDefault();
      togglePlayPause();
      break;

    case "ArrowRight":
      e.preventDefault();
      // Seek forward 5 seconds
      if (DOM.audio.duration) {
        DOM.audio.currentTime = Math.min(
          DOM.audio.duration,
          DOM.audio.currentTime + 5,
        );
        updateProgressUI();
        showToast("Forward 5s", "info", 1000);
      }
      break;

    case "ArrowLeft":
      e.preventDefault();
      // Seek backward 5 seconds
      if (DOM.audio.duration) {
        DOM.audio.currentTime = Math.max(0, DOM.audio.currentTime - 5);
        updateProgressUI();
        showToast("Backward 5s", "info", 1000);
      }
      break;

    case "ArrowUp":
      e.preventDefault();
      // Volume Up 5%
      setVolume(Math.min(1, PlayerState.volume + 0.05));
      break;

    case "ArrowDown":
      e.preventDefault();
      // Volume Down 5%
      setVolume(Math.max(0, PlayerState.volume - 0.05));
      break;

    case "KeyM":
      e.preventDefault();
      toggleMute();
      break;

    case "KeyS":
      e.preventDefault();
      toggleShuffle();
      break;

    case "KeyR":
      e.preventDefault();
      cycleRepeatMode();
      break;

    case "Slash":
      if (e.shiftKey) {
        // '?' key
        e.preventDefault();
        DOM.shortcutsModal.hidden = false;
      }
      break;

    case "Escape":
      closeSleepTimerModal();
      DOM.shortcutsModal.hidden = true;
      closeMobileSidebar();
      break;

    default:
      break;
  }
}

// ==========================================================================
// 15. INITIALIZATION & BINDINGS
// ==========================================================================

function initApp() {
  // 1. Restore Theme from localStorage
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || "dark";
  setTheme(savedTheme);

  // 2. Restore Volume & Mute from localStorage
  const savedVol = localStorage.getItem(STORAGE_KEYS.VOLUME);
  if (savedVol !== null) {
    PlayerState.volume = parseFloat(savedVol);
  }
  const savedMuted = localStorage.getItem(STORAGE_KEYS.MUTED) === "true";
  setVolume(PlayerState.volume, false);
  if (savedMuted) toggleMute();

  // 3. Restore Favorites from localStorage
  try {
    const rawFavs = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (rawFavs) {
      PlayerState.favorites = new Set(JSON.parse(rawFavs));
    }
  } catch (err) {
    PlayerState.favorites = new Set();
  }
  DOM.favCountBadge.textContent = PlayerState.favorites.size;

  // 4. Restore Recently Played from localStorage
  try {
    const rawRecent = localStorage.getItem(STORAGE_KEYS.RECENT);
    if (rawRecent) {
      PlayerState.recentlyPlayed = JSON.parse(rawRecent);
    }
  } catch (err) {
    PlayerState.recentlyPlayed = [];
  }

  // 5. Restore Last Song ID or default to song 0
  const lastSongId = parseInt(
    localStorage.getItem(STORAGE_KEYS.LAST_SONG_ID),
    10,
  );
  let initIndex = 0;
  if (!isNaN(lastSongId)) {
    const foundIdx = PlayerState.queue.findIndex((s) => s.id === lastSongId);
    if (foundIdx !== -1) initIndex = foundIdx;
  }

  // 6. Load initial song
  loadSong(initIndex, false);

  // 7. Render initial grids and views
  renderGrids();
  setupCardGridDelegation(DOM.featuredCardsGrid);
  setupCardGridDelegation(DOM.ethiopianCardsGrid);
  setupCardGridDelegation(DOM.allTracksCardsGrid);
  setupCardGridDelegation(DOM.exploreCardsGrid);
  updateFavoritesView();
  updateQueueView();
  updateRecentlyPlayedView();

  // 8. Bind Audio Events
  DOM.audio.addEventListener("loadedmetadata", updateProgressUI);
  DOM.audio.addEventListener("timeupdate", updateProgressUI);
  DOM.audio.addEventListener("ended", handleSongEnded);

  // Graceful Error Handling as required by CodeAlpha / Requirement 33
  DOM.audio.addEventListener("error", (e) => {
    console.warn("Audio loading failed for file:", DOM.audio.src, e);
    showToast(
      "Audio unavailable. Add the required audio file to the assets/audio folder.",
      "error",
      6000,
    );
    PlayerState.isPlaying = false;
    updatePlayPauseIcons(false);
    DOM.artworkWrap.classList.remove("playing");
  });

  // 9. Main Player Controls Bindings
  DOM.mainPlayPauseBtn.addEventListener("click", togglePlayPause);
  DOM.miniPlayPauseBtn.addEventListener("click", togglePlayPause);
  DOM.prevBtn.addEventListener("click", handlePreviousTrack);
  DOM.miniPrevBtn.addEventListener("click", handlePreviousTrack);
  DOM.nextBtn.addEventListener("click", handleNextTrack);
  DOM.miniNextBtn.addEventListener("click", handleNextTrack);
  DOM.shuffleBtn.addEventListener("click", toggleShuffle);
  DOM.repeatBtn.addEventListener("click", cycleRepeatMode);

  // Favorite buttons
  DOM.showcaseFavBtn.addEventListener("click", () => {
    const current = PlayerState.queue[PlayerState.currentSongIndex];
    if (current) toggleFavorite(current.id);
  });
  DOM.miniFavBtn.addEventListener("click", () => {
    const current = PlayerState.queue[PlayerState.currentSongIndex];
    if (current) toggleFavorite(current.id);
  });

  // Progress Bar Seek & Dragging
  setupProgressBarDragging(DOM.progressBarContainer);
  setupProgressBarDragging(DOM.miniProgressContainer);

  // Volume Sliders
  DOM.volumeSlider.addEventListener("input", (e) => setVolume(e.target.value));
  DOM.miniVolumeSlider.addEventListener("input", (e) =>
    setVolume(e.target.value),
  );
  DOM.volumeMuteBtn.addEventListener("click", toggleMute);
  DOM.miniVolumeBtn.addEventListener("click", toggleMute);

  // Speed Pills
  DOM.speedPills.forEach((pill) => {
    pill.addEventListener("click", () => setPlaybackSpeed(pill.dataset.speed));
  });
  DOM.miniSpeedBtn.addEventListener("click", () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const currIdx = speeds.indexOf(PlayerState.playbackRate);
    const nextIdx = (currIdx + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  });
  DOM.sidebarSpeedBtn.addEventListener("click", () => {
    DOM.miniSpeedBtn.click();
  });

  // Hero Actions
  DOM.heroPlayNowBtn.addEventListener("click", () => {
    loadSong(0, true);
  });
  DOM.heroHighlightPlayBtn.addEventListener("click", () => {
    const current = PlayerState.queue[PlayerState.currentSongIndex];
    if (current && PlayerState.isPlaying) {
      pauseAudio();
    } else {
      loadSong(0, true);
    }
  });
  DOM.heroExploreEthiopianBtn.addEventListener("click", () => {
    handleCategoryFilter("Ethiopian Nasheeds");
    const ethiopianSec = document.querySelector(".ethiopian-section");
    if (ethiopianSec) ethiopianSec.scrollIntoView({ behavior: "smooth" });
  });

  // Sort Selection
  if (DOM.sortSelect) {
    DOM.sortSelect.addEventListener("change", renderFilteredContent);
  }

  // Category Chips Filter
  DOM.categoryChips.forEach((chip) => {
    chip.addEventListener("click", () =>
      handleCategoryFilter(chip.dataset.category),
    );
  });

  // Category Nav items in Sidebar
  DOM.categoryNavItems.forEach((item) => {
    item.addEventListener("click", () => {
      handleCategoryFilter(item.dataset.category);
      switchView("home");
    });
  });

  // Explore Filter Pills
  DOM.exploreFilterPills.forEach((pill) => {
    pill.addEventListener("click", () =>
      handleCategoryFilter(pill.dataset.filter),
    );
  });

  // Empty State Action Buttons
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "emptyClearFilterBtn") {
      setCategory("All");
    } else if (e.target && e.target.id === "emptyClearSearchBtn") {
      DOM.searchInput.value = "";
      handleSearch("");
    }
  });

  // Search Input
  DOM.searchInput.addEventListener("input", (e) =>
    handleSearch(e.target.value),
  );
  DOM.searchClearBtn.addEventListener("click", () => {
    DOM.searchInput.value = "";
    handleSearch("");
    DOM.searchInput.focus();
  });
  DOM.filterResetBtn.addEventListener("click", () => {
    handleCategoryFilter("All");
    DOM.searchInput.value = "";
    handleSearch("");
  });
  if (DOM.resetSearchFromExplore) {
    DOM.resetSearchFromExplore.addEventListener("click", () => {
      DOM.searchInput.value = "";
      handleSearch("");
    });
  }

  // Navigation Links
  DOM.navButtons.forEach((btn) => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });
  document.querySelectorAll("[data-view]").forEach((el) => {
    if (!el.classList.contains("nav-item")) {
      el.addEventListener("click", () => switchView(el.dataset.view));
    }
  });

  // Play All Favorites
  DOM.playAllFavoritesBtn.addEventListener("click", () => {
    const favSongs = songs.filter((s) => PlayerState.favorites.has(s.id));
    if (favSongs.length > 0) {
      PlayerState.queue = [...favSongs];
      loadSong(0, true);
      showToast("Playing your favorite nasheeds", "info");
    }
  });

  // Reset Queue
  DOM.clearQueueBtn.addEventListener("click", () => {
    PlayerState.queue = [...songs];
    loadSong(0, false);
    showToast("Queue reset to original catalog", "info");
  });

  // Clear History
  DOM.clearRecentBtn.addEventListener("click", () => {
    PlayerState.recentlyPlayed = [];
    localStorage.removeItem(STORAGE_KEYS.RECENT);
    updateRecentlyPlayedView();
    showToast("Playback history cleared", "info");
  });

  // Theme Toggles
  DOM.themeToggleBtn.addEventListener("click", toggleTheme);
  DOM.topThemeBtn.addEventListener("click", toggleTheme);

  // Mobile Menu
  DOM.mobileMenuToggle.addEventListener("click", () => {
    if (DOM.sidebar.classList.contains("open")) {
      closeMobileSidebar();
    } else {
      openMobileSidebar();
    }
  });
  DOM.mobileNavBackdrop.addEventListener("click", closeMobileSidebar);

  // Sleep Timer Modals & Buttons
  DOM.sidebarSleepTimerBtn.addEventListener("click", openSleepTimerModal);
  DOM.miniSleepTimerBtn.addEventListener("click", openSleepTimerModal);
  DOM.sleepTimerPill.addEventListener("click", openSleepTimerModal);
  DOM.closeSleepModalBtn.addEventListener("click", closeSleepTimerModal);
  DOM.sleepTimerModal.addEventListener("click", (e) => {
    if (e.target === DOM.sleepTimerModal) closeSleepTimerModal();
  });
  DOM.sleepOptionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      DOM.sleepOptionBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      setSleepTimer(btn.dataset.minutes);
    });
  });

  // Shortcuts Modal
  DOM.shortcutsBtn.addEventListener(
    "click",
    () => (DOM.shortcutsModal.hidden = false),
  );
  DOM.topShortcutsBtn.addEventListener(
    "click",
    () => (DOM.shortcutsModal.hidden = false),
  );
  DOM.closeShortcutsModalBtn.addEventListener(
    "click",
    () => (DOM.shortcutsModal.hidden = true),
  );
  DOM.shortcutsModal.addEventListener("click", (e) => {
    if (e.target === DOM.shortcutsModal) DOM.shortcutsModal.hidden = true;
  });

  // Scroll to Now Playing
  DOM.scrollToPlayerBtn.addEventListener("click", () => {
    DOM.showcaseSection.scrollIntoView({ behavior: "smooth" });
  });

  // Keyboard Shortcuts Listener
  document.addEventListener("keydown", handleKeyShortcuts);

  // Touch / Mobile optimization: prevent double-tap zoom on buttons
  document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("touchstart", () => {}, { passive: true });
  });
}

/**
 * Setup seeking & smooth drag on progress bar containers.
 */
function setupProgressBarDragging(container) {
  if (!container) return;

  let isDragging = false;

  function calculatePercent(e) {
    const rect = container.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const offsetX = clientX - rect.left;
    return Math.max(0, Math.min(1, offsetX / rect.width));
  }

  container.addEventListener("mousedown", (e) => {
    isDragging = true;
    seekAudioToPercent(calculatePercent(e));
  });

  window.addEventListener("mousemove", (e) => {
    if (isDragging) {
      seekAudioToPercent(calculatePercent(e));
    }
  });

  window.addEventListener("mouseup", () => {
    if (isDragging) isDragging = false;
  });

  // Touch support for mobile devices
  container.addEventListener(
    "touchstart",
    (e) => {
      isDragging = true;
      seekAudioToPercent(calculatePercent(e));
    },
    { passive: true },
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      if (isDragging) {
        seekAudioToPercent(calculatePercent(e));
      }
    },
    { passive: true },
  );

  window.addEventListener("touchend", () => {
    if (isDragging) isDragging = false;
  });
}

// Start application when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
