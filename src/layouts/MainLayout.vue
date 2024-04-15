<template>
  <q-layout view="hHh lpR fFf">

    <q-header class="text-white" :class="{'bg-dark': $q.dark.isActive}">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ blogInfo?.title }} | {{ blogInfo?.subtitle }}
        </q-toolbar-title>
        <q-btn dense flat round
               :icon="$q.dark.mode === 'auto' ? 'computer' : ($q.dark.mode ? 'dark_mode' : 'light_mode')"
               @click="toggleDarkMode" />
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-drawer v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { StoreEnum } from 'src/models/enum/StoreEnum';
import { getBlogInfo } from 'src/apis/config';
import { notifyC, notifyT } from 'src/utils/QuasarUtils';
import { BlogInfo } from 'src/models/BlogInfo';
import { updateFavicon } from 'src/utils/Utils';

const $q = useQuasar();

// 左侧抽屉是否展示
const leftDrawerOpen = ref(false);
// 右侧抽屉是否展示
const rightDrawerOpen = ref(false);

// 博客信息
const blogInfo = ref<BlogInfo | null>(null);

onMounted(() => {
  // 读取设置
  loadSetting();
  // 初始化博客信息
  initBlogInfo();
});

/**
 * 初始化博客信息
 */
const initBlogInfo = () => {
  getBlogInfo().then((res) => {
    blogInfo.value = res.data as BlogInfo;
    if (blogInfo.value === null || blogInfo.value.blogger === null) {
      // 博客或者博主尚未初始化，跳转后台页面
      window.location.href = '/console';
      return;
    }
    window.document.title = blogInfo.value.title + ' | ' + blogInfo.value.subtitle;
    // 修改网页图标
    if (blogInfo.value.logo) {
      updateFavicon(blogInfo.value.logo);
    }
  }).catch((err) => {
    notifyT(err.errMsg, 'negative');
  });
};

/**
 * 读取设置
 */
const loadSetting = () => {
  // 暗色模式
  const darkMode = localStorage.getItem(StoreEnum.DARK_MODE);
  if (darkMode === 'true') {
    $q.dark.set(true);
  } else if (darkMode === 'auto') {
    $q.dark.set('auto');
  } else {
    $q.dark.set(false);
  }
};

/**
 * 左侧抽屉触发
 */
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

/**
 * 右侧抽屉触发
 */
const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value;
};

/**
 * 切换暗色模式
 */
const toggleDarkMode = () => {
  if ($q.dark.mode === false) {
    $q.dark.set(true);
    notifyC('暗色模式', 'dark');
    localStorage.setItem(StoreEnum.DARK_MODE, 'true');
    return;
  }
  if ($q.dark.mode === true) {
    $q.dark.set('auto');
    if ($q.dark.isActive) {
      notifyC('根据系统', 'dark');
    } else {
      notifyC('根据系统', 'primary');
    }
    localStorage.setItem(StoreEnum.DARK_MODE, 'auto');
    return;
  }
  $q.dark.set(false);
  localStorage.setItem(StoreEnum.DARK_MODE, 'false');
  notifyC('亮色模式', 'primary');
};
</script>
