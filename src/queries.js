import gql from 'graphql-tag';

const GET_MY_COMPOUND = gql`
	query cmpdn_total ($address: String!) {
		user(id: $address) {
			cTokens {
				id
				cTokenBalance
				totalBorrowed
				underlyingSupplied
				underlyingRedeemed
				totalRepaid
			}
			totalSupplyInEth
			totalBorrowInEth
			hasBorrowed
		}
	}
`;

const GET_ENS_DOMAINS = gql`
	query ens_summary ($address: String!) {
		account(id: $address) {
			id
			domains {
				id
			}
		}
	}`

const GET_0X_DATA = gql`
	query zeroX_summary ($address: String!) {
		user(id: $address) {
			orders {
				id
			}
		}
	}`

const GET_DAI_RECS = gql`
	query daiRec_summary ($address: String!) {
		transfers(where: { dst: $address }) {
		    src
		    dst
		    wad
	  }
	}`

const GET_DAI_SENT = gql`
	query daiSent_summary ($address: String!) {
		transfers(where: { src: $address }) {
		    src
		    dst
		    wad
	  }
	}`

const GET_ARAGON_RECS = gql`
	query aragonRec_summary ($address: String!) {
		transfers(where: { to: $address }) {
		    from
		    to
		    value
	  }
	}`

const GET_ARAGON_SENT = gql`
	query aragonSent_summary ($address: String!) {
		transfers(where: { from: $address }) {
		    from
		    to
		    value
	  }
	}`

const GET_GITCOIN_KUDOS = gql`
	query gitcoin_kudos ($address: String!) {
		kudos(where: { owner: $address }) {
			id
			owner
			tokenURI
	  		price
		}
	}`

const GET_KYBER_DATA = gql`
	query kyber_swaps ($address: String!) {
		executeTrades(where: { trader: $address }) {
		    id
		    trader
		    src
		    dest
		    actualSrcAmount
		    actualDestAmount
		}
	}`

export {
	GET_MY_COMPOUND,
	GET_ENS_DOMAINS,
	GET_0X_DATA,
	GET_DAI_RECS,
	GET_DAI_SENT,
	GET_ARAGON_RECS,
	GET_ARAGON_SENT,
	GET_GITCOIN_KUDOS,
	GET_KYBER_DATA
}