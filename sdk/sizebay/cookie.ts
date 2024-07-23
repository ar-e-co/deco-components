export function getCookieSzb(cname: string) {
  const cookie = `; ${document.cookie}`.match(`;\\s*${cname}=([^;]+)`);
  return cookie ? cookie[1] : "";
}

export function setCookie(cname: string, cvalue: string) {
  document.cookie = cname + "=" + cvalue + "; path= / ";
}
