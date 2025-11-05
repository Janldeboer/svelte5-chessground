<script lang="ts">
	import { Chessground } from '$lib';
	import type { Key } from 'chessground/types';

	let fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

	function handleMove(from: Key, to: Key) {
		console.log('Move:', from, 'to', to);
	}
</script>

<div class="page-container">
	<h1>Dynamic Sizing Test</h1>
	<p>This page demonstrates the current behavior of the chessboard component when no fixed size is set on its container.</p>

	<!-- Content with sidebar layout -->
	<div class="content-layout">
		<aside class="sidebar">
			<h3>Navigation</h3>
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/minimal">Minimal Example</a></li>
				<li><a href="/dynamic-sizing" class="active">Dynamic Sizing</a></li>
			</ul>
		</aside>

		<main class="main-content">
			<h2>Interactive Chessboard</h2>
			<p>Try interacting with the board below. Notice how it sizes itself without explicit dimensions when competing for space with other elements.</p>

			<!-- Chessboard with competing element -->
			<div class="board-section">
				<div class="board-wrapper">
					<Chessground 
						{fen} 
						coordinates={true}
						onMove={handleMove}
						draggableEnabled={true}
						draggableShowGhost={true}
					/>
				</div>

				<!-- Large info panel competing for space -->
				<div class="board-info-panel">
					<h3>Mockup Game Information Panel</h3>
					
					<div class="info-box">
						<h4>Current Position</h4>
						<p><strong>FEN:</strong> rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR</p>
						<p><strong>Turn:</strong> White to move</p>
						<p><strong>Castling:</strong> KQkq available</p>
					</div>

					<div class="move-list">
						<h4>Move History</h4>
						<div class="move-item">1. e4 - Opening move</div>
						<div class="move-item">1... e5 - Symmetric response</div>
						<div class="move-item">2. Nf3 - Knight development</div>
						<div class="move-item">2... Nc6 - Knight development</div>
						<div class="move-item">3. Bc4 - Italian Game</div>
						<div class="move-item">3... Bc5 - Giuoco Piano</div>
						<div class="move-item">4. c3 - Preparing d4 push</div>
						<div class="move-item">4... Nf6 - Attacking e4</div>
					</div>

					<div class="info-box">
						<h4>Engine Analysis</h4>
						<p><strong>Evaluation:</strong> +0.3 (slight advantage)</p>
						<p><strong>Best move:</strong> d4</p>
						<p><strong>Depth:</strong> 20 plies</p>
					</div>
				</div>
			</div>

			<div class="description">
				<h3>Current Behavior</h3>
				<p>
					The chessboard component has <code>width: 100%; height: 100%; aspect-ratio: 1;</code> set on the wrapper.
					When the parent container doesn't have explicit dimensions and shares space with other elements, this can lead to sizing issues.
				</p>
				<ul>
					<li><strong>Issue 1:</strong> The board may collapse to zero height or expand unpredictably</li>
					<li><strong>Issue 2:</strong> The aspect ratio may not be respected in flex layouts with competing elements</li>
					<li><strong>Issue 3:</strong> The board and info panel compete for space without clear sizing rules</li>
					<li><strong>Issue 4:</strong> Responsive behavior can be inconsistent across different viewports</li>
				</ul>
			</div>
		</main>
	</div>

	<!-- Footer -->
	<footer class="footer">
		<p>© 2025 svelte5-chessground - A Svelte 5 wrapper for chessground</p>
	</footer>
</div>

