import { api } from 'boot/axios';

/**
 * 获取博客信息
 */
export const getBlogInfo = () => {
  return api({
    url: '/config/blog',
    method: 'GET'
  });
};
