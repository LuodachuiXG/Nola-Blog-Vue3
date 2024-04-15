/**
 * 分类接口
 */
export interface Category {
  /** 分类 ID */
  categoryId: number;
  /** 分类名称 */
  displayName: string;
  /** 分类别名 */
  slug: string;
  /** 封面 */
  cover: string | null;
  /** 是否统一封面（未设置封面的文章） */
  unifiedCover: boolean;
  /** 文章数量 */
  pageCount: number;
}
