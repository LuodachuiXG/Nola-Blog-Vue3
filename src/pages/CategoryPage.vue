<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Category } from 'src/models/Category';
import { getCategory } from 'src/apis/categoryApi';
import { errorMsg } from 'src/utils/QuasarUtils';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const $q = useQuasar();

const router = useRouter();

// 分类列表
const categories = ref<Array<Category>>([]);
// 当前页码
const currentPage = ref(1);
// 每页条数
const pageSize = ref(30);
// 总分类数量
const totalCategory = ref(0);
// 总页数
const totalPage = ref(0);

onMounted(() => {
  // 获取分类
  refreshCategory();
});

/**
 * 获取分类
 */
const refreshCategory = () => {
  $q.loadingBar.start();
  $q.loading.show();
  getCategory(currentPage.value, pageSize.value)
    .then((res) => {
      currentPage.value = res.data.page;
      pageSize.value = res.data.size;
      totalCategory.value = res.data.totalData;
      totalPage.value = res.data.totalPages;
      categories.value = res.data.data;
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
  refreshCategory();
};

/**
 * 分类点击事件
 * @param category
 */
const onCategoryClick = (category: Category) => {
  router.push({
    path: '/',
    query: {
      c: category.displayName,
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
          v-for="(category, index) in categories"
          :key="index"
          clickable
          @click="onCategoryClick(category)"
        >
          <q-avatar icon="book" color="primary" text-color="white" />
          <span>
            <span class="text-bold q-ml-xs">{{ category.displayName }}</span>
            <span class="text-primary q-ml-xs text-bold"
              >({{ category.postCount }})</span
            >
          </span>
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
