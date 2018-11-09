import test from 'ava';
import { Schedule } from 'src/entity/Schedule';
import * as moment from 'moment';


function parseDate (str: string) {
  return moment(str, 'DD.MM.YYYY');
}

function parseDatetime (str: string) {
  return moment(str, 'DD.MM.YYYY HH:mm');
}

const workingDays: [moment.Duration, moment.Duration] = [
  moment.duration('09:00'), moment.duration('18:00')
];
let TEST_SCHEDULE: Schedule;
test.beforeEach(() => {
  TEST_SCHEDULE = new Schedule(
    [workingDays, false, workingDays, workingDays, workingDays, true, false],
    {
      '08.11.2018': true
    }
  );
});

test('isOpen: correctly returns true for always-open', t => {
  t.is(TEST_SCHEDULE.isOpen(parseDate('10.11.2018')), true);
});

test('isOpen: correctly returns false for always-closed', t => {
  t.is(TEST_SCHEDULE.isOpen(parseDate('11.11.2018')), false);
});

test('isOpen: correctly returns true when in range', t => {
  t.is(TEST_SCHEDULE.isOpen(parseDatetime('09.11.2018 15:00')), true);
});

test('isOpen: correctly returns false when not in range', t => {
  t.is(TEST_SCHEDULE.isOpen(parseDatetime('09.11.2018 20:00')), false);
});

test('isOpen: exception overrides usual schedule', t => {
  t.is(TEST_SCHEDULE.isOpen(parseDatetime('08.11.2018 20:00')), true);
});


test('getNextOpenDate: returns argument date if open', t => {
  const date = parseDatetime('10.11.2018 20:00');
  const openDate = TEST_SCHEDULE.getNextOpenDate(date);
  t.true(openDate!.isSame(date));
});

test('getNextOpenDate: returns next day opening time if next is whole day open', t => {
  const date = parseDatetime('09.11.2018 20:00');
  const openDate = TEST_SCHEDULE.getNextOpenDate(date);
  t.true(openDate!.isSame(parseDatetime('10.11.2018 00:00')));
});

test('getNextOpenDate: returns opening time for (arg + 2 days) if next is fully closed', t => {
  const date = parseDatetime('05.11.2018 20:00');
  const openDate = TEST_SCHEDULE.getNextOpenDate(date);
  t.true(openDate!.isSame(parseDatetime('07.11.2018 09:00')));
});

test('getNextOpenDate: respects exceptions', t => {
  const date = parseDatetime('07.11.2018 20:00');
  const openDate = TEST_SCHEDULE.getNextOpenDate(date);
  t.true(openDate!.isSame(parseDatetime('08.11.2018 00:00')));
});

test('getNextOpenDate: returns next day opening time on work days', t => {
  const date = parseDatetime('08.11.2018 20:00');
  TEST_SCHEDULE.exceptions = {};
  const openDate = TEST_SCHEDULE.getNextOpenDate(date);
  t.true(openDate!.isSame(parseDatetime('09.11.2018 09:00')));
});
