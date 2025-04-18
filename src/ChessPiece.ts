export enum ChessPiece {
  BLACK_ROOK = "♜",
  BLACK_KNIGHT = "♞",
  BLACK_BISHOP = "♝",
  BLACK_QUEEN = "♛",
  BLACK_KING = "♚",
  BLACK_PAWN = "♟",
  WHITE_ROOK = "♖",
  WHITE_KNIGHT = "♘",
  WHITE_BISHOP = "♗",
  WHITE_QUEEN = "♕",
  WHITE_KING = "♔",
  WHITE_PAWN = "♙",
}

export type ChessPieceType = typeof ChessPiece[keyof typeof ChessPiece];
