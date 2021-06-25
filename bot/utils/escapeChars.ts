export default (input: string): string => {
  // prettier-ignore
  const escapedChars = ['_','[','*','[',']','(',')','~','`','>','#','+','-','=','|','{','}','.','!'];
  let copy = input.toString();
  escapedChars.forEach((char) => {
    copy = copy.split(char).join(`\\${char}`);
  });

  return copy;
};
