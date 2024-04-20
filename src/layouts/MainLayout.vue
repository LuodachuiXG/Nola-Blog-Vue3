<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="text-white" :class="{ 'bg-dark': $q.dark.isActive }">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          {{ blogInfo?.title }} | {{ blogInfo?.subtitle }}
        </q-toolbar-title>
        <q-btn
          dense
          flat
          round
          :icon="
            $q.dark.mode === 'auto'
              ? 'computer'
              : $q.dark.mode
              ? 'dark_mode'
              : 'light_mode'
          "
          @click="toggleDarkMode"
        />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-scroll-area style="height: calc(100% - 160px); margin-top: 160px">
        <q-list padding>
          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="inbox" />
            </q-item-section>

            <q-item-section> Inbox</q-item-section>
          </q-item>

          <q-item active clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="star" />
            </q-item-section>

            <q-item-section> Star</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="send" />
            </q-item-section>

            <q-item-section> Send</q-item-section>
          </q-item>

          <q-item clickable v-ripple>
            <q-item-section avatar>
              <q-icon name="drafts" />
            </q-item-section>

            <q-item-section> Drafts</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        :src="blogger?.avatar ? baseUrl + blogger.avatar : 'https://cdn.quasar.dev/img/material.png'"
        style="height: 160px;"
      >
        <div class="blogger-div">
          <div class="absolute-bottom bg-transparent" style="bottom: 15px;left: 15px">
            <div>
              <q-avatar size="56px" class="q-mb-sm">
                <img
                  style="object-fit: cover"
                  :src="blogger?.avatar ? baseUrl + blogger.avatar : ''"
                  :alt="blogger?.displayName"
                />
              </q-avatar>
              <div class="text-weight-bold">{{ blogger?.displayName }}</div>
              <div v-if="blogger?.email">{{ blogger?.email }}</div>
              <div v-if="blogger?.description" class="description text-caption">
                {{ blogger?.description }}
              </div>
            </div>
          </div>
        </div>
      </q-img>
    </q-drawer>

<!--    <q-footer class="text-white" :class="{ 'bg-dark': $q.dark.isActive }">-->
<!--      ©我不是罗大锤-->
<!--    </q-footer>-->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { StoreEnum } from 'src/models/enum/StoreEnum';
import { getBlogInfo } from 'src/apis/configApi';
import { errorMsg, notifyC } from 'src/utils/QuasarUtils';
import { BlogInfo } from 'src/models/BlogInfo';
import { updateFavicon } from 'src/utils/Utils';
import { getBlogger } from 'src/apis/bloggerApi';
import { Blogger } from 'src/models/Blogger';

const $q = useQuasar();

// 请求基地址
const baseUrl = import.meta.env.VITE_BASE_URL;

// 左侧抽屉是否展示
const leftDrawerOpen = ref(true);

// 博客信息
const blogInfo = ref<BlogInfo | null>(null);
// 博主信息
const blogger = ref<Blogger | null>(null);

onMounted(() => {
  // 读取设置
  loadSetting();
  // 初始化博客信息
  initBlogInfo();
  // 初始化博主信息
  initBlogger();
  console.log(baseUrl);
});

/**
 * 初始化博客信息
 */
const initBlogInfo = () => {
  getBlogInfo()
    .then((res) => {
      blogInfo.value = res.data as BlogInfo;
      if (blogInfo.value === null || blogInfo.value.blogger === null) {
        // 博客或者博主尚未初始化，跳转后台页面
        window.location.href = '/console';
        return;
      }
      window.document.title =
        blogInfo.value.title + ' | ' + blogInfo.value.subtitle;
      // 修改网页图标
      if (blogInfo.value.logo) {
        updateFavicon(blogInfo.value.logo);
      }
    })
    .catch((err) => {
      errorMsg(err);
    });
};

/**
 * 初始化博主信息
 */
const initBlogger = () => {
  getBlogger()
    .then((res) => {
      blogger.value = res.data;
      console.log(blogger.value);
    })
    .catch((err) => {
      errorMsg(err);
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

<style scoped>
.blogger-div {
  backdrop-filter: blur(2px);
  width: 100%;
  height: 100%;
  .description {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
  }
}


</style>
