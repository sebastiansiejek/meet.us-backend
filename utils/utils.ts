export const getRandomKeyFromObject = (someObject: any): any =>
  Object.keys(someObject)[
    Math.floor(Math.random() * Object.keys(someObject).length)
  ];
