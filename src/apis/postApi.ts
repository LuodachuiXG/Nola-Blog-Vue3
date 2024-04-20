import { api } from 'boot/axios';

/**
 * 获取文章
 * @param page 当前页数（留 0 获取全部）
 * @param size 每页条数
 * @param key 关键字（标题、别名、摘要、内容）
 * @param tag 标签 ID
 * @param category 分类 ID
 */
export const getPosts = (
  page: number,
  size: number,
  key?: string,
  tag?: number,
  category?: number
) => {
  let baseUrl = `/post?page=${page}&size=${size}`;
  if (key) {
    baseUrl += `&key=${key}`;
  }
  if (tag) {
    baseUrl += `&tag=${tag}`;
  }
  if (category) {
    baseUrl += `&category=${category}`;
  }
  return api({
    url: baseUrl,
    method: 'GET'
  });
};
