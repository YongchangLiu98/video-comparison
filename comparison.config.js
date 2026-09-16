window.COMPARISON_CONFIG = {
  title: "Ref2VA 新版、上一次与 Prompt Extender 同步对比",
  columns: [
    { id: "current", label: "本次新版", detail: "2026-09-15" },
    { id: "previous", label: "上一次", detail: "2026-09-08" },
    { id: "extender", label: "本次新版 · Prompt Extender", detail: "2026-09-16 · seed 0" }
  ],
  modes: [
    { id: "balanced", label: "Balanced" },
    { id: "quality", label: "Quality" }
  ],
  cases: [
    { id: "01", title: "师徒重逢：江岁欢与楚晨" },
    { id: "02", title: "毒蝎线索：江岁欢与顾锦对峙" },
    { id: "03", title: "宝华殿法事：慧通法师留人" },
    { id: "04", title: "医馆宣召：江岁欢入宫诊治" },
    { id: "05", title: "宫门相遇：江岁欢与顾锦" },
    { id: "06", title: "三人对话：吴耐、白雪与沙丽丽" },
    { id: "07", title: "甩袖离场：沙丽丽与吴耐" },
    { id: "08", title: "服装店冲突：吴耐、王刚与沙丽丽" }
  ],
  videoPath(column, item, mode) {
    const suffix = column.id === "extender" ? "_extender" : "";
    return `videos/${column.id}/${item.id}_${item.title}/case_${item.id}_${mode.id}_seed_0${suffix}.mp4`;
  }
};
