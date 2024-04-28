/**
 * 友情链接接口
 */
export interface Link {
  /** 链接名称 */
  displayName: string;
  /** 链接地址 */
  url: string;
  /** 链接图标 */
  logo: string | null;
  /** 链接描述 */
  description: string | null;
}
