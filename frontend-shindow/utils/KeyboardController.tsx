export default class KeyboardController {
  private static instance: KeyboardController;
  private window: (Window & typeof globalThis) | undefined;
  private ctrlPressed: boolean = false;

  private constructor() {}

  public static GetInstance(window: Window & typeof globalThis) {
    if (!KeyboardController.instance) {
      this.instance = new KeyboardController();
      this.instance.window = window;

      window.addEventListener("keydown", (e) => {
        if (e.ctrlKey) {
          this.instance.ctrlPressed = true;
        }
      });

      window.addEventListener("keyup", (e) => {
        if (!e.ctrlKey) {
          this.instance.ctrlPressed = false;
        }
      });
    }

    return this.instance;
  }

  public isCtrlPressed(): boolean {
    return this.ctrlPressed;
  }
}
