export default class EventCamera {
  stage: any;
  scale: number = 1;
  minScale = 1;
  maxScale = 3;

  isPanning = false;
  lastX = 0;
  lastY = 0;

  constructor(stage: any) {
    this.stage = stage;
  }

  enable(onScaleChange: (s: number) => void) {
    const s = this.stage;

    s.on("wheel", (e: any) => this.onWheel(e, onScaleChange));
    s.on("mousedown", (e: any) => this.onMouseDown(e));
    s.on("mousemove", (e: any) => this.onMouseMove(e));
    s.on("mouseup", () => this.onMouseUp());
    s.on("mouseleave", () => this.onMouseUp());
  }

  onWheel(e: any, onScaleChange: (s: number) => void) {
    e.evt.preventDefault();

    const stage = this.stage;
    const pointer = stage.getPointerPosition();
    if (!pointer) return;

    const oldScale = this.scale;
    const scaleBy = 1.12;

    let newScale =
      e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

    newScale = Math.max(this.minScale, Math.min(this.maxScale, newScale));
    if (newScale === oldScale) return;

    this.scale = newScale;
    onScaleChange(newScale);

    const mousePointTo = {
      x: (pointer.x),
      y: (pointer.y) 
    };

    stage.scale({ x: newScale, y: newScale });

    const newPos = {
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale
    };

    stage.position(newPos);

    this.limitBounds();
    stage.batchDraw();
  }

  onMouseDown(e: any) {
    if (e.evt.button !== 1) return;

    e.evt.preventDefault();
    this.isPanning = true;
    this.lastX = e.evt.clientX;
    this.lastY = e.evt.clientY;
  }

  onMouseMove(e: any) {
    if (!this.isPanning) return;

    const dx = e.evt.clientX - this.lastX;
    const dy = e.evt.clientY - this.lastY;

    const stage = this.stage;
    const pos = stage.position();

    stage.position({
      x: pos.x + dx,
      y: pos.y + dy
    });

    this.lastX = e.evt.clientX;
    this.lastY = e.evt.clientY;

    this.limitBounds();
    stage.batchDraw();
  }

  onMouseUp() {
    this.isPanning = false;
  }

  limitBounds() {
    const stage = this.stage;
    const s = this.scale;

    const canvasWidth = stage.width();
    const canvasHeight = stage.height();

    const worldWidth = canvasWidth * s;
    const worldHeight = canvasHeight * s;

    const pos = stage.position();

    const xMin = canvasWidth - worldWidth;
    const yMin = canvasHeight - worldHeight;

    const x = Math.min(0, Math.max(xMin, pos.x));
    const y = Math.min(0, Math.max(yMin, pos.y));

    stage.position({ x, y });
  }
}
