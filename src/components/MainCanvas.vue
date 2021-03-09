<template>
  <canvas ref="canvas" :width="canvasWid" :height="canvasHei"></canvas>
  <button class="btn-clear" type="button" @click="clearCanvas">清空画布</button>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";

let _this = null;
export default defineComponent({
  name: "MainCanvas",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
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
    ctx() {
      return this.canvasDom.getContext("2d");
    },
  },
  watch: {},
  methods: {
    drawLine() {
      const { ctx } = this;
      ctx.fillStyle = "red";
      ctx.stock;
    },
    drawRect() {
      const { ctx, mouseDown, mouseMove } = this;
      const width = mouseMove[0] - mouseDown[0];
      const height = mouseMove[1] - mouseDown[1];
      console.log("drawRect：mouseDown, mouseMove", mouseDown, mouseMove);
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.rect(...mouseDown, width, height);
      ctx.fill();

      // ctx.fillRect(...mouseDown, width, height);
    },
    handleMouseDown(evt) {
      const { clientX, clientY } = evt;
      const { offsetLeft, offsetTop } = _this.canvasDom;
      _this.mouseDown = [clientX - offsetLeft, clientY - offsetTop];
      // debugger
      console.log("handleMouseDown：_this.mouseDown", _this.mouseDown);
    },
    handleMouseUp(evt) {
      const { clientX, clientY } = evt;
      const { offsetLeft, offsetTop } = _this.canvasDom;
      _this.mouseDown = [-1, -1];
    },
    handleMouseMove(evt) {
      const { clientX, clientY } = evt;
      const { canvasDom, mouseDown } = _this;
      const { offsetLeft, offsetTop } = canvasDom;
      if (mouseDown[0] === -1 || mouseDown[1] === -1) {
        return;
      }
      _this.mouseMove = [clientX - offsetLeft, clientY - offsetTop];
      switch (_this.selected) {
        case "line":
          _this.drawLine();
          break;
        case "rect":
          _this.drawRect();
          break;
        case "oval":
          _this.drawOval();
          break;
        default:
          break;
      }
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
  destroyed() {
    const { canvasDom } = this;
    canvasDom.removeEventListener("mousedown", this.handleMouseDown);
    canvasDom.removeEventListener("mouseup", this.handleMouseUp);
    canvasDom.removeEventListener("mousemove", this.handleMouseMove);
  },
});
</script>

<style scoped>
canvas {
  width: 100%;
  background: #434343;
}
.btn-clear {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>
