import { api } from 'boot/axios';

/**
 * 获取日记
 * @param page 页码（留 0 获取全部）
 * @param size 页大小
 */
export const getDiaries = (page: number, size: number) => {
  return api({
    url: `/diary?page=${page}&size=${size}`,
    method: 'GET'
  });
};
