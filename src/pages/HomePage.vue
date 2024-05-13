<script setup lang="ts">
import { getPosts } from 'src/apis/postApi';
import { Pager } from 'src/models/Pager';
import { Post } from 'src/models/Post';
import { errorMsg } from 'src/utils/QuasarUtils';
import { onMounted, ref } from 'vue';
import PostCard from 'components/PostCard.vue';
import { Category } from 'src/models/Category';
import { Tag } from 'src/models/Tag';
import { useRoute, useRouter } from 'vue-router';
import { isNumber } from 'src/utils/Utils';
import { useQuasar } from 'quasar';

const router = useRouter();
const route = useRoute();

const $q = useQuasar();

// 总文章数
const totalPost = ref(0);
// 总页数
const totalPage = ref(0);
// 当前页码
const currentPage = ref(1);
// 每页大小
const pageSize = ref(10);

// 关键字检索
const key = ref<string | undefined>(undefined);
// 标签 ID 检索
const tagId = ref<number | undefined>(undefined);
// 分类 ID 检索
const categoryId = ref<number | undefined>(undefined);
// 标签名或别名检索
const tag = ref<string | undefined>(undefined);
// 分类名或别名检索
const category = ref<string | undefined>(undefined);


// 文章列表
const posts = ref<Array<Post>>([]);

onMounted(() => {
  initUrlParam();
  refreshPost();
});

/**
 * 初始化 URL 参数
 */
const initUrlParam = () => {
  // 关键字检索
  if (route.query.key) {
    key.value = String(route.query.key);
  }
  // 标签 ID 检索
  const tId = route.query.tid;
  if (tId && isNumber(String(tId))) {
    tagId.value = Number(tId);
  }
  // 分类 ID 检索
  const cId = route.query.cid;
  if (cId && isNumber(String(cId))) {
    categoryId.value = Number(cId);
  }
  // 标签名或别名检索
  if (route.query.t) {
    tag.value = String(route.query.t);
  }
  // 分类名或别名检索
  if (route.query.c) {
    category.value = String(route.query.c);
  }
};

/**
 * 刷新文章
 */
const refreshPost = () => {
  $q.loadingBar.start();
  $q.loading.show();
  getPosts(
    currentPage.value,
    pageSize.value,
    key.value,
    tagId.value,
    categoryId.value,
    tag.value,
    category.value
  )
    .then((res) => {
      const pager = res.data as Pager<Post>;
      currentPage.value = pager.page;
      pageSize.value = pager.size;
      totalPost.value = pager.totalData;
      totalPage.value = pager.totalPages;
      posts.value = pager.data;
      $q.loadingBar.stop();
      $q.loading.hide();
    })
    .catch((err) => {
      errorMsg(err);
      $q.loadingBar.stop();
      $q.loading.hide();
    });
};

/**
 * 文章点击事件
 * @param post 文章
 */
const onPostClick = (post: Post) => {
  router.push({
    path: 'post',
    query: {
      s: post.slug,
    },
  });
};

/**
 * 分类点击事件
 * @param c 分类
 */
const onCategoryClick = (c: Category) => {
  category.value = c.displayName;
  refreshPost();
};

/**
 * 标签点击事件
 * @param t 标签
 */
const onTagClick = (t: Tag) => {
  tag.value = t.displayName;
  refreshPost();
};

/**
 * 清除检索条件
 */
const onSearchClear = () => {
  key.value = undefined;
  tagId.value = undefined;
  categoryId.value = undefined;
  tag.value = undefined;
  category.value = undefined;
  refreshPost();
  router.push({
    path: '/',
  });
};

/**
 * 页码改变事件
 * @param value 页码
 */
const onPageChange = (value: number) => {
  currentPage.value = value;
  refreshPost();
};
</script>
<template>
  <div class="container">
    <!-- 用于显示当前检索的项 -->
    <div
      class="search-div q-pa-md row items-start q-gutter-sm"
      v-if="key || tagId || categoryId || tag || category"
    >
      <q-chip
        v-if="key"
        square
        removable
        color="orange"
        text-color="white"
        icon="key"
        @remove="onSearchClear"
      >
        <span class="text-bold q-mr-xs">{{ key }}</span>
      </q-chip>
      <q-chip
        v-if="tagId"
        square
        removable
        color="primary"
        text-color="white"
        icon="bookmark"
        @remove="onSearchClear"
      >
        <span class="text-bold q-mr-xs">ID: {{ tagId }}</span>
      </q-chip>

      <q-chip v-if="categoryId" square removable @remove="onSearchClear">
        <q-avatar icon="book" color="primary" text-color="white" />
        <span class="text-bold q-ml-xs q-mr-xs"> ID: {{ categoryId }} </span>
      </q-chip>
      <q-chip
        v-if="tag"
        square
        removable
        color="primary"
        text-color="white"
        icon="bookmark"
        @remove="onSearchClear"
      >
        <span class="text-bold q-mr-xs">
          {{ tag }}
        </span>
      </q-chip>

      <q-chip v-if="category" square removable @remove="onSearchClear">
        <q-avatar icon="book" color="primary" text-color="white" />
        <span class="text-bold q-ml-xs q-mr-xs">
          {{ category }}
        </span>
      </q-chip>
    </div>

    <div class="q-pa-md" v-if="posts.length === 0 && !$q.loading.isActive">
      <q-banner rounded class="bg-orange text-white"> 暂无文章 </q-banner>
    </div>

    <q-scroll-area style="height: 100%; width: 100%" v-else>
      <div class="q-pa-md row items-start q-gutter-md">
        <post-card
          v-for="(post, index) in posts"
          :post="post"
          :key="index"
          @on-post-click="onPostClick"
          @on-tag-click="onTagClick"
          @on-category-click="onCategoryClick"
        />
      </div>

      <div class="pagination-div">
        <q-pagination
          v-if="posts.length > 0 && !$q.loading.isActive"
          v-model="currentPage"
          :max="totalPage"
          direction-links
          flat
          color="grey"
          active-color="primary"
          @update:model-value="onPageChange"
        />
      </div>
    </q-scroll-area>
  </div>
</template>
<style scoped>
.container {
  height: 100%;
}

.search-div {
  padding-bottom: 0;
}

.pagination-div {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
</style>
