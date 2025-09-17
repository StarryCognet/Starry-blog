import comp from "E:/Visual Studio Code/git/starry-blog/docs/.vuepress/.temp/pages/posts/article9.html.vue"
const data = JSON.parse("{\"path\":\"/posts/article9.html\",\"title\":\"Article 9\",\"lang\":\"en-US\",\"frontmatter\":{\"date\":\"2022-01-09T00:00:00.000Z\",\"category\":[\"Category A\",\"Category B\"],\"tag\":[\"tag C\",\"tag D\"]},\"headers\":[{\"level\":2,\"title\":\"Heading 2\",\"slug\":\"heading-2\",\"link\":\"#heading-2\",\"children\":[{\"level\":3,\"title\":\"Heading 3\",\"slug\":\"heading-3\",\"link\":\"#heading-3\",\"children\":[]}]}],\"git\":{\"updatedTime\":1758109277000,\"contributors\":[{\"name\":\"StarryCognet\",\"username\":\"StarryCognet\",\"email\":\"127642222+StarryCognet@users.noreply.github.com\",\"commits\":1,\"url\":\"https://github.com/StarryCognet\"}],\"changelog\":[{\"hash\":\"863ca6c0f4dea0223026c1cf3a86e4336e2c1ca9\",\"time\":1758109277000,\"email\":\"127642222+StarryCognet@users.noreply.github.com\",\"author\":\"StarryCognet\",\"message\":\"1\"}]},\"filePathRelative\":\"posts/article9.md\",\"excerpt\":\"\\n<h2>Heading 2</h2>\\n<p>Here is the content.</p>\\n<h3>Heading 3</h3>\\n<p>Here is the content.</p>\\n\"}")
export { comp, data }

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
