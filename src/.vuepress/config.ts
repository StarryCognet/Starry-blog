import { defineUserConfig } from "vuepress";

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

locales: {
  "/zh/": {
    lang: "zh-CN",
    title: "StarryCognet",
    description: "记录技术与生活",
  },
  "/": {
    lang: "en-US",
    title: "Starry Blog",
    description: "A blog demo for vuepress-theme-hope",
  },
},

  theme,

  // Enable it with pwa
  // shouldPrefetch: false,
});
