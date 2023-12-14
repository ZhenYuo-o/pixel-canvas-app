<template>
  <div id="app">
    <PixelCanvasComponent ref="PixelCanvasComponent" /> <!-- Correct component name here -->
  </div>
</template>

<script>
import PixelCanvasComponent from './components/PixelCanvasComponent.vue';

export default {
  components: {
    PixelCanvasComponent, // Use the correct component name here
  },
  methods: {
    changeColor(newColor) {
      this.$refs.PixelCanvasComponent.selectedColor = newColor; // Correct component reference
    },
  },
};
</script>
