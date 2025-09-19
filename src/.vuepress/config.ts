import { defineUserConfig } from "vuepress";
// import { metingPlugin } from 'vuepress-plugin-meting'
import metingPlugin from "vuepress-plugin-meting2";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "StarryCognition",
  description: "StarryCognet 的博客",

  theme,
  plugins: [
    metingPlugin({
      // 插件选项
      metingOptions: {
        global: true, // 开启全局播放器
        server: "netease", // 音乐平台：网易云
        type: "playlist", // 类型：歌单
        mid: "7351717679", // 替换为你的歌单 ID
      },
      // 其他 aplayer 选项（如需要）
      aplayerOptions: {
        fixed: true,
        mini: true,
        autoplay: false,
        theme: '#39b5cc',
        lrcType: 3,
        // 控制移动设备上是否显示封面图
        cover: false,
        // 使播放器列表默认处于折叠状态
        listFolded: true,
      },
    }),
  ],

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