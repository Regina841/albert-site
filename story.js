const story = document.querySelector(".story");
const video = document.querySelector(".story__video");
const playButton = document.querySelector(".story__play");
const startButton = document.querySelector(".story__start");

const firstNextButton = document.querySelector(".chapter--one .chapter__next");
const gamblingNextButton = document.querySelector(".chapter--gambling .chapter__next");
const loveNextButton = document.querySelector(".chapter--love .chapter__next");
const happyNextButton = document.querySelector(".chapter--happy .chapter__next");
const happyVideo = document.querySelector(".happy__video");

const storyStage = document.querySelector(".story__stage");
const chapterOne = document.querySelector(".chapter--one");
const gamblingChapter = document.querySelector(".chapter--gambling");
const loveChapter = document.querySelector(".chapter--love");
const happyChapter = document.querySelector(".chapter--happy");
const finalChapter = document.querySelector(".chapter--final");

const chapterTimers = [];

const sadAudio = new Audio("assets/audio/sad.mp3");
const aggressionAudio = new Audio("assets/audio/aggression.mp3");
const hookahRevealAudio = new Audio("assets/audio/hookah-reveal.mp3");
const loveThemeAudio = new Audio("assets/audio/love-theme.mp3");
const happyLifeAudio = new Audio("assets/audio/happy-life.mp3");
const finalMemoriesAudio = new Audio("assets/audio/final-memories.mp3");
const finalLegendAudio = new Audio("assets/audio/final_legend.mp3");

const audioFadeTimers = new Map();

sadAudio.loop = true;

const chapterStateClasses = [
  "is-blackout",
  "runner-exit",
  "chapter-photo-in",
  "chapter-line-one",
  "chapter-line-two",
  "chapter-line-three",
  "chapter-reality",
  "chapter-next-ready",
  "chapter-scene-one-out",
  "chapter-interlude",
  "chapter-interlude-out",
  "chapter-scene-two",

  "is-gambling",
  "gambling-fadeout",
  "gambling-scene-one",
  "gambling-photo-one-out",
  "gambling-line-one",
  "gambling-line-two",
  "gambling-family",
  "gambling-testosterone",
  "gambling-scene-two",
  "gambling-photo-two",
  "gambling-photo-two-next",
  "gambling-photo-two-out",
  "gambling-side",
  "gambling-aggression",
  "gambling-aggression-out",
  "gambling-scene-three",
  "gambling-photo-three",
  "gambling-photo-three-next",
  "gambling-hookah-one",
  "gambling-hookah-two",
  "gambling-hookah-word",
  "gambling-hookah-word-out",
  "gambling-next-ready",

  "love-transition",
  "is-love",
  "love-title",
  "love-title-out",
  "love-photo-one",
  "love-photo-two",
  "love-final",
  "love-next-ready",

  "happy-transition",
  "is-happy",
  "happy-text-smile",
  "happy-smile-photo",
  "happy-smile-out",
  "happy-text-dance",
  "happy-dance-photo",
  "happy-dance-out",
  "happy-text-sport",
  "happy-text-horse",
  "happy-horse-photo",
  "happy-horse-out",
  "happy-text-weight",
  "happy-weight-photo",
  "happy-weight-out",
  "happy-text-years",
  "happy-text-now",
  "happy-text-reality-one",
  "happy-text-reality-two",
  "happy-final-dim",
  "happy-now-photo",
  "happy-now-out",
  "happy-reality-photo",
  "happy-reality-text",
  "happy-reality-out",
  "happy-video-in",
  "happy-video-ended",
  "happy-next-ready",

  "final-transition",
  "is-final",
  "final-blackout",
  "final-text-strange-intro",
  "final-text-strange-one",
  "final-text-strange-two",
  "final-text-years",
  "final-text-same",
  "final-photo-strange-one",
  "final-strange-one-out",
  "final-photo-strange-two",
  "final-strange-two-out",
  "final-photo-strange-three",
  "final-strange-three-out",
  "final-text-honest",
  "final-text-time",
  "final-text-changed",
  "final-text-important",
  "final-family-one",
  "final-family-two",
  "final-family-three",
  "final-family-out",
  "final-caption-family-one",
  "final-caption-family-two",
  "final-caption-family-three",
  "final-text-question",
  "final-text-brother",
  "final-text-beginning",
  "final-text-future",
  "final-photo-boat",
  "final-caption-continue",
  "final-boat-out",
  "final-legend-name",
  "final-legend-subtitle",
  "final-legend-return",
];

const clearChapterTimers = () => {
  while (chapterTimers.length) {
    window.clearTimeout(chapterTimers.pop());
  }
};

const queueChapterStep = (callback, delay) => {
  chapterTimers.push(window.setTimeout(callback, delay));
};

const stopAudio = (audio) => {
  const fadeTimer = audioFadeTimers.get(audio);

  if (fadeTimer) {
    window.clearInterval(fadeTimer);
    audioFadeTimers.delete(audio);
  }

  audio.pause();
  audio.currentTime = 0;
  audio.volume = 0;
};

const fadeAudio = (
  audio,
  targetVolume,
  duration,
  shouldPause = false
) => {
  const fadeTimer = audioFadeTimers.get(audio);

  if (fadeTimer) {
    window.clearInterval(fadeTimer);
  }

  const startVolume = audio.volume;
  const startTime = performance.now();

  const nextTimer = window.setInterval(() => {
    const progress = Math.min(
      (performance.now() - startTime) / duration,
      1
    );

    audio.volume =
      startVolume + (targetVolume - startVolume) * progress;

    if (progress >= 1) {
      window.clearInterval(nextTimer);
      audioFadeTimers.delete(audio);

      if (shouldPause) {
        audio.pause();
      }
    }
  }, 40);

  audioFadeTimers.set(audio, nextTimer);
};

const playAudio = (audio, volume, fadeDuration = 0) => {
  audio.volume = fadeDuration > 0 ? 0 : volume;

  return audio
    .play()
    .then(() => {
      if (fadeDuration > 0) {
        fadeAudio(audio, volume, fadeDuration);
      }
    })
    .catch(() => {});
};

const resetStoryAudio = () => {
  stopAudio(sadAudio);
  stopAudio(aggressionAudio);
  stopAudio(hookahRevealAudio);
  stopAudio(loveThemeAudio);
  stopAudio(happyLifeAudio);
  stopAudio(finalMemoriesAudio);
  stopAudio(finalLegendAudio);
};

const showOnlyGamblingText = (className) => {
  story.classList.remove(
    "gambling-line-one",
    "gambling-line-two",
    "gambling-family",
    "gambling-testosterone",
    "gambling-side",
    "gambling-aggression",
    "gambling-hookah-one",
    "gambling-hookah-two",
    "gambling-hookah-word"
  );

  if (className) {
    story.classList.add(className);
  }
};

const showOnlyHappyText = (className) => {
  story.classList.remove(
    "happy-text-smile",
    "happy-text-dance",
    "happy-text-sport",
    "happy-text-horse",
    "happy-text-weight",
    "happy-text-years",
    "happy-text-now",
    "happy-text-reality-one",
    "happy-text-reality-two"
  );

  if (className) {
    story.classList.add(className);
  }
};

const finalTextClasses = [
  "final-text-strange-intro",
  "final-text-strange-one",
  "final-text-strange-two",
  "final-text-years",
  "final-text-same",
  "final-text-honest",
  "final-text-time",
  "final-text-changed",
  "final-text-important",
  "final-text-question",
  "final-text-brother",
  "final-text-beginning",
  "final-text-future",
];

const finalCaptionClasses = [
  "final-caption-family-one",
  "final-caption-family-two",
  "final-caption-family-three",
  "final-caption-continue",
];

const showOnlyFinalText = (className) => {
  story.classList.remove(...finalTextClasses);

  if (className) {
    story.classList.add(className);
  }
};

const showOnlyFinalCaption = (className) => {
  story.classList.remove(...finalCaptionClasses);

  if (className) {
    story.classList.add(className);
  }
};

/* =========================================
   ГЛАВА: ЛУДОМАНИЯ
========================================= */

const startGamblingChapter = () => {
  clearChapterTimers();
  resetStoryAudio();

  story.classList.remove(...chapterStateClasses);

  gamblingChapter.hidden = false;
  gamblingChapter?.setAttribute("aria-hidden", "false");

  story.classList.add("is-transitioning");

  queueChapterStep(() => {
    chapterOne.hidden = true;
    chapterOne?.setAttribute("aria-hidden", "true");

    story.classList.add(
      "is-gambling",
      "gambling-scene-one"
    );

    story.classList.remove("is-transitioning");

    playAudio(sadAudio, 0.24, 2000);
  }, 720);

  queueChapterStep(() => {
    showOnlyGamblingText("gambling-line-one");
  }, 3200);

  queueChapterStep(() => {
    showOnlyGamblingText();
  }, 5800);

  queueChapterStep(() => {
    showOnlyGamblingText("gambling-line-two");
  }, 6600);

  queueChapterStep(() => {
    showOnlyGamblingText();
  }, 9900);

  queueChapterStep(() => {
    showOnlyGamblingText("gambling-family");
  }, 10700);

  queueChapterStep(() => {
    showOnlyGamblingText();
  }, 13600);

  queueChapterStep(() => {
    showOnlyGamblingText("gambling-testosterone");
  }, 14400);

  queueChapterStep(() => {
    showOnlyGamblingText();
  }, 17400);

  queueChapterStep(() => {
    story.classList.add("gambling-photo-one-out");
  }, 18400);

  queueChapterStep(() => {
    showOnlyGamblingText("gambling-side");
    story.classList.add("gambling-scene-two");
  }, 19700);

  queueChapterStep(() => {
    showOnlyGamblingText();
    fadeAudio(sadAudio, 0, 1500, true);
  }, 22800);

  /* АГРЕССИЯ */

  queueChapterStep(() => {
    showOnlyGamblingText("gambling-aggression");

    aggressionAudio.currentTime = 0;
    playAudio(aggressionAudio, 0.52);
  }, 23600);

  queueChapterStep(() => {
    story.classList.add("gambling-photo-two");
  }, 25400);

  queueChapterStep(() => {
    story.classList.add("gambling-aggression-out");
  }, 27000);

  queueChapterStep(() => {
    story.classList.add("gambling-photo-two-next");
  }, 29600);

  queueChapterStep(() => {
    story.classList.add("gambling-photo-two-out");

    fadeAudio(
      aggressionAudio,
      0,
      1200,
      true
    );
  }, 33700);

  /* =========================================
     ТЯЖЁЛАЯ АРТИЛЛЕРИЯ
  ========================================= */

  queueChapterStep(() => {
    showOnlyGamblingText("gambling-hookah-one");
    story.classList.add("gambling-scene-three");
  }, 35800);

  queueChapterStep(() => {
    showOnlyGamblingText();
  }, 38800);

  queueChapterStep(() => {
    showOnlyGamblingText("gambling-hookah-two");
  }, 39600);

  queueChapterStep(() => {
    hookahRevealAudio.currentTime = 0;
    playAudio(
      hookahRevealAudio,
      0.42,
      3600
    );
  }, 41400);

  /*
   * Текст перед словом КАЛЬЯН исчезает.
   * Оставляем небольшую паузу.
   */
  queueChapterStep(() => {
    showOnlyGamblingText();
  }, 43200);

  /* =========================================
     КАЛЬЯН
     Теперь эта сцена специально медленнее.
  ========================================= */

  /*
   * 44.0 сек
   * Сначала появляется ТОЛЬКО слово КАЛЬЯН.
   * Музыка к этому моменту уже тихо входит.
   */
  queueChapterStep(() => {
    showOnlyGamblingText("gambling-hookah-word");
  }, 44000);

  /*
   * 45.8 сек
   * КАЛЬЯН уже пробыл один на экране 3 секунды.
   * Теперь появляется первая фотография.
   */
  queueChapterStep(() => {
    story.classList.add("gambling-photo-three");
  }, 47200);

  /*
   * 48.8 сек
   * Первая фотография уже показана.
   * Теперь слово КАЛЬЯН плавно исчезает.
   */
  queueChapterStep(() => {
    story.classList.add(
      "gambling-hookah-word-out"
    );
  }, 50200);

  /*
   * 51.5 сек
   * Появляется вторая фотография с кальяном.
   */
  queueChapterStep(() => {
    story.classList.add(
      "gambling-photo-three-next"
    );
  }, 53200);

  /*
   * 55 сек
   * Музыка начинает очень плавно уходить.
   * Fade-out длится 4 секунды.
   */
  queueChapterStep(() => {
    fadeAudio(
      hookahRevealAudio,
      0,
      4000,
      true
    );
  }, 57000);

  /*
   * 59 сек
   * Только теперь появляется NEXT.
   */
  queueChapterStep(() => {
    story.classList.add(
      "gambling-next-ready"
    );
  }, 61200);
};

