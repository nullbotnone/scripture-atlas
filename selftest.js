const out = [];
const ok = (name, cond, extra) => out.push((cond ? "PASS " : "FAIL ") + name + (extra ? " :: " + extra : ""));
const $ = (s) => document.querySelector(s);
const text = (s) => $(s).textContent;
const wait = async (cond) => { for (let i = 0; i < 300 && !cond(); i++) await new Promise((r) => setTimeout(r, 50)); };
const pick = async (lang) => { $(`#langSeg [data-lang="${lang}"]`).click(); await wait(() => /[\p{L}]/u.test(text("#selectedText")) && !/…/.test(text("#selectedText"))); await new Promise((r) => setTimeout(r, 300)); };

await wait(() => /\d/.test(text("#statVerses")) && $("#bookAxis").children.length === 66);

ok("defaults to browser language", document.documentElement.lang === "en", document.documentElement.lang);
await pick("en");
ok("html lang en", document.documentElement.lang === "en");
ok("English UI", /echoes/.test(text("h1")) && /Arc of connections/.test(text("#arcTab")), text("h1"));
ok("KJV text", text("#selectedText") === "In the beginning God created the heaven and the earth.", text("#selectedText"));
ok("English book names", text("#selectedRef") === "Genesis 1:1" && $("#bookFilter").options[43].textContent === "John", text("#selectedRef"));
ok("path inputs follow language", $("#pathFrom").value === "Genesis 1:1" && $("#pathTo").value === "John 1:1", $("#pathFrom").value);
ok("dynamic counts translated", /match/.test(text("#arcCount")) && /connections/.test(text("#selectedLinks")), text("#arcCount"));
ok("stats refilled after switch", /\d/.test(text("#skippedRows")) && /\d/.test(text("#nonpositivePairs")));

await pick("tw");
ok("html lang zh-TW", document.documentElement.lang === "zh-TW");
ok("choice shared with homepage", localStorage.getItem("slashai.lang") === '"tw"', String(localStorage.getItem("slashai.lang")));
ok("Traditional UI", /迴聲/.test(text("h1")), text("h1"));
ok("Traditional CUV text", text("#selectedText") === "起初神創造天地。", text("#selectedText"));
$("#verseSearch").value = "John 3:16"; $("#verseSearchForm").requestSubmit();
ok("search accepts any language", text("#selectedRef") === "約翰福音 3:16" && /神愛世人/.test(text("#selectedText")), text("#selectedRef"));

await pick("zh");
ok("Simplified back", /回声/.test(text("h1")) && text("#selectedRef") === "约翰福音 3:16" && /神爱世人/.test(text("#selectedText")), text("#selectedRef"));

document.title = out.join(" | ");
