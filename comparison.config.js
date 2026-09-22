window.COMPARISON_CONFIG = {
  title: "H3 Ref2VA Quality 视频对比",
  defaultView: "versions",
  views: [
    {
      id: "versions", label: "版本比较",
      title: "HyperFlow with PE、HyperFlow 与 SOL H3 同步对比",
      columns: [
        { id: "extender", label: "HyperFlow with PE", detail: "HyperFlow 8-step · Prompt Extender · seed 0" },
        { id: "current", label: "HyperFlow", detail: "HyperFlow 8-step · 原 Prompt · seed 0" },
        { id: "previous", label: "SOL H3", detail: "FastVideo4 + SOL-BSA · 原 Prompt · seed 0" }
      ]
    },
    {
      id: "pe", label: "PE比较器",
      title: "HyperFlow：官方 Context-IR、PE 与原 Prompt 对比",
      columns: [
        { id: "official-ir", label: "HyperFlow with official IR", detail: "MiniMax Context-IR · seed 0" },
        { id: "extender", label: "HyperFlow with PE", detail: "Prompt Extender · seed 0" },
        { id: "current", label: "HyperFlow", detail: "原 Prompt · seed 0" }
      ]
    }
  ],
  modes: [
    { id: "quality", label: "Quality" }
  ],
  cases: [
    {
      id: "00",
      title: "复杂多参考赛车：林雪赛前对话",
      views: ["pe"],
      cellLabels: {
        "official-ir": "H3 官方 Skill 重写",
        extender: "API Prompt Rewrite",
        current: "原始 Prompt"
      },
      videoPaths: {
        "official-ir": "videos/official-ir/00_复杂多参考赛车：林雪赛前对话/case_00_quality_seed_0_official_ir.mp4",
        extender: "videos/extender/00_复杂多参考赛车：林雪赛前对话/case_00_quality_seed_0_extender.mp4",
        current: "videos/current/00_复杂多参考赛车：林雪赛前对话/case_00_quality_seed_0.mp4"
      }
    },
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
    if (item.videoPaths?.[column.id]) return item.videoPaths[column.id];
    const suffix = column.id === "extender" ? "_extender" : column.id === "official-ir" ? "_official_ir" : "";
    return `videos/${column.id}/${item.id}_${item.title}/case_${item.id}_${mode.id}_seed_0${suffix}.mp4`;
  }
};
