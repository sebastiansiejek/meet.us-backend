import * as dayjs from 'dayjs';

export const getRandomKeyFromObject = (someObject: any): any =>
  Object.keys(someObject)[
    Math.floor(Math.random() * Object.keys(someObject).length)
  ];

export const getRandomBoolean = (): boolean => {
  const booleans = [true, false];
  return booleans[Math.floor(Math.random() * booleans.length)];
};

export const getRandomDateFromDate = (
  date: Date = new Date(),
  minDay = 1,
  maxDay = 2,
  minHours = 1,
  maxHours = 4,
): {
  startDate: Date;
  endDate: Date;
} => {
  const startDate = dayjs(date);
  const endDate = startDate
    .add(
      Math.floor(Math.random() * getRandomNumberBetween(minDay, maxDay)),
      'day',
    )
    .add(getRandomNumberBetween(minHours, maxHours), 'hours')
    .toDate();

  return {
    startDate: startDate.toDate(),
    endDate,
  };
};

export const getRandomNumberBetween = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const getRandomValueFromArray = (arr: Array<any>) =>
  arr[Math.floor(Math.random() * arr.length)];
