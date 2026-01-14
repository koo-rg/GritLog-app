const FW_POSITIONS = ['PR', 'HO', 'LO', 'FL', 'No.8'];
const BK_POSITIONS = ['SH', 'SO', 'CTB', 'WTB', 'FB'];

export const getPlayerCategory = (position: string): 'FW' | 'BK' | 'Unknown' => {
  if (!position) return 'Unknown';
  const primaryPosition = position.split('/')[0].trim();
  if (FW_POSITIONS.includes(primaryPosition)) {
    return 'FW';
  }
  if (BK_POSITIONS.includes(primaryPosition)) {
    return 'BK';
  }
  return 'Unknown';
};
