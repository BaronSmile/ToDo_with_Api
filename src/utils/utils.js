const htmlDecode = (input) => {
  let doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
}

export const readCookie = (name) => {
  let nameEQ = name + '=';
  let ca = document.cookie.split(';');
  for(let i=0;i < ca.length;i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}  

export const createCookie = (name, value, seconds) => {
  let expires = '';
  if (seconds) {
    const date = new Date();
    date.setTime(date.getTime()+(seconds*1000));
    expires = '; expires='+date.toGMTString();
  }
  document.cookie = name+'='+value+expires+'; path=/';
}

export const eraseCookie = (name) => {
  createCookie(name,'',-1);
}  

export default htmlDecode;