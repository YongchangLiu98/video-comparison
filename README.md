# Video Comparison

公开的 Ref2VA 视频同步对比页面。当前展示全部 8 个用例的 Balanced 与 Quality 模式，每排对比“本次新版”、“上一次”和“本次新版 · Prompt Extender”三条视频。

## 在线页面

启用 GitHub Pages 后，页面位于：

`https://yongchangliu98.github.io/video-comparison/`

## 页面功能

- 每排视频自动同步、循环播放，默认静音。
- 点击任意视频，只开启该视频声音；再次点击关闭。
- 切换到另一条视频时，上一条自动静音。
- 支持任意数量的版本列、用例和模式。
- Prompt Extender 列使用网页端同一套预生成重写流程；每个用例的 Balanced 与 Quality 共用一份已确认重写结果。

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
