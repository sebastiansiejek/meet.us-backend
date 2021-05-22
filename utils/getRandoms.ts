export const getRandomKeyFromObject = (someObject: any): any =>
  Object.keys(someObject)[
    Math.floor(Math.random() * Object.keys(someObject).length)
  ];

export const getRandomBoolean = (): boolean => {
  const booleans = [true, false];
  return booleans[Math.floor(Math.random() * booleans.length)];
};
