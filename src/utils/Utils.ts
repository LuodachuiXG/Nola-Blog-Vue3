import { useBlogInfoStore } from 'stores/example-store';

/**
 * 更新网站图标
 * @param newIconUrl
 */
export const updateFavicon = (newIconUrl: string) => {
  const linkElement: HTMLLinkElement | null =
    document.querySelector('link[rel="icon"]');
  if (linkElement) {
    linkElement.href = newIconUrl;
  } else {
    // 如果没有找到现有 favicon，创建一个新的 link 标签
    const newLink = document.createElement('link');
    newLink.rel = 'icon';
    newLink.href = newIconUrl;
    document.head.appendChild(newLink);
  }
};

/**
 * 获取实际链接
 * 用于判断链接是否为相对链接，以及是否是开发模式
 * @param url
 */
export const getActualUrl = (url: string) => {
  // 此环境变量在开发和生产模式下不同
  const baseUrl = import.meta.env.VITE_BASE_URL;
  if (url.startsWith('http')) {
    // 绝对地址
    return url;
  } else {
    // 相对地址
    return baseUrl + url;
  }
};

/**
 * 设置网页标题
 * 如果博客信息不为空，就加上博客标题
 * @param title
 */
export const setDocumentTitle = (title: string) => {
  const blogInfo = useBlogInfoStore();
  if (blogInfo.blogInfo) {
    document.title =
      title +
      ' - ' +
      blogInfo.blogInfo.title +
      ' | ' +
      blogInfo.blogInfo.subtitle;
  } else {
    document.title = title;
  }
};
