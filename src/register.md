---
title: 注册
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
/* 修复注册页面居中问题 */
main {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: calc(100vh - 200px);
  padding: 50px 0 !important;
}
</style>

<ClientOnly>
  <Register />
</ClientOnly>