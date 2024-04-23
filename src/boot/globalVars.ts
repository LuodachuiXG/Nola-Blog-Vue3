import { boot } from 'quasar/wrappers';
import { reactive } from 'vue';

export default boot(({ app }) => {
  // 全局响应变量
  const globalVars: GlobalVars = reactive({
    isSmallWindow: false
  });

  /**
   * 监听窗口大小变化
   */
  const handleWindowSizeChange = () => {
    globalVars.isSmallWindow = window.document.documentElement.clientWidth < 768;
  }

  window.addEventListener('resize', handleWindowSizeChange);
  handleWindowSizeChange();

  // 挂载全局响应变量
  app.provide('globalVars', globalVars);
});
