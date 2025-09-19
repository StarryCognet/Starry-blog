import { defineUserConfig } from "vuepress";
// import { metingPlugin } from 'vuepress-plugin-meting'
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "StarryCognition",
  description: "StarryCognet 的博客",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
  // plugins: [
  //   metingPlugin({
  //     // 网易云歌单示例
  //     api:    'https://api.injah.cn/meting/',
  //     server: 'netease',
  //     type:   'playlist',
  //     id:     '60198',        // 替换成你的歌单 id
  //     auto:   'https',        // 自动 https
  //   }),
  // ],
});
