import { Notify } from 'quasar';
import { NamedColor } from 'quasar/dist/types/api';

/**
 * 按照类型显示通知
 * @param message
 * @param type
 */
export const notifyT = (
  message: string,
  type?: 'positive' | 'negative' | 'warning' | 'info' | 'ongoing'
) => {
  Notify.create({
    message: message,
    type: type ?? 'positive',
    position: 'top',
    timeout: 350
  });
};

/**
 * 按照颜色显示通知
 * @param message
 * @param color
 */
export const notifyC = (
  message: string,
  color?: NamedColor
) => {
  Notify.create({
    message: message,
    color: color,
    position: 'top',
    timeout: 350
  });
};