/* =========================================
   ГЛАВА: А ПОТОМ ПОЯВИЛАСЬ ОНА
========================================= */

const startLoveChapter = () => {
  clearChapterTimers();
  resetStoryAudio();

  loveChapter.hidden = false;
  loveChapter?.setAttribute(
    "aria-hidden",
    "false"
  );

  story.classList.remove(
    "gambling-next-ready"
  );

  story.classList.add("love-transition");

  queueChapterStep(() => {
    gamblingChapter.hidden = true;
    gamblingChapter?.setAttribute(
      "aria-hidden",
      "true"
    );

    story.classList.remove(
      "is-gambling",
      "love-transition",
      "gambling-scene-one",
      "gambling-photo-one-out",
      "gambling-scene-two",
      "gambling-photo-two",
      "gambling-photo-two-next",
      "gambling-photo-two-out",
      "gambling-aggression-out",
      "gambling-scene-three",
      "gambling-photo-three",
      "gambling-photo-three-next",
      "gambling-hookah-word-out"
    );

    story.classList.add("is-love");
  }, 1000);

  queueChapterStep(() => {
    loveThemeAudio.currentTime = 0;

    playAudio(
      loveThemeAudio,
      0.34,
      2800
    );
  }, 1100);

  queueChapterStep(() => {
    story.classList.add("love-title");
  }, 1900);

  queueChapterStep(() => {
    story.classList.add("love-title-out");
  }, 5600);

  queueChapterStep(() => {
    story.classList.add("love-photo-one");
  }, 6700);

  queueChapterStep(() => {
    story.classList.add("love-photo-two");
  }, 12000);

  queueChapterStep(() => {
    story.classList.add("love-final");
  }, 17800);

  queueChapterStep(() => {
    story.classList.add("love-next-ready");
  }, 21400);
};

/* =========================================
   ГЛАВА: НОВАЯ ЖИЗНЬ
========================================= */

const startHappyChapter = () => {
  clearChapterTimers();
  fadeAudio(loveThemeAudio, 0, 2400, true);

  if (happyVideo) {
    happyVideo.pause();
    happyVideo.currentTime = 0;
  }

  happyChapter.hidden = false;
  happyChapter?.setAttribute(
    "aria-hidden",
    "false"
  );

  story.classList.remove(
    "love-next-ready"
  );

  story.classList.add("happy-transition");

  queueChapterStep(() => {
    loveChapter.hidden = true;
    loveChapter?.setAttribute(
      "aria-hidden",
      "true"
    );

    story.classList.remove(
      "is-love",
      "happy-transition",
      "love-title",
      "love-title-out",
      "love-photo-one",
      "love-photo-two",
      "love-final"
    );

    story.classList.add("is-happy");
  }, 1000);

  queueChapterStep(() => {
    happyLifeAudio.currentTime = 0;
    playAudio(happyLifeAudio, 0.3, 2000);
  }, 1200);

  queueChapterStep(() => {
    showOnlyHappyText("happy-text-smile");
  }, 1700);

  queueChapterStep(() => {
    story.classList.add("happy-smile-photo");
  }, 4300);

  queueChapterStep(() => {
    showOnlyHappyText();
    story.classList.add("happy-smile-out");
  }, 8600);

  queueChapterStep(() => {
    showOnlyHappyText("happy-text-dance");
  }, 9800);

  queueChapterStep(() => {
    story.classList.add("happy-dance-photo");
  }, 12400);

  queueChapterStep(() => {
    showOnlyHappyText();
    story.classList.add("happy-dance-out");
  }, 17000);

  queueChapterStep(() => {
    showOnlyHappyText("happy-text-sport");
  }, 18200);

  queueChapterStep(() => {
    showOnlyHappyText("happy-text-horse");
  }, 20900);

  queueChapterStep(() => {
    story.classList.add("happy-horse-photo");
  }, 23500);

  queueChapterStep(() => {
    showOnlyHappyText();
    story.classList.add("happy-horse-out");
  }, 28000);

  queueChapterStep(() => {
    showOnlyHappyText("happy-text-weight");
  }, 29300);

  queueChapterStep(() => {
    story.classList.add("happy-weight-photo");
  }, 32100);

  queueChapterStep(() => {
    showOnlyHappyText();
    story.classList.add("happy-weight-out");
    fadeAudio(happyLifeAudio, 0.1, 2200);
  }, 36800);

  queueChapterStep(() => {
    showOnlyHappyText("happy-text-years");
  }, 38600);

  queueChapterStep(() => {
    showOnlyHappyText();
  }, 41400);

  queueChapterStep(() => {
    showOnlyHappyText("happy-text-now");
  }, 42800);

  queueChapterStep(() => {
    showOnlyHappyText();
    story.classList.add("happy-final-dim");
  }, 45800);

  queueChapterStep(() => {
    story.classList.add("happy-now-photo");
    fadeAudio(happyLifeAudio, 0.25, 2600);
  }, 47000);

  queueChapterStep(() => {
    fadeAudio(happyLifeAudio, 0, 2400, true);
  }, 52500);

  queueChapterStep(() => {
    story.classList.add("happy-now-out");
  }, 53800);

  queueChapterStep(() => {
    story.classList.add("happy-reality-photo");
  }, 56000);

  queueChapterStep(() => {
    story.classList.add("happy-reality-text");
    showOnlyHappyText("happy-text-reality-one");
  }, 57700);

  queueChapterStep(() => {
    showOnlyHappyText();
  }, 61000);

  queueChapterStep(() => {
    showOnlyHappyText("happy-text-reality-two");
  }, 62200);

  queueChapterStep(() => {
    showOnlyHappyText();
    story.classList.add("happy-reality-out");
  }, 65800);

  queueChapterStep(() => {
    if (!happyVideo) {
      story.classList.add("happy-next-ready");
      return;
    }

    happyVideo.currentTime = 0;
    happyVideo.muted = false;
    happyVideo.volume = 1;
    story.classList.add("happy-video-in");

    happyVideo.play().catch(() => {
      story.classList.add("happy-next-ready");
    });
  }, 67000);
};

/* =========================================
   ФИНАЛ
========================================= */