<style>
	.page-container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		background-color: #f5f5f5;
	}

	h1 {
		text-align: center;
		color: #333;
		margin: 2rem 0 0.5rem 0;
		padding: 0 1rem;
	}

	h1 + p {
		text-align: center;
		color: #666;
		margin: 0 0 2rem 0;
		padding: 0 1rem;
	}

	.hero {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 3rem 2rem;
		text-align: center;
	}

	.hero h2 {
		margin: 0 0 1rem 0;
		font-size: 2.5rem;
	}

	.hero p {
		margin: 0;
		font-size: 1.2rem;
		opacity: 0.95;
	}

	.content-layout {
		display: grid;
		grid-template-columns: 250px 1fr;
		gap: 2rem;
		padding: 2rem;
		flex: 1;
		max-width: 1400px;
		margin: 0 auto;
		width: 100%;
	}

	@media (max-width: 768px) {
		.content-layout {
			grid-template-columns: 1fr;
		}
	}

	.sidebar {
		background-color: white;
		border-radius: 8px;
		padding: 1.5rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
		height: fit-content;
		position: sticky;
		top: 2rem;
	}

	.sidebar h3 {
		margin: 0 0 1rem 0;
		color: #333;
		font-size: 1.1rem;
		border-bottom: 2px solid #667eea;
		padding-bottom: 0.5rem;
	}

	.sidebar ul {
		list-style: none;
		padding: 0;
		margin: 0 0 2rem 0;
	}

	.sidebar li {
		margin: 0.5rem 0;
	}

	.sidebar a {
		color: #555;
		text-decoration: none;
		display: block;
		padding: 0.5rem;
		border-radius: 4px;
		transition: background-color 0.2s;
	}

	.sidebar a:hover {
		background-color: #f0f0f0;
	}

	.sidebar a.active {
		background-color: #667eea;
		color: white;
	}

	.sidebar-box {
		background-color: #f9f9f9;
		border-radius: 6px;
		padding: 1rem;
		margin-bottom: 1rem;
	}

	.sidebar-box h3 {
		font-size: 1rem;
		margin: 0 0 0.75rem 0;
		border: none;
		padding: 0;
	}

	.sidebar-box p {
		margin: 0.5rem 0;
		color: #666;
		font-size: 0.9rem;
	}

	.sidebar-box label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 0.5rem 0;
		font-size: 0.9rem;
		cursor: pointer;
	}

	.main-content {
		background-color: white;
		border-radius: 8px;
		padding: 2rem;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}

	.main-content h2 {
		margin: 0 0 1rem 0;
		color: #333;
	}

		.main-content > p {
			color: #666;
			line-height: 1.6;
			margin-bottom: 2rem;
		}

		.board-section {
			display: flex;
			gap: 2rem;
			margin: 2rem 0;
		}

		@media (max-width: 1024px) {
			.board-section {
				flex-direction: column;
			}
		}

		.board-wrapper {
			/* NO FIXED SIZE - This demonstrates the problem */
			background-color: #f9f9f9;
			border: 2px dashed #ccc;
			border-radius: 8px;
			padding: 1rem;
			/* Let's try to contain the board but without explicit dimensions */
			min-height: 200px;
			flex: 1;
		}

		.board-info-panel {
			background-color: #f0f7ff;
			border: 2px dashed #b3d9ff;
			border-radius: 8px;
			padding: 1.5rem;
			flex: 1;
			min-width: 300px;
		}

		.board-info-panel h3 {
			margin: 0 0 1rem 0;
			color: #333;
		}

		.info-box {
			background-color: white;
			border-radius: 6px;
			padding: 1rem;
			margin-bottom: 1rem;
			border: 1px solid #d0e7ff;
		}

		.info-box h4 {
			margin: 0 0 0.5rem 0;
			color: #444;
			font-size: 0.95rem;
		}

		.info-box p {
			margin: 0.25rem 0;
			color: #666;
			font-size: 0.9rem;
		}

		.move-list {
			background-color: white;
			border-radius: 6px;
			padding: 1rem;
			border: 1px solid #d0e7ff;
			max-height: 300px;
			overflow-y: auto;
		}

		.move-list h4 {
			margin: 0 0 0.75rem 0;
			color: #444;
			font-size: 0.95rem;
		}

		.move-item {
			padding: 0.5rem;
			margin: 0.25rem 0;
			background-color: #f9f9f9;
			border-radius: 4px;
			font-family: monospace;
			font-size: 0.9rem;
			color: #555;
		}	.description {
		margin: 2rem 0;
		padding: 1.5rem;
		background-color: #fff9e6;
		border-left: 4px solid #ffc107;
		border-radius: 4px;
	}

	.description h3 {
		margin: 0 0 1rem 0;
		color: #333;
	}

	.description p {
		margin: 0 0 1rem 0;
		color: #555;
		line-height: 1.6;
	}

	.description code {
		background-color: rgba(0, 0, 0, 0.1);
		padding: 0.2rem 0.4rem;
		border-radius: 3px;
		font-family: monospace;
		font-size: 0.9em;
	}

	.description ul {
		margin: 0;
		padding-left: 1.5rem;
	}

	.description li {
		margin: 0.5rem 0;
		color: #555;
	}

	.features-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 1.5rem;
		margin: 2rem 0;
	}

	.feature-card {
		background-color: #f9f9f9;
		border-radius: 8px;
		padding: 1.5rem;
		text-align: center;
		border: 1px solid #e0e0e0;
		transition: transform 0.2s, box-shadow 0.2s;
	}

	.feature-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	.feature-card h3 {
		margin: 0 0 0.5rem 0;
		font-size: 1.5rem;
		color: #333;
	}

	.feature-card p {
		margin: 0;
		color: #666;
		font-size: 0.95rem;
	}

	.analysis-section {
		margin: 2rem 0;
		padding: 1.5rem;
		background-color: #f0f7ff;
		border-radius: 8px;
		border: 1px solid #b3d9ff;
	}

	.analysis-section h3 {
		margin: 0 0 1rem 0;
		color: #333;
	}

	.analysis-section p {
		margin: 0 0 1rem 0;
		color: #555;
	}

	.placeholder-box {
		background-color: white;
		border: 1px dashed #b3d9ff;
		border-radius: 4px;
		padding: 2rem;
		text-align: center;
		color: #999;
	}

	.footer {
		background-color: #333;
		color: white;
		text-align: center;
		padding: 2rem;
		margin-top: auto;
	}

	.footer p {
		margin: 0;
	}

	@media (max-width: 768px) {
		.sidebar {
			position: static;
		}

		.main-content {
			padding: 1.5rem;
		}

		.features-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
