<template>
  <div>
    <span class="province">皖</span
    ><span class="license">{{ license | licenseFilter }}</span>
  </div>
</template>

<script>
export default {
  name: "CarLicense",
  components: {},
  props: {
    license: {
      type: String,
      default: "A8888",
    },
  },
  filters: {
    licenseFilter(value) {
      if (value.includes("皖")) {
        return value.replace("皖", "");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.province {
  width: 25px;
  height: 25px;
  display: inline-block;
  text-align: center;
  line-height: 25px;
  color: #fff;
  background-color: #0577ff;
}
.license {
  width: 75px;
  height: 25px;
  display: inline-block;
  text-align: center;
  line-height: 25px;
  color: #0577ff;
  background-color: #dcdeff;
}
</style>

