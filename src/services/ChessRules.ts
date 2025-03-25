import type { TileSquare } from '@/types/tilesquare.ts';
import { ChessPiece } from '@/ChessPiece';


// Check if target square is empty or has an enemy piece
// * Can move to that square if empty or enemy piece
const checkEnemyPieceOrEmpty = (index: number, board: TileSquare[], isWhitePiece: boolean): boolean => {
  const targetPiece = board[index].piece;
  return !targetPiece || (isWhitePiece && targetPiece.charCodeAt(0) >= 9818) || (!isWhitePiece && targetPiece.charCodeAt(0) < 9818);
}

const checkIfWhitePiece = (piece: ChessPiece | null): boolean => {
  return piece !== null && piece !== undefined && piece.charCodeAt(0) < 9818;

}

const isSquareUnderAttack = (row:number, col: number, board: TileSquare[], isWhitePiece: boolean): boolean => {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r * 8 + c].piece;

      if (piece && checkIfWhitePiece(piece) === isWhitePiece) {
        let moves: TileSquare[] = [];
        switch (piece) {
          case ChessPiece.WHITE_PAWN:
            moves = getWhitePawnMoves(r, c, board);
            break;
          case ChessPiece.BLACK_PAWN:
            moves = getBlackPawnMoves(r, c, board);
            break;
          case ChessPiece.WHITE_KNIGHT:
          case ChessPiece.BLACK_KNIGHT:
            moves = getKnightMoves(r, c, board);
            break;
          case ChessPiece.WHITE_ROOK:
          case ChessPiece.BLACK_ROOK:
            moves = getRookMoves(r, c, board);
            break;
          case ChessPiece.WHITE_BISHOP:
          case ChessPiece.BLACK_BISHOP:
            moves = getBishopMoves(r, c, board);
            break;
          case ChessPiece.WHITE_QUEEN:
          case ChessPiece.BLACK_QUEEN:
            moves = getQueenMoves(r, c, board);
            break;
          case ChessPiece.WHITE_KING:
          case ChessPiece.BLACK_KING:
            moves = getPossibleKingMoves(r, c, board).filter(
              move => Math.abs(move.row - row) > 1 || Math.abs(move.col - col) > 1
            ); // Exclude moves that would place kings adjacent to each other
            break;
        }

        if (moves.some(move => move.row === row && move.col === col)) {
          return true;
        }
      }
    }
  }
  return false;
};


export const isKingInCheck = (board: TileSquare[], isWhiteKing: boolean): boolean => {
  // Find the king's position
  const kingPiece = isWhiteKing ? ChessPiece.WHITE_KING : ChessPiece.BLACK_KING;
  let kingRow = -1;
  let kingCol = -1;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (board[r * 8 + c].piece === kingPiece) {
        kingRow = r;
        kingCol = c;
        break;
      }
    }
    if (kingRow !== -1) break; // Exit outer loop if king is found
  }
  // If the king is not found (shouldn't happen in a valid game)
  if (kingRow === -1 || kingCol === -1) {
    console.error("King not found on the board!");
    return false;
  }

  // Check if the king's position is under attack
  return isSquareUnderAttack(kingRow, kingCol, board, !isWhiteKing);
};

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
    if (board[captureLeftIndex].piece && checkEnemyPieceOrEmpty(captureLeftIndex, board, isWhitePiece)) {
      moves.push(board[captureLeftIndex]);
    }
  }

  // capture diagonally right
  if (row > 0 && col < 7) {
    const captureRightIndex = (row-1)*8 + col+1;
    if (board[captureRightIndex].piece && checkEnemyPieceOrEmpty(captureRightIndex, board, isWhitePiece)) {
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
    if (board[captureLeftIndex].piece && checkEnemyPieceOrEmpty(captureLeftIndex, board, isWhitePiece)) {
      moves.push(board[captureLeftIndex]);
    }
  }

  // capture diagonally right
  if (row < 7 && col < 7) {
    const captureRightIndex = (row+1)*8 + col+1;
    if (board[captureRightIndex].piece && checkEnemyPieceOrEmpty(captureRightIndex, board, isWhitePiece)) {
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
  const possibleMoves = getPossibleKingMoves(row,col,board);
  const piece = board[row*8 + col].piece;
  const isWhitePiece = checkIfWhitePiece(piece);

  return possibleMoves.filter(move => !isSquareUnderAttack(move.row, move.col, board, !isWhitePiece))
}

export const getPossibleKingMoves = (row: number, col: number, board: TileSquare[]): TileSquare[] => {
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
