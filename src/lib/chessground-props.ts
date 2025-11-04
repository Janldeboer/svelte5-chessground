import type { Api } from 'chessground/api';
import type { Key, Color, FEN, Dests, Role, Piece, MoveMetadata, SetPremoveMetadata, Elements, SquareClasses, Mobility } from 'chessground/types';
import type { DrawShape, DrawBrushes } from 'chessground/draw';

/** Props for the Chessground Svelte component */
export interface ChessgroundProps {
	// Core configuration
	fen?: FEN; // Chess position in Forsyth notation
	orientation?: Color; // Board orientation: 'white' | 'black'
	turnColor?: Color; // Turn to play: 'white' | 'black'
	check?: Color | boolean; // True for current color, false to unset, or specific color
	lastMove?: Key[]; // Squares part of the last move, e.g., ["c3", "c4"]
	selected?: Key; // Square currently selected, e.g., "a1"
	coordinates?: boolean; // Include coords attributes
	coordinatesOnSquares?: boolean; // Include coords attributes on every square
	autoCastle?: boolean; // Immediately complete the castle by moving the rook after king move
	viewOnly?: boolean; // Don't bind events: the user will never be able to move pieces around
	disableContextMenu?: boolean; // Disable the context menu on the board
	addPieceZIndex?: boolean; // Adds z-index values to pieces (for 3D)
	addDimensionsCssVarsTo?: HTMLElement; // Add --cg-width and --cg-height CSS vars containing the board's dimensions to this element
	blockTouchScroll?: boolean; // Block scrolling via touch dragging on the board, e.g., for coordinate training
	touchIgnoreRadius?: number; // Ignore touches within a radius of an occupied square, in units of its circumradius
	trustAllEvents?: boolean; // Disable checking for human only input (e.isTrusted)
	
	// Highlight options
	highlightLastMove?: boolean; // Add last-move class to squares
	highlightCheck?: boolean; // Add check class to squares
	highlightCustom?: SquareClasses; // Add custom classes to custom squares
	
	// Animation options
	animationEnabled?: boolean; // Enable animations
	animationDuration?: number; // Animation duration in milliseconds
	
	// Movable options
	movableFree?: boolean; // All moves are valid - board editor mode
	movableColor?: Color | 'both'; // Color that can move: 'white' | 'black' | 'both' | undefined
	movableDests?: Dests; // Valid moves: {"a2": ["a3", "a4"], "b1": ["a3", "c3"]}
	movableShowDests?: boolean; // Whether to add the move-dest class on squares
	movableRookCastle?: boolean; // Castle by moving the king to the rook
	
	// Premovable options
	premovableEnabled?: boolean; // Allow premoves for color that cannot move
	premovableShowDests?: boolean; // Whether to add the premove-dest class on squares
	premovableCastle?: boolean; // Whether to allow king castle premoves
	premovableDests?: Key[]; // Premove destinations for the current selection
	premovableCustomDests?: Dests; // Use custom valid premoves: {"a2": ["a3", "a4"], "b1": ["a3", "c3"]}
	premovableUnrestrictedPremoves?: boolean; // If false, positions of friendly pieces will trim premove options
	premovableAdditionalPremoveRequirements?: Mobility; // Additional premove requirements
	
	// Predroppable options
	predroppableEnabled?: boolean; // Allow predrops for color that cannot move
	
	// Draggable options
	draggableEnabled?: boolean; // Allow moves & premoves to use drag'n drop
	draggableDistance?: number; // Minimum distance to initiate a drag; in pixels
	draggableAutoDistance?: boolean; // Lets chessground set distance to zero when user drags pieces
	draggableShowGhost?: boolean; // Show ghost of piece being dragged
	draggableDeleteOnDropOff?: boolean; // Delete a piece when it is dropped off the board
	
	// Selectable options
	selectableEnabled?: boolean; // Disable to enforce dragging over click-click move
	
	// Drawable options
	drawableEnabled?: boolean; // Can draw shapes
	drawableVisible?: boolean; // Can view shapes
	drawableDefaultSnapToValidMove?: boolean; // Default snap to valid move behavior
	drawableEraseOnMovablePieceClick?: boolean; // Clicking on a movable piece will clear the drawing
	drawableShapes?: DrawShape[]; // User-drawn shapes
	drawableAutoShapes?: DrawShape[]; // Computer-drawn shapes
	drawableBrushes?: DrawBrushes; // Custom brushes for drawing
	
	// Event callbacks
	onChange?: () => void; // Called after the situation changes on the board
	onMove?: (orig: Key, dest: Key, capturedPiece?: Piece) => void; // Called after a piece has been moved
	onDropNewPiece?: (piece: Piece, key: Key) => void; // Called after a new piece is dropped on the board
	onSelect?: (key: Key) => void; // Called when a square is selected
	onInsert?: (elements: Elements) => void; // Called when the board DOM has been (re)inserted
	onMoveAfter?: (orig: Key, dest: Key, metadata: MoveMetadata) => void; // Called after the move has been played
	onAfterNewPiece?: (role: Role, key: Key, metadata: MoveMetadata) => void; // Called after a new piece is dropped on the board (from movable events)
	onPremoveSet?: (orig: Key, dest: Key, metadata?: SetPremoveMetadata) => void; // Called after the premove has been set
	onPremoveUnset?: () => void; // Called after the premove has been unset
	onPredropSet?: (role: Role, key: Key) => void; // Called after the predrop has been set
	onPredropUnset?: () => void; // Called after the predrop has been unset
	onDrawableChange?: (shapes: DrawShape[]) => void; // Called after drawable shapes change
	
	api?: Api; // Bindable reference to the Chessground API instance
	[key: string]: any; // Additional HTML attributes
}
