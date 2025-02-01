import { ChessPiece } from "@/ChessPiece";

export interface TileSquare {
  row: number;
  col: number;
  notation: string;
  piece: ChessPiece | null;
}
