<template>
  <aside>
    <dl>
      <dt>{{ basicGraphics.title }}</dt>
      <dd
        v-for="item of basicGraphics.items"
        :key="item.text"
        :class="{ active: selected === item.id }"
        @click="onClick(item)"
      >
        {{ item.text }}
      </dd>
    </dl>
  </aside>
</template>

<script lang="ts">
import { ref, defineComponent } from "vue";

interface Graphic {
  text: string;
  id: string;
}

export default defineComponent({
  name: "SiderBar",
  props: {
    msg: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      basicGraphics: {
        title: "基本图形",
        items: [
          {
            text: "线段",
            id: "line",
          },
          {
            text: "矩形",
            id: "rect",
          },
          {
            text: "椭圆",
            id: "oval",
          },
        ],
      },
    };
  },
  computed: {
    selected() {
      return this.$store.state.selectedBasicGraphics;
    },
  },
  methods: {
    onClick(graphic: Graphic) {
      this.$store.commit("setSelected", graphic.id);
    },
  },
});
</script>

<style scoped>
aside {
  width: 100px;
  border: 1px solid #ccc;
  padding: 10px;
}
dl {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0;
  white-space: nowrap;
}
dt {
  width: 100%;
  /* border: 1px solid #ccc; */
  line-height: 1.5em;
}
dd {
  width: 50%;
  margin: 0;
  box-sizing: border-box;
  line-height: 2.68em;
  cursor: pointer;
}
.active {
  background: #eee;
}
</style>
