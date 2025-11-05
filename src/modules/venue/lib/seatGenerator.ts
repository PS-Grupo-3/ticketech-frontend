export function generateRectangleSeats(width: number, height: number, rows: number, cols: number) {
  const seats = [];
  const padding = 10;
  const usableWidth = width - padding * 2;
  const usableHeight = height - padding * 2;
  const stepX = usableWidth / (cols + 1);
  const stepY = usableHeight / (rows + 1);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      seats.push({
        x: padding + stepX * (c + 1),
        y: padding + stepY * (r + 1),
      });
    }
  }
  return seats;
}
