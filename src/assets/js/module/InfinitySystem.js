const BREAK_POINT = 768;

export class InfinitySystem {
  constructor(body, params) {
    this.body = body;
    this.params = params;

    this.isPageEnter = false;
    this.isClickItem = true;
    this.isAnime = false;
    this.isDown = false; // mouse,touch
    this.isRafUpdateParameter = false; // raf内で`updateParameter()`を実行できる
    this.isClickSizeBtn = false;
    this.isMatchMediaHover = this.params.isMatchMediaHover;

    this.SCALE = 1;
    this.EASE = 0.1;

    this.winW = this.params.w;
    this.winH = this.params.h;
    this.winRadiusW = this.winW * 0.5;
    this.winRadiusH = this.winH * 0.5;
    this.wrapW = 0;
    this.wrapH = 0;

    this.centerItem = {
      ele: null,
      index: 0,
    };

    // 減速
    this.deceleration = {
      wheel: 0.2,
      touch: this.isMatchMediaHover ? 0.1 : 0.2,
    };

    // 座標
    this.vector = {
      current: { x: 0, y: 0 },
      target: { x: 0, y: 0 },
      touch: { x: 0, y: 0 },
    };

    this.timer = {
      touch: null,
      resize: null,
      resize2: null,
    };

    if (this.isMatchMediaHover) {
      window.addEventListener("wheel", this.onWheel.bind(this), { passive: true });
      window.addEventListener("mousemove", this.onMove.bind(this), { passive: true });
      window.addEventListener("mousedown", this.onDown.bind(this), { passive: true });
      window.addEventListener("mouseup", this.onUp.bind(this), { passive: true });
    } else {
      window.addEventListener("touchstart", this.onDown.bind(this), { passive: true });
      window.addEventListener("touchmove", this.onMove.bind(this), { passive: true });
      window.addEventListener("touchend", this.onUp.bind(this), { passive: true });
    }
  }

  onWheel(e) {
    if (this.isAnime && this.isPageEnter && this.isClickSizeBtn) {
      this.vector.target.x = this.vector.target.x + e.deltaX * this.deceleration.wheel;
      this.vector.target.y = this.vector.target.y + e.deltaY * this.deceleration.wheel;
    }
  }

  onDown(e) {
    if (this.isAnime && this.isPageEnter && this.isClickSizeBtn) {
      console.log("🐭 ~ onDown");
      this.isDown = true;
      this.vector.touch.x = e.touches ? e.touches[0].clientX : e.clientX;
      this.vector.touch.y = e.touches ? e.touches[0].clientY : e.clientY;
    }
  }

  onMove(e) {
    if (this.isDown && this.isAnime && this.isPageEnter && this.isClickSizeBtn) {
      const x = e.touches ? e.touches[0].clientX : e.clientX;
      const y = e.touches ? e.touches[0].clientY : e.clientY;

      const moveX = this.vector.touch.x - x;
      const moveY = this.vector.touch.y - y;

      this.vector.target.x = this.vector.target.x + moveX * this.deceleration.touch * -1;
      this.vector.target.y = this.vector.target.y + moveY * this.deceleration.touch * -1;

      clearTimeout(this.timer.touch);
      this.timer.touch = setTimeout(() => {
        console.log("🐭 ~ onMove Fin");
        this.vector.touch.x = x;
        this.vector.touch.y = y;
        clearTimeout(this.timer.touch);
      }, 100);
    }
  }

  onUp(e) {
    if (this.isPageEnter && this.isClickSizeBtn) {
      console.log("🐭 ~ onUp");
      this.isDown = false;
    }
  }

  toResize(props) {
    this.isRafUpdateParameter = true;

    this.winW = props.w;
    this.winH = props.h;
    this.isMatchMediaHover = props.isMatchMediaHover;

    this.winW = this.params.w;
    this.winH = this.params.h;
    this.winRadiusW = this.winW * 0.5;
    this.winRadiusH = this.winH * 0.5;
  }

  resize(props) {
    this.toResize(props);

    clearTimeout(this.timer.resize);
    this.timer.resize = setTimeout(() => {
      this.resizeAfter();
      clearTimeout(this.timer.resize);
    }, 500);

    clearTimeout(this.timer.resize2);
    this.timer.resize2 = setTimeout(() => {
      this.resizeAfter2();
      clearTimeout(this.timer.resize2);
    }, 1000);
  }

  resizeAfter() {
    console.log("⏰ ~ resizeAfter");
    // ブレイクポイントの閾値
    const threshold = () => {
      const w = window.innerWidth;
      // 768px以下から768px以上に
      if (w > BREAK_POINT) if (this.params.beforeWidth < BREAK_POINT + 1) window.location.reload();

      // 768px以上から768px以下に
      if (w < BREAK_POINT + 1) if (this.params.beforeWidth > BREAK_POINT + 1) window.location.reload();

      this.params.beforeWidth = w;
    };
    threshold();
  }

  resizeAfter2() {
    console.log("⏰ ~ resizeAfter2");
    this.updateParameter();
    this.isRafUpdateParameter = false;
  }

