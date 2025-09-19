<template>
  <!-- 左下角长条 -->
  <div class="music-bar" @click="togglePanel">
    <icon icon="mdi-play-circle" width="20" />
    <span class="title">{{ current.name }}</span>
  </div>

  <!-- 展开面板 -->
  <Teleport to="body">
    <div v-if="showPanel" class="music-panel" @click.self="togglePanel">
      <div class="panel-content">
        <header>
          <icon icon="mdi-music" width="24" />
          <span>音乐播放器</span>
          <icon icon="mdi-close" width="24" class="close" @click="togglePanel" />
        </header>

        <div class="cover">
          <img :src="current.cover" alt="cover" />
        </div>

        <div class="info">
          <div class="name">{{ current.name }}</div>
          <div class="artist">{{ current.artist }}</div>
        </div>

        <div class="controls">
          <icon icon="mdi-skip-previous" width="28" @click="prev" />
          <icon :icon="playing ? 'mdi-pause-circle' : 'mdi-play-circle'" width="40" @click="togglePlay" />
          <icon icon="mdi-skip-next" width="28" @click="next" />
        </div>

        <div class="progress">
          <span>{{ formatTime(currentTime) }}</span>
          <input type="range" min="0" :max="duration" v-model.number="currentTime" @input="seek" />
          <span>{{ formatTime(duration) }}</span>
        </div>

        <div class="list">
          <div v-for="(song, idx) in playlist" :key="idx" :class="{ active: idx === index }" @click="select(idx)">
            <icon icon="mdi-music-note" width="16" />
            <span>{{ song.name }} - {{ song.artist }}</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Icon } from '@iconify/vue'

// ===== 数据 =====
interface Song {
  name: string
  artist: string
  url: string
  cover: string
}
const playlist: Song[] = [
  {
    name: '太空漫步Remix',
    artist: 'miHoyo-Mix',
    url: 'https://img.starrycognition.cn/Music/%E5%A4%AA%E7%A9%BA%E6%BC%AB%E6%AD%A5%20(Kirara%20Magic%20Remix).mp3',
    cover: 'https://img.starrycognition.cn/%E5%A4%B4%E5%83%8F/StarryCognet%E9%80%9A%E7%94%A8%E5%A4%B4%E5%83%8F(%E5%B0%8F).png'
  },
  {
    name: '太空漫步Remix(高音质)',
    artist: 'miHoyo-Mix',
    url: 'https://img.starrycognition.cn/Music/%E5%A4%AA%E7%A9%BA%E6%BC%AB%E6%AD%A5%20(Kirara%20Magic%20Remix).wav',
    cover: 'https://img.starrycognition.cn/%E5%A4%B4%E5%83%8F/StarryCognet%E9%80%9A%E7%94%A8%E5%A4%B4%E5%83%8F(%E5%B0%8F).png'
  }
]

const index = ref(0)
const current = ref<Song>(playlist[index.value])
const audio = ref<HTMLAudioElement>()
const playing = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const showPanel = ref(false)

// ===== 逻辑 =====
const togglePlay = () => {
  if (!audio.value) return
  playing.value ? audio.value.pause() : audio.value.play()
}

const togglePanel = () => {
  showPanel.value = !showPanel.value
}

const prev = () => {
  index.value = (index.value - 1 + playlist.length) % playlist.length
  load()
}

const next = () => {
  index.value = (index.value + 1) % playlist.length
  load()
}

const select = (idx: number) => {
  index.value = idx
  load()
}

const load = () => {
  current.value = playlist[index.value]
  if (audio.value) {
    audio.value.pause()
    audio.value.src = current.value.url
    audio.value.load()
    if (playing.value) audio.value.play()
  }
}

const seek = () => {
  if (audio.value) audio.value.currentTime = currentTime.value
}

const formatTime = (sec: number) => {
  const m = Math.floor(sec / 60).toString().padStart(2, '0')
  const s = Math.floor(sec % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

onMounted(() => {
  audio.value = new Audio(current.value.url)
  audio.value.addEventListener('loadedmetadata', () => {
    duration.value = audio.value!.duration
  })
  audio.value.addEventListener('timeupdate', () => {
    currentTime.value = audio.value!.currentTime
  })
  audio.value.addEventListener('ended', next)
})
</script>

<style scoped>
/* 左下角长条 */
.music-bar {
  position: fixed;
  left: 16px;
  bottom: 16px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  height: 36px;
  border-radius: 18px;
  background: var(--vp-c-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  font-size: 14px;
  color: var(--vp-c-text-1);
  transition: background 0.2s;
}

.music-bar:hover {
  background: var(--vp-c-bg-soft);
}

.music-bar .title {
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 展开面板 */
.music-panel {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-content {
  width: 90%;
  max-width: 400px;
  background: var(--vp-c-bg);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.panel-content header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-weight: 600;
}

.panel-content header .close {
  margin-left: auto;
  cursor: pointer;
}

.panel-content .cover img {
  width: 100%;
  border-radius: 8px;
}

.panel-content .info {
  text-align: center;
  margin: 12px 0;
}

.panel-content .name {
  font-size: 18px;
  font-weight: 600;
}

.panel-content .artist {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.panel-content .controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin: 16px 0;
  cursor: pointer;
}

.panel-content .progress {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.panel-content .progress input {
  flex: 1;
}

.panel-content .list {
  max-height: 200px;
  overflow-y: auto;
  margin-top: 16px;
}

.panel-content .list>div {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  cursor: pointer;
}

.panel-content .list>div:hover,
.panel-content .list>div.active {
  background: var(--vp-c-bg-soft);
}
</style>