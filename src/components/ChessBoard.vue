
<script setup lang="ts">

  import {ref, onMounted} from 'vue'
  import BoardSquare from './BoardSquare.vue';
  import { ChessPiece } from '@/ChessPiece';
  import type { TileSquare } from '@/types/tilesquare.ts';
  import { getKnightMoves, getWhitePawnMoves, getBlackPawnMoves, getRookMoves, getBishopMoves, getQueenMoves, getKingMoves, isKingInCheck } from '@/services/ChessRules';


const board = ref<TileSquare[]>([]); // ref([])
const letters = ['a','b','c','d','e','f','g','h'];
// const ranks = [8,7,6,5,4,3,2,1]

// todo: should move this to a another file
const initialPieces: Record<number, ChessPiece> = {
    0: ChessPiece.BLACK_ROOK, 1: ChessPiece.BLACK_KNIGHT, 2: ChessPiece.BLACK_BISHOP,
    3: ChessPiece.BLACK_QUEEN, 4: ChessPiece.BLACK_KING, 5: ChessPiece.BLACK_BISHOP,
    6: ChessPiece.BLACK_KNIGHT, 7: ChessPiece.BLACK_ROOK,
    8: ChessPiece.BLACK_PAWN, 9: ChessPiece.BLACK_PAWN, 10: ChessPiece.BLACK_PAWN,
    11: ChessPiece.BLACK_PAWN, 12: ChessPiece.BLACK_PAWN, 13: ChessPiece.BLACK_PAWN,
    14: ChessPiece.BLACK_PAWN, 15: ChessPiece.BLACK_PAWN,

    48: ChessPiece.WHITE_PAWN, 49: ChessPiece.WHITE_PAWN, 50: ChessPiece.WHITE_PAWN,
    51: ChessPiece.WHITE_PAWN, 52: ChessPiece.WHITE_PAWN, 53: ChessPiece.WHITE_PAWN,
    54: ChessPiece.WHITE_PAWN, 55: ChessPiece.WHITE_PAWN,
    56: ChessPiece.WHITE_ROOK, 57: ChessPiece.WHITE_KNIGHT, 58: ChessPiece.WHITE_BISHOP,
    59: ChessPiece.WHITE_QUEEN, 60: ChessPiece.WHITE_KING, 61: ChessPiece.WHITE_BISHOP,
    62: ChessPiece.WHITE_KNIGHT, 63: ChessPiece.WHITE_ROOK
  };
  // const initialPieces: Record<NumericKeys, string> = {
    //   0: "♜", 1: "♞", 2: "♝", 3: "♛", 4: "♚", 5: "♝", 6: "♞", 7: "♜",
    //   8: "♟", 9: "♟", 10: "♟", 11: "♟", 12: "♟", 13: "♟", 14: "♟", 15: "♟",
    //   48: "♙", 49: "♙", 50: "♙", 51: "♙", 52: "♙", 53: "♙", 54: "♙", 55: "♙",
    //   56: "♖", 57: "♘", 58: "♗", 59: "♕", 60: "♔", 61: "♗", 62: "♘", 63: "♖"
    // };

const isWhiteTurn = ref(true);

const initializeBoard = () => {
  board.value = Array.from({length: 64}, (_,i) => ({
  row: Math.floor(i/8),
  col: i%8,
  notation: letters[i%8] + String(8-Math.floor(i/8)),
  piece: initialPieces[i] || null
  }));
}

