
export const broncoTimeToSeconds = (time: string | null): number | null => {
  if (!time) return null;
  const parts = time.split(':');
  if (parts.length !== 2) return null;
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  if (isNaN(minutes) || isNaN(seconds)) return null;
  return minutes * 60 + seconds;
};

export const secondsToBroncoTime = (totalSeconds: number | null): string => {
  if (totalSeconds === null || isNaN(totalSeconds)) return '-';
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
