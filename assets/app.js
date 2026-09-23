(() => {
  const config = window.COMPARISON_CONFIG;
  if (!config) throw new Error("Missing COMPARISON_CONFIG");

  const viewId = document.body.dataset.view || config.defaultView;
  const view = config.views.find(item => item.id === viewId) || config.views[0];
  const pageTitle = document.getElementById("page-title");
  const columnHeads = document.getElementById("column-heads");
  const comparisons = document.getElementById("comparisons");
  const status = document.getElementById("status");
  const loadingBar = document.getElementById("loading-bar");
  let videos = [];
  let readyCount = 0;
  let failedCount = 0;
  let autoplayEnabled = true;

  document.title = view.title;
  pageTitle.textContent = view.title;
  document.documentElement.style.setProperty("--column-count", view.columns.length);

  const visibleCases = config.cases.filter(item => !item.views || item.views.includes(view.id));
  comparisons.innerHTML = visibleCases.flatMap(item =>
    config.modes.map(mode => {
      const columns = item.columns?.[view.id] || view.columns;
      return `
        <section class="comparison-row" data-row="case${item.id}-${mode.id}" style="--row-column-count:${columns.length}">
          <div class="group-title"><h2>Case ${item.id} · ${item.title}</h2><span class="badge">${mode.label}</span></div>
          <div class="video-grid">
            ${columns.map(column => `
              <div class="video-cell">
                <video data-src="${config.videoPath(column, item, mode)}" muted loop playsinline preload="none"></video>
                <span class="cell-label">${column.label}</span>
              </div>`).join("")}
          </div>
        </section>`;
    })
  ).join("");

  if (view.id === "pe") {
    columnHeads.hidden = true;
  } else {
    columnHeads.innerHTML = view.columns.map(column =>
      `<div>${column.label}${column.detail ? `<div class="column-detail">${column.detail}</div>` : ""}</div>`
    ).join("");
  }

  videos = [...document.querySelectorAll("video")];
  const totalCount = videos.length;
  const audioStatus = () => videos.some(video => !video.muted) ? "单路有声" : "静音";

  function updateProgress(message = "") {
    const completed = readyCount + failedCount;
    const percent = totalCount ? Math.round(completed / totalCount * 100) : 100;
    loadingBar.style.width = `${percent}%`;
    status.textContent = `${message ? `${message} · ` : ""}已加载 ${readyCount}/${totalCount}${failedCount ? ` · 失败 ${failedCount}` : ""} · ${percent}%`;
  }

  function playRow(row, reset = false) {
    const rowVideos = [...row.querySelectorAll("video")].filter(video => video.dataset.ready === "true");
    if (reset) rowVideos.forEach(video => { video.currentTime = 0; });
    Promise.allSettled(rowVideos.map(video => video.play()));
  }

  function activateRow(row) {
    if (row.dataset.activated === "true") return;
    row.dataset.activated = "true";
    row.dataset.loading = "true";
    const rowVideos = [...row.querySelectorAll("video")];
    rowVideos.forEach(video => {
      video.addEventListener("canplay", () => {
        if (video.dataset.ready === "true") return;
        video.dataset.ready = "true";
        readyCount += 1;
        updateProgress("正在加载可见视频");
        if (rowVideos.every(item => item.dataset.ready === "true" || item.dataset.failed === "true")) {
          row.dataset.loading = "false";
          row.dataset.ready = "true";
          if (autoplayEnabled) playRow(row, true);
        }
      });
      video.addEventListener("error", () => {
        if (video.dataset.failed === "true") return;
        video.dataset.failed = "true";
        failedCount += 1;
        updateProgress("部分视频加载失败");
      });
      video.src = video.dataset.src;
      video.load();
    });
  }

  function activateAll() {
    document.querySelectorAll(".comparison-row").forEach(activateRow);
  }

  function playAll(reset = false) {
    autoplayEnabled = true;
    activateAll();
    if (reset) videos.filter(video => video.dataset.ready === "true").forEach(video => { video.currentTime = 0; });
    Promise.allSettled(videos.filter(video => video.dataset.ready === "true").map(video => video.play())).then(() => {
      updateProgress(`同步播放中 · 循环 · ${audioStatus()}`);
    });
  }

  function pauseAll() {
    autoplayEnabled = false;
    videos.forEach(video => video.pause());
    updateProgress("已暂停");
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
    updateProgress(`同步播放中 · 循环 · ${audioStatus()}`);
  }

  document.querySelectorAll(".video-grid").forEach(row => {
    const rowVideos = [...row.querySelectorAll("video")];
    const master = rowVideos[0];
    setInterval(() => {
      if (!master || master.paused || master.dataset.ready !== "true") return;
      rowVideos.slice(1).forEach(video => {
        if (video.dataset.ready === "true" && Math.abs(video.currentTime - master.currentTime) > 0.18) {
          video.currentTime = master.currentTime;
        }
      });
    }, 400);
  });

  videos.forEach(video => video.addEventListener("click", () => toggleSound(video)));
  document.getElementById("play").addEventListener("click", () => playAll(false));
  document.getElementById("pause").addEventListener("click", pauseAll);
  document.getElementById("restart").addEventListener("click", () => playAll(true));

  updateProgress("正在加载全部视频");
  activateAll();
})();
