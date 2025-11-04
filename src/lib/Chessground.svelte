<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Chessground as ChessgroundApi } from 'chessground';
	import type { Api } from 'chessground/api';
	import type { Config } from 'chessground/config';
	import type { Key, Color, FEN, Dests, Role, Piece, MoveMetadata, SetPremoveMetadata, Elements, SquareClasses, Mobility } from 'chessground/types';
	import type { DrawShape, DrawBrushes } from 'chessground/draw';

	interface ChessgroundProps {
		// Core configuration
		/**
		 * Chess position in Forsyth notation
		 */
		fen?: FEN;
		
		/**
		 * Board orientation: 'white' | 'black'
		 */
		orientation?: Color;
		
		/**
		 * Turn to play: 'white' | 'black'
		 */
		turnColor?: Color;
		
		/**
		 * True for current color, false to unset, or specific color
		 */
		check?: Color | boolean;
		
		/**
		 * Squares part of the last move, e.g., ["c3", "c4"]
		 */
		lastMove?: Key[];
		
		/**
		 * Square currently selected, e.g., "a1"
		 */
		selected?: Key;
		
		/**
		 * Include coords attributes
		 */
		coordinates?: boolean;
		
		/**
		 * Include coords attributes on every square
		 */
		coordinatesOnSquares?: boolean;
		
		/**
		 * Immediately complete the castle by moving the rook after king move
		 */
		autoCastle?: boolean;
		
		/**
		 * Don't bind events: the user will never be able to move pieces around
		 */
		viewOnly?: boolean;
		
		/**
		 * Disable the context menu on the board
		 */
		disableContextMenu?: boolean;
		
		/**
		 * Adds z-index values to pieces (for 3D)
		 */
		addPieceZIndex?: boolean;
		
		/**
		 * Add --cg-width and --cg-height CSS vars containing the board's dimensions to this element
		 */
		addDimensionsCssVarsTo?: HTMLElement;
		
		/**
		 * Block scrolling via touch dragging on the board, e.g., for coordinate training
		 */
		blockTouchScroll?: boolean;
		
		/**
		 * Ignore touches within a radius of an occupied square, in units of its circumradius
		 */
		touchIgnoreRadius?: number;
		
		/**
		 * Disable checking for human only input (e.isTrusted)
		 */
		trustAllEvents?: boolean;
		
		// Highlight options
		/**
		 * Add last-move class to squares
		 */
		highlightLastMove?: boolean;
		
		/**
		 * Add check class to squares
		 */
		highlightCheck?: boolean;
		
		/**
		 * Add custom classes to custom squares
		 */
		highlightCustom?: SquareClasses;
		
		// Animation options
		/**
		 * Enable animations
		 */
		animationEnabled?: boolean;
		
		/**
		 * Animation duration in milliseconds
		 */
		animationDuration?: number;
		
		// Movable options
		/**
		 * All moves are valid - board editor mode
		 */
		movableFree?: boolean;
		
		/**
		 * Color that can move: 'white' | 'black' | 'both' | undefined
		 */
		movableColor?: Color | 'both';
		
		/**
		 * Valid moves: {"a2": ["a3", "a4"], "b1": ["a3", "c3"]}
		 */
		movableDests?: Dests;
		
		/**
		 * Whether to add the move-dest class on squares
		 */
		movableShowDests?: boolean;
		
		/**
		 * Castle by moving the king to the rook
		 */
		movableRookCastle?: boolean;
		
		// Premovable options
		/**
		 * Allow premoves for color that cannot move
		 */
		premovableEnabled?: boolean;
		
		/**
		 * Whether to add the premove-dest class on squares
		 */
		premovableShowDests?: boolean;
		
		/**
		 * Whether to allow king castle premoves
		 */
		premovableCastle?: boolean;
		
		/**
		 * Premove destinations for the current selection
		 */
		premovableDests?: Key[];
		
		/**
		 * Use custom valid premoves: {"a2": ["a3", "a4"], "b1": ["a3", "c3"]}
		 */
		premovableCustomDests?: Dests;
		
		/**
		 * If falsy, positions of friendly pieces will trim premove options
		 */
		premovableUnrestrictedPremoves?: boolean;
		
		/**
		 * Additional premove requirements
		 */
		premovableAdditionalPremoveRequirements?: Mobility;
		
		// Predroppable options
		/**
		 * Allow predrops for color that cannot move
		 */
		predroppableEnabled?: boolean;
		
		// Draggable options
		/**
		 * Allow moves & premoves to use drag'n drop
		 */
		draggableEnabled?: boolean;
		
		/**
		 * Minimum distance to initiate a drag; in pixels
		 */
		draggableDistance?: number;
		
		/**
		 * Lets chessground set distance to zero when user drags pieces
		 */
		draggableAutoDistance?: boolean;
		
		/**
		 * Show ghost of piece being dragged
		 */
		draggableShowGhost?: boolean;
		
		/**
		 * Delete a piece when it is dropped off the board
		 */
		draggableDeleteOnDropOff?: boolean;
		
		// Selectable options
		/**
		 * Disable to enforce dragging over click-click move
		 */
		selectableEnabled?: boolean;
		
		// Drawable options
		/**
		 * Can draw shapes
		 */
		drawableEnabled?: boolean;
		
		/**
		 * Can view shapes
		 */
		drawableVisible?: boolean;
		
		/**
		 * Default snap to valid move behavior
		 */
		drawableDefaultSnapToValidMove?: boolean;
		
		/**
		 * Clicking on a movable piece will clear the drawing
		 */
		drawableEraseOnMovablePieceClick?: boolean;
		
		/**
		 * User-drawn shapes
		 */
		drawableShapes?: DrawShape[];
		
		/**
		 * Computer-drawn shapes
		 */
		drawableAutoShapes?: DrawShape[];
		
		/**
		 * Custom brushes for drawing
		 */
		drawableBrushes?: DrawBrushes;
		
		// Event callbacks
		/**
		 * Called after the situation changes on the board
		 */
		onChange?: () => void;
		
		/**
		 * Called after a piece has been moved
		 */
		onMove?: (orig: Key, dest: Key, capturedPiece?: Piece) => void;
		
		/**
		 * Called after a new piece is dropped on the board
		 */
		onDropNewPiece?: (piece: Piece, key: Key) => void;
		
		/**
		 * Called when a square is selected
		 */
		onSelect?: (key: Key) => void;
		
		/**
		 * Called when the board DOM has been (re)inserted
		 */
		onInsert?: (elements: Elements) => void;
		
		/**
		 * Called after the move has been played
		 */
		onMoveAfter?: (orig: Key, dest: Key, metadata: MoveMetadata) => void;
		
		/**
		 * Called after a new piece is dropped on the board (from movable events)
		 */
		onAfterNewPiece?: (role: Role, key: Key, metadata: MoveMetadata) => void;
		
		/**
		 * Called after the premove has been set
		 */
		onPremoveSet?: (orig: Key, dest: Key, metadata?: SetPremoveMetadata) => void;
		
		/**
		 * Called after the premove has been unset
		 */
		onPremoveUnset?: () => void;
		
		/**
		 * Called after the predrop has been set
		 */
		onPredropSet?: (role: Role, key: Key) => void;
		
		/**
		 * Called after the predrop has been unset
		 */
		onPredropUnset?: () => void;
		
		/**
		 * Called after drawable shapes change
		 */
		onDrawableChange?: (shapes: DrawShape[]) => void;
		
		/**
		 * Bindable reference to the Chessground API instance
		 */
		api?: Api;
		
		/**
		 * Additional HTML attributes
		 */
		[key: string]: any;
	}

	let {
		// Core props
		fen = $bindable(),
		orientation = 'white',
		turnColor,
		check,
		lastMove,
		selected,
		coordinates,
		coordinatesOnSquares,
		autoCastle,
		viewOnly,
		disableContextMenu,
		addPieceZIndex,
		addDimensionsCssVarsTo,
		blockTouchScroll,
		touchIgnoreRadius,
		trustAllEvents,
		
		// Highlight props
		highlightLastMove,
		highlightCheck,
		highlightCustom,
		
		// Animation props
		animationEnabled,
		animationDuration,
		
		// Movable props
		movableFree,
		movableColor,
		movableDests,
		movableShowDests,
		movableRookCastle,
		
		// Premovable props
		premovableEnabled,
		premovableShowDests,
		premovableCastle,
		premovableDests,
		premovableCustomDests,
		premovableUnrestrictedPremoves,
		premovableAdditionalPremoveRequirements,
		
		// Predroppable props
		predroppableEnabled,
		
		// Draggable props
		draggableEnabled,
		draggableDistance,
		draggableAutoDistance,
		draggableShowGhost,
		draggableDeleteOnDropOff,
		
		// Selectable props
		selectableEnabled,
		
		// Drawable props
		drawableEnabled,
		drawableVisible,
		drawableDefaultSnapToValidMove,
		drawableEraseOnMovablePieceClick,
		drawableShapes,
		drawableAutoShapes,
		drawableBrushes,
		
		// Event callbacks
		onChange,
		onMove,
		onDropNewPiece,
		onSelect,
		onInsert,
		onMoveAfter,
		onAfterNewPiece,
		onPremoveSet,
		onPremoveUnset,
		onPredropSet,
		onPredropUnset,
		onDrawableChange,
		
		// API binding
		api = $bindable(),
		
		...restProps
	}: ChessgroundProps = $props();

	let boardElement: HTMLDivElement;

	onMount(async () => {
		// Build the configuration
		const finalConfig: Config = {
			// Core configuration
			...(fen && { fen }),
			...(orientation && { orientation }),
			...(turnColor && { turnColor }),
			...(check !== undefined && { check }),
			...(lastMove && { lastMove }),
			...(selected && { selected }),
			...(coordinates !== undefined && { coordinates }),
			...(coordinatesOnSquares !== undefined && { coordinatesOnSquares }),
			...(autoCastle !== undefined && { autoCastle }),
			...(viewOnly !== undefined && { viewOnly }),
			...(disableContextMenu !== undefined && { disableContextMenu }),
			...(addPieceZIndex !== undefined && { addPieceZIndex }),
			...(addDimensionsCssVarsTo && { addDimensionsCssVarsTo }),
			...(blockTouchScroll !== undefined && { blockTouchScroll }),
			...(touchIgnoreRadius !== undefined && { touchIgnoreRadius }),
			...(trustAllEvents !== undefined && { trustAllEvents }),
			
			// Highlight configuration
			...(highlightLastMove !== undefined || highlightCheck !== undefined || highlightCustom) && {
				highlight: {
					...(highlightLastMove !== undefined && { lastMove: highlightLastMove }),
					...(highlightCheck !== undefined && { check: highlightCheck }),
					...(highlightCustom && { custom: highlightCustom }),
				}
			},
			
			// Animation configuration
			...(animationEnabled !== undefined || animationDuration !== undefined) && {
				animation: {
					...(animationEnabled !== undefined && { enabled: animationEnabled }),
					...(animationDuration !== undefined && { duration: animationDuration }),
				}
			},
			
			// Movable configuration
			...(movableFree !== undefined || movableColor || movableDests || movableShowDests !== undefined || movableRookCastle !== undefined || onMoveAfter || onAfterNewPiece) && {
				movable: {
					...(movableFree !== undefined && { free: movableFree }),
					...(movableColor && { color: movableColor }),
					...(movableDests && { dests: movableDests }),
					...(movableShowDests !== undefined && { showDests: movableShowDests }),
					...(movableRookCastle !== undefined && { rookCastle: movableRookCastle }),
					...((onMoveAfter || onAfterNewPiece) && {
						events: {
							...(onMoveAfter && { after: onMoveAfter }),
							...(onAfterNewPiece && { afterNewPiece: onAfterNewPiece }),
						}
					}),
				}
			},
			
			// Premovable configuration
			...(premovableEnabled !== undefined || premovableShowDests !== undefined || premovableCastle !== undefined || premovableDests || premovableCustomDests || premovableUnrestrictedPremoves !== undefined || premovableAdditionalPremoveRequirements || onPremoveSet || onPremoveUnset) && {
				premovable: {
					...(premovableEnabled !== undefined && { enabled: premovableEnabled }),
					...(premovableShowDests !== undefined && { showDests: premovableShowDests }),
					...(premovableCastle !== undefined && { castle: premovableCastle }),
					...(premovableDests && { dests: premovableDests }),
					...(premovableCustomDests && { customDests: premovableCustomDests }),
					...(premovableUnrestrictedPremoves !== undefined && { unrestrictedPremoves: premovableUnrestrictedPremoves }),
					...(premovableAdditionalPremoveRequirements && { additionalPremoveRequirements: premovableAdditionalPremoveRequirements }),
					...((onPremoveSet || onPremoveUnset) && {
						events: {
							...(onPremoveSet && { set: onPremoveSet }),
							...(onPremoveUnset && { unset: onPremoveUnset }),
						}
					}),
				}
			},
			
			// Predroppable configuration
			...(predroppableEnabled !== undefined || onPredropSet || onPredropUnset) && {
				predroppable: {
					...(predroppableEnabled !== undefined && { enabled: predroppableEnabled }),
					...((onPredropSet || onPredropUnset) && {
						events: {
							...(onPredropSet && { set: onPredropSet }),
							...(onPredropUnset && { unset: onPredropUnset }),
						}
					}),
				}
			},
			
			// Draggable configuration
			...(draggableEnabled !== undefined || draggableDistance !== undefined || draggableAutoDistance !== undefined || draggableShowGhost !== undefined || draggableDeleteOnDropOff !== undefined) && {
				draggable: {
					...(draggableEnabled !== undefined && { enabled: draggableEnabled }),
					...(draggableDistance !== undefined && { distance: draggableDistance }),
					...(draggableAutoDistance !== undefined && { autoDistance: draggableAutoDistance }),
					...(draggableShowGhost !== undefined && { showGhost: draggableShowGhost }),
					...(draggableDeleteOnDropOff !== undefined && { deleteOnDropOff: draggableDeleteOnDropOff }),
				}
			},
			
			// Selectable configuration
			...(selectableEnabled !== undefined) && {
				selectable: {
					enabled: selectableEnabled,
				}
			},
			
			// Events configuration
			...(onChange || onMove || onDropNewPiece || onSelect || onInsert) && {
				events: {
					...(onChange && { change: onChange }),
					...(onMove && { move: onMove }),
					...(onDropNewPiece && { dropNewPiece: onDropNewPiece }),
					...(onSelect && { select: onSelect }),
					...(onInsert && { insert: onInsert }),
				}
			},
			
			// Drawable configuration
			...(drawableEnabled !== undefined || drawableVisible !== undefined || drawableDefaultSnapToValidMove !== undefined || drawableEraseOnMovablePieceClick !== undefined || drawableShapes || drawableAutoShapes || drawableBrushes || onDrawableChange) && {
				drawable: {
					...(drawableEnabled !== undefined && { enabled: drawableEnabled }),
					...(drawableVisible !== undefined && { visible: drawableVisible }),
					...(drawableDefaultSnapToValidMove !== undefined && { defaultSnapToValidMove: drawableDefaultSnapToValidMove }),
					...(drawableEraseOnMovablePieceClick !== undefined && { eraseOnMovablePieceClick: drawableEraseOnMovablePieceClick }),
					...(drawableShapes && { shapes: drawableShapes }),
					...(drawableAutoShapes && { autoShapes: drawableAutoShapes }),
					...(drawableBrushes && { brushes: drawableBrushes }),
					...(onDrawableChange && { onChange: onDrawableChange }),
				}
			},
		};

		// Initialize the board
		api = ChessgroundApi(boardElement, finalConfig);
	});

	onDestroy(() => {
		if (api) {
			api.destroy();
		}
	});

	// Update board when props change
	$effect(() => {
		if (api) {
			const updates: Partial<Config> = {};
			
			if (fen !== undefined) {
				updates.fen = fen;
			}
			
			if (orientation !== undefined) {
				updates.orientation = orientation;
			}
			
			if (turnColor !== undefined) {
				updates.turnColor = turnColor;
			}
			
			if (check !== undefined) {
				updates.check = check;
			}
			
			if (lastMove !== undefined) {
				updates.lastMove = lastMove;
			}
			
			if (selected !== undefined) {
				updates.selected = selected;
			}
			
			if (movableDests !== undefined) {
				updates.movable = { ...updates.movable, dests: movableDests };
			}
			
			if (movableColor !== undefined) {
				updates.movable = { ...updates.movable, color: movableColor };
			}
			
			if (drawableShapes !== undefined) {
				updates.drawable = { ...updates.drawable, shapes: drawableShapes };
			}
			
			if (drawableAutoShapes !== undefined) {
				updates.drawable = { ...updates.drawable, autoShapes: drawableAutoShapes };
			}
			
			if (Object.keys(updates).length > 0) {
				api.set(updates);
			}
		}
	});
</script>

<div bind:this={boardElement} class="cg-wrap" {...restProps}></div>

<style>
	.cg-wrap {
		width: 100%;
		height: 100%;
		aspect-ratio: 1;
	}
</style>
