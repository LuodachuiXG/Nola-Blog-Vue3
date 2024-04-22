<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { StoreEnum } from 'src/models/enum/StoreEnum';
import { getBlogInfo } from 'src/apis/configApi';
import { errorMsg, notifyC } from 'src/utils/QuasarUtils';
import { BlogInfo } from 'src/models/BlogInfo';
import { getActualUrl, updateFavicon } from 'src/utils/Utils';
import { getBlogger } from 'src/apis/bloggerApi';
import { Blogger } from 'src/models/Blogger';
import { getMenus } from 'src/apis/menuApi';
import { Menu } from 'src/models/Menu';
import { useRoute, useRouter } from 'vue-router';
import { useBlogInfoStore } from 'stores/example-store';
import {
  MenuTargetEnum,
  MenuTargetValueEnum,
} from 'src/models/enum/MenuTargetEnum';

const $q = useQuasar();
const blogInfoStore = useBlogInfoStore();

const router = useRouter();
const route = useRoute();

// 左侧抽屉是否展示
const leftDrawerOpen = ref(false);

// 博客信息
const blogInfo = ref<BlogInfo | null>(null);
// 博主信息
const blogger = ref<Blogger | null>(null);
// 菜单项
const menus = ref<Array<Menu>>([]);

// 当前选择的菜单项
const currentMenuIndex = ref(-1);

// 加载完成的个数
const loadedCount = ref(0);

onMounted(() => {
  $q.loading.show();
  const isLoaded = watch(() => loadedCount.value, () => {
    console.log(loadedCount.value);
    if (loadedCount.value >= 3) {
      $q.loading.hide();
      // 结束监听
      isLoaded();
    }
  })
  // 读取设置
  loadSetting();
  // 初始化博客信息
  initBlogInfo();
  // 初始化博主信息
  initBlogger();
  // 初始化菜单项
  initMenus();
});

/**
 * 初始化博客信息
 */
const initBlogInfo = () => {
  getBlogInfo()
    .then((res) => {
      blogInfo.value = res.data as BlogInfo;
      blogInfoStore.setBlogInfo(blogInfo.value);
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
      loadedCount.value++;
    })
    .catch((err) => {
      errorMsg(err);
      $q.loading.hide();
    });
};

/**
 * 初始化博主信息
 */
const initBlogger = () => {
  getBlogger()
    .then((res) => {
      blogger.value = res.data;
      loadedCount.value++;
    })
    .catch((err) => {
      errorMsg(err);
      $q.loading.hide();
    });
};

/**
 * 初始化菜单项
 */
const initMenus = () => {
  getMenus()
    .then((res) => {
      menus.value = res.data;

      // 判断当前是否直接使用链接跳转到了某个页面
      const path = route.path.replaceAll('/', '');
      menus.value.forEach((menu, index) => {
        if (menu.href?.replaceAll('/', '') === path) {
          // 设置当前菜单为选中菜单
          currentMenuIndex.value = index;
          return;
        }
      });
      loadedCount.value++;
    })
    .catch((err) => {
      errorMsg(err);
      $q.loading.hide();
    });
};

/**
 * 读取设置
 */
const loadSetting = () => {
  // 暗色模式
  const darkMode = localStorage.getItem(StoreEnum.DARK_MODE);
  // 暗色模式默认跟随系统
  if (!darkMode) return $q.dark.set('auto');
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
      notifyC('跟随系统', 'dark');
    } else {
      notifyC('跟随系统', 'primary');
    }
    localStorage.setItem(StoreEnum.DARK_MODE, 'auto');
    return;
  }
  $q.dark.set(false);
  localStorage.setItem(StoreEnum.DARK_MODE, 'false');
  notifyC('亮色模式', 'primary');
};

/**
 * 菜单项点击
 * @param index 菜单项索引
 * @param menu 菜单接口
 */
const onMenuItemClick = (index: number, menu: Menu) => {
  currentMenuIndex.value = index;

  if (!menu.href) return;

  if (menu.target !== MenuTargetEnum.SELF || menu.href.includes('http')) {
    // 在新的页面打开网页，并设置打开方式
    window.open(menu.href, MenuTargetValueEnum[menu.target]);
  } else {
    // 在当前页打开
    router.push({
      path: menu.href,
    });
  }
};

/**
 * 网站标题点击事件
 */
const onTitleClick = () => {
  router.push('/');
};
</script>

<template>
  <q-layout view="hHh lpr lFf">
    <q-header class="text-white" :class="{ 'bg-dark': $q.dark.isActive }">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title @click="onTitleClick" class="pointer">
          <span class="title">{{ blogInfo?.title }} | {{ blogInfo?.subtitle }}</span>
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
          <q-item
            clickable
            v-ripple
            v-for="(menu, index) in menus"
            :key="index"
            :active="index === currentMenuIndex"
            @click="onMenuItemClick(index, menu)"
          >
            <q-item-section avatar>
              <q-icon name="menu" />
            </q-item-section>

            <q-item-section>{{ menu.displayName }}</q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>

      <q-img
        class="absolute-top"
        :src="
          blogger?.avatar
            ? getActualUrl(blogger.avatar)
            : 'https://cdn.quasar.dev/img/material.png'
        "
        style="height: 160px"
      >
        <div class="blogger-div">
          <div
            class="absolute-bottom bg-transparent"
            style="bottom: 15px; left: 15px"
          >
            <div>
              <q-avatar size="56px" class="q-mb-sm">
                <img
                  style="object-fit: cover"
                  :src="blogger?.avatar ? getActualUrl(blogger.avatar) : ''"
                  :alt="blogger?.displayName"
                />
              </q-avatar>
              <div class="text-weight-bold">{{ blogger?.displayName }}</div>
              <div v-if="blogger?.email">
                <a class="text-white" :href="'mailto:' + blogger?.email">{{
                  blogger?.email
                }}</a>
              </div>
              <div v-if="blogger?.description" class="description text-caption">
                {{ blogger?.description }}
              </div>
            </div>
          </div>
        </div>
      </q-img>
    </q-drawer>

    <q-footer class="text-white" :class="{ 'bg-dark': $q.dark.isActive }">
      <div class="footer-div">
        © {{ new Date().getFullYear() }}
        <span class="text-bold" v-if="blogInfo"
          >{{ blogInfo.title }} | {{ blogInfo.subtitle }}</span
        >
        <span class="powered-by-span">
          Powered by
          <a
            class="text-white text-bold text-italic"
            href="https://github.com/LuodachuiXG/Nola"
            target="_blank"
          >
            Nola
          </a>
        </span>
      </div>
    </q-footer>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.title {
  transition: all .3s ease-in-out;
}

.title:hover {
  text-shadow: 0 0 6px #FFFFFF;
}

.blogger-div {
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  width: 100%;
  height: 100%;

  .description {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -o-text-overflow: ellipsis;
  }
}

a {
  text-decoration: none;
}

.footer-div {
  padding: 5px 20px;
  position: relative;
}

.powered-by-span {
  position: absolute;
  right: 20px;
}
</style>
