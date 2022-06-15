export const getSizeNumber = (number: number | string): number => {
  if(typeof number === 'number'){
    return number;
  }
  return parseInt(number);
}