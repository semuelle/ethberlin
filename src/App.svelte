<script>
	import { onMount } from 'svelte';
	import { getClient, query } from 'svelte-apollo';
	import { GET_MY_COMPOUND, GET_ENS_DOMAINS, GET_0X_DATA, GET_DAI_RECS, GET_DAI_SENT, GET_ARAGON_RECS, GET_ARAGON_SENT, GET_GITCOIN_KUDOS, GET_KYBER_DATA } from './queries';
	import ApolloClient from 'apollo-boost';  
	import { setClient } from 'svelte-apollo';
	import Viz from './Viz.svelte';
	import { data, addr } from './stores.js';

	const compoundClient = new ApolloClient({ uri: 'https://api.thegraph.com/subgraphs/name/compound-finance/compound-v2-rinkeby' });

	const ensClient = new ApolloClient({ uri: 'https://api.thegraph.com/subgraphs/name/graphprotocol/ens' });

	const zeroXClient = new ApolloClient({ uri: 'https://api.thegraph.com/subgraphs/name/dekz/zeroex' });

	const daiClient = new ApolloClient({ uri: 'https://api.thegraph.com/subgraphs/name/drbh/dai' });

	const aragonClient = new ApolloClient({ uri: 'https://api.thegraph.com/subgraphs/name/elopio-private/aragon-network-token' });

	const gitcoinClient = new ApolloClient({ uri: 'https://api.thegraph.com/subgraphs/name/santteegt/gitcoin' });

	const kyberClient = new ApolloClient({ uri: 'https://api.thegraph.com/subgraphs/name/jjperezaguinaga/kyber-swap' });

	$: compoundData = query(compoundClient, {
		query: GET_MY_COMPOUND,
		variables: {
			address: $addr.toLowerCase()
		}
	});

	$: ensData = query(ensClient, {
		query: GET_ENS_DOMAINS,
		variables: {
			address: $addr.toLowerCase()
		}
	});

	$: zeroXData = query(zeroXClient, {
		query: GET_0X_DATA,
		variables: {
			address: $addr.toLowerCase()
		}
	});

	$: daiSentData = query(daiClient, {
		query: GET_DAI_SENT,
		variables: {
			address: $addr.toLowerCase()
		}
	});

	$: daiRecData = query(daiClient, {
		query: GET_DAI_RECS,
		variables: {
			address: $addr.toLowerCase()
		}
	});

	$: aragonSentData = query(aragonClient, {
		query: GET_ARAGON_SENT,
		variables: {
			address: $addr.toLowerCase()
		}
	});

	$: aragonRecData = query(aragonClient, {
		query: GET_ARAGON_RECS,
		variables: {
			address: $addr.toLowerCase()
		}
	});

	$: gitcoinKudosData = query(gitcoinClient, {
		query: GET_GITCOIN_KUDOS,
		variables: {
			address: $addr.toLowerCase()
		}
	});

	$: kyberData = query(kyberClient, {
		query: GET_KYBER_DATA,
		variables: {
			address: $addr.toLowerCase()
		}
	});

	function reload() {
		compoundData.refetch();
		ensData.refetch();
		zeroXData.refetch();
		daiSentData.refetch();
		daiRecData.refetch();
		aragonSentData.refetch();
		aragonRecData.refetch();
		gitcoinKudosData.refetch();
		kyberData.refetch();
	}

	function getCompoundToken(tokenId) {
		if(tokenId == "0x6d7f0754ffeb405d23c51ce938289d4835be3b14-0xb86a765cbe0d800dce25c291dd21cdefa07b4515") {
			return "DAI"
		} else if(tokenId == "0xd6801a1dffcd0a410336ef88def4320d6df1883e-0xb86a765cbe0d800dce25c291dd21cdefa07b4515") {
			return "ETH";
		}
	}

	function summarizeKyber(trades) {
		const daiTrades = trades.filter(d => d.src == "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359");
		let daiSum = (daiTrades.reduce((a, c) => a + parseInt(c["actualSrcAmount"]), 0) / 100000000).toFixed(2);
		const dgxTrades = trades.filter(d => d.src == "0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf");
		let dgxSum = (dgxTrades.reduce((a, c) => a + parseInt(c["actualSrcAmount"]), 0) / 1000000000).toFixed(2);

		return [{
			"icon": "DAI",
			"value": daiSum
			},
			{
			"icon": "DGX",
			"value": dgxSum
			}];
	}

	function getKudoDescription(addi) {
		console.log("tokenURI", addi);
		fetch(addi, {
			method: 'GET',
			mode: 'no-cors', // no-cors, cors, *same-origin
		})
		.then(res => res.json())
		.then((out) => {
			console.log("out", out);
			return out.description;
		})
		.catch(err => { throw err })
	}

	function getBalance(addi) {
		return fetch("https://api.etherscan.io/api?module=account&action=balance&address=" + addi + "&tag=latest&apikey=41S5QUA8PX2459R568N1GABSBEX14RVQT7", {
			method: 'GET',
			mode: 'cors', // no-cors, cors, *same-origin
		})
		.then(res => res.json())
		.then((out) => {
			console.log("out", out);
			return out;
		})
		.catch(err => { throw err })
	}

	function getTransactions(addi) {
		return fetch(" http://api.etherscan.io/api?module=account&action=txlist&address=" + addi + "&startblock=0&endblock=99999999&sort=asc&apikey=41S5QUA8PX2459R568N1GABSBEX14RVQT7", {
			method: 'GET',
			mode: 'cors', // no-cors, cors, *same-origin
		})
		.then(res => res.json())
		.then((out) => {
			data.set(out);
			return out;
		})
		.catch(err => { throw err })
	}

	export let name = "whatev";
	
	//---------------------------------------



	//---------------------------------------
	
