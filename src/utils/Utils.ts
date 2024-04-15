/**
 * 更新网站图标
 * @param newIconUrl
 */
export const updateFavicon = (newIconUrl: string) => {
  const linkElement: HTMLLinkElement | null = document.querySelector('link[rel="icon"]');
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
