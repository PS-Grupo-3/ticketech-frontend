export default class CanvasCamera {
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

    enable() {
        const s = this.stage;

        s.on("wheel", (e: any) => this.onWheel(e));
        s.on("mousedown", (e: any) => this.onMouseDown(e));
        s.on("mousemove", (e: any) => this.onMouseMove(e));
        s.on("mouseup", () => this.onMouseUp());
    }

    onWheel(e: any) {
        e.evt.preventDefault();
        const stage = this.stage;

        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const oldScale = this.scale;
        const scaleBy = 1.1;
        
        let newScale =
            e.evt.deltaY > 0 ? oldScale / scaleBy : oldScale * scaleBy;

        if (newScale < this.minScale) newScale = this.minScale;
        if (newScale > this.maxScale) newScale = this.maxScale;

        if (newScale === oldScale) return;

        this.scale = newScale;

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        stage.scale({ x: newScale, y: newScale });

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };

        stage.position(newPos);
        stage.batchDraw();
    }


    onMouseDown(e: any) {
        if (e.evt.button === 1) {
            e.evt.preventDefault();
            this.isPanning = true;
            this.lastX = e.evt.clientX;
            this.lastY = e.evt.clientY;
        }
    }

    onMouseMove(e: any) {
        if (!this.isPanning) return;

        const dx = e.evt.clientX - this.lastX;
        const dy = e.evt.clientY - this.lastY;

        const stage = this.stage;
        const pos = stage.position();

        stage.position({
            x: pos.x + dx,
            y: pos.y + dy,
        });

        this.lastX = e.evt.clientX;
        this.lastY = e.evt.clientY;

        stage.batchDraw();
    }

    onMouseUp() {
        this.isPanning = false;
    }

    reset() {
        this.scale = 1;
        this.stage.scale({ x: 1, y: 1 });
        this.stage.position({ x: 0, y: 0 });
        this.stage.batchDraw();
    }
}
