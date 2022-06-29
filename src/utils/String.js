export const getFirstName = (fullName, type) => {
  if (!fullName) 
    return ""; 
  let splitedName = fullName.trim().split(" ");
  if (type === "vn") {
    return splitedName[splitedName.length-1];
  } else {
    return splitedName[0];
  }
}

export const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};