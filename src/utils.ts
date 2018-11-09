import * as moment from 'moment';

moment.locale('ru');

// util type to define fixed-length array of same type.
// works since TS 3.0.
export type FixedArray<Item, Length> = [Item, ...Item[]] & { length: Length };

export function serializeDate (date: moment.Moment): string {
  return date.format('DD.MM.YYYY');
}
