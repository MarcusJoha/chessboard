import type { TileSquare } from '@/types/tilesquare.ts';
import { ChessPiece } from '@/ChessPiece';


// Check if target square is empty or has an enemy piece
const checkEnemyPieceOrEmpty = (index: number, board: TileSquare[], isWhitePiece: boolean): boolean => {
  const targetPiece = board[index].piece;
  return !targetPiece || (isWhitePiece && targetPiece.charCodeAt(0) >= 9818) || (!isWhitePiece && targetPiece.charCodeAt(0) < 9818);
}

const checkIfWhitePiece = (piece: ChessPiece | null): boolean => {
  return piece !== null && piece !== undefined && piece.charCodeAt(0) < 9818;

}
/**
 *
 * @param row
 * @param col
 * @param board
 * @returns boolean if square is under attack
 *
 * Function to decide if a square is under attack by an enemy piece for when king moves
 * At this moment I get an error of to much recursion, I will try to fix it later
 */

// const isSquareUnderAttack = (row: number, col: number, board: TileSquare[], isWhitePiece: boolean): boolean => {
//   for (let r = 0; r < 8; r++) {
//     for (let c = 0; c < 8; c++) {
//       const piece = board[r * 8 + c].piece;
//       if (piece && checkIfWhitePiece(piece) !== isWhitePiece) {
//         let moves: TileSquare[] = [];
//         switch (piece) {
//           case ChessPiece.WHITE_KNIGHT:
//           case ChessPiece.BLACK_KNIGHT:
//             moves = getKnightMoves(r, c, board);
//             break;
//           case ChessPiece.WHITE_PAWN:
//             moves = getWhitePawnMoves(r, c, board);
//             break;
//           case ChessPiece.BLACK_PAWN:
//             moves = getBlackPawnMoves(r, c, board);
//             break;
//           case ChessPiece.WHITE_ROOK:
//           case ChessPiece.BLACK_ROOK:
//             moves = getRookMoves(r, c, board);
//             break;
//           case ChessPiece.WHITE_BISHOP:
//           case ChessPiece.BLACK_BISHOP:
//             moves = getBishopMoves(r, c, board);
//             break;
//           case ChessPiece.WHITE_QUEEN:
//           case ChessPiece.BLACK_QUEEN:
//             moves = getQueenMoves(r, c, board);
//             break;
//           case ChessPiece.WHITE_KING:
//           case ChessPiece.BLACK_KING:
//             moves = getKingMoves(r, c, board);
//             break;
//         }
//         if (moves.some(move => move.row === row && move.col === col)) {
//           return true;
//         }
//       }
//     }
//   }
//   return false;
// }

export const getKnightMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {
  const moves: TileSquare[] = [];
  const possibleMoves = [
    { row: row - 2, col: col - 1 },
    { row: row - 2, col: col + 1 },
    { row: row - 1, col: col - 2 },
    { row: row - 1, col: col + 2 },
    { row: row + 1, col: col - 2 },
    { row: row + 1, col: col + 2 },
    { row: row + 2, col: col - 1 },
    { row: row + 2, col: col + 1 },
  ];

  const piece = board[row * 8 + col].piece;
  const isWhitePiece = checkIfWhitePiece(piece);

  for (const move of possibleMoves) {
    if (move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8) {
      const index = move.row *8 + move.col;

      // check if target square is empty or has an enemy piece
      if (checkEnemyPieceOrEmpty(index, board, isWhitePiece)) {
        moves.push(board[index]);
      }
    }
  }
  return moves;
}

export const getWhitePawnMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {
  const moves: TileSquare[] = [];

  const piece = board[row * 8 + col].piece;
  const isWhitePiece = checkIfWhitePiece(piece);

  if (row > 0) {
    const forwardOneIndex = (row - 1) * 8 + col;
    if(!board[forwardOneIndex].piece) {
      moves.push(board[forwardOneIndex])

      if (row === 6) {
        const forwardTwoIndex = (row-2)*8 + col;
        if(!board[forwardTwoIndex].piece) {
          moves.push(board[forwardTwoIndex]);
        }
      }
    }
  }
  // capture diagonally left
  if (row > 0 && col > 0) {
    const captureLeftIndex = (row-1)*8 + col-1;
    if (checkEnemyPieceOrEmpty(captureLeftIndex, board, isWhitePiece)) {
      moves.push(board[captureLeftIndex]);
    }
  }

  // capture diagonally right
  if (row > 0 && col < 7) {
    const captureRightIndex = (row-1)*8 + col+1;
    if (checkEnemyPieceOrEmpty(captureRightIndex, board, isWhitePiece)) {
      moves.push(board[captureRightIndex]);
    }
  }
  return moves;
}

export const getBlackPawnMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {
  const moves: TileSquare[] = [];

  const piece = board[row * 8 + col].piece;
  const isWhitePiece = piece !== null && piece !== undefined && piece.charCodeAt(0) < 9818;

  if (row < 7) {
    const forwardOneIndex = (row + 1) * 8 + col;
    if(!board[forwardOneIndex].piece) {
      moves.push(board[forwardOneIndex])

      if (row === 1) {
        const forwardTwoIndex = (row+2)*8 + col;
        if(!board[forwardTwoIndex].piece) {
          moves.push(board[forwardTwoIndex]);
        }
      }
    }
  }
  // capture diagonally left
  if (row < 7 && col > 0) {
    const captureLeftIndex = (row+1)*8 + col-1;
    if (checkEnemyPieceOrEmpty(captureLeftIndex, board, isWhitePiece)) {
      moves.push(board[captureLeftIndex]);
    }
  }

  // capture diagonally right
  if (row < 7 && col < 7) {
    const captureRightIndex = (row+1)*8 + col+1;
    if (checkEnemyPieceOrEmpty(captureRightIndex, board, isWhitePiece)) {
      moves.push(board[captureRightIndex]);
    }
  }
  return moves;
}

export const getRookMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {
  const moves: TileSquare[] = [];
  const piece = board[row*8 + col].piece;
  const isWhitePiece = checkIfWhitePiece(piece);

  // move up
  const upMoves = moveUp(row, col, board, isWhitePiece);
  moves.push(...upMoves);

  // move left
  const leftMoves = moveLeft(row, col, board, isWhitePiece);
  moves.push(...leftMoves);

  // move right
  const rightMoves = moveRight(row, col, board, isWhitePiece);
  moves.push(...rightMoves);
  // move down
  const downMoves = moveDown(row, col, board, isWhitePiece);
  moves.push(...downMoves);

  return moves;

}

export const getBishopMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {
  const moves: TileSquare[] = [];
  const piece = board[row*8 + col].piece;
  const isWhitePiece = checkIfWhitePiece(piece);

  // move diagonally up-left
  const upLeftMoves = moveUpLeft(row, col, board, isWhitePiece);
  moves.push(...upLeftMoves);

  // move diagonally up-right
  const upRightMoves = moveUpRight(row, col, board, isWhitePiece);
  moves.push(...upRightMoves);

  // move diagonally down-left
  const downLeftMoves = movemoveDownLeft(row, col, board, isWhitePiece);
  moves.push(...downLeftMoves);

  // move diagonally down-right
  const downRightMoves = moveDownRight(row, col, board, isWhitePiece);
  moves.push(...downRightMoves);

  return moves;
}

export const getQueenMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {
  const moves: TileSquare[] = [];
  const piece = board[row*8 + col].piece;
  const isWhitePiece = checkIfWhitePiece(piece);

  const upMoves = moveUp(row, col, board, isWhitePiece);
  moves.push(...upMoves);

  // move left
  const leftMoves = moveLeft(row, col, board, isWhitePiece);
  moves.push(...leftMoves);

  // move right
  const rightMoves = moveRight(row, col, board, isWhitePiece);
  moves.push(...rightMoves);
  // move down
  const downMoves = moveDown(row, col, board, isWhitePiece);
  moves.push(...downMoves);

  // move diagonally up-left
  const upLeftMoves = moveUpLeft(row, col, board, isWhitePiece);
  moves.push(...upLeftMoves);

  // move diagonally up-right
  const upRightMoves = moveUpRight(row, col, board, isWhitePiece);
  moves.push(...upRightMoves);

  // move diagonally down-left
  const downLeftMoves = movemoveDownLeft(row, col, board, isWhitePiece);
  moves.push(...downLeftMoves);

  // move diagonally down-right
  const downRightMoves = moveDownRight(row, col, board, isWhitePiece);
  moves.push(...downRightMoves);

  return moves;
}

