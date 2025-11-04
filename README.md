# svelte5-chessground

A Svelte 5 wrapper for the [chessground](https://github.com/lichess-org/chessground) chess board library.

## Installation

```bash
npm install svelte5-chessground
```

## Usage

### Basic Example

```svelte
<script lang="ts">
	import { Chessground } from 'svelte5-chessground';
	import 'svelte5-chessground/style.css';

	let fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

	function handleMove(from: string, to: string) {
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
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `Partial<Config>` | `{}` | Chessground configuration object |
| `fen` | `string` | `undefined` | FEN string for initial position (shorthand, **overrides** config.fen) |
| `orientation` | `'white' \| 'black'` | `'white'` | Board orientation (shorthand, **overrides** config.orientation) |
| `onMove` | `(from: string, to: string) => void` | `undefined` | Callback for move events |
| `api` | `Api \| undefined` | `undefined` | Bindable reference to chessground API instance |

> [!TIP]
> Don't mix shorthand props with their config equivalents. Shorthand props (`fen`, `orientation`) take precedence over the same properties in `config`.
> - Use `fen` and `orientation` props for simple cases
> - Use `config` prop for complex configurations

> [!NOTE]
> I’m still working out the details. Feel free to create an issue describing your use case to help shape this library.

## License

Chessground is distributed under the **GPL-3.0 license** (or any later version,
at your option).
When you use Chessground for your website, your combined work may be
distributed only under the GPL. **You must release your source code** to the
users of your website.

Please read more about GPL for JavaScript on [greendrake.info](https://greendrake.info/publications/js-gpl).

## Credits

- [chessground](https://github.com/lichess-org/chessground) - The underlying chess board library by Lichess
