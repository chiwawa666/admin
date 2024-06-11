<template>
  <detail :is-edit="false" />
</template>

<script>
import detail from "@/views/civilized/rule/components/Detail";

export default {
  name: "Detail1",
  components: { detail },
};
</script>
<style scoped >
.el-upload {
  text-align: start;
}
</style>

