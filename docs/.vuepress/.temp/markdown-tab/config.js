import { CodeTabs } from "E:/Blog/starry-blog/node_modules/.pnpm/@vuepress+plugin-markdown-t_5c9f047f686a2a4f3cf59e9a177457d1/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "E:/Blog/starry-blog/node_modules/.pnpm/@vuepress+plugin-markdown-t_5c9f047f686a2a4f3cf59e9a177457d1/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "E:/Blog/starry-blog/node_modules/.pnpm/@vuepress+plugin-markdown-t_5c9f047f686a2a4f3cf59e9a177457d1/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
