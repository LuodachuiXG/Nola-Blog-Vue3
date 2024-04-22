/**
 * 菜单打开方式枚举类
 */
export enum MenuTargetEnum {
  /** 新窗口打开 */
  BLANK = 'BLANK',
  /** 当前窗口打开 */
  SELF = 'SELF',
  /** 父窗口打开 */
  PARENT = 'PARENT',
  /** 顶层窗口打开 */
  TOP = 'TOP'
}

/**
 * 菜单打开方式实际枚举值
 */
export enum MenuTargetValueEnum {
  BLANK = '_blank',
  SELF = '_self',
  PARENT = '_parent',
  TOP = '_top'
}
