import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/demo/",
  { text: '💬 聊天', link: '/chat.html' },
  {
    text: "博文",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "苹果",
        icon: "pen-to-square",
        prefix: "apple/",
        children: [{ text: "苹果1", icon: "pen-to-square", link: "1" }, { text: "苹果2", icon: "pen-to-square", link: "2" }, "3", "4"],
      },
      {
        text: "香蕉",
        icon: "pen-to-square",
        prefix: "banana/",
        children: [
          {
            text: "香蕉 1",
            icon: "pen-to-square",
            link: "1",
          },
          {
            text: "香蕉 2",
            icon: "pen-to-square",
            link: "2",
          },
          "3",
          "4",
        ],
      },
      { text: "樱桃", icon: "pen-to-square", link: "cherry" },
      { text: "火龙果", icon: "pen-to-square", link: "dragonfruit" },
      "electron",
      "strawberry",
    ],
  },
  {
    text: "工具分享",
    icon: "pen-to-square",
    prefix: "/tools/",
    children: [
      {
        text: "A整合包",
        icon: "pen-to-square",
        link: "APack",
      },
    ],
  },

  {
    text: "V2 文档",
    icon: "book",
    link: "https://theme-hope.vuejs.press/zh/",
  },
  // "/gallery/gallery", // ← 加这一行
  // "drive/drive",
  // "demo/element-plus",
  {
    text: "其他",
    icon: "pen-to-square",
    prefix: "/other/",
    children: [
      {
        text: "在线相册",
        icon: "pen-to-square",
        link: "gallery",
      },
      {
        text: "直链下载",
        icon: "pen-to-square",
        link: "drive",
      },
    ],
  },
]);
