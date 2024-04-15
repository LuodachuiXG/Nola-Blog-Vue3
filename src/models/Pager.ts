/**
 * 分页组件
 */
export interface Pager<T> {
  /** 当前页数 */
  page: number;
  /** 每页条数 */
  size: number;
  /** 数据 */
  data: Array<T>;
  /** 总条数 */
  totalData: number;
  /** 总页数 */
  totalPages: number;
}
