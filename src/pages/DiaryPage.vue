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
import { Diary } from 'src/models/Diary';
import { getDiaries } from 'src/apis/diaryApi';
import DiaryCard from 'components/DiaryCard.vue';

const router = useRouter();
const route = useRoute();

const $q = useQuasar();

// 总日志数
const totalDiary = ref(0);
// 总页数
const totalPage = ref(0);
// 当前页码
const currentPage = ref(1);
// 每页大小
const pageSize = ref(10);

// 日志列表
const diaries = ref<Array<Diary>>([]);

onMounted(() => {
  refreshDiary();
});

/**
 * 刷新日志
 */
const refreshDiary = () => {
  $q.loadingBar.start();
  $q.loading.show();
  getDiaries(currentPage.value, pageSize.value)
    .then((res) => {
      const pager = res.data as Pager<Diary>;
      currentPage.value = pager.page;
      pageSize.value = pager.size;
      totalDiary.value = pager.totalData;
      totalPage.value = pager.totalPages;
      diaries.value = pager.data;
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
  refreshDiary();
};
</script>
<template>
  <div class="container">
    <div class="q-pa-md" v-if="diaries.length === 0 && !$q.loading.isActive">
      <q-banner rounded class="bg-orange text-white">暂无日志</q-banner>
    </div>

    <q-scroll-area style="height: 100%; width: 100%" v-else>
      <div class="q-pa-md row items-start q-gutter-md">
        <diary-card
          v-for="(diary, index) in diaries"
          :diary="diary"
          :key="index"
        />
      </div>

      <div class="pagination-div">
        <q-pagination
          v-if="diaries.length > 0 && !$q.loading.isActive"
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

.pagination-div {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}
</style>
