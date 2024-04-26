import { api } from 'boot/axios';

/**
 * 获取分类
 * @param page 页码（留 0 获取全部）
 * @param size 页大小
 */
export const getCategory = (page: number, size: number) => {
  return api({
    url: `/category?page=${page}&size=${size}`,
    method: 'GET',
  });
};
