/**
 * 日记接口
 */
export interface Diary {
  diaryId: number;
  content: string;
  html: string;
  createTime: number;
  lastModifyTime: number | null;
}
