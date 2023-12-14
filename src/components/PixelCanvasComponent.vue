<template>
  <div>
    <div class="canvas-container">
      <canvas ref="canvas" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing" @mouseout="stopDrawing"></canvas>
    </div>
    <div class="pixel-counter">
      <p>Placed Pixels: {{ placedPixels }} / {{ pixelLimit }}</p>
    </div>
    <div class="color-buttons">
      <div
          v-for="color in colors"
          :key="color"
          class="color-pixel"
          :style="{ backgroundColor: color }"
          @click="changeColor(color)"
      ></div>
    </div>
    <div class="download-button">
      <button @click="downloadCanvas">Download as PNG</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      isDrawing: false,
      selectedColor: '#000', // Default color (black)
      pixelSize: 10, // Adjust as needed
      placedPixels: 0, // Counter for placed pixels
      pixelLimit: 1000, // Adjust the pixel limit
      lastPixelPosition: null, // Store the last drawn pixel position
      currentStrokePixels: [], // Store pixel positions for the current stroke
      colors: ['#000', '#515252', '#898d90', '#d4d7d9',
        '#ffffff','#6d001a','#be0039','#ff4500',
        '#ffa800','#ffd635', '#fff8b8','#00a368'
        ,'#00cc78','#7eed56','#51e9f4','#00ccc0',
        '#009eaa','#94b3ff','#3690ea','#6a5cff'
        ,'#493ac1','#2450a4','#811e9f','#b44ac0'
        ,'#e4abff','#de107f','#ff3881','#ff99aa'
        ,'#6d482f','#9c6926','#ffb470'], // List of colors
    };
  },
  methods: {
    startDrawing(e) {
      if (this.placedPixels >= this.pixelLimit) {
        this.isDrawing = false; // Stop drawing when the limit is reached
        return;
      }
      this.isDrawing = true;
      this.draw(e);
    },
    stopDrawing() {
      this.isDrawing = false;
      this.lastPixelPosition = null; // Reset the last drawn pixel position when the stroke ends
      this.currentStrokePixels = []; // Reset the current stroke's pixel positions
    },
    draw(e) {
      if (!this.isDrawing) return;

      const { x, y } = this.getPixelCoordinates(e);

      // Check if the new pixel is placed at the same position as the last one
      if (
          this.lastPixelPosition &&
          this.lastPixelPosition.x === x &&
          this.lastPixelPosition.y === y
      ) {
        return; // Don't increment the counter for the same position
      }

      // Check if the new pixel is part of the current stroke
      if (this.currentStrokePixels.some((pixel) => pixel.x === x && pixel.y === y)) {
        return; // Don't increment the counter for the same position within the current stroke
      }

      this.ctx.fillStyle = this.selectedColor; // Use the selected color
      this.ctx.fillRect(x, y, this.pixelSize, this.pixelSize);

      // Increment the placed pixels counter
      this.placedPixels += 1;

      // Update the last drawn pixel position
      this.lastPixelPosition = { x, y };

      // Add the current pixel position to the current stroke
      this.currentStrokePixels.push({ x, y });

      if (this.placedPixels >= this.pixelLimit) {
        this.isDrawing = false; // Stop drawing when the limit is reached
      }
    },
    getPixelCoordinates(e) {
      const x = Math.floor((e.clientX - this.canvas.getBoundingClientRect().left) / this.pixelSize) * this.pixelSize;
      const y = Math.floor((e.clientY - this.canvas.getBoundingClientRect().top) / this.pixelSize) * this.pixelSize;
      return { x, y };
    },
    changeColor(newColor) {
      this.selectedColor = newColor;
    },
    downloadCanvas() {
      const link = document.createElement('a');
      link.href = this.canvas.toDataURL('image/png');
      link.download = 'canvas.png';
      link.click();
    },
  },
  mounted() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext('2d');

    // Set the canvas size
    this.canvas.width = 1000; // Adjust as needed
    this.canvas.height = 900; // Adjust as needed
  },
};
</script>

<style>


.pixel-counter {
  text-align: center;
  margin-top: 10px;
}

.color-buttons {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.color-pixel {
  width: 20px;
  height: 20px;
  margin: 0 5px;
  cursor: pointer;
}

.download-button {
  text-align: center;
  margin-top: 10px;
}
</style>
