<script lang="ts">
	import { Chessground } from '$lib';
	import type { Key } from 'chessground/types';

	let fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

	function handleMove(from: Key, to: Key) {
		console.log('Move:', from, 'to', to);
	}
</script>

<div class="container">
    <Chessground {fen} onMove={handleMove} />
</div>

<style>
	.container :global(.cg-wrap) {
		width: 512px;
		height: 512px;
	}
</style>