  /**
   * @param {number} progress 進捗: e.deltaX, e.deltaY
   * @param {number} distance 親コンテナに対する要素の距離: EX）offsetTop, offsetLeft
   * @param {number} threshold 閾値(要素の縦横の半分の値): EX）offsetWidth * 0.5, offsetHeight * 0.5
   * @param {number} limitMax 限界最大値(親コンテナの縦横幅): EX）parent.offsetWidth, parent.offsetHeight
   */
  getElementCoord(progress, distance, threshold, limitMax) {
    if (progress + distance < threshold * -1) {
      progress = progress + limitMax;
    }
    if (progress + distance > limitMax - threshold) {
      progress = progress - limitMax;
    }
    return progress;
  }

  getItemList() {
    return this.itemList();
  }

  updateElementsPosition() {
    let x = this.vector.current.x;
    let y = this.vector.current.y;
    for (let i = 0; i < this.itemList.length; i++) {
      const item = this.itemList[i];
      const itemRadiusW = item.offsetWidth * 0.5;
      const itemRadiusH = item.offsetHeight * 0.5;
      const itemLeft = item.offsetLeft;
      const itemTop = item.offsetTop;

      y = this.getElementCoord(y, itemTop, itemRadiusH, this.wrapH);
      x = this.getElementCoord(x, itemLeft, itemRadiusW, this.wrapW);

      item.style.transform = `translate3d(${x}px,${y}px,0)`;
    }
  }

  /**
   * @param {element} item
   * @param {number} i index
   */
  updateElementCenterPosition(item, i) {
    this.centerItem.ele = item;
    this.centerItem.index = i;

    const itemRadiusW = item.offsetWidth * 0.5;
    const itemRadiusH = item.offsetHeight * 0.5;

    const rect = item.getBoundingClientRect();
    const rectY = rect.y;
    const rectX = rect.x;

    const centerX = this.winRadiusW - itemRadiusW;
    const centerY = this.winRadiusH - itemRadiusH;

    const moveX = centerX - rectX;
    const moveY = centerY - rectY;

    this.vector.target.x = this.vector.target.x + moveX;
    this.vector.target.y = this.vector.target.y + moveY;
  }

  updateY() {
    this.vector.current.y = Number(G.lerp(this.vector.current.y, this.vector.target.y, this.EASE).toFixed(3));

    // max
    if (this.vector.current.y > this.wrapH) {
      this.vector.current.y = this.vector.current.y - this.wrapH;
      this.vector.target.y = this.vector.target.y - this.wrapH;
    }

    // min
    if (this.vector.current.y < this.wrapH * -1) {
      this.vector.current.y = this.vector.current.y + this.wrapH;
      this.vector.target.y = this.vector.target.y + this.wrapH;
    }
  }

  updateX() {
    this.vector.current.x = Number(G.lerp(this.vector.current.x, this.vector.target.x, this.EASE).toFixed(3));

    // max
    if (this.vector.current.x > this.wrapW) {
      this.vector.current.x = this.vector.current.x - this.wrapW;
      this.vector.target.x = this.vector.target.x - this.wrapW;
    }
    // min
    if (this.vector.current.x < this.wrapW * -1) {
      this.vector.current.x = this.vector.current.x + this.wrapW;
      this.vector.target.x = this.vector.target.x + this.wrapW;
    }
  }

  raf() {
    if (this.isPageEnter) {
      if (this.isRafUpdateParameter) this.updateParameter();
      this.updateY();
      this.updateX();
      this.updateElementsPosition();
    }
  }

  updateParameter() {
    this.wrapW = this.wrapper.offsetWidth;
    this.wrapH = this.wrapper.offsetHeight;
  }

  init(_itemList = [...document.querySelectorAll(".jsInfinityItem")]) {
    this.isPageEnter = true;
    this.isAnime = true;

    this.container = document.getElementById("jsInfinityContainer");
    this.wrapper = document.getElementById("jsInfinityWrapper");
    this.itemList = _itemList;

    const setInitPosition = () => {
      const size = this.itemList[0].offsetWidth * 0.5;
      this.vector.current.x = size;
      this.vector.target.x = size;
    };

    const setSizeBtn = () => {
      const sizeBtnList = [...document.querySelectorAll(".jsBtnSize")];
      for (let i = 0; i < sizeBtnList.length; i++) {
        const btn = sizeBtnList[i];
        btn.addEventListener("click", (e) => {
          if (this.isClickSizeBtn) {
            this.isClickSizeBtn = false;
            this.isRafUpdateParameter = true;
            const data = btn.getAttribute("data-scale");
            this.SCALE = Number(data);
            this.body.setAttribute("data-scale", this.SCALE);
            setTimeout(() => {
              this.vector.target.x = 0;
              this.vector.target.y = 0;
            }, 100);
          }
        });
      }
    };

    const transitionend = () => {
      this.wrapper.addEventListener("transitionend", (e) => {
        if (this.isRafUpdateParameter) {
          setTimeout(() => {
            this.isRafUpdateParameter = false;
            this.isClickSizeBtn = true;
            // this.resize(this.params);
            this.toResize(this.params);
          }, 100);
        }
      });
    };

    this.updateParameter();
    setInitPosition();
    setSizeBtn();
    transitionend();
  }
}
