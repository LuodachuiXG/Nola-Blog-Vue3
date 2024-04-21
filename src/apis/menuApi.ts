import { api } from 'boot/axios';

/**
 * 获取菜单项
 * @param tree 是否构建菜单树（默认为 true）
 */
export const getMenus = (tree?: boolean) => {
  return api({
    url: `/menu${tree ? '/tree=true' : ''}`,
    method: 'GET',
  });
};
