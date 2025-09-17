import { GitContributors } from "E:/Blog/starry-blog/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-_1be6d8e48186091591ceba8d775265e8/node_modules/@vuepress/plugin-git/lib/client/components/GitContributors.js";
import { GitChangelog } from "E:/Blog/starry-blog/node_modules/.pnpm/@vuepress+plugin-git@2.0.0-_1be6d8e48186091591ceba8d775265e8/node_modules/@vuepress/plugin-git/lib/client/components/GitChangelog.js";

export default {
  enhance: ({ app }) => {
    app.component("GitContributors", GitContributors);
    app.component("GitChangelog", GitChangelog);
  },
};
