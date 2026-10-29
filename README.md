# Motif — 私人观影手记

一个用于记录看过的电影、评分、短评和待看清单的中文单页网站。视觉语言参考了 Kestrel / TV Show & Movie Detail 的暗色电影感界面，但**功能、结构、品牌和文案均为重新设计**，不是剧集详情页的复刻。当前已导入 2018–2026 年的 **151 条历史观看记录**。

- 技术栈：React 19 + Vite + Tailwind CSS 4
- 数据：`src/data/history.js` 历史记录 + `localStorage` 本地缓存 + Supabase 云同步 + JSON 备份
- 字体：Manrope Variable（西文 UI）+ Instrument Serif（西文展示标题），中文回退到 PingFang SC / 宋体
- 响应式：桌面 4 列 / 平板 2 列 / 手机 1 列
- 预览图：[桌面](docs/preview-desktop.png) · [记录网格](docs/preview-grid.png) · [详情弹层](docs/preview-detail.png) · [新增记录弹层](docs/preview-log.png) · [导入 / 导出](docs/preview-data.png) · [云同步登录](docs/preview-account.png) · [手机](docs/preview-mobile.png)

## 运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

在 `.env.local` 中填入 Supabase 项目 URL 和 **Publishable / anon public key**。不要把 `service_role` / secret key 放进前端。

首次接入 Supabase 前还需要：

1. 在 Supabase SQL Editor 执行 [`supabase/schema.sql`](supabase/schema.sql)，创建 `entries` 表、索引、RLS 策略和更新时间触发器
2. 在 Authentication → Users 添加一个邮箱用户，并开启 **Auto Confirm**
3. 启动站点后点击右上角头像或首屏「登录以云同步」，用这个账号登录

打开 Vite 输出的地址（默认 `http://localhost:5173`）。构建：

```bash
npm run build
npm run preview
```

## 云同步

- 未登录：记录只写入浏览器 `localStorage`
- 首次登录：如果 Supabase 云端为空，会自动上传当前本地记录；如果云端已有数据，则以云端为准
- 登录后：新增、编辑、评分、收藏、删除会自动写入 Supabase，带 700ms 防抖
- 每次打开页面会重新拉取云端数据；点击头像里的「立即同步」可以手动上传当前本地副本
- RLS 按 `auth.uid()` 隔离，只有当前登录用户能读写自己的记录
- 退出登录后本地缓存仍保留，重新登录时会以云端数据为准
- 当前是单用户、最后写入者优先的同步模型，不是多人实时协作；多设备同时编辑时以最后同步的一份为准

## 功能

- 已导入 151 条历史观看记录（2018–2026）
- 新增 / 编辑 / 删除观影条目
- 首批显示 16 条，可「加载更多」继续浏览
- 标记「已看 / 待看」，一键移入待看清单
- 五星评分、收藏、短评、观看日期、导演、片长、类型、国家、语言
- 搜索标题 / 导演 / 短评，按最近观看、评分、标题排序
- 按全部、已看、待看、收藏筛选
- 统计看过数量、本年观看、平均分、待看数量
- 未登录时数据保存在浏览器本地；刷新后仍在
- 登录 Supabase 后自动云同步，换设备登录可继续使用
- 导入 / 导出 JSON 备份；文件可放进 iCloud Drive 跨设备迁移
- 空状态、键盘焦点环、Esc 关闭弹层、焦点陷阱、背景 `inert`、减少动态偏好支持

## 设计 token（来自参考并落地到 Tailwind）

| 类别 | Token | 值 |
| --- | --- | --- |
| 背景 | canvas | `#0a0908` |
| 面板 | panel | `#1c1b19` |
| 次级表面 | tabs / elevated | `#141311` / `#262421` |
| 缩略图底 | thumb | `#2e2c29` |
| 强调色 | accent | `#b07f43` |
| 强调色文字 | accent ink | `#16100a` |
| 主文字 | hi | `#f3f0ea` |
| 次文字 | mid | `#b4afa5` |
| 弱文字 | low | `#8b867c` |
| 发丝线 | hairline | `rgba(243,240,234,.09)` |
| 小圆角 | tile | `3px` |
| 大圆角 | card | `6px` |
| 网格 | desktop | 4 列 / 列距 26px / 行距 52px |
| 网格 | tablet | 2 列（≤1180px） |
| 网格 | mobile | 1 列（≤640px） |
| 卡片 | 图片比例 | 16:9 |
| 卡片标题 | 字号 / 行高 | 19px / 1.25 |
| 卡片短评 | 字号 / 行高 | 14.5px / 1.55 |
| 卡片元信息 | 字号 | 11px / 700 / `.13em` |
| 筛选标签 | 字号 | 13px / 600 / `.1em` |
| 弹层标题带 | 字号 | 13px / 700 / `.16em` |
| 弹层阴影 | modal | `0 32px 80px -24px rgba(0,0,0,.85)` |
| 缓动 | expo | `cubic-bezier(.16,1,.3,1)` |

