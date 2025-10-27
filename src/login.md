---
title: 登录
pageLayout: raw

navbar: false
sidebar: false

breadcrumb: false
pageInfo: false
contributors: false
editLink: false
lastUpdated: false
prev: false
next: false
comment: false
footer: false

backtotop: false
---

<style>
/* 修复登录页面居中问题 */
/* .login-wrapper {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 200px);
  padding: 50px 0 !important;
  width: 100%;
} */

/* 确保在有页面信息时也能居中 */
.page-content {
  width: 100%;
  display: flex;
  justify-content: center;
}

/* 覆盖主题默认样式，确保无侧边栏时也能正确居中 */
.theme-container.no-sidebar .vp-page {
  padding-inline: 0 !important;
}
</style>

<div class="login-wrapper">
  <div class="page-content">
    <ClientOnly>
      <Login />
    </ClientOnly>
  </div>
</div>