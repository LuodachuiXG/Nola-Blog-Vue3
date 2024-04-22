<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { onMounted, ref } from 'vue';
import { Post } from 'src/models/Post';
import { getPostById, getPostBySlug } from 'src/apis/postApi';
import { errorMsg } from 'src/utils/QuasarUtils';
import { setDocumentTitle } from 'src/utils/Utils';
import { useQuasar } from 'quasar';

const $q = useQuasar();

const route = useRoute();
const router = useRouter();
// 文章 ID
const postId = ref(-1);

// 文章别名
const postSlug = ref('');

// 文章
const post = ref<Post | null>(null);
onMounted(() => {
  $q.loading.show();
  const id = route.query.id;
  const slug = route.query.slug;
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
 * 根据文章 ID 刷新文章
 * @param id 文章 ID
 */
const refreshPostById = (id: number) => {
  getPostById(id)
    .then((res) => {
      post.value = res.data;
      setDocumentTitle(post.value?.title ?? '');
      $q.loading.hide();
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
      $q.loading.hide();
    })
    .catch((err) => {
      errorMsg(err);
      $q.loading.hide();
      if (err.includes('404')) {
        router.push('404');
      }
    });
};
</script>

<template>
  <div class="container"></div>
</template>

<style scoped></style>
