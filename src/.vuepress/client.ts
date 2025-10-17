import { defineClientConfig } from "vuepress/client";
// import GlobalMusicPlayer from "./components/GlobalMusicPlayer.vue";
import Not from "./components/Not.vue";
import ElementPlus from "element-plus";
import ChatBox from "./components/ChatBox.vue"
import "element-plus/dist/index.css";
import { ref, computed, watchEffect, h } from "vue";

export default defineClientConfig({
  enhance({ app }) {
    app.use(ElementPlus);
    // app.component("GlobalMusicPlayer", GlobalMusicPlayer);
    app.component("Not", Not);
    app.component("ChatBox", ChatBox);
  },
  setup() {
    if (typeof window !== "undefined") {
      // 添加 APlayer CSS
      /*const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css";
      document.head.appendChild(link);*/

      // 监听主题变化并应用 Element Plus 主题
      const update = () => (document.documentElement.dataset.theme || "light") as "light" | "dark";
      const theme = ref(update());

      const ob = new MutationObserver(() => (theme.value = update()));
      watchEffect(() =>
        ob.observe(document.documentElement, {
          attributes: true,
          attributeFilter: ["data-theme"],
        })
      );

      // 应用 Element Plus 主题
      watchEffect(() => {
        const isDark = theme.value === "dark";
        document.documentElement.classList.toggle("dark", isDark);

        // 动态切换 Element Plus 的暗黑模式
        if (isDark) {
          document.body.classList.add("el-popup-parent--hidden");
          import("element-plus/theme-chalk/dark/css-vars.css" as string).then(() => {
            document.body.classList.remove("el-popup-parent--hidden");
          });
        } else {
          document.body.classList.remove("el-popup-parent--hidden");
        }
      });

      // 在页面加载后添加播放器
      /*window.addEventListener("load", () => {
        const container = document.createElement("div");
        container.id = "global-music-player";
        document.body.appendChild(container);

        // 添加点击事件监听器实现锁定和移动功能
        document.addEventListener("click", function (e) {
          // 检查是否点击了 aplayer-miniswitcher 元素
          const target = e.target as Element;
          if (target.matches(".aplayer-miniswitcher") || target.closest(".aplayer-miniswitcher")) {
            const aplayerBody = document.querySelector(".aplayer-body");
            if (aplayerBody) {
              aplayerBody.classList.toggle("locked");
              // aplayerBody.classList.toggle("moved");
              // 阻止事件冒泡，避免立即触发其他点击事件
              // e.stopPropagation();
            }
          }
        });
      });*/
    }
  },
});