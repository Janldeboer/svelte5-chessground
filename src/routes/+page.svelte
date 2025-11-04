<script lang="ts">
	import { Chessground } from '$lib';
	import type { Api } from 'chessground/api';
	import type { Key } from 'chessground/types';
	import { Chess } from 'chess.js';

	let api: Api | undefined = $state();
	let game = new Chess();
	let fen = $state(game.fen());
	let gameStatus = $state('White to move');
	let moveHistory = $state<string[]>([]);
	let boardOrientation: 'white' | 'black' = $state('white');
	let checkState: 'white' | 'black' | boolean = $state(false);
	
	// Configuration toggles
	let showDests = $state(true);
	let animationEnabled = $state(true);
	let animationDuration = $state(200);
	let highlightLastMove = $state(true);
	let highlightCheck = $state(true);
	let drawableEnabled = $state(true);
	let coordinates = $state(true);
	let freeMove = $state(false);
	
	// Event logs
	let eventLog = $state<string[]>([]);
	
	function logEvent(message: string) {
		eventLog = [message, ...eventLog].slice(0, 10);
	}

	function getLegalMoves(): Map<Key, Key[]> {
		const dests = new Map();
		const squares = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
		const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

		for (const file of squares) {
			for (const rank of ranks) {
				const square = (file + rank) as Key;
				const moves = game.moves({ square, verbose: true });
				if (moves.length > 0) {
					dests.set(
						square,
						moves.map((m) => m.to as Key)
					);
				}
			}
		}
		return dests;
	}

	function handleMove(from: Key, to: Key) {
		logEvent(`Move: ${from} → ${to}`);
		
		if (freeMove) {
			// In free move mode, just update the board
			if (api) {
				fen = api.getFen();
			}
			return;
		}
		
		const move = game.move({ from, to, promotion: 'q' });
		
		if (move && api) {
			fen = game.fen();
			moveHistory = game.history();
			updateGameStatus();
			
			api.set({
				fen,
				turnColor: game.turn() === 'w' ? 'white' : 'black',
				check: checkState,
				movable: {
					color: game.turn() === 'w' ? 'white' : 'black',
					dests: getLegalMoves(),
					showDests: showDests
				}
			});
		} else if (api) {
			// Invalid move - reset
			api.set({ fen });
		}
	}

	function updateGameStatus() {
		if (game.isCheckmate()) {
			gameStatus = game.turn() === 'w' ? 'Black wins by checkmate!' : 'White wins by checkmate!';
			checkState = false;
		} else if (game.isDraw()) {
			gameStatus = 'Draw';
			checkState = false;
		} else if (game.isStalemate()) {
			gameStatus = 'Stalemate';
			checkState = false;
		} else if (game.isCheck()) {
			gameStatus = `${game.turn() === 'w' ? 'White' : 'Black'} is in check`;
			checkState = game.turn() === 'w' ? 'white' : 'black';
		} else {
			gameStatus = `${game.turn() === 'w' ? 'White' : 'Black'} to move`;
			checkState = false;
		}
	}

	function resetGame() {
		game.reset();
		fen = game.fen();
		moveHistory = [];
		gameStatus = 'White to move';
		checkState = false;
		logEvent('Board reset');
		
		if (api) {
			api.set({
				fen,
				turnColor: 'white',
				check: false,
				movable: {
					color: freeMove ? 'both' : 'white',
					free: freeMove,
					dests: freeMove ? undefined : getLegalMoves(),
					showDests: showDests
				},
				lastMove: undefined
			});
		}
	}
	
	function flipBoard() {
		boardOrientation = boardOrientation === 'white' ? 'black' : 'white';
		logEvent(`Board flipped to ${boardOrientation}`);
	}
	
	function setRandomPosition() {
		const positions = [
			'r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 0 1', // Sicilian
			'rnbqkb1r/pp2pppp/3p1n2/2p5/2PP4/2N2N2/PP2PPPP/R1BQKB1R b KQkq - 0 1', // Queen's Gambit
			'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1', // Italian
			'rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq c6 0 2' // French
		];
		const randomFen = positions[Math.floor(Math.random() * positions.length)];
		if (api) {
			api.set({ fen: randomFen });
			fen = randomFen;
			game.load(randomFen);
			moveHistory = [];
			updateGameStatus();
			logEvent('Random position set');
		}
	}
	
	function clearShapes() {
		if (api) {
			api.setShapes([]);
			logEvent('Shapes cleared');
		}
	}

	function undoMove() {
		const move = game.undo();
		if (move && api) {
			fen = game.fen();
			moveHistory = game.history();
			updateGameStatus();
			
			// Get last move for highlighting
			const history = game.history({ verbose: true });
			const lastMove = history.length > 0 
				? [history[history.length - 1].from, history[history.length - 1].to] as [Key, Key]
				: undefined;
			
			api.set({
				fen,
				turnColor: game.turn() === 'w' ? 'white' : 'black',
				movable: {
					color: game.turn() === 'w' ? 'white' : 'black',
					dests: getLegalMoves()
				},
				lastMove
			});
		}
	}

	// Initialize legal moves when API is ready (run once)
	$effect(() => {
		if (api) {
			api.set({
				movable: {
					free: freeMove,
					color: freeMove ? 'both' : 'white',
					dests: freeMove ? undefined : getLegalMoves(),
					showDests: showDests
				}
			});
		}
	});
	
	// Update config when toggles change (but not orientation - that's handled via prop binding)
	$effect(() => {
		if (api) {
			const updates: any = {};
			
			// Movement settings
			updates.movable = {
				free: freeMove,
				color: freeMove ? 'both' : (game.turn() === 'w' ? 'white' : 'black'),
				dests: freeMove ? undefined : getLegalMoves(),
				showDests: showDests
			};
			
			// Draggable settings (showGhost always enabled)
			updates.draggable = {
				enabled: true,
				showGhost: true
			};
			
			// Highlight settings
			updates.highlight = {
				lastMove: highlightLastMove,
				check: highlightCheck
			};
			
			// Animation settings
			updates.animation = {
				enabled: animationEnabled,
				duration: animationDuration
			};
			
			// Drawable settings
			updates.drawable = {
				enabled: drawableEnabled
			};
			
			api.set(updates);
		}
	});
