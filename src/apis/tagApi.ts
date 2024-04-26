import { api } from 'boot/axios';

/**
 * 获取标签
 * @param page 页码（留 0 获取全部）
 * @param size 页大小
 */
export const getTag = (page: number, size: number) => {
  return api({
    url: `/tag?page=${page}&size=${size}`,
    method: 'GET',
  });
};
