import fetchURL from "../../utils/fetchURL";
import { FetchResult, SimpleAdapter } from "../../adapters/types";
import { getUniqStartOfTodayTimestamp } from "../../helpers/getUniSubgraphVolume";

const chainsMap = { eth: "ethereum" };
const chains = [
  "eth",
  "bsc",
  "polygon",
  "xdai",
  "fantom",
  "heco",
  "arbitrum",
  "optimism",
  "moonriver",
  "aurora",
  "metis",
  "kava",
  "celo",
  "zksync",
  "polygon_zkevm",
  "linea",
  "base",
];

const fetch =
  (chain: string) =>
  async (timestamp: number): Promise<FetchResult> => {
    const today = new Date();
    const timestampDate = new Date(timestamp * 1000);
    const unixTimestamp = getUniqStartOfTodayTimestamp(timestampDate);
    const dayDiff = today.getTime() - timestampDate.getTime();
    const daysPassed = (dayDiff / (1000 * 3600 * 24)).toFixed(0);
    try {
      const data = await fetchURL(
        `https://open-api.openocean.finance/v3/DefiLlama/volume?limit=${
          daysPassed || 1
        }&total=true`
      );

      return {
        dailyVolume: data.data.data[chain]?.volume,
        timestamp: unixTimestamp,
      };
    } catch (e) {
      return {
        dailyVolume: "0",
        timestamp: unixTimestamp,
      };
    }
  };

const adapter: any = {
  adapter: {
    ...chains.reduce((acc, chain) => {
      return {
        ...acc,
        [(chainsMap as any)[chain] || chain]: {
          fetch: fetch(chain),
          start: async () => new Date(2023, 6, 1).getTime() / 1000,
        },
      };
    }, {}),
  },
};

export default adapter;
