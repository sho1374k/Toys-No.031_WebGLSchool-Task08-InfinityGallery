/**
 * @param {number} w // window.innerWidth
 * @param {number} h // window.innerHeight
 */
export function SetPropertySize(w, h) {
  const vh = h * 0.01,
    longer = w > h ? w : h,
    shorter = w > h ? h : w;

  document.documentElement.style.setProperty("--vh", vh + "px"); // height: calc(var(--vh, 1vh) * 100);
  document.documentElement.style.setProperty("--longer", longer + "px");
  document.documentElement.style.setProperty("--shorter", shorter + "px");

  // const longSide = longer * 0.01;
  // document.documentElement.style.setProperty("--longSide", longSide + "px"); // height: calc(var(--vh, 1vh) * 100);
}
