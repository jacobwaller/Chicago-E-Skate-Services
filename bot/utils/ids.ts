export const IS_PROD = process.env.FUNCTION_NAME?.includes('QA') ? false : true;
export const MAIN_GROUP_ID = IS_PROD ? -1001365176902 : -1001218570823; // PEV
export const GROUP_IDS = IS_PROD
  ? [
    -1001315765753, // Onewheel
    -1001270121090, // EUC
  ]
  : [-1001588542714];
