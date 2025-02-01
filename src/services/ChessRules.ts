import type { TileSquare } from '@/types/tilesquare.ts';


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
  const isWhitePiece = piece !== null && piece !== undefined && piece.charCodeAt(0) >= 9818;

  for (const move of possibleMoves) {
    if (move.row >= 0 && move.row < 8 && move.col >= 0 && move.col < 8) {
      const index = move.row *8 + move.col;
      const targetPiece = board[index].piece;

      // check if target square is empty or has an enemy piece
      if (!targetPiece || (isWhitePiece && targetPiece.charCodeAt(0) < 9818) || (!isWhitePiece && targetPiece.charCodeAt(0) >= 9818)) {
        moves.push(board[index]);
      }
    }
  }
  return moves;
}


// export const getWhitePawnMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {
// }

// export const getBlackPawnMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {}

// export const getRookMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {}

// export const getBishopMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {}

// export const getQueenMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {}

// export const getKnightMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {}
