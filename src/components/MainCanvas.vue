<template>
  <div class="canvas-container" ref="container">
    <canvas ref="canvas" :width="canvasWid" :height="canvasHei"></canvas>
    <canvas
      :class="['canvas-layer', { on: mouseStatusDown }]"
      ref="canvasLayer"
      :width="canvasWid"
      :height="canvasHei"
    ></canvas>
  </div>
  <button class="btn-clear" type="button" @click="clearCanvas">清空画布</button>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";

type Point = [number, number];

type Line = [Point, Point];

interface DataInterface {
  mouseDown: Point;
  mouseMove: Point;
  canvasWid: number | undefined;
  canvasHei: number | undefined;
}

interface Options {
  isOverLayer?: boolean;
  color?: string;
  startingPoint?: Point;
  endPoint?: Point;
}

const defaultOptions: Options = {
  isOverLayer: false,
  color: "blue",
};

let _this: any = null;
const existingLines: Line[] = [];
export default defineComponent({
  name: "MainCanvas",
  data() {
    return {
      mouseDown: [-1, -1],
      mouseMove: [-1, -1],
      canvasWid: undefined,
      canvasHei: undefined,
    } as DataInterface;
  },
  computed: {
    selected(): string {
      return this.$store.state.selectedBasicGraphics;
    },
    canvasDom(): any {
      return this.$refs.canvas;
    },
    canvasLayer() {
      return this.$refs.canvasLayer;
    },
    mouseStatusDown(): boolean {
      return this.mouseDown[0] !== -1 && this.mouseDown[1] !== -1;
    },
    ctx(): CanvasRenderingContext2D {
      return this.canvasDom.getContext("2d");
    },
  },
  methods: {
    detectParallelLines() {
      const { mouseDown, mouseMove, canvasDom } = this;
      const ctx = canvasDom.getContext("2d");
      for (let i = 0; i < existingLines.length; i++) {
        const line = existingLines[i];
        const lineDir = this.getLineDir(line);
        const curlineDir = this.getLineDir([mouseDown, mouseMove]);

        console.log(
          "lineDir, curlineDir",
          lineDir.toFixed(2),
          curlineDir.toFixed(2)
        );
        if (lineDir.toFixed(2) === curlineDir.toFixed(2)) {
          // 两条线平行了
          console.log("两条线平行了");
          this.drawLine(ctx, {
            startingPoint: line[0],
            endPoint: line[1],
            isOverLayer: true,
            color: "yellow",
          });
        } else {
          this.drawLine(ctx, {
            startingPoint: line[0],
            endPoint: line[1],
            isOverLayer: true,
          });
        }
      }
    },
    getLineDir(line: Line) {
      const [point0, point1] = line;
      return Math.atan2(point1[1] - point0[1], point1[0] - point0[0]);
    },
    handleDrawLine(ctx: CanvasRenderingContext2D, options = defaultOptions) {
      const { mouseDown, mouseMove } = this;
      let color = options.color;
      if (options.isOverLayer) {
        color = "blue";
      }
      this.drawLine(ctx, {
        startingPoint: mouseDown,
        endPoint: mouseMove,
        color,
      });

      if (options.isOverLayer) {
        this.detectParallelLines();
      }
    },
    drawLine(ctx: CanvasRenderingContext2D, options = defaultOptions) {
      const { startingPoint, endPoint, color } = options;
      if (!ctx) {
        return;
      }
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(...startingPoint);
      ctx.lineTo(...endPoint);
      ctx.stroke();
    },
    drawRect(ctx: CanvasRenderingContext2D, options = defaultOptions) {
      const { mouseDown, mouseMove } = this;
      const rectWidth = mouseMove[0] - mouseDown[0];
      const rectHeight = mouseMove[1] - mouseDown[1];

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.rect(...mouseDown, rectWidth, rectHeight);

      if (options.isOverLayer) {
        ctx.stroke();
      } else {
        ctx.fill();
      }
      // ctx.fillRect(...mouseDown, width, height);
    },
    drawOval(ctx: CanvasRenderingContext2D, options = defaultOptions) {
      const { mouseDown, mouseMove } = this;
      const { pow, sqrt } = Math;
      const horDis = mouseMove[0] - mouseDown[0];
      const verticalDis = mouseMove[1] - mouseDown[1];
      const x = (mouseMove[0] + mouseDown[0]) / 2;
      const y = (mouseMove[1] + mouseDown[1]) / 2;
      const radius = sqrt(pow(horDis, 2) + pow(verticalDis, 2)) / 2;

      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);

      if (options.isOverLayer) {
        ctx.stroke();
      } else {
        ctx.fill();
      }
    },
    draw(
      selected: String,
      canvas: HTMLCanvasElement,
      options = defaultOptions
    ) {
      const { handleDrawLine, drawRect, drawOval } = this;
      const { isOverLayer } = options;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      // 临时画布先清空画布
      if (isOverLayer) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 轮廓线为虚线
        ctx.setLineDash([5, 15]);
      }
      switch (selected) {
        case "line":
          handleDrawLine(ctx, options);
          break;
        case "rect":
          drawRect(ctx, options);
          break;
        case "oval":
          drawOval(ctx, options);
          break;
        default:
          alert("请选择绘制工具！");
          break;
      }
    },
    handleMouseDown(evt: MouseEvent) {
      const { clientX, clientY } = evt;
      const { offsetLeft, offsetTop } = _this.$refs.container;
      _this.mouseDown = [clientX - offsetLeft, clientY - offsetTop];
    },
    handleMouseUp(evt: MouseEvent) {
      const { canvasDom, selected, mouseDown, mouseMove } = _this;
      _this.draw(selected, canvasDom);
      existingLines.push([mouseDown, mouseMove]);
      // 绘制完成
      _this.mouseDown = [-1, -1];
    },
    handleMouseMove(evt: MouseEvent) {
      const { clientX, clientY } = evt;
      const { canvasLayer, selected } = _this;
      const { offsetLeft, offsetTop } = _this.$refs.container;
      if (!_this.mouseStatusDown) {
        return;
      }
      // console.log("handleMouseMove：_this.mouseMove", _this.mouseMove);
      _this.mouseMove = [clientX - offsetLeft, clientY - offsetTop];
      _this.draw(selected, canvasLayer, {
        ...defaultOptions,
        isOverLayer: true,
      });
    },
    clearCanvas() {
      const { width, height } = this.canvasDom;
      this.ctx.clearRect(0, 0, width, height);
    },
  },
  mounted() {
    _this = this;
    const { canvasDom } = this;
    this.canvasWid = canvasDom.offsetWidth;
    this.canvasHei = canvasDom.offsetHeight;
    canvasDom.addEventListener("mousedown", this.handleMouseDown);
    canvasDom.addEventListener("mouseup", this.handleMouseUp);
    canvasDom.addEventListener("mousemove", this.handleMouseMove);
  },
  unmounted() {
    const { canvasDom } = this;
    canvasDom.removeEventListener("mousedown", this.handleMouseDown);
    canvasDom.removeEventListener("mouseup", this.handleMouseUp);
    canvasDom.removeEventListener("mousemove", this.handleMouseMove);
  },
});
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
}
canvas {
  width: 100%;
  height: 100%;
  /* background: #434343; */
}
.canvas-layer {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  opacity: 0;
}
.canvas-layer.on {
  opacity: 1;
  background: rgba(204, 204, 204, 0.6);
}
.btn-clear {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
