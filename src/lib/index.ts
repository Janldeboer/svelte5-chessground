// Export the main component
export { default as Chessground } from './Chessground.svelte';

// Re-export types from chessground for convenience
export type { Api } from 'chessground/api';
export type { Config } from 'chessground/config';
export type { Key, Piece, Role, Color, File, Rank } from 'chessground/types';
