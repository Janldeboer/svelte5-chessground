<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Chessground as ChessgroundApi } from 'chessground';
	import type { ChessgroundProps } from './chessground-props';
	import { buildConfig, buildUpdateConfig } from './config-builder';

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
		// Build the configuration from props
		const finalConfig = buildConfig({
			fen, orientation, turnColor, check, lastMove, selected,
			coordinates, coordinatesOnSquares, autoCastle, viewOnly, disableContextMenu,
			addPieceZIndex, addDimensionsCssVarsTo, blockTouchScroll, touchIgnoreRadius, trustAllEvents,
			highlightLastMove, highlightCheck, highlightCustom,
			animationEnabled, animationDuration,
			movableFree, movableColor, movableDests, movableShowDests, movableRookCastle,
			premovableEnabled, premovableShowDests, premovableCastle, premovableDests, premovableCustomDests,
			premovableUnrestrictedPremoves, premovableAdditionalPremoveRequirements,
			predroppableEnabled,
			draggableEnabled, draggableDistance, draggableAutoDistance, draggableShowGhost, draggableDeleteOnDropOff,
			selectableEnabled,
			drawableEnabled, drawableVisible, drawableDefaultSnapToValidMove, drawableEraseOnMovablePieceClick,
			drawableShapes, drawableAutoShapes, drawableBrushes,
			onChange, onMove, onDropNewPiece, onSelect, onInsert,
			onMoveAfter, onAfterNewPiece, onPremoveSet, onPremoveUnset,
			onPredropSet, onPredropUnset, onDrawableChange,
		});

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
			const updates = buildUpdateConfig({
				fen, orientation, turnColor, check, lastMove, selected,
				movableDests, movableColor, drawableShapes, drawableAutoShapes
			});
			
			if (Object.keys(updates).length > 0) {
				api.set(updates);
			}
		}
	});
</script>

<div bind:this={boardElement} class="cg-wrap" {...restProps}></div>

<style>
	.cg-wrap {
		/* Set minimum size for the board */
		min-width: 200px;
		min-height: 200px;
		
		/* Default to width-based sizing with max constraints */
		width: 100%;
		max-width: 100%;
		
		/* Use the smaller of available width or height to maintain square */
		height: auto;
		max-height: 100%;
		
		/* Ensure the board is always square */
		aspect-ratio: 1 / 1;
		
		/* Prevent the board from growing beyond its container */
		contain: layout size;
		
		/* Center the board if it's smaller than container */
		margin: 0 auto;
	}
	
	/* In flex containers, constrain size based on available space */
	:global(*) > .cg-wrap {
		flex-shrink: 1;
		flex-grow: 0;
	}
</style>