主要 token 定义在 [`src/index.css`](src/index.css) 的 `@theme` 中。

## 导入 / 导出与 iCloud

入口有两个：顶部导航右侧的「数据」图标，以及页脚的「导入 / 导出」。

**导出**

- 导出当前全部记录为一个 JSON 文件：`motif-entries-YYYY-MM-DD.json`
- 文件包含完整字段：片名、评分、状态、短评、类型、观看年份、图片路径等
- Chrome / Edge 会打开系统保存对话框，可直接选择 **iCloud Drive**
- Safari / Firefox 会走普通下载；把下载的文件移动到 iCloud Drive 即可同步
- 文件保存在 iCloud Drive 后，会由系统自动同步，不需要上传到本站服务器

**导入**

- 点击或拖入 JSON 文件；支持本页导出的备份，也支持直接是记录数组的 JSON
- 文件最大 5 MB，单次最多 5000 条记录
- 会校验片名、评分、状态、日期等字段；无片名的条目会被跳过
- 导入方式：
  - **合并**：保留现有记录，同 ID 记录被文件内容覆盖，新记录追加
  - **替换**：确认后用文件内容完全覆盖当前记录；适合在另一台设备上精确恢复备份
- 导入只在本机浏览器中解析，不会上传服务器

示例备份结构：

```json
{
  "app": "Motif",
  "schemaVersion": 1,
  "exportedAt": "2026-10-29T07:00:00.000Z",
  "count": 151,
  "entries": []
}
```

跨设备步骤：在旧设备「导出 JSON」→ 保存到 iCloud Drive → 在新设备打开本站 → 顶部「数据」→ 选择 iCloud 里的文件 → 选择「替换」精确恢复。

这是**文件备份**。如果已经登录 Supabase，日常跨设备同步由云端负责；JSON 文件适合留作独立备份或迁移。

## 文件结构

```text
src/
  App.jsx                     # 页面状态、数据流、弹层挂载
  data/content.js             # 品牌、种子映射、筛选项、导航
  data/history.js             # 2018–2026 历史观看记录
  lib/format.js               # 日期、统计、筛选、排序
  lib/supabase.js              # Supabase 客户端
  lib/cloud.js                 # 云端读取、写入与字段映射
  lib/transfer.js             # JSON 导入、校验、合并与导出
  hooks/
    usePersistentState.js     # localStorage
    useSupabaseAuth.js         # Supabase 会话与登录
    useDialogBehavior.js      # 焦点陷阱、Esc、滚动锁定
    useToast.js               # 轻提示
  components/
    AppHeader.jsx
    Hero.jsx
    StatBand.jsx
    JournalToolbar.jsx
    JournalSection.jsx
    EntryCard.jsx
    EntryMenu.jsx
    LogDialog.jsx             # 新增 / 编辑条目
    EntryDetailDialog.jsx     # 条目详情
    DataDialog.jsx            # 导入 / 导出 JSON
    AccountDialog.jsx         # Supabase 登录与同步状态
    ModalShell.jsx            # 琥珀色标题带 + 关闭按钮
    StarRating.jsx
    ArtworkPlaceholder.jsx    # 无剧照时的文字占位画面
    EmptyState.jsx
    Toast.jsx
    Footer.jsx
    Icons.jsx
public/
  stills/                     # 16:9 占位剧照
  posters/                    # 2:3 占位海报
supabase/
  schema.sql                  # 表、RLS、索引和触发器
docs/                         # 预览截图
```

## 替换占位内容

1. **品牌 / Logo**：修改 `src/components/Icons.jsx` 中的 `LogoMark`，以及 `src/data/content.js` 中的 `brand`。
2. **电影条目**：导入的数据在 `src/data/history.js` 的 `historyEntries` 中，`content.js` 将其作为 `seedEntries`。新增记录直接用页面上的「记录电影」；也可以继续编辑 `history.js` 后清空 v3 本地数据重新导入。字段包括 `title`、`year`、`director`、`runtime`、`genres`、`status`、`rating`、`watchedAt`、`watchedYear`、`note`、`still`、`poster` 等。
3. **图片**：直接替换 `public/stills/*.jpg` 和 `public/posters/*.jpg`，或把数据里的路径指向自己的图片。
4. **文案**：页面主文案在 `hero` 对象；其余界面文案分散在组件中。
5. **已有本地数据 / 旧演示数据**：网站使用 `localStorage` key `motif.entries.v3`。首次读取时会从旧的 `motif.entries.v2` 迁移你自己新增的记录，并过滤掉旧版 8 条演示记录，再与历史数据合并。另有一个一次性标记 `motif.historyImport.v1`，用于修复“本地已有空 v3 数组导致看不到导入数据”的情况。

