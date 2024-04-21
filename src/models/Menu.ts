import { MenuTargetEnum } from 'src/models/enum/MenuTargetEnum';

/**
 * 菜单项接口
 */
export interface Menu {
  /** 菜单项 ID */
  menuItemId: number;
  /** 菜单项名称 */
  displayName: string;
  /** 地址 */
  href: string | null;
  /** 打开方式 */
  target: MenuTargetEnum;
  /** 父菜单项 ID */
  parentMenuItemId: number | null;
  /** 子菜单项 */
  children: Array<Menu>;
  /** 菜单项排序索引 */
  index: number;
  /** 创建时间 */
  createTime: number;
  /** 最后修改时间 */
  lastModifyTime: number | null;
}
