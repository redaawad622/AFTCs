<template>
  <diV
    class="coloreBox"
    :style="{ 'background-color': color }"
    @click="$emit('updateColor')"
  ></diV>
</template>

<script>
export default {
  props: ['color'],
}
</script>

<style>
.coloreBox {
  max-width: 100%;
  width: 350px;
  height: 250px;
  border: 1px dashed;
  margin: 10px auto;
}
.circle {
  border-radius: 50%;
  cursor: pointer;
  height: 200px;
}
</style>