```js
// 清空全部数据，并保持空白（不会重新导入历史记录）
localStorage.setItem('motif.entries.v3', '[]');
localStorage.setItem('motif.historyImport.v1', '1');
location.reload();

// 重新导入 151 条历史记录
localStorage.removeItem('motif.entries.v3');
localStorage.removeItem('motif.historyImport.v1');
location.reload();
```

新增记录可选的占位剧照来自 Unsplash / Lorem Picsum，仅用于演示。正式发布前请替换为拥有使用权的图片；历史导入记录默认不使用这些图片。

## 历史记录导入说明

| 观看年份 | 条数 |
| --- | --- |
| 2026 | 3 |
| 2025 | 13 |
| 2024 | 10 |
| 2023 | 8 |
| 2022 | 13 |
| 2021 | 50 |
| 2020 | 18 |
| 2019 | 20 |
| 2018 | 16 |
| **合计** | **151** |

- 2026 年表头写的是 1 部，但表格实际有 3 行，按 3 条导入
- 星级转为 1–5 分；`-` 保持未评分，共 65 条有评分
- 表格中的年份作为「观看年份」，不伪造具体日期；卡内显示为「已看 · 2021 年」
- 类型按 `/` 拆成标签；备注导入为短评
- 没有提供的上映年份、导演、片长、国家、语言、简介、剧照、海报全部留空
- 无剧照记录使用标题首字 + 深色渐变的占位画面，不套用无关剧照
- 相同片名或相近片名不做自动合并，保持原表每一行

## 与参考的差异与自查

**已对齐**
- 暖黑画布、琥珀强调色、三级文字与发丝线均使用参考色值
- 16:9 缩略图、3px 圆角、1px 外描边、hover 上浮 3px 与深阴影
- 19px 卡片标题、14.5px 短评、11px 元信息、13px 筛选标签
- 4 / 2 / 1 列响应式网格，26px 列距与 52px 行距
- 琥珀色弹层标题带、居中 13px 大写标题、右上 36px 关闭按钮
- 关闭按钮 hover / active、卡片与菜单 focus-visible、Esc 关闭、焦点陷阱
- 空状态与占位图

**中文版本核对**
- 全站可见文案、提示、表单标签、空状态、确认框、无障碍标签和日期均改为中文
- 精确日期使用 `Intl.DateTimeFormat("zh-CN")`；只有年份的记录显示为「已看 · 2021 年」
- 历史记录中的「观看年份」用独立的 `watchedYear` 字段保存，不写死成 1 月 1 日
- 中文标题使用宋体回退，正文使用苹方回退，避免中文落到默认无衬线字体
- 手机端筛选标签从英文版的 10.5px 提升到 12px，中文四字标签仍能完整显示

**有意保留的差异（因为功能不同）**
- 参考页是“APP 背景 + 剧集详情弹层”；本站是“观影日志首页 + 新增/详情弹层”
- 参考页的季选择器、剧集标签页、集数进度被替换为电影筛选、观看状态和评分线
- 西文标题使用 Instrument Serif，中文标题使用宋体回退；正文使用 Manrope + 苹方回退；字阶和色彩仍遵循参考
- 弹层宽度按表单/详情内容收窄，未照搬参考的整宽剧集面板
- 无图记录使用文字占位画面；有图记录统一加了低饱和、压暗和渐变处理

## 自查中修正过的问题

- 修复 4 列网格在 1280px 被 2 列规则覆盖的断点顺序问题
- 将卡片 meta 从 10px 调到参考的 11px
- 将筛选标签在桌面端调到参考的 13px / 33px 间距
- 将遮罩从 `.78` 调回参考的 `.72`
- 弹层在手机端改为全宽、无侧边留白，与参考的 `≤640px` 规则一致
- 手机详情页海报改为 16:9，避免小屏首屏被 2:3 海报占满
- 修复点击遮罩无法关闭弹层的问题
- 移除卡片图片的懒加载，避免长页面截图中出现空卡片
- 修复「最近观看」排序把待看条目排到已看条目前面的问题
- 过滤器的 `role="tab"` 改为 `aria-pressed` 按钮，避免没有 tabpanel 的语义问题
# FilmLog