const startFinalChapter = () => {
  clearChapterTimers();

  if (happyVideo) {
    happyVideo.pause();
  }

  fadeAudio(happyLifeAudio, 0, 1200, true);
  stopAudio(finalMemoriesAudio);
  stopAudio(finalLegendAudio);

  finalChapter.hidden = false;
  finalChapter?.setAttribute(
    "aria-hidden",
    "false"
  );

  story.classList.remove("happy-next-ready");
  story.classList.add(
    "final-transition",
    "is-final",
    "final-blackout"
  );

  queueChapterStep(() => {
    happyChapter.hidden = true;
    happyChapter?.setAttribute(
      "aria-hidden",
      "true"
    );

    story.classList.remove(
      "final-transition",
      "is-happy",
      "happy-final-dim",
      "happy-now-photo",
      "happy-now-out",
      "happy-reality-photo",
      "happy-reality-text",
      "happy-reality-out",
      "happy-video-in",
      "happy-video-ended"
    );
  }, 1100);

  queueChapterStep(() => {
    showOnlyFinalText("final-text-strange-intro");
  }, 1700);

  queueChapterStep(() => {
    showOnlyFinalText();
  }, 5600);

  queueChapterStep(() => {
    showOnlyFinalText("final-text-strange-one");
  }, 7000);

  queueChapterStep(() => {
    story.classList.remove("final-blackout");
    story.classList.add("final-photo-strange-one");
  }, 10300);

  queueChapterStep(() => {
    showOnlyFinalText();
  }, 11600);

  queueChapterStep(() => {
    story.classList.add(
      "final-strange-one-out",
      "final-blackout"
    );
  }, 15500);

  queueChapterStep(() => {
    showOnlyFinalText("final-text-strange-two");
  }, 17400);

  queueChapterStep(() => {
    story.classList.remove("final-blackout");
    story.classList.add("final-photo-strange-two");
  }, 20700);

  queueChapterStep(() => {
    showOnlyFinalText();
  }, 22000);

  queueChapterStep(() => {
    story.classList.add(
      "final-strange-two-out",
      "final-blackout"
    );
  }, 26000);

  queueChapterStep(() => {
    showOnlyFinalText("final-text-years");
  }, 28100);

  queueChapterStep(() => {
    showOnlyFinalText();
  }, 31300);

  queueChapterStep(() => {
    showOnlyFinalText("final-text-same");
  }, 32400);

  queueChapterStep(() => {
    showOnlyFinalText();
  }, 37100);

  queueChapterStep(() => {
    story.classList.remove("final-blackout");
    story.classList.add("final-photo-strange-three");
  }, 38900);

  queueChapterStep(() => {
    story.classList.add(
      "final-strange-three-out",
      "final-blackout"
    );
  }, 44700);

  queueChapterStep(() => {
    showOnlyFinalText("final-text-honest");
  }, 47400);

  queueChapterStep(() => {
    showOnlyFinalText();
  }, 50800);

  queueChapterStep(() => {
    showOnlyFinalText("final-text-time");
  }, 52100);

  queueChapterStep(() => {
    showOnlyFinalText();
  }, 55800);

  queueChapterStep(() => {
    showOnlyFinalText("final-text-changed");
  }, 57000);

  queueChapterStep(() => {
    showOnlyFinalText();
  }, 60200);

  queueChapterStep(() => {
    showOnlyFinalText("final-text-important");
  }, 61500);

  queueChapterStep(() => {
    story.classList.remove("final-blackout");
    story.classList.add("final-family-one");
  }, 65500);

  queueChapterStep(() => {
    showOnlyFinalText();
  }, 67100);

  queueChapterStep(() => {
    showOnlyFinalCaption("final-caption-family-one");
  }, 67400);

  queueChapterStep(() => {
    story.classList.add("final-family-two");
    showOnlyFinalCaption("final-caption-family-two");
  }, 72400);

  queueChapterStep(() => {
    story.classList.add("final-family-three");
    showOnlyFinalCaption("final-caption-family-three");
  }, 77800);

  queueChapterStep(() => {
    showOnlyFinalCaption();
  }, 83800);

  queueChapterStep(() => {
    story.classList.add(
      "final-family-out",
      "final-blackout"
    );
  }, 85300);

  queueChapterStep(() => {
    showOnlyFinalText("final-text-question");
  }, 89200);

  queueChapterStep(() => {
    showOnlyFinalText();
  }, 93800);

  queueChapterStep(() => {
    finalLegendAudio.currentTime = 0;
    playAudio(finalLegendAudio, 0.18, 5200);
  }, 94500);

  queueChapterStep(() => {
    story.classList.remove("final-blackout");
    story.classList.add("final-photo-boat");
    fadeAudio(finalLegendAudio, 0.28, 5400);
  }, 97000);

  queueChapterStep(() => {
    showOnlyFinalText("final-text-brother");
  }, 101800);

  queueChapterStep(() => {
    showOnlyFinalText();
  }, 106000);

  queueChapterStep(() => {
    showOnlyFinalText("final-text-beginning");
  }, 107500);

  queueChapterStep(() => {
    showOnlyFinalText();
  }, 111200);

  queueChapterStep(() => {
    showOnlyFinalText("final-text-future");
  }, 112600);

  queueChapterStep(() => {
    showOnlyFinalText();
  }, 116800);

  queueChapterStep(() => {
    showOnlyFinalCaption("final-caption-continue");
  }, 118600);

  queueChapterStep(() => {
    showOnlyFinalCaption();
    story.classList.add(
      "final-boat-out",
      "final-blackout"
    );
  }, 126000);

  queueChapterStep(() => {
    story.classList.add("final-legend-name");
  }, 130300);

  queueChapterStep(() => {
    story.classList.add("final-legend-subtitle");
  }, 132000);

  queueChapterStep(() => {
    story.classList.add("final-legend-return");
  }, 134600);

  queueChapterStep(() => {
    fadeAudio(finalLegendAudio, 0, 8200, true);
  }, 137800);

  queueChapterStep(() => {
    stopAudio(finalLegendAudio);
  }, 146400);
};

/* =========================================
   ПЕРВАЯ ГЛАВА
========================================= */

const startChapterOne = () => {
  clearChapterTimers();

  story.classList.remove(
    ...chapterStateClasses
  );

  chapterOne.hidden = false;

  story.classList.add("is-transitioning");

  queueChapterStep(() => {
    story.classList.add("is-chapter-one");

    storyStage.hidden = true;
    storyStage?.setAttribute(
      "aria-hidden",
      "true"
    );

    chapterOne?.setAttribute(
      "aria-hidden",
      "false"
    );

    story.classList.remove(
      "is-transitioning"
    );
  }, 720);

  /* Первая фотография */

  queueChapterStep(() => {
    story.classList.add(
      "chapter-photo-in",
      "chapter-line-one"
    );
  }, 1080);

  /*
   * Первая фотография остаётся
   * на экране подольше.
   */

  queueChapterStep(() => {
    story.classList.add(
      "chapter-scene-one-out"
    );
  }, 5000);

  /* Уже потекли слюнки? */

  queueChapterStep(() => {
    story.classList.add(
      "chapter-interlude",
      "chapter-line-two"
    );
  }, 5500);

  queueChapterStep(() => {
    story.classList.add(
      "chapter-interlude-out"
    );
  }, 8000);

  /* Вторая фотография */

  queueChapterStep(() => {
    story.classList.add(
      "chapter-scene-two",
      "chapter-reality"
    );
  }, 8500);

  queueChapterStep(() => {
    story.classList.add(
      "chapter-line-three"
    );
  }, 9500);

  queueChapterStep(() => {
    story.classList.add(
      "chapter-next-ready"
    );
  }, 12000);
};

/* =========================================
   ВСТУПИТЕЛЬНОЕ ВИДЕО
========================================= */

if (story && video && playButton) {
  const tryPlayWithSound = async () => {
    video.muted = false;
    video.volume = 1;

    try {
      await video.play();

      story.classList.remove(
        "needs-gesture"
      );

      playButton.hidden = true;
    } catch {
      playButton.hidden = false;

      story.classList.add(
        "needs-gesture"
      );
    }
  };

  const playFromGesture = async () => {
    video.muted = false;
    video.volume = 1;

    try {
      await video.play();

      story.classList.remove(
        "needs-gesture"
      );

      playButton.hidden = true;
    } catch {
      playButton.hidden = false;

      story.classList.add(
        "needs-gesture"
      );
    }
  };

  video.addEventListener(
    "loadeddata",
    tryPlayWithSound,
    { once: true }
  );

  if (video.readyState >= 2) {
    tryPlayWithSound();
  }

  playButton.addEventListener(
    "click",
    playFromGesture
  );

  video.addEventListener("click", () => {
    if (
      story.classList.contains(
        "is-ended"
      )
    ) {
      return;
    }

    if (video.paused) {
      playFromGesture();
      return;
    }

    video.pause();
  });

  video.addEventListener("play", () => {
    story.classList.remove(
      "is-ended"
    );
  });

  video.addEventListener("ended", () => {
    story.classList.remove(
      "needs-gesture"
    );

    playButton.hidden = true;

    story.classList.add(
      "is-ended"
    );
  });
}

if (happyVideo) {
  happyVideo.addEventListener("ended", () => {
    story.classList.add("happy-video-ended");

    queueChapterStep(() => {
      story.classList.add("happy-next-ready");
    }, 900);
  });
}

/* =========================================
   КНОПКИ
========================================= */

if (startButton) {
  startButton.addEventListener(
    "click",
    (event) => {
      event.preventDefault();

      resetStoryAudio();
      startChapterOne();
    }
  );
}

if (story && firstNextButton) {
  firstNextButton.addEventListener(
    "click",
    () => {
      clearChapterTimers();

      story.classList.add(
        "runner-exit"
      );

      window.setTimeout(() => {
        startGamblingChapter();
      }, 620);
    }
  );
}

if (gamblingNextButton) {
  gamblingNextButton.addEventListener(
    "click",
    () => {
      startLoveChapter();
    }
  );
}

if (loveNextButton) {
  loveNextButton.addEventListener(
    "click",
    () => {
      startHappyChapter();
    }
  );
}

if (happyNextButton) {
  happyNextButton.addEventListener(
    "click",
    () => {
      happyNextButton.blur();
      startFinalChapter();
    }
  );
}