export const getKingMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {
  const moves: TileSquare[] = [];
  const possibleMoves = [
    { row: row - 1, col: col - 1 },
    { row: row - 1, col: col },
    { row: row - 1, col: col + 1 },
    { row: row, col: col - 1 },
    { row: row, col: col + 1 },
    { row: row + 1, col: col - 1 },
    { row: row + 1, col: col },
    { row: row + 1, col: col + 1 },
  ];
  const piece = board[row*8 + col].piece;
  const isWhitePiece = checkIfWhitePiece(piece);
  for (const move of possibleMoves) {
    if (move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8) {
      const index = move.row*8 + move.col;
      if (checkEnemyPieceOrEmpty(index, board, isWhitePiece)) {
        moves.push(board[index]);
      }
    }
  }
  return moves;
}


const moveUp = (row: number, col: number,board: TileSquare[], isWhitePiece: boolean): TileSquare[] => {
  const moves: TileSquare[] = [];
  for (let r = row - 1; r >= 0; r--) {
    const index = r*8 + col;
    if (board[index].piece) {
      if (checkEnemyPieceOrEmpty(index, board, isWhitePiece)) {
        moves.push(board[index]);
      }
      break;
    }
    moves.push(board[index]);
  }
  return moves;
}

const moveDown = (row: number, col: number, board: TileSquare[], isWhitePiece: boolean) => {
  const moves: TileSquare[] = [];
  for (let r = row + 1; r < 8; r++) {
    const index = r*8 + col;
    if (board[index].piece) {
      if (checkEnemyPieceOrEmpty(index, board, isWhitePiece)) {
        moves.push(board[index]);
      }
      break;
    }
    moves.push(board[index]);
  }
  return moves;

}

const moveLeft = (row: number, col: number, board: TileSquare[], isWhitePiece: boolean): TileSquare[] => {
  const moves: TileSquare[] = [];
  for (let c = col -1; c >= 0; c--) {
    const index = row*8 + c;
    if (board[index].piece) {
      if (checkEnemyPieceOrEmpty(index, board, isWhitePiece)) {
        moves.push(board[index]);
      }
      break;
    }
    moves.push(board[index]);
  }
  return moves;
}

const moveRight = (row: number, col: number, board: TileSquare[], isWhitePiece: boolean): TileSquare[] => {
  const moves: TileSquare[] = [];
  for (let c = col +1; c <8; c++) {
    const index = row*8 + c;
    if (board[index].piece) {
      if (checkEnemyPieceOrEmpty(index, board, isWhitePiece)) {
        moves.push(board[index]);
      }
      break;
    }
    moves.push(board[index]);
  }
  return moves;
}

const moveUpLeft = (row: number, col: number, board: TileSquare[], isWhitePiece: boolean): TileSquare[] => {
  const moves: TileSquare[] = [];
  for (let r = row-1, c = col-1; r >= 0 && c >= 0; r--,c--) {
    const index = r*8 + c;
    if (board[index].piece) {
      if (checkEnemyPieceOrEmpty(index, board, isWhitePiece)) {
        moves.push(board[index]);
      }
      break;
    }
    moves.push(board[index]);
  }
  return moves;
}

const moveUpRight = (row: number, col: number, board: TileSquare[], isWhitePiece: boolean): TileSquare[] => {
  const moves: TileSquare[] = [];
  for (let r = row-1, c = col+1; r >= 0 && c < 8; r--,c++) {
    const index = r*8 + c;
    if (board[index].piece) {
      if (checkEnemyPieceOrEmpty(index, board, isWhitePiece)) {
        moves.push(board[index]);
      }
      break;
    }
    moves.push(board[index]);
  }
  return moves;
}

const movemoveDownLeft = (row: number, col: number, board: TileSquare[], isWhitePiece: boolean): TileSquare[] => {
  const moves: TileSquare[] = [];
  for (let r = row+1, c = col-1; r < 8 && c >= 0; r++,c--) {
    const index = r*8 + c;
    if (board[index].piece) {
      if (checkEnemyPieceOrEmpty(index, board, isWhitePiece)) {
        moves.push(board[index]);
      }
      break;
    }
    moves.push(board[index]);
  }
  return moves;
}

const moveDownRight = (row: number, col: number, board: TileSquare[], isWhitePiece: boolean): TileSquare[] => {
  const moves: TileSquare[] = [];
  for (let r = row+1, c = col+1; r < 8 && c < 8; r++,c++) {
    const index = r*8 + c;
    if (board[index].piece) {
      if (checkEnemyPieceOrEmpty(index, board, isWhitePiece)) {
        moves.push(board[index]);
      }
      break;
    }
    moves.push(board[index]);
  }
  return moves;
}
