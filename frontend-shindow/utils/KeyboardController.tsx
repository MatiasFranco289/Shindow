export default class KeyboardController {
  private static instance: KeyboardController;
  private window: (Window & typeof globalThis) | undefined;
  private shiftPressed: boolean = false;

  private constructor() {}

  public static GetInstance(window: Window & typeof globalThis) {
    if (!KeyboardController.instance) {
      this.instance = new KeyboardController();
      this.instance.window = window;

      window.addEventListener("keydown", (e) => {
        if (e.shiftKey) {
          this.instance.shiftPressed = true;
        }
      });

      window.addEventListener("keyup", (e) => {
        if (!e.shiftKey) {
          this.instance.shiftPressed = false;
        }
      });
    }

    return this.instance;
  }

  public isShiftPressed(): boolean {
    return this.shiftPressed;
  }
}
