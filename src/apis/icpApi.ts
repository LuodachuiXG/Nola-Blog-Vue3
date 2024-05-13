import { api } from 'boot/axios';

/**
 * 获取备案信息
 */
export const getICP = () => {
  return api({
    url: '/config/icp',
    method: 'GET'
  });
};
