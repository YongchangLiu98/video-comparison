# Video Comparison

公开的 Ref2VA 视频同步对比页面。当前只展示 Quality 模式，并拆分为两个独立页面：“版本比较”和“PE比较器”。版本比较依次展示 HyperFlow with Qwen9B PE、HyperFlow 和 SOL H3；PE比较器统一展示 DeepSeek PE、官方 Context-IR、Qwen9B PE 与原 Prompt。

## 在线页面

启用 GitHub Pages 后，页面位于：

`https://yongchangliu98.github.io/video-comparison/`

## 页面功能

- 每排视频自动同步、循环播放，默认静音。
- 两个比较器是独立网页，只加载当前页面的视频；进入页面后立即加载本页全部视频，并显示加载数量和百分比。
- 点击任意视频，只开启该视频声音；再次点击关闭。
- 切换到另一条视频时，上一条自动静音。
- 支持任意数量的版本列、用例和模式。
- 页面只展示 Quality 模式、seed 0 的结果。
- DeepSeek PE 列使用新版 `deepseek/deepseek-v4.1-flash`（`h3-official-v8-auto`）预生成重写结果。
- Qwen9B PE 列是原网页端旧版 Qwen3.5-9B 重写结果。
- HyperFlow with official IR 列使用 MiniMax 官方 Context-IR 重写器。
- PE 比较器最前面的 Case 00 是复杂多参考赛车用例，四格分别展示 DeepSeek PE v8、H3 官方 Skill 重写、旧版 API Rewrite 与原始 Prompt；该用例不属于历史版本对比，因此不会出现在“版本比较”页面。

## 后续加入新版本

1. 将生成结果导入新目录：

   ```bash
   ./scripts/import-version.sh v4 /path/to/result-folder
   ```

   结果目录需要包含 `by_case/`，脚本只导入 MP4，不导入请求、响应或密钥文件。

2. 编辑 `comparison.config.js`：

   - 在 `columns` 中增加版本列，例如 `{ id: "v4", label: "V4", detail: "2026-10-01" }`。
   - 如有新用例，在 `cases` 中增加编号和标题。
   - 如有新模式，在 `modes` 中增加模式 ID 和显示名称。

3. 本地查看：

   ```bash
   python3 -m http.server 4173
   ```

4. 提交并推送，GitHub Pages 会自动更新。

## 目录结构

```text
assets/                  页面样式与交互
videos/<版本>/<用例>/     对比视频
comparison.config.js     版本、模式和用例配置
scripts/import-version.sh 后续版本导入工具
index.html               页面入口
```

仓库不包含 API Key、生成请求记录或服务端响应记录。
