<script setup lang="ts">

import { computed, type PropType } from 'vue';
import { ChessPiece } from '@/ChessPiece';
import ChessPieceComp from './ChessPieceComp.vue';

 const props = defineProps({
    row: {
      type: Number,
      required: true
    },
    col: {
      type: Number,
      required: true
    },
    notation: {
      type: String,
      required: true
    },
    piece: {
      type: Object as PropType<ChessPiece>,
      default: null
  }
  })

  const emit = defineEmits(["tile-clicked", "piece-moved", "piece-dragged"]);

  const tileColor = computed(() => ((props.row ?? 0) + ( props.col ?? 0)) % 2 === 0 ? "light": "dark");

  const onTileClick = () => {
    emit("tile-clicked", {
      row:props.row,
      col:props.col,
      notation: props.notation,
      piece:props.piece
    })
  };

  const onDrop = (event:DragEvent) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer!.getData("text/plain"));
    if (data) {
      emit("piece-moved", {from: data, to: {row: props.row, col: props.col}});
    }
  }

</script>

<template>
  <div
    class="tile"
    :class="[tileColor]"
    @click="onTileClick"
    @drop="onDrop"
    @dragover.prevent
  >
    <ChessPieceComp
    v-if="piece"
    :piece="piece"
    :row="row"
    :col="col"
    @dragstart="startDrag"
    />

  </div>

</template>

<style scoped>
  .tile {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 30px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
  }
  .light {
    background-color: #f0d9b5;
  }
  .dark {
    background-color: #b58863;
  }
  .piece {
  pointer-events: none;
  font-size: 40px; /* Increase size for better visibility */
}

.tile:hover {
  background-color: rgb(126, 126, 155);
}

</style>
