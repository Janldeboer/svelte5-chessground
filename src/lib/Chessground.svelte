<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Chessground as ChessgroundApi } from 'chessground';
	import type { ChessgroundProps } from './chessground-props';
	import { buildConfig, buildUpdateConfig } from './config-builder';

	let {
		fen = $bindable(),
		api = $bindable(),
		...props
	}: ChessgroundProps = $props();

	let boardElement: HTMLDivElement;

	onMount(async () => {
		// Build the configuration from props
		const finalConfig = buildConfig({ fen, ...props });

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
			const updates = buildUpdateConfig({ fen, ...props });
			
			if (Object.keys(updates).length > 0) {
				api.set(updates);
			}
		}
	});
</script>

<div bind:this={boardElement} class="cg-wrap"></div>

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
