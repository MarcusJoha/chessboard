import type { TileSquare } from '@/types/tilesquare.ts';
import type { ChessPiece } from '@/ChessPiece';


// Check if target square is empty or has an enemy piece
const checkEnemyPieceOrEmpty = (index: number, board: TileSquare[], isWhitePiece: boolean): boolean => {
  const targetPiece = board[index].piece;
  return !targetPiece || (isWhitePiece && targetPiece.charCodeAt(0) >= 9818) || (!isWhitePiece && targetPiece.charCodeAt(0) < 9818);
}

const checkIfWhitePiece = (piece: ChessPiece | null): boolean => {
  return piece !== null && piece !== undefined && piece.charCodeAt(0) < 9818;

}

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
  // move left
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

  // move right
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
  // move down
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

export const getBishopMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {
  const moves: TileSquare[] = [];
  const piece = board[row*8 + col].piece;
  const isWhitePiece = checkIfWhitePiece(piece);

  // move diagonally up-left
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

  // move diagonally up-right
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

  // move diagonally down-left
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

  // move diagonally down-right
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

// export const getQueenMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {}

// export const getKnightMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {}