</script>

<style>
	h1 {
		color: purple;
	}
</style>

<h1>PrivETHy</h1>

<input type="text" bind:value={$addr}>

{#if $addr}

	<Viz data={$data} />

	<h3>This account...</h3>

	<div style="margin-left: 5%">

		<h4>Overview</h4>

		<div style="margin-left: 5%">
			{#await getBalance($addr)}
				<p>Loading...</p>
			{:then result}
				<p>💰 owns {(parseInt(result.result) / 1000000000000000000).toFixed(2)} ETH.</p>
			{:catch error}
				<p>ERROR: {error}</p>
			{/await}

			{#await getTransactions($addr)}
				<p>Loading...</p>
			{:then result}
				<p>💼 has transacted on mainnet {result.result.length} times for a total value of {(result.result.reduce((a, b) => a + ((parseInt(b["value"]) / 1000000000000000000) || 0), 0)).toFixed(2)} ETH.</p>
			{:catch error}
				<p>ERROR: {error}</p>
			{/await}
			
		</div>


		<h4>Finance</h4>

		<div style="margin-left: 5%">
			{#await $compoundData}
				<p>Loading...</p>
			{:then result}
				{#if result.data.user}
					{#each result.data.user.cTokens as token, index}
						{#if token.underlyingSupplied > 0}
							<p>💰 provided {token.underlyingSupplied} {getCompoundToken(token.id)} to Compound.</p>
						{/if}
						{#if token.totalBorrowed > 0}
							<p>💸 has borrowed {token.totalBorrowed} {getCompoundToken(token.id)} on Compound.</p>
						{/if}
					{/each}
				{/if}
			{:catch error}
				<p>ERROR: {error}</p>
			{/await}
			
			{#await $zeroXData}
				<p>Loading...</p>
			{:then result}
				{#if result.data.user != null && result.data.user.orders.length > 0}
					<p>💰 has created {result.data.user.orders.length} orders through 0x.</p>
				{/if}
			{:catch error}
				<p>ERROR: {error}</p>
			{/await}

			{#await $daiRecData}
				<p>Loading...</p>
			{:then result}
				{#if result.data.transfers.length > 0}
					<p>🤑 has received a total of {(result.data.transfers.reduce((a, b) => a + ((parseInt(b["wad"]) / 1000000000000000000) || 0), 0)).toFixed(2)} DAI.</p>
				{/if}
			{:catch error}
				<p>ERROR: {error}</p>
			{/await}

			{#await $daiSentData}
				<p>Loading...</p>
			{:then result}
				{#if result.data.transfers.length > 0}
					<p>💸 has spent a total of {(result.data.transfers.reduce((a, b) => a + ((parseInt(b["wad"]) / 1000000000000000000) || 0), 0)).toFixed(2)} DAI.</p>
				{/if}
			{:catch error}
				<p>ERROR: {error}</p>
			{/await}

			{#await $kyberData}
				<p>Loading...</p>
			{:then result}
				{#if result.data.executeTrades != null && result.data.executeTrades.length > 0}
					{#each summarizeKyber(result.data.executeTrades) as trade, index}
						{#if trade.value > 0}
							<p>💱 has traded {trade.value} {trade.icon} on Kyber.</p>	
						{/if}
					{/each}
				{/if}
			{:catch error}
				<p>ERROR: {error}</p>
			{/await}

		</div>

		<h4>Ethereum Infrastructure</h4>

		<div style="margin-left: 5%">
			{#await $ensData}
				<p>Loading...</p>
			{:then result}
				{#if result.data.account && result.data.account.domains.length > 0}
					<p>🌐 owns {result.data.account.domains.length} domains on ENS.</p>
				{/if}
			{:catch error}
				<p>ERROR: {error}</p>
			{/await}
		</div>

		<h4>Communities</h4>

		<div style="margin-left: 5%">
			{#await $aragonRecData}
				<p>Loading...</p>
			{:then result}
				{#if result.data.transfers.length > 0}
					<p>🖧 has received a total of {(result.data.transfers.reduce((a, b) => a + ((parseInt(b["value"]) / 1000000000000000000) || 0), 0)).toFixed(2)} Aragon Network Tokens (ANT).</p>
				{/if}
			{:catch error}
				<p>ERROR: {error}</p>
			{/await}

			{#await $aragonSentData}
				<p>Loading...</p>
			{:then result}
				{#if result.data.transfers.length > 0}
					<p>🗳️ has spent a total of {(result.data.transfers.reduce((a, b) => a + ((parseInt(b["value"]) / 1000000000000000000) || 0), 0)).toFixed(2)} Aragon Network Tokens (ANT).</p>
				{/if}
			{:catch error}
				<p>ERROR: {error}</p>
			{/await}
		</div>

		<div style="margin-left: 5%">
			{#await $gitcoinKudosData}
				<p>Loading...</p>
			{:then result}
				{#if result.data.kudos.length > 0}
					<p>🖧 holds {result.data.kudos.length} Kudos from Gitcoin.</p>
					<!-- <li>
					{#each result.data.kudos as kudo, index}
						<ul>{getKudoDescription(kudo.tokenURI)}</ul>
					{/each}
					</li> -->
				{/if}
			{:catch error}
				<p>ERROR: {error}</p>
			{/await}

		</div>
	</div>

{/if}