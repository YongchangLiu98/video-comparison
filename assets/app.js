(() => {
  const config = window.COMPARISON_CONFIG;
  if (!config) throw new Error("Missing COMPARISON_CONFIG");

  document.title = config.title;
  document.getElementById("page-title").textContent = config.title;
  document.documentElement.style.setProperty("--column-count", config.columns.length);

  document.getElementById("column-heads").innerHTML = config.columns.map(column =>
    `<div>${column.label}${column.detail ? `<div class="column-detail">${column.detail}</div>` : ""}</div>`
  ).join("");

  document.getElementById("comparisons").innerHTML = config.cases.flatMap(item =>
    config.modes.map(mode => `
      <section class="comparison-row" data-row="case${item.id}-${mode.id}">
        <div class="group-title"><h2>Case ${item.id} · ${item.title}</h2><span class="badge">${mode.label}</span></div>
        <div class="video-grid">
          ${config.columns.map(column => `
            <div class="video-cell">
              <video src="${config.videoPath(column, item, mode)}" muted loop playsinline preload="metadata"></video>
              <span class="cell-label">${column.label}</span>
            </div>`).join("")}
        </div>
      </section>`)
  ).join("");

  const videos = [...document.querySelectorAll("video")];
  const status = document.getElementById("status");
  const audioStatus = () => videos.some(video => !video.muted) ? "单路有声" : "静音";

  function playAll(reset = false) {
    if (reset) videos.forEach(video => { video.currentTime = 0; });
    Promise.allSettled(videos.map(video => video.play())).then(() => {
      status.textContent = `同步播放中 · 循环 · ${audioStatus()}`;
    });
  }

  function pauseAll() {
    videos.forEach(video => video.pause());
    status.textContent = "已暂停";
  }

  function toggleSound(selected) {
    const shouldEnable = selected.muted;
    videos.forEach(video => {
      video.muted = true;
      video.closest(".video-cell").classList.remove("sound-on");
    });
    if (shouldEnable) {
      selected.muted = false;
      selected.closest(".video-cell").classList.add("sound-on");
    }
    status.textContent = `同步播放中 · 循环 · ${audioStatus()}`;
  }

  document.getElementById("play").addEventListener("click", () => playAll(false));
  document.getElementById("pause").addEventListener("click", pauseAll);
  document.getElementById("restart").addEventListener("click", () => playAll(true));

  document.querySelectorAll(".video-grid").forEach(row => {
    const rowVideos = [...row.querySelectorAll("video")];
    const master = rowVideos[0];
    setInterval(() => {
      if (master.paused) return;
      rowVideos.slice(1).forEach(video => {
        if (Math.abs(video.currentTime - master.currentTime) > 0.18) video.currentTime = master.currentTime;
      });
    }, 400);
  });

  let ready = 0;
  videos.forEach(video => {
    video.addEventListener("canplay", () => {
      ready += 1;
      if (ready === videos.length) playAll(true);
    }, { once: true });
    video.addEventListener("click", () => toggleSound(video));
  });
  setTimeout(() => playAll(true), 1800);
})();
