import { Category } from 'src/models/Category';
import { Tag } from 'src/models/Tag';

/**
 * 文章接口
 */
export interface Post {
  /** 文章 ID */
  postId: number;
  /** 文章标题 */
  title: string;
  /** 文章摘要（如果文章有密码，摘要为 null） */
  excerpt: string | null;
  /** 文章别名 */
  slug: string;
  /** 文章封面 */
  cover: string | null;
  /** 是否允许评论 */
  allowComment: boolean;
  /** 是否置顶 */
  pinned: boolean;
  /** 是否加密 */
  encrypted: boolean;
  /** 访问量 */
  visit: number;
  /** 分类 */
  category: Category | null;
  /** 标签 */
  tags: Array<Tag>;
  /** 创建时间 */
  createTime: number;
  /** 最后修改时间 */
  lastModifyTime: number | null;
}