</script>

<div class="container">
	<h1>svelte5-chessground Demo</h1>
	<p>A Svelte 5 wrapper for chessground with interactive configuration</p>

	<div class="demo-grid">
		<div class="board-section">
			<div class="board-container">
				<Chessground 
					bind:api
					{fen}
					orientation={boardOrientation}
					check={checkState}
					{coordinates}
					draggableEnabled={true}
					draggableShowGhost={true}
					highlightLastMove={highlightLastMove}
					highlightCheck={highlightCheck}
					animationEnabled={animationEnabled}
					animationDuration={animationDuration}
					drawableEnabled={drawableEnabled}
					drawableVisible={true}
					drawableBrushes={{
						green: { key: 'g', color: '#15781B', opacity: 1, lineWidth: 10 },
						red: { key: 'r', color: '#882020', opacity: 1, lineWidth: 10 },
						blue: { key: 'b', color: '#003088', opacity: 1, lineWidth: 10 },
						yellow: { key: 'y', color: '#e68f00', opacity: 1, lineWidth: 10 }
					}}
					onMove={handleMove}
					onSelect={(key) => logEvent(`Square selected: ${key}`)}
				/>
			</div>
			
			<div class="status">
				<p>{gameStatus}</p>
			</div>

			<div class="board-controls">
				<button onclick={resetGame}>New Game</button>
				<button onclick={undoMove} disabled={moveHistory.length === 0}>Undo Move</button>
				<button onclick={flipBoard}>Flip Board</button>
				<button onclick={setRandomPosition}>Random Position</button>
				<button onclick={clearShapes}>Clear Shapes</button>
			</div>

			{#if moveHistory.length > 0}
				<div class="move-history">
					<h3>Move History</h3>
					<div class="moves">
						{#each moveHistory as move, i}
							<span class="move">
								{#if i % 2 === 0}{Math.floor(i / 2) + 1}.{/if}
								{move}
							</span>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<div class="controls-section">
			<div class="control-group">
				<h3>Movement</h3>
				<label>
					<input type="checkbox" bind:checked={showDests} />
					Show Valid Moves
				</label>
				<label>
					<input type="checkbox" bind:checked={freeMove} />
					Free Move (no rules)
				</label>
			</div>

			<div class="control-group">
				<h3>Display</h3>
				<label>
					<input type="checkbox" bind:checked={coordinates} />
					Show Coordinates
				</label>
			</div>

			<div class="control-group">
				<h3>Highlights</h3>
				<label>
					<input type="checkbox" bind:checked={highlightLastMove} />
					Highlight Last Move
				</label>
				<label>
					<input type="checkbox" bind:checked={highlightCheck} />
					Highlight Check
				</label>
			</div>

			<div class="control-group">
				<h3>Animation</h3>
				<label>
					<input type="checkbox" bind:checked={animationEnabled} />
					Enable Animation
				</label>
				<label>
					Duration: {animationDuration}ms
					<input 
						type="range" 
						min="0" 
						max="1000" 
						step="50"
						bind:value={animationDuration}
						disabled={!animationEnabled}
					/>
				</label>
			</div>

			<div class="control-group">
				<h3>Advanced</h3>
				<label>
					<input type="checkbox" bind:checked={drawableEnabled} />
					Enable Drawing (Right-click drag)
				</label>
			</div>

			<div class="event-log">
				<h3>Event Log</h3>
				<div class="log-content">
					{#each eventLog as event}
						<div class="log-entry">{event}</div>
					{/each}
					{#if eventLog.length === 0}
						<div class="log-empty">No events yet...</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<div class="info">
		<h2>About This Demo</h2>
		<p>This interactive demo showcases all the configuration options available in svelte5-chessground:</p>
		<ul>
			<li><strong>Movement:</strong> Toggle valid move indicators and enable free move mode (board editor)</li>
			<li><strong>Display:</strong> Show/hide board coordinates (a-h, 1-8)</li>
			<li><strong>Highlights:</strong> Show last move and check indicators</li>
			<li><strong>Animation:</strong> Adjust animation speed or disable it completely</li>
			<li><strong>Drawing:</strong> Draw arrows and circles by right-clicking and dragging on the board</li>
		</ul>
		<p><strong>Try it:</strong> Play a game, toggle the settings to see how they affect the board, draw shapes, and watch the event log!</p>
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 2rem;
	}

	h1 {
		text-align: center;
		color: #333;
		margin-bottom: 0.5rem;
	}

	h3 {
		margin: 0 0 0.5rem 0;
		color: #444;
		font-size: 1rem;
	}

	p {
		text-align: center;
		color: #666;
		margin-bottom: 2rem;
	}

	.demo-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
		margin-bottom: 2rem;
	}

	@media (max-width: 900px) {
		.demo-grid {
			grid-template-columns: 1fr;
		}
	}

	.board-section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.board-container {
		width: 100%;
		max-width: 500px;
		margin: 0 auto;
	}

	.status {
		text-align: center;
		font-size: 1.2rem;
		font-weight: bold;
		color: #444;
	}

	.board-controls {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		justify-content: center;
	}

	.controls-section {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.control-group {
		padding: 1rem;
		background-color: #f9f9f9;
		border-radius: 4px;
		border: 1px solid #e0e0e0;
	}

	.control-group label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-bottom: 0.5rem;
		cursor: pointer;
		font-size: 0.9rem;
	}

	.control-group label:last-child {
		margin-bottom: 0;
	}

	input[type="checkbox"] {
		cursor: pointer;
		width: 16px;
		height: 16px;
	}

	input[type="range"] {
		flex: 1;
		cursor: pointer;
	}

	button {
		padding: 0.5rem 1rem;
		font-size: 0.9rem;
		background-color: #4a90e2;
		color: white;
		border: none;
		border-radius: 4px;
		cursor: pointer;
		transition: background-color 0.2s;
		white-space: nowrap;
	}

	button:hover:not(:disabled) {
		background-color: #357abd;
	}

	button:active {
		background-color: #2868a8;
	}

	button:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	.move-history {
		margin-top: 1rem;
		padding: 1rem;
		background-color: #f5f5f5;
		border-radius: 4px;
	}

	.move-history h3 {
		margin-top: 0;
		margin-bottom: 0.5rem;
		color: #333;
	}

	.moves {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.move {
		padding: 0.25rem 0.5rem;
		background-color: white;
		border-radius: 3px;
		font-family: monospace;
	}

	.event-log {
		padding: 1rem;
		background-color: #f9f9f9;
		border-radius: 4px;
		border: 1px solid #e0e0e0;
		max-height: 300px;
		overflow-y: auto;
	}

	.log-content {
		font-family: monospace;
		font-size: 0.85rem;
	}

	.log-entry {
		padding: 0.25rem 0.5rem;
		margin-bottom: 0.25rem;
		background-color: white;
		border-left: 3px solid #4a90e2;
		border-radius: 2px;
	}

	.log-empty {
		color: #999;
		text-align: center;
		padding: 1rem;
	}

	.info {
		margin-top: 3rem;
		padding: 1.5rem;
		background-color: #f0f7ff;
		border-radius: 4px;
		border: 1px solid #b3d9ff;
	}

	.info h2 {
		margin-top: 0;
		color: #333;
	}

	.info ul {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.info li {
		margin-bottom: 0.5rem;
		color: #555;
	}

	.info code {
		background-color: rgba(0, 0, 0, 0.1);
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: monospace;
	}

	pre {
		background-color: #2d2d2d;
		color: #f8f8f2;
		padding: 1rem;
		border-radius: 4px;
		overflow-x: auto;
	}

	code {
		font-family: 'Courier New', monospace;
		font-size: 0.9rem;
		line-height: 1.5;
	}
</style>
