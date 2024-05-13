/**
 * 博客信息接口
 */
export interface BlogInfo {
  /** 博客标题 */
  title: string;
  /** 博客副标题 */
  subtitle: string | null;
  /** 博主 */
  blogger: string | null;
  /** 博客 logo */
  logo: string | null;
  /** 博客 favicon */
  favicon: string | null;
  /** 博客创建时间 */
  createDate: number;
}
