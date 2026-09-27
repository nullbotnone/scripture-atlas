# 经纬圣经 · Scripture Atlas

一个静态、可交互的整本圣经交叉引用地图，作为 [slashai.app](https://nullbotnone.github.io/) 的子页面部署于 `/bible-wiki/`。

## 探索方式

- **关联穹顶**：按经文顺序绘制跨节弧线，可按关系范围、票数、书卷筛选；点击时间轴、搜索经文并查看相邻经文。
- **书卷矩阵**：比较 66 卷书的关联数量或按可能经文配对数归一化的密度；点击格子查看对应弧线。
- **经文路径**：寻找两节经文之间最多三步的交叉引用路径。
- **数据观察**：展示跨新旧约比例、连接最多与密度最高的跨约书卷配对。

## 本地运行

这是无需构建的静态网站。运行 `python3 -m http.server 8000`，然后打开 `http://localhost:8000/`。直接双击 `index.html` 时，浏览器可能阻止读取数据文件。

## 数据来源与处理

- 交叉引用：[OpenBible.info](https://www.openbible.info/labs/cross-references/) 的 `cross_references.txt`，CC BY；本项目使用 2026-09-21 的文件，共 344,799 条原始记录。来源以《经文汇编》为主，并包含读者评价票数。
- 中文经文：[seven1m/open-bibles](https://github.com/seven1m/open-bibles) 的 `chi-cuv-simp.usfx.xml`，公版和合本简体。

`scripts/build_data.py` 将节段引用展开到逐节配对，对无向经文配对去重并保留最高票数，剔除非正票配对，生成 `data/meta.json`、`data/verses.json`、`data/references.bin`。原始记录数与展开后的配对数不同。由于两份资料采用的节号划分略有差异，无法在中文版本中定位的引用会跳过；具体数量见 `data/meta.json`。

重新生成数据：

```bash
python3 scripts/build_data.py /path/to/cross-references.zip /path/to/chi-cuv-simp.usfx.xml
```

可视化只绘制当前筛选最多 6,000 条弧线，所有统计、经文详情与路径搜索均使用完整的逐节配对集。连线表示来源中提出的关联，不等同于一段经文直接引用另一段、作者意图或神学结论。

## 部署

推送到 `main` 后，`.github/workflows/pages.yml` 会将仓库根目录部署到 GitHub Pages。仓库 Pages 设置需选择 **GitHub Actions** 作为发布源。
