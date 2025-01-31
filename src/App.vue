<script setup lang="ts">
import ChessBoard from './components/ChessBoard.vue'
</script>

<template>
  <header class="header">
    <h1>My Chessboard</h1>
  </header>

  <main>
    <div class="app">
    <ChessBoard />
  </div>
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
}

/* @media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
} */
</style>
