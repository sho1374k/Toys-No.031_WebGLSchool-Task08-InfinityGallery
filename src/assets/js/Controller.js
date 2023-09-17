import { WebGL } from "./webgl/WebGL";
import { InfinitySystem } from "./module/InfinitySystem";
import { SetPropertySize } from "./module/SetPropertySize";

export class Controller {
  constructor() {
    this.body = document.body;
    this.params = {
      w: window.innerWidth,
      h: window.innerHeight,
      isMatchMediaHover: window.matchMedia("(hover: hover)").matches,
    };

    this.initDom();
    this.initModule();
    this.initClass();
    this.bindModule();
  }

  initDom() {
    this.itemList = [...document.querySelectorAll(".jsInfinityItem")];
  }

  initModule() {
    SetPropertySize(this.params.w, this.params.h);
  }

  initClass() {
    this.infinitySystem = new InfinitySystem(this.body, this.params);
    this.webgl = new WebGL(this.body, this.params, this.itemList);
  }

  bindModule() {
    this.raf = this.raf.bind(this);
    this.resize = this.resize.bind(this);
  }

  resize() {
    this.params.w = window.innerWidth;
    this.params.h = window.innerHeight;
    this.isMatchMediaHover = window.matchMedia("(hover: hover)").matches;

    SetPropertySize(this.params.w, this.params.h);
    this.infinitySystem.resize(this.params);
    this.webgl.resize(this.params);
  }

  raf() {
    this.infinitySystem.raf();
    this.webgl.raf(this.infinitySystem.vector);
  }

  async toEnterAnime() {
    await G.delay(300);
    console.log("⌚️ ~ toEnterAnime");
    this.infinitySystem.vector.target.x = 0;
    this.infinitySystem.vector.target.y = 0;
    GSAP.to(this.webgl.output.variable, {
      duration: 0.8,
      maskProgress: 0,
      onComplete: () => {
        this.infinitySystem.isClickSizeBtn = true;
        this.body.setAttribute("data-status", "enter");
      },
    });
  }

  setEvent() {
    const setItemEvent = () => {
      for (let i = 0; i < this.itemList.length; i++) {
        const item = this.itemList[i];
        const inner = this.itemList[i].children[0];

        const setClickEvent = () => {
          inner.addEventListener("click", (e) => {
            if (this.infinitySystem.isClickItem) {
              this.infinitySystem.isClickItem = false;
              this.infinitySystem.isAnime = false;
              item.classList.add("is-active");
              this.body.setAttribute("data-opened", 1);
              !(async () => {
                await G.delay(0);
                this.infinitySystem.EASE = 0.2;
                this.infinitySystem.updateElementCenterPosition(item, i);

                await G.delay(600);
                this.infinitySystem.updateElementCenterPosition(item, i);

                await this.webgl.plane.toClickItem(i);
                this.infinitySystem.EASE = 0.1;
                this.infinitySystem.updateElementCenterPosition(item, i);
                this.infinitySystem.isAnime = !this.webgl.plane.isOpened;
                this.body.setAttribute("data-id", i + 1);
              })();
            }
          });
        };

        const setMouseEvent = () => {
          if (this.params.isMatchMediaHover) {
            inner.addEventListener("mouseenter", (e) => {
              const mesh = this.webgl.plane.meshList[i];
              GSAP.to(mesh.progress, {
                duration: 0.3,
                hover: 1.0,
                ease: "power1.inOut",
              });
            });
            inner.addEventListener("mouseleave", (e) => {
              const mesh = this.webgl.plane.meshList[i];
              GSAP.to(mesh.progress, {
                duration: 0.3,
                hover: 0.0,
                ease: "power1.inOut",
              });
            });
          }
        };

        setClickEvent();
        setMouseEvent();
      }
    };

    const setWindowEvent = () => {
      window.addEventListener("click", (e) => {
        // 閉じる
        if (this.webgl.plane.isOpened) {
          !(async () => {
            await G.delay(0);
            this.infinitySystem.updateElementCenterPosition(
              this.infinitySystem.centerItem.ele,
              this.infinitySystem.centerItem.index,
            );
            this.body.setAttribute("data-id", "");

            await this.webgl.plane.toClickItem(this.infinitySystem.centerItem.index);

            if (this.infinitySystem.centerItem.ele.classList.contains("is-active")) {
              this.infinitySystem.centerItem.ele.classList.remove("is-active");
            }

            this.infinitySystem.isClickItem = true;
            this.infinitySystem.isAnime = true;
            this.infinitySystem.EASE = 0.1;
            this.body.setAttribute("data-opened", 0);
          })();
        }
      });
    };

    setItemEvent();
    setWindowEvent();
  }

  async init() {
    this.infinitySystem.init(this.itemList);

    await this.webgl.plane.init();
    this.webgl.output.init();
    this.webgl.init();
    this.setEvent();

    await G.delay(300);
    this.toEnterAnime();
  }
}
