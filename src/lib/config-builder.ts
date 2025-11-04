import type { Config } from 'chessground/config';
import type { ChessgroundProps } from './chessground-props.js';

/**
 * Builds a Chessground Config object from component props
 */
export function buildConfig(props: ChessgroundProps): Config {
	const {
		// Core props
		fen,
		orientation,
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
	} = props;

	return {
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
}

/**
 * Builds a partial config for reactive updates
 */
export function buildUpdateConfig(props: Partial<ChessgroundProps>): Partial<Config> {
	const updates: Partial<Config> = {};
	
	if (props.fen !== undefined) {
		updates.fen = props.fen;
	}
	
	if (props.orientation !== undefined) {
		updates.orientation = props.orientation;
	}
	
	if (props.turnColor !== undefined) {
		updates.turnColor = props.turnColor;
	}
	
	if (props.check !== undefined) {
		updates.check = props.check;
	}
	
	if (props.lastMove !== undefined) {
		updates.lastMove = props.lastMove;
	}
	
	if (props.selected !== undefined) {
		updates.selected = props.selected;
	}
	
	if (props.movableDests !== undefined) {
		updates.movable = { ...updates.movable, dests: props.movableDests };
	}
	
	if (props.movableColor !== undefined) {
		updates.movable = { ...updates.movable, color: props.movableColor };
	}
	
	if (props.drawableShapes !== undefined) {
		updates.drawable = { ...updates.drawable, shapes: props.drawableShapes };
	}
	
	if (props.drawableAutoShapes !== undefined) {
		updates.drawable = { ...updates.drawable, autoShapes: props.drawableAutoShapes };
	}
	
	return updates;
}
