<template>
  <div id="xgplayer" class="music-bar"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import Player from 'xgplayer'

onMounted(() => {
  new Player({
    id: 'xgplayer',
    url: 'https://img.starrycognition.cn/Music/%E5%A4%AA%E7%A9%BA%E6%BC%AB%E6%AD%A5%20(Kirara%20Magic%20Remix).mp3',
    poster: '/assets/images/cover2.jpg',   // 用你已有的封面
    width: '100%',
    height: 80,
    videoInit: false,   // 音频模式
    autoplay: false,
    loop: true,
    lang: 'zh-cn',
    theme: '#b7daff'
  })
})
</script>

<style scoped>
.music-bar {
  margin: 2rem auto;
  max-width: 600px;
  border-radius: 8px;
  overflow: hidden;
}
</style>