<script setup lang="ts">
  import { computed, defineProps, defineEmits, } from 'vue';

  const props = defineProps ({
    piece: String,
    row: Number,
    col: Number,
  })

  const emit = defineEmits( ["tile-clicked", "piece-dragged"]);

  const pieceColor = computed(() =>
    props.piece && props.piece.charCodeAt(0) < 9818 ? "white-piece" : "black-piece"
  );

  const startDrag = (event: DragEvent) => {
    event.dataTransfer?.setData(
    "text/plain",
    JSON.stringify({ piece: props.piece, row: props.row, col: props.col })
    );

    emit("piece-dragged", { row: props.row, col: props.col });
  };

</script>

<template>
  <div
  class="chess-piece"
  :class="[pieceColor]"
  draggable="true"
  @dragstart="startDrag"
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
