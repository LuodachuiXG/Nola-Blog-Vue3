import { api } from 'boot/axios';

/**
 * 获取友情链接
 * @param page 页码（留 0 获取全部）
 * @param size 页大小
 */
export const getLinks = (page: number, size: number) => {
  return api({
    url: `/link?page=${page}&size=${size}`,
    method: 'GET',
  });
};
