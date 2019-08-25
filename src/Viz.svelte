<script> 
	import { arc } from 'd3-shape';
	import { addr } from './stores.js';
	import * as tokenInfo from 'eth-contract-metadata';
	
	// Replace with lowercase because no time
	let tokenMetadata = {};
	$: {
		for (var i = 0; i < Object.keys(tokenInfo.default).length; i++) {
			console.log("Object.keys(tokenInfo)[i].toLowerCase()", Object.keys(tokenInfo.default)[i].toLowerCase());
			tokenMetadata[Object.keys(tokenInfo.default)[i].toLowerCase()] = tokenInfo.default[Object.keys(tokenInfo.default)[i]];
		}
	}

	export let data;

	let links = [];
	let values = {}
	let maxValue = 0;
	$: widthFactor = 5 / maxValue;
	$: {
		console.log("data", data);
		console.log("data.result", data.result);
		console.log("data != ''", data != "");
		if(data) {
			links = data.result.map(tx => {
				if(tx.value > maxValue) {
					maxValue = parseInt(tx.value);
				}
				values[tx.to] = tx.value;
				return {
					source: tx.from,
					target: tx.to
				}
			});
		}
		console.log("links", links);
	}

	let nodes;
	$: {
		nodes = [];
		console.log("data", data);
		if(data) {
			for (var i = 0; i < data.result.length; i++) {
				nodes.push({ id: data.result[i].from});
				nodes.push({ id: data.result[i].to});
			}
		}
		nodes = [...new Set(nodes.map(x => x.id))];
		// Add coordinates
		let angle = 0
    	let step = (2*Math.PI) / (nodes.length - 1);
		for (var i = 0; i < nodes.length; i++) {
			if(nodes[i] == $addr) {
				nodes[i] = {
					id: nodes[i],
					x: 0,
					y: 0
				}
			} else {
				nodes[i] = {
					id: nodes[i],
					x: 0 + 70 * Math.cos(angle),
					y: 0 + 40 * Math.sin(angle)
				}
			}
			// Add weight if available
			if(values[nodes[i].id]) {
				nodes[i].value = values[nodes[i].id];
			}
			
			angle += step;

			// Get metadata if available
		    let metadata = imageFor(nodes[i].id);
		    console.log("metadata", metadata);
		    if(metadata) {
		    	nodes[i].img = metadata.logo;
		    	nodes[i].symbol = metadata.symbol;
		    }
		}

	}

	function imageFor(address) {
		const metadata = tokenMetadata[address];
	    if(!metadata) {
	    	return false;
	    } else if (!('logo' in metadata)) {
			return false;
		}
		return metadata;
	}
</script>

<style>
	input {
		width: 100%;
	}

	svg {
		width: 100%;
		height: calc(100% - 5em);
	}

	path {
	 	stroke: purple;
	}

	text {
		font-size: 3px;
		text-anchor: middle;
	}

	.outline {
		stroke: white;
		stroke-width: 0.5px;
	}
</style>

<svg viewBox='0 0 100 100'>
	<g transform='translate(50,50)'>
		{#each nodes as node, index}
			<path d="M 0 0 L {node.x} {node.y}" stroke-width="{node.value > 0 ? widthFactor * node.value : 0.2}" fill="red" />
			<circle cx={node.x} cy={node.y} r="5" fill="purple" on:click={() => addr.set(node.id)} />
			<a href="https://etherscan.io/address/{node.id}" target="_blank">
				<!-- {#if node.img}
					<image x="{node.x}" y="{node.y + 1}" width="32" height="32" href="https://github.com/MetaMask/eth-contract-metadata/blob/master/images/{node.img}?raw=true" />
				{:else}
					<text fill="white" x={node.x} y={node.y + 1}>
						{"..." + node.id.substr(38, 41)}
					</text>
				{/if} -->

				{#if node.symbol}
					<text fill="white" x={node.x} y={node.y + 1}>
						{node.symbol}
					</text>
				{:else}
					<text fill="white" x={node.x} y={node.y + 1}>
						{"..." + node.id.substr(38, 41)}
					</text>
				{/if}
			</a>
		{/each}
	</g>
</svg>
