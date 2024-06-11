<template>
  <div>
    <waterfall
      ref="waterfall"
      :align="align"
      :line-gap="200"
      :min-line-gap="100"
      :max-line-gap="220"
      :single-max-width="300"
      :watch="items"
      @reflowed="reflowed"
    >
      <!-- each component is wrapped by a waterfall slot -->
      <waterfall-slot
        v-for="(item, index) in items"
        :key="item.index"
        :width="item.width"
        :height="item.height"
        :order="index"
        move-class="item-move"
      >
        <div class="item" :style="item.style" :index="item.index">
          <div class="position">{{ item.position }}</div>
          <div class="time">{{ item.time }}</div>
        </div>
      </waterfall-slot>
    </waterfall>
  </div>
</template>

<script>
import { Waterfall, WaterfallSlot } from "vue-waterfall";
import { ItemFactory } from "@/utils/item-factory";
// import '@/assets/css/bootstrap-grid.min.css'
// import '@/assets/css/base.css'
export default {
  components: {
    waterfall: Waterfall,
    "waterfall-slot": WaterfallSlot,
  },
  data() {
    return {
      align: "center",
      items: ItemFactory(100),
      isBusy: true,
    };
  },
  mounted() {
    const _this = this;
    // document.body.addEventListener(
    //   "click",
    //   function () {
    //     _this.shuffle();
    //     // this.$refs.waterfall.$emit('reflow') // manually trigger reflow action
    //   },
    //   false
    // );

    window.addEventListener("scroll", function () {
      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (scrollTop + window.innerHeight >= document.body.clientHeight) {
        _this.addItems();
      }
    });
  },
  methods: {
    addItems: function () {
      if (!this.isBusy && this.items.length < 200) {
        this.isBusy = true;
        this.items.push.apply(this.items, ItemFactory(50));
      }
    },
    // shuffle: function () {
    //   this.items.sort(function () {
    //     return Math.random() - 0.5;
    //   });
    // },
    reflowed: function () {
      this.isBusy = false;
    },
  },
};
</script>

<style scoped>
@import "~@/assets/css/base.css";
@import "~@/assets/css/bootstrap-grid.min.css";

.item-move {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
  -webkit-transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}
</style>
