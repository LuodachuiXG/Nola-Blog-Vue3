<script setup lang="ts">
import { Link } from 'src/models/Link';
import { onMounted, ref } from 'vue';
import { getLinks } from 'src/apis/linkApi';
import { errorMsg } from 'src/utils/QuasarUtils';
import { useQuasar } from 'quasar';
import PostCard from 'components/PostCard.vue';
import LinkCard from 'components/LinkCard.vue';

const $q = useQuasar();

// 当前页
const currentPage = ref(1);
// 每页条数
const pageSize = ref(10);
// 总链接数
const totalLinks = ref(0);
// 总页数
const totalPages = ref(0);
const links = ref<Array<Link>>([]);

onMounted(() => {
  refreshLinks();
});

/**
 * 获取友情链接
 */
const refreshLinks = () => {
  $q.loading.show();
  $q.loadingBar.start();
  getLinks(currentPage.value, pageSize.value)
    .then((res) => {
      totalPages.value = res.data.totalPages;
      totalLinks.value = res.data.totalData;
      currentPage.value = res.data.page;
      pageSize.value = res.data.size;
      links.value = res.data.data;
      $q.loading.hide();
      $q.loadingBar.stop();
    })
    .catch((err) => {
      errorMsg(err);
      $q.loading.hide();
      $q.loadingBar.stop();
    });
};

/**
 * 页码改变事件
 * @param value 页码
 */
const onPageChange = (value: number) => {
  currentPage.value = value;
  refreshLinks();
};

/**
 * 链接点击事件
 * @param link
 */
const onLinkClick = (link: Link) => {
  console.log();
  if (link.url.includes('http')) {
    window.open(link.url, '_blank')
  } else {
    window.open(link.url, '_self');
  }
}
</script>

<template>
  <div class="container">
    <div class="q-pa-md" v-if="links.length === 0 && !$q.loading.isActive">
      <q-banner rounded class="bg-orange text-white"> 暂无友情链接 </q-banner>
    </div>
    <div class="q-pa-md row items-start q-gutter-sm" v-else>
      <link-card
        v-for="(link, index) in links"
        :link="link"
        :key="index"
        @on-link-click="onLinkClick"
      />
    </div>

    <div class="pagination-div">
      <q-pagination
        v-if="links.length > 0 && !$q.loading.isActive"
        v-model="currentPage"
        :max="totalPages"
        direction-links
        flat
        color="grey"
        active-color="primary"
        @update:model-value="onPageChange"
      />
    </div>
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
