import { defineStore } from 'pinia';
import { BlogInfo } from 'src/models/BlogInfo';
import { computed, ref } from 'vue';

/**
 * 博客信息 Store
 */
export const useBlogInfoStore = defineStore('blogInfo', () => {
  const blogInfo = ref<BlogInfo | null>(null);
  function setBlogInfo(bi: BlogInfo) {
    blogInfo.value = bi;
  }

  return { blogInfo, setBlogInfo };
});
