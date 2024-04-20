import { api } from 'boot/axios';

/**
 * 获取博主信息
 */
export const getBlogger = () => {
  return api({
    url: '/blogger',
    method: 'GET'
  });
};
