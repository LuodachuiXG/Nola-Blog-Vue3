/**
 * 博主信息接口
 */
export interface Blogger {
  /** 邮箱 */
  email: string;
  /** 显示名称 */
  displayName: string;
  /** 描述 */
  description: string | null;
  /** 头像 */
  avatar: string | null;
}
