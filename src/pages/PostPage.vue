<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { inject, onMounted, ref } from 'vue';
import { Post } from 'src/models/Post';
import { getPostById, getPostBySlug, getPostContent } from 'src/apis/postApi';
import { errorMsg } from 'src/utils/QuasarUtils';
import { getActualUrl, setDocumentTitle } from 'src/utils/Utils';
import { useQuasar } from 'quasar';
import { MdPreview, MdCatalog } from 'md-editor-v3';
import { PostContent } from 'src/models/PostContent';
import 'md-editor-v3/lib/style.css';
import { StoreEnum } from 'src/models/enum/StoreEnum';
import { MdPreviewThemeEnum } from 'src/models/enum/MdPreviewThemeEnum';

const $q = useQuasar();

const globalVars: GlobalVars = inject('globalVars')!!;

const route = useRoute();
const router = useRouter();

// 文章 ID
const postId = ref(-1);

// 文章别名
const postSlug = ref('');

// 文章
const post = ref<Post | null>(null);

// 文章内容
const postContent = ref<PostContent | null>(null);

const scrollElement = document.documentElement;

// Markdown 预览器主题
const mdPreviewTheme = ref<MdPreviewThemeEnum>(MdPreviewThemeEnum.Cyanosis);

// 文章密码输入框数据
const postPassword = ref('');

onMounted(() => {
  // 读取设置
  loadSetting();
  $q.loading.show();
  const id = route.query.id;
  const slug = route.query.s;
  if (id && !isNaN(Number(id))) {
    postId.value = Number(id);
    refreshPostById(postId.value);
  } else if (slug) {
    postSlug.value = slug.toString();
    refreshPostBySlug(postSlug.value);
  } else {
    // 跳回主页
    router.push({ path: '/' });
  }
});

/**
 * 读取设置
 */
const loadSetting = () => {
  let theme =
    localStorage.getItem(StoreEnum.MD_THEME) ?? MdPreviewThemeEnum.Cyanosis;
  if (
    !Object.values(MdPreviewThemeEnum).includes(theme as MdPreviewThemeEnum)
  ) {
    theme = MdPreviewThemeEnum.Cyanosis;
  }
  mdPreviewTheme.value = theme as MdPreviewThemeEnum;
};

/**
 * 根据文章 ID 刷新文章
 * @param id 文章 ID
 */
const refreshPostById = (id: number) => {
  getPostById(id)
    .then((res) => {
      post.value = res.data;
      setDocumentTitle(post.value?.title ?? '');
      if (!post.value?.encrypted) {
        // 文章没加密，获取文章内容
        refreshPostContent(id);
      } else {
        // 文章加密
        $q.loading.hide();
      }
    })
    .catch((err) => {
      errorMsg(err);
      $q.loading.hide();
      if (err.includes('404')) {
        router.push('404');
      }
    });
};

/**
 * 根据文章别名刷新文章
 * @param slug 文章别名
 */
const refreshPostBySlug = (slug: string) => {
  getPostBySlug(slug)
    .then((res) => {
      post.value = res.data;
      setDocumentTitle(post.value?.title ?? '');
      if (!post.value?.encrypted) {
        // 文章没加密，获取文章内容
        refreshPostContent(null, slug);
      } else {
        // 文章加密
        $q.loading.hide();
      }
    })
    .catch((err) => {
      errorMsg(err);
      $q.loading.hide();
      if (err.includes('404')) {
        router.push('404');
      }
    });
};

/**
 * 获取文章内容（ID 和别名至少提供一个）
 * @param id 文章 ID
 * @param slug 文章别名
 * @param password 密码（如果有）
 */
const refreshPostContent = (
  id?: number | null,
  slug?: string | null,
  password?: string | null
) => {
  getPostContent(id, slug, password)
    .then((res) => {
      postContent.value = res.data;
      $q.loading.hide();
    })
    .catch((err) => {
      errorMsg(err);
      $q.loading.hide();
    });
};

/**
 * 设置 Markdown 预览器主题
 * @param theme
 */
