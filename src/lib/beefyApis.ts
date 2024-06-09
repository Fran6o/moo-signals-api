import axios from 'axios';
const QUERY_VAULTS = "https://api.beefy.finance/vaults"
const QUERY_APY = "https://api.beefy.finance/apy"
const QUERY_TVL = "https://api.beefy.finance/tvl"

export const getVaults = async () => {
    const response = await axios.get(QUERY_VAULTS);
    return response.data;
}

export const getAPY = async () => {
    const response = await axios.get(QUERY_APY);
    return response.data;
}

export const getTVL = async () => {
    const response = await axios.get(QUERY_TVL);
    return response.data;
}