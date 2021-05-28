export const createInputObject = (object: any) =>
  JSON.stringify(object).replace(/\"([^(\")"]+)\":/g, '$1:');
