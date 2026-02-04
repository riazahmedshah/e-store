export const removeUndefinedFromObject = (obj: Record<string, any>) => {
  const newObj = {...obj};

  Object.keys(newObj).forEach((key) => {
    if(newObj[key] === undefined){
      delete newObj[key]
    }
  });

  return newObj;
}