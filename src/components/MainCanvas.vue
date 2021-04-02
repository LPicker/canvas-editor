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

let _this = null;
export default defineComponent({
  name: "MainCanvas",
  data() {
    return {
      mouseDown: [-1, -1],
      mouseMove: [-1, -1],
      canvasWid: undefined,
      canvasHei: undefined,
    };
  },
  computed: {
    selected() {
      return this.$store.state.selectedBasicGraphics;
    },
    canvasDom() {
      return this.$refs.canvas;
    },
    canvasLayer() {
      return this.$refs.canvasLayer;
    },
    mouseStatusDown() {
      return this.mouseDown[0] !== -1 && this.mouseDown[1] !== -1;
    },
    ctx() {
      return this.canvasDom.getContext("2d");
    },
  },
  methods: {
    drawLine(ctx, overLayer) {
      const { mouseDown, mouseMove } = this;
      let color = "blue";
      if (overLayer) {
        color = "blue";
      }
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.moveTo(...mouseDown);
      ctx.lineTo(...mouseMove);
      ctx.stroke();
    },
    drawRect(ctx, overLayer) {
      const { mouseDown, mouseMove } = this;
      const rectWidth = mouseMove[0] - mouseDown[0];
      const rectHeight = mouseMove[1] - mouseDown[1];

      console.log("drawRect：mouseDown, mouseMove", mouseDown, mouseMove);
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.rect(...mouseDown, rectWidth, rectHeight);

      if (overLayer) {
        ctx.stroke();
      } else {
        ctx.fill();
      }
      // ctx.fillRect(...mouseDown, width, height);
    },
    drawOval(ctx, overLayer) {
      const { mouseDown, mouseMove } = this;
      const { pow, sqrt } = Math;
      const horDis = mouseMove[0] - mouseDown[0];
      const verticalDis = mouseMove[1] - mouseDown[1];
      const x = (mouseMove[0] + mouseDown[0]) / 2;
      const y = (mouseMove[1] + mouseDown[1]) / 2;
      const radius = sqrt(pow(horDis, 2) + pow(verticalDis, 2)) / 2;

      console.log("handleMouseDown：_this.mouseDown", _this.mouseDown);
      console.log("handleMouseMove：_this.mouseMove", _this.mouseMove);
      console.log("drawOval：x, y, radius", x, y, radius);
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);

      if (overLayer) {
        ctx.stroke();
      } else {
        ctx.fill();
      }
    },
    draw(selected, canvas, overLayer) {
      const { drawLine, drawRect, drawOval } = this;
      const ctx = canvas.getContext("2d");
      // 临时画布先清空画布
      if (overLayer) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // 轮廓线为虚线
        ctx.setLineDash([5, 15]);
      }
      switch (selected) {
        case "line":
          drawLine(ctx, overLayer);
          break;
        case "rect":
          drawRect(ctx, overLayer);
          break;
        case "oval":
          drawOval(ctx, overLayer);
          break;
        default:
          alert("请选择绘制工具！");
          break;
      }
    },
    handleMouseDown(evt) {
      const { clientX, clientY } = evt;
      const { offsetLeft, offsetTop } = _this.$refs.container;
      _this.mouseDown = [clientX - offsetLeft, clientY - offsetTop];
    },
    handleMouseUp(evt) {
      const { canvasDom, selected } = _this;
      _this.draw(selected, canvasDom);
      // 绘制完成
      _this.mouseDown = [-1, -1];
    },
    handleMouseMove(evt) {
      const { clientX, clientY } = evt;
      const { canvasLayer, selected } = _this;
      const { offsetLeft, offsetTop } = _this.$refs.container;
      if (!_this.mouseStatusDown) {
        return;
      }
      console.log("handleMouseMove：_this.mouseMove", _this.mouseMove);
      _this.mouseMove = [clientX - offsetLeft, clientY - offsetTop];
      _this.draw(selected, canvasLayer, true);
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