const setTheme = (theme: string) => {
  mdPreviewTheme.value = theme as MdPreviewThemeEnum;
  localStorage.setItem(StoreEnum.MD_THEME, theme);
};

/**
 * 确认文章密码按钮点击事件
 */
const onSubmitPasswordClick = () => {
  if (postPassword.value.length === 0) {
    errorMsg('请输入密码');
    return;
  }

  refreshPostContent(post.value?.postId, null, postPassword.value);
};
</script>

<template>
  <div class="container">
    <!-- 文章已加密 -->
    <div class="post-encrypted-div" v-if="post?.encrypted && !postContent">
      <q-card
        style="text-align: center"
        :flat="$q.dark.isActive"
        :bordered="$q.dark.isActive"
        @keydown.enter="onSubmitPasswordClick"
      >
        <q-card-section>
          <div class="text-h6">{{ post.title }}</div>
          <div>文章已加密，请输入密码</div>
          <div style="width: 250px; margin: 20px auto">
            <q-input
              outlined
              v-model="postPassword"
              label="文章密码"
              type="password"
            />
            <q-btn
              style="margin-top: 20px; width: 100%"
              :color="$q.dark.isActive ? 'dark' : 'primary'"
              label="确定"
              @click="onSubmitPasswordClick"
            />
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- 文章内容展示 -->
    <div
      class="md-div"
      v-if="postContent"
      :class="{ 'big-padding': !globalVars.isSmallWindow }"
    >
      <q-card
        class="post-card"
        :flat="$q.dark.isActive"
        :bordered="$q.dark.isActive"
      >
        <q-img
          v-if="postContent.post.cover || postContent.post.category?.cover"
          :src="
            getActualUrl(
              postContent.post.cover
                ? postContent.post.cover
                : postContent.post.category?.cover
                ? postContent.post.category.cover
                : ''
            )
          "
          height="30vh"
        >
          <div class="absolute-bottom text-h6">
            {{ postContent.post.title }}
          </div>
        </q-img>

        <!-- 没有封面图 -->
        <q-card-section v-else class="title-div text-center text-h5">
          {{ postContent.post.title }}
        </q-card-section>

        <q-card-section>
          <div class="switch-theme-div">
            <q-btn-dropdown
              class="switch-theme-btn"
              :color="$q.dark.isActive ? 'dark' : 'primary'"
              :label="`切换主题 (${mdPreviewTheme})`"
            >
              <q-list>
                <q-item
                  clickable
                  v-close-popup
                  v-for="(theme, index) in Object.values(MdPreviewThemeEnum)"
                  :key="index"
                  @click="setTheme(theme)"
                >
                  <q-item-section>
                    <q-item-label>{{ theme }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
          <MdPreview
            class="md-preview"
            editorId="post-preview"
            :modelValue="postContent.content"
            :previewTheme="mdPreviewTheme"
            :theme="$q.dark.isActive ? 'dark' : 'light'"
          />
        </q-card-section>
      </q-card>

      <div class="catalog-div" v-if="!globalVars.isSmallWindow">
        <q-card
          class="catalog-card"
          :flat="$q.dark.isActive"
          :bordered="$q.dark.isActive"
        >
          <q-card-section>
            <q-scroll-area style="height: 60vh; max-width: 100%">
              <MdCatalog
                editor-id="post-preview"
                :scroll-element="scrollElement"
              />
            </q-scroll-area>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.md-preview {
  max-width: 90vw;
}

.md-div {
  display: flex;

  .post-card {
    flex-grow: 1;
    width: 75%;
  }

  .catalog-div {
    width: 20vw;
    flex-grow: 1;
    margin-left: 10px;
  }

  .catalog-card {
    width: 20.5vw;
    position: fixed;
  }
}

.big-padding {
  padding: 40px;
}

.switch-theme-div {
  position: relative;
  height: 36px;
  margin-bottom: 10px;

  .switch-theme-btn {
    position: absolute;
    right: 0;
  }
}

.catalog-card {
  display: inline-block;
  align-self: start;
}

.title-div {
  padding: 40px 0 10px 0;
}
</style>
