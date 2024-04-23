<script setup lang="ts">
import { getPosts } from 'src/apis/postApi';
import { Pager } from 'src/models/Pager';
import { Post } from 'src/models/Post';
import { errorMsg } from 'src/utils/QuasarUtils';
import { inject, onMounted, ref } from 'vue';
import PostCard from 'components/PostCard.vue';
import { Category } from 'src/models/Category';
import { Tag } from 'src/models/Tag';
import { useRouter } from 'vue-router';

const router = useRouter();

// 总文章数
const totalPost = ref(0);
// 总页数
const totalPage = ref(0);
// 当前页码
const currentPage = ref(1);
// 每页大小
const pageSize = ref(10);

// 文章列表
const posts = ref<Array<Post>>([]);

onMounted(() => {
  refreshPost();
});

/**
 * 刷新文章
 */
const refreshPost = () => {
  getPosts(currentPage.value, pageSize.value)
    .then((res) => {
      const pager = res.data as Pager<Post>;
      currentPage.value = pager.page;
      pageSize.value = pager.size;
      totalPost.value = pager.totalData;
      totalPage.value = pager.totalPages;
      posts.value = pager.data;
    })
    .catch((err) => errorMsg(err));
};

/**
 * 文章点击事件
 * @param post 文章
 */
const onPostClick = (post: Post) => {
  router.push({
    path: 'post',
    query: {
      slug: post.slug,
    },
  });
};

/**
 * 分类点击事件
 * @param category 分类
 */
const onCategoryClick = (category: Category) => {};

/**
 * 标签点击事件
 * @param tag 标签
 */
const onTagClick = (tag: Tag) => {};
</script>
<template>
  <div class="container">
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
  </div>
</template>
<style scoped></style>
