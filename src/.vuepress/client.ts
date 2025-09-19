import { defineClientConfig } from 'vuepress/client'
import GlobalMusicPlayer from './components/GlobalMusicPlayer.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('GlobalMusicPlayer', GlobalMusicPlayer)
  },
  setup() {
    if (typeof window !== 'undefined') {
      // 添加 APlayer CSS
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
})