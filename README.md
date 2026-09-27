# 经纬圣经 · Scripture Atlas

一个静态、可交互的整本圣经交叉引用地图。线上地址：<https://slashai.app/scripture-atlas/>。

## 探索方式

- **关联穹顶**：按经文顺序绘制跨节弧线，可按关系范围、票数、书卷筛选；点击时间轴、搜索经文并查看相邻经文。
- **书卷矩阵**：比较 66 卷书的关联数量或按可能经文配对数归一化的密度；点击格子查看对应弧线。
- **经文路径**：寻找两节经文之间最多三步的交叉引用路径。
- **数据观察**：展示跨新旧约比例、连接最多与密度最高的跨约书卷配对。
- **简 / 繁 / EN**：界面、书名与经文随语言切换（和合本简体、和合本繁体、KJV）。首次访问按浏览器语言选择；选择存于 `slashai.lang`，与主页共用。搜索框任何语言的书名都认。

## 本地运行

这是无需构建的静态网站。运行 `python3 -m http.server 8000`，然后打开 `http://localhost:8000/`。直接双击 `index.html` 时，浏览器可能阻止读取数据文件。

## 数据来源与处理

- 交叉引用：[OpenBible.info](https://www.openbible.info/labs/cross-references/) 的 `cross_references.txt`，CC BY；本项目使用 2026-09-21 的文件，共 344,799 条原始记录。来源以《经文汇编》为主，并包含读者评价票数。
- 经文：[seven1m/open-bibles](https://github.com/seven1m/open-bibles) 的 `chi-cuv-simp.usfx.xml`（和合本简体）、`chi-cuv.usfx.xml`（和合本繁体）、`eng-kjv.osis.xml`（KJV），均为公版。

`scripts/build_data.py` 将节段引用展开到逐节配对，对无向经文配对去重并保留最高票数，剔除非正票配对，生成 `data/meta.json`、`data/verses.json`、`data/references.bin`。原始记录数与展开后的配对数不同。由于两份资料采用的节号划分略有差异，无法在中文版本中定位的引用会跳过；具体数量见 `data/meta.json`。

重新生成数据：

```bash
python3 scripts/build_data.py /path/to/cross-references.zip /path/to/chi-cuv-simp.usfx.xml
python3 scripts/build_translations.py /path/to/chi-cuv.usfx.xml /path/to/eng-kjv.osis.xml
```

`build_translations.py` 按和合本简体的节号布局对齐，生成 `data/verses.tw.json`、`data/verses.en.json`，并把繁体书名写入 `meta.json`。KJV 与和合本节号划分不同之处（如代上 21:31、约叁 1:15）英文留空。只载入当前语言的经文文件。

## 自检

```sh
./selftest.sh
```

在无头 Chrome 里切换三种语言并检查界面、书名、经文与搜索，每项一行，应全部 PASS。Chrome 不在默认位置时设置 `CHROME=`。

可视化只绘制当前筛选最多 6,000 条弧线，所有统计、经文详情与路径搜索均使用完整的逐节配对集。连线表示来源中提出的关联，不等同于一段经文直接引用另一段、作者意图或神学结论。

## 部署

本仓库自己开启了 GitHub Pages（`main` 分支根目录），推送 `main` 即发布到 `https://slashai.app/scripture-atlas/`，与其他工具一样。主页仓库只放入口链接，不存放本站文件。
