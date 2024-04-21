<script setup lang="ts">
import { getPosts } from 'src/apis/postApi';
import { Pager } from 'src/models/Pager';
import { Post } from 'src/models/Post';
import { errorMsg } from 'src/utils/QuasarUtils';
import { onMounted, ref } from 'vue';

const baseUrl = import.meta.env.VITE_BASE_URL;

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
      console.log(posts.value);
    })
    .catch((err) => errorMsg(err));
};
</script>
<template>
  <div class="container">
    <div class="q-pa-md row items-start q-gutter-md">
      <q-card
        class="post-card"
        flat
        bordered
        v-for="(post, index) in posts"
        :key="index"
        style="width: 240px; height: 350px"
      >
        <q-img
          class="pointer post-cover"
          v-if="post.cover"
          :src="baseUrl + post.cover"
          style="height: 200px"
          fit="cover"
        />

        <q-card-section>
          <div class="text-h6 q-mb-xs pointer">{{ post.title }}</div>
          <div class="text-caption text-grey">
            {{ post.excerpt }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>
<style scoped>
.post-card:hover .post-cover:deep(img) {
  transform: scale(1.05) rotate(1deg);
  filter: brightness(1.1);
}

.post-cover:deep(img) {
  transition: all 0.6s ease;
}
</style>
