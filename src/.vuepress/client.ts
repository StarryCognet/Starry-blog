import { defineClientConfig } from 'vuepress/client'
// 导入全局音乐播放器组件
import GlobalMusicPlayer from './components/GlobalMusicPlayer.vue'
// 导入自定义 Card 组件示例
import Card from './components/Card.vue'
// import Notification from "./components/Notification.vue";
// 导入 naive-ui 组件库
import naive from 'naive-ui'

// 定义客户端配置
export default defineClientConfig({
  // enhance 用于扩展 Vue 应用实例
  enhance({ app }) {
    // 注册全局组件，注册后可在任何 Markdown 文件中使用
    // 格式：app.component('组件名', 组件引用)
    app.component('GlobalMusicPlayer', GlobalMusicPlayer)
    app.component('Card', Card)
    // app.component("Notification", Notification);
    
    // 注册第三方组件库（如 naive-ui）
    app.use(naive)
  },
  
  // setup 用于在客户端初始化时执行代码
  setup() {
    // 确保只在浏览器环境中执行
    if (typeof window !== 'undefined') {
      // 添加 APlayer CSS 样式文件
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css'
      document.head.appendChild(link)
      
      // 在页面加载后添加播放器
      window.addEventListener('load', () => {
        const container = document.createElement('div')
        container.id = 'global-music-player'
        document.body.appendChild(container)
        
        // 添加点击事件监听器实现锁定功能
        document.addEventListener('click', function(e) {
          // 检查是否点击了 aplayer-miniswitcher 元素
          const target = e.target as Element;
          if (target.matches('.aplayer-miniswitcher') || target.closest('.aplayer-miniswitcher')) {
            const aplayerBody = document.querySelector('.aplayer-body')
            if (aplayerBody) {
              aplayerBody.classList.toggle('locked')
            }
          }
        })
      })
    }
  },
  
  // 可选的路由增强配置
  // router: (router) => {
  //   // 可以在这里添加路由守卫等逻辑
  // },
  
  // 可选的根组件配置
  // rootComponents: [
  //   // 可以在这里添加需要在根实例中使用的组件
  // ]
})