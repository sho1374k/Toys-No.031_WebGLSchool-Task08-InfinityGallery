// scss
import "../scss/app.scss";

// lib
import gsap from "gsap";

// module
// import { SetGui } from "./lib/setGui";
import { GlobalUtility } from "./module/GlobalUtility";
import { Controller } from "./Controller";

// window
window.MODE = process.env.NODE_ENV === "development";
window.GSAP = gsap;
window.G = new GlobalUtility();
window.addEventListener("DOMContentLoaded", (e) => {
  // new SetGui();
  const $ = new Controller();
  $.init();
  $.resize();
  GSAP.ticker.add($.raf);
  GSAP.ticker.fps(30);
  window.addEventListener("resize", $.resize, { passive: true });

  // 右クリック禁止
  // window.oncontextmenu = function () {
  //   return false;
  // };
});
