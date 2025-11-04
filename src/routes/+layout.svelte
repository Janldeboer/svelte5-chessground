<script lang="ts">
	import '../lib/style.css';
	import './styles.css';
	
	let { children } = $props();
</script>

<div class="app">
	{@render children()}
</div>
