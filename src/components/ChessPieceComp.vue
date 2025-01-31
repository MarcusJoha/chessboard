<script lang="ts">
  import { computed } from 'vue';

  export default {
    props: {
      piece: String,
      row: Number,
      col: Number,
    },

    emits: ["tile-clicked", "piece-moved"],
    setup(props, { emit }) {
      const pieceColor = computed(() =>
        props.piece && props.piece.charCodeAt(0) < 9818 ? "white" : "black"
      );
      const onDrop = (event) => {
      const data = JSON.parse(event.dataTransfer.getData("text/plain"));
      emit("piece-moved", { from: data, to: { row: props.row, col: props.col } });
    };

      return {pieceColor, onDrop};
    }
  }

</script>

<template>
  <div
  class="chess-piece"
  :class="pieceColor"
  draggable="true"
  @piece-drag="startDrag"
  > {{ piece }}</div>

</template>

<style scoped>

.chess-piece {
  font-size: 40px;
  cursor: grab;
  user-select: none;
}

.white-piece {
  color: white;
}

.black-piece {
  color: black;
}

</style>
