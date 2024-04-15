import { boot } from 'quasar/wrappers';
import axios, { AxiosInstance } from 'axios';
import * as process from 'process';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ baseURL: '/api' });

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios;
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api;
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
});

/**
 * 响应拦截：后端返回来的结果
 */
api.interceptors.response.use(
  (res) => {
    // 请求成功
    return res.data;
  },
  (err) => {
    if (err.response) {
      // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
      return Promise.reject(err.response.data.errMsg);
    }
    // 处理错误响应
    return Promise.reject(err.code ? err.code : err.response.data.errMsg);
  }
);

export { api };
