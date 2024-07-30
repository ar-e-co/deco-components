export function getCookieSzb(cname: string, cookies?: string) {
  const cookie = `; ${cookies ?? document.cookie}`.match(
    `;\\s*${cname}=([^;]+)`,
  );
  return cookie ? cookie[1] : "";
}

export function setCookie(cname: string, cvalue: string) {
  document.cookie = cname + "=" + cvalue + "; path= / ";
}
