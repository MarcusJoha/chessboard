<script setup lang="ts">
  import { computed, defineProps } from 'vue';

  const props = defineProps ({
    piece: String,
    row: Number,
    col: Number,
    isWhiteTurn: Boolean
  })

  const pieceColor = computed(() =>
    props.piece && props.piece.charCodeAt(0) < 9818 ? "white-piece" : "black-piece"
  );

  // Do not have to define emits when I have DragEvent
  const startDrag = (event: DragEvent) => {
    if(!isDraggable.value) return;
    event.dataTransfer?.setData(
    "text/plain",
    JSON.stringify({ piece: props.piece, row: props.row, col: props.col })
    );
  };

  const isDraggable = computed(() => {
    if (!props.piece) return false;
    const isWhitePiece = props.piece.charCodeAt(0) < 9818;
    return (isWhitePiece && props.isWhiteTurn) || (!isWhitePiece && !props.isWhiteTurn);
  })

</script>

<template>
  <div
  class="chess-piece"
  :class="[pieceColor]"
  :draggable="isDraggable"
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