const movePiece = ({ from, to }: { from: TileSquare; to: TileSquare }) => {
  const fromIndex = from.row * 8 + from.col;
  const toIndex = to.row * 8 + to.col;

  // If the piece exists at the source square
  if (board.value[fromIndex].piece) {
    // Get valid moves for the piece
    const validMoves = getValidMoves(board.value[fromIndex].piece, from.row, from.col);

    // Check if the target square is a valid move
    if (validMoves.some(move => move.row === to.row && move.col === to.col)) {
      // Check if the move is valid (doesn't leave the king in check)
      if (isValidBoard(fromIndex, toIndex)) {
        // Update the board
        board.value[toIndex].piece = board.value[fromIndex].piece;
        board.value[fromIndex].piece = null;

        // Switch turns
        isWhiteTurn.value = !isWhiteTurn.value;

        console.log(
          `Moved ${board.value[toIndex].piece} from ${board.value[fromIndex].notation} to ${board.value[toIndex].notation}`
        );
      } else {
        console.log("Invalid move: King would be in check.");
      }
    } else {
      console.log("Invalid move");
    }
  }
};

const isValidBoard = (fromIndex: number, toIndex: number): boolean => {
  // Create a copy of the board
  const boardCopy = board.value.map(tile => ({ ...tile }));

  // Simulate the move
  boardCopy[toIndex].piece = boardCopy[fromIndex].piece;
  boardCopy[fromIndex].piece = null;

  const isWhiteKing = isWhiteTurn.value;

  const isCheck = isKingInCheck(boardCopy, isWhiteKing);

  return !isCheck;
};

const getValidMoves = (piece: ChessPiece, row: number, col: number): TileSquare[] => {
  const possibleMoves = (() => {
    switch (piece) {
      case ChessPiece.WHITE_KNIGHT:
      case ChessPiece.BLACK_KNIGHT:
        return getKnightMoves(row, col, board.value);
      case ChessPiece.WHITE_PAWN:
        return getWhitePawnMoves(row, col, board.value);
      case ChessPiece.BLACK_PAWN:
        return getBlackPawnMoves(row, col, board.value);
      case ChessPiece.WHITE_ROOK:
      case ChessPiece.BLACK_ROOK:
        return getRookMoves(row, col, board.value);
      case ChessPiece.WHITE_BISHOP:
      case ChessPiece.BLACK_BISHOP:
        return getBishopMoves(row, col, board.value);
      case ChessPiece.WHITE_QUEEN:
      case ChessPiece.BLACK_QUEEN:
        return getQueenMoves(row, col, board.value);
      case ChessPiece.WHITE_KING:
      case ChessPiece.BLACK_KING:
        return getKingMoves(row, col, board.value);
      default:
        return [];
    }
  })();

  // Filter out moves that leave the king in check (handle pinned pieces)
  return possibleMoves.filter(move => {
    const fromIndex = row * 8 + col;
    const toIndex = move.row * 8 + move.col;

    // Simulate the move and check if the king is in check
    return isValidBoard(fromIndex, toIndex);
  });
};

const handleTileClick = (tile: TileSquare) => {
  console.log(`Tile clicked: Row ${tile.row}, Column ${tile.col}, Notation ${tile.notation}, Piece: ${tile.piece}`);
};

function resetChessBoard() {
  initializeBoard()
  isWhiteTurn.value = true;
}

onMounted(initializeBoard);


</script>

<template>
<h3>{{ isWhiteTurn ? "White" : "Black" }} turn</h3>
<div class="board">
    <BoardSquare
      v-for="(tile, index) in board"
      :key="index"
      :row="tile.row"
      :col="tile.col"
      :notation="tile.notation"
      :piece="tile.piece as ChessPiece"
      :isWhiteTurn="isWhiteTurn"
      @tile-clicked="handleTileClick"
      @piece-moved="movePiece"
    />
  </div>
    <button class="reset-button" @click="resetChessBoard">Reset Chessboard</button>

</template>

<style scoped>
  .board {
    display: grid;
    grid-template-columns: repeat(8, 60px);
    grid-template-rows: repeat(8, 60px);
    width: 480px;
    border: 2px solid black;
  }
  .reset-button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    transition: 0.3s;
    margin-top: 1rem;
  }
  .reset-button:active {
    background-color: #0056b3;
    transform: scale(0.95);
  }
  .reset-button:hover {
    background-color: #0056b3;
  }
</style>
