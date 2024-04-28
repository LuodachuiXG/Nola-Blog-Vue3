<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Tag } from 'src/models/Tag';
import { errorMsg } from 'src/utils/QuasarUtils';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import {  getTags } from 'src/apis/tagApi';

const $q = useQuasar();

const router = useRouter();

// 标签列表
const tags = ref<Array<Tag>>([]);
// 当前页码
const currentPage = ref(1);
// 每页条数
const pageSize = ref(30);
// 总标签数量
const totalTag = ref(0);
// 总页数
const totalPage = ref(0);

onMounted(() => {
  // 获取标签
  refreshTag();
});

/**
 * 获取标签
 */
const refreshTag = () => {
  $q.loadingBar.start();
  $q.loading.show();
  getTags(currentPage.value, pageSize.value)
    .then((res) => {
      currentPage.value = res.data.page;
      pageSize.value = res.data.size;
      totalTag.value = res.data.totalData;
      totalPage.value = res.data.totalPages;
      tags.value = res.data.data;
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
 * 页码改变事件
 * @param value 页码
 */
const onPageChange = (value: number) => {
  currentPage.value = value;
  refreshTag();
};

/**
 * 标签点击事件
 * @param tag
 */
const onTagClick = (tag: Tag) => {
  router.push({
    path: '/',
    query: {
      t: tag.displayName,
    },
  });
};
</script>

<template>
  <div class="container">
    <q-scroll-area style="height: 100%; width: 100%">
      <div class="q-pa-md row items-start q-gutter-sm">
        <q-chip
          class="pointer non-selectable"
          square
          color="primary"
          text-color="white"
          icon="bookmark"
          v-for="(tag, index) in tags"
          :key="index"
          clickable
          @click="onTagClick(tag)"
        >
          <span class="text-bold">{{ tag.displayName }}</span>
          <span class="text-bold q-ml-xs text-orange"
            >({{ tag.postCount }})</span
          >
        </q-chip>
      </div>
      <div class="pagination-div">
        <q-pagination
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
  height: 87vh;
}

.pagination-div {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
</style>
