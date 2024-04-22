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
    method: 'GET',
  });
};

/**
 * 获取文章内容（ID 和别名至少提供一个）
 * @param id 文章 ID
 * @param slug 文章别名
 * @param password 密码（如果有）
 */
export const getPostContent = (
  id?: number,
  slug?: string,
  password?: string
) => {
  let url = '/post/content';
  if (id) {
    url += `?postId=${id}`;
  } else if (slug) {
    url += `?slug=${slug}`;
  } else {
    return Promise.reject('文章 ID 或别名至少提供一个');
  }
  if (password) {
    url += `&password=${password}`;
  }
  return api({
    url: url,
    method: 'GET',
  });
};

/**
 * 根据文章 ID 获取文章
 * @param id 文章 ID
 */
export const getPostById = (id: number) => {
  return api({
    url: `/post/${id}`,
    method: 'GET',
  });
};

/**
 * 根据文章别名获取文章
 * @param slug 文章别名
 */
export const getPostBySlug = (slug: string) => {
  return api({
    url: `/post/slug/${slug}`,
    method: 'GET',
  });
};
