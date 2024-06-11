<template>
  <!-- 单穴 -->
  <div
    v-if="data.oddType == 1"
    class="block"
    :class="[
      {
        eco:
          data.functionid == 1 || data.functionid == 2 || data.functionid == 3,
      },
      { blue: data.state === 3 },
      { brought: data.state === 1 },
    ]"
    @click="$emit('clickGrave', data.id)"
  >
    <div class="myid">{{ data.num }}</div>
  </div>
  <!-- 双穴 -->
  <div
    v-else
    class="block"
    :class="[
      {
        eco:
          data.functionid == 1 || data.functionid == 2 || data.functionid == 3,
      },
      { blue: data.state === 3 },
      { brought: data.state === 1 },
    ]"
    @click="$emit('clickGrave', data.id)"
  >
    <div class="doubleLeft" :class="[{ blue: data.state === 2 }]"></div>
    <div class="myid">{{ data.num }}</div>
  </div>
</template>

<script>
export default {
  name: "GraveBlock",
  props: {
    data: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {};
  },

  created() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.block {
  display: inline-block;
  width: 80px;
  height: 40px;
  margin-top: 20px;
  margin-right: 20px;
  border: 3px solid #979797;
  border-radius: 5px;
  position: relative;
  .doubleLeft {
    width: 50%;
    height: 100%;
    border-right: 2px solid #000;
  }

  .brought {
    background-color: #8ec937;
  }
}
.eco {
  border: 5px solid #1c9522;
}
.blue {
  background-color: #5894ff;
}
.brought {
  background-color: #8ec937;
}
.myid {
  position: absolute;
  bottom: -22px;
  text-align: center;
  box-sizing: border-box;
  width: 100%;
}
</style>
