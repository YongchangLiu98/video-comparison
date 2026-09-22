(() => {
  const config = window.COMPARISON_CONFIG;
  if (!config) throw new Error("Missing COMPARISON_CONFIG");

  const pageTitle = document.getElementById("page-title");
  const columnHeads = document.getElementById("column-heads");
  const comparisons = document.getElementById("comparisons");
  const status = document.getElementById("status");
  const tabs = document.getElementById("view-tabs");
  let videos = [];
  let syncTimers = [];

  document.title = config.title;
  tabs.innerHTML = config.views.map(view =>
    `<button class="view-tab" type="button" data-view="${view.id}">${view.label}</button>`
  ).join("");

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

  function renderView(viewId) {
    const view = config.views.find(item => item.id === viewId) || config.views[0];
    history.replaceState(null, "", `#${view.id}`);
    syncTimers.forEach(clearInterval);
    syncTimers = [];
    videos.forEach(video => video.pause());
    pageTitle.textContent = view.title;
    document.documentElement.style.setProperty("--column-count", view.columns.length);
    document.querySelectorAll(".view-tab").forEach(button => {
      button.classList.toggle("active", button.dataset.view === view.id);
    });
    columnHeads.innerHTML = view.columns.map(column =>
      `<div>${column.label}${column.detail ? `<div class="column-detail">${column.detail}</div>` : ""}</div>`
    ).join("");
    const visibleCases = config.cases.filter(item => !item.views || item.views.includes(view.id));
    comparisons.innerHTML = visibleCases.flatMap(item =>
      config.modes.map(mode => `
        <section class="comparison-row" data-row="case${item.id}-${mode.id}">
          <div class="group-title"><h2>Case ${item.id} · ${item.title}</h2><span class="badge">${mode.label}</span></div>
          <div class="video-grid">
            ${view.columns.map(column => `
              <div class="video-cell">
                <video src="${config.videoPath(column, item, mode)}" muted loop playsinline preload="metadata"></video>
                <span class="cell-label">${item.cellLabels?.[column.id] || column.label}</span>
              </div>`).join("")}
          </div>
        </section>`)
    ).join("");

    videos = [...document.querySelectorAll("video")];
    document.querySelectorAll(".video-grid").forEach(row => {
      const rowVideos = [...row.querySelectorAll("video")];
      const master = rowVideos[0];
      syncTimers.push(setInterval(() => {
        if (master.paused) return;
        rowVideos.slice(1).forEach(video => {
          if (Math.abs(video.currentTime - master.currentTime) > 0.18) video.currentTime = master.currentTime;
        });
      }, 400));
    });
    videos.forEach(video => video.addEventListener("click", () => toggleSound(video)));
    status.textContent = "正在加载同步对比视频…";
    setTimeout(() => playAll(true), 1400);
  }

  tabs.addEventListener("click", event => {
    const button = event.target.closest("[data-view]");
    if (button) renderView(button.dataset.view);
  });
  document.getElementById("play").addEventListener("click", () => playAll(false));
  document.getElementById("pause").addEventListener("click", pauseAll);
  document.getElementById("restart").addEventListener("click", () => playAll(true));

  renderView(location.hash.slice(1) || config.defaultView);
})();
