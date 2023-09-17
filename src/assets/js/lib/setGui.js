import GUI from "lil-gui";

export class SetGui {
  constructor() {
    this.gui = null;
    window.GUI = null;
    if (MODE) {
      this.gui = new GUI();
      window.GUI = this.gui;
      this.toOpen();
      // this.toClose();
    }
  }

  toOpen() {
    if (window.GUI != null) this.gui.open();
  }

  toClose() {
    if (window.GUI != null) this.gui.close();
  }
}
