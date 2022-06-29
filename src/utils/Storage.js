export const localStorageSetObj = (key, obj) => {
  localStorage.setItem(key, JSON.stringify(obj));
}

export const localStorageGetObj = (key) => {
  return JSON.parse(localStorage.getItem(key));
}

export const b64StrToFile = (b64str, filename) => {
  if (!b64str) return null;
  if (b64str.slice(0, 4) === "data") {
    b64str = b64str.split(",")[1];
  }
  var bstr = atob(b64str);
  var n = bstr.length;
  var u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: "jpeg" });
}