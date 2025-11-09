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

export function generateCircleSeats(width: number, height: number, rows: number, cols: number) {
  const seats = [];
  const centerX = 0;
  const centerY = 0;
  const maxRadius = Math.min(width, height) / 2 - 10; // padding

  // If cols is null or 0, calculate seats per ring proportionally
  const seatsPerRing = cols > 0 ? cols : Math.max(8, Math.floor(rows * 4));

  for (let r = 0; r < rows; r++) {
    const radius = (maxRadius / rows) * (r + 1);
    const seatsInRow = cols > 0 ? Math.floor(seatsPerRing / rows) + (r < seatsPerRing % rows ? 1 : 0) : seatsPerRing;

    for (let c = 0; c < seatsInRow; c++) {
      const angle = (2 * Math.PI * c) / seatsInRow;
      seats.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      });
    }
  }
  return seats;
}

export function generateSemicircleSeats(width: number, height: number, rows: number, cols: number) {
  const seats = [];
  const centerX = width / 2;
  const centerY = height - 10; // bottom center
  const maxRadius = Math.min(width / 2, height) - 10;

  // If cols is null or 0, calculate seats per ring proportionally
  const seatsPerRing = cols > 0 ? cols : Math.max(6, Math.floor(rows * 3));

  for (let r = 0; r < rows; r++) {
    const radius = (maxRadius / rows) * (r + 1);
    const seatsInRow = cols > 0 ? Math.floor(seatsPerRing / rows) + (r < seatsPerRing % rows ? 1 : 0) : seatsPerRing;

    for (let c = 0; c < seatsInRow; c++) {
      const angle = (Math.PI * c) / (seatsInRow - 1); // from 0 to PI
      seats.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY - radius * Math.sin(angle), // negative sin for upward semicircle
      });
    }
  }
  return seats;
}

export function generateArcSeats(width: number, height: number, rows: number, cols: number) {
  const seats = [];
  const centerX = width / 2;
  const centerY = height - 10;
  const maxRadius = Math.min(width / 2, height) - 10;

  // If cols is null or 0, calculate seats per ring proportionally
  const seatsPerRing = cols > 0 ? cols : Math.max(4, Math.floor(rows * 2));

  for (let r = 0; r < rows; r++) {
    const radius = (maxRadius / rows) * (r + 1);
    const seatsInRow = cols > 0 ? Math.floor(seatsPerRing / rows) + (r < seatsPerRing % rows ? 1 : 0) : seatsPerRing;

    for (let c = 0; c < seatsInRow; c++) {
      const angle = (Math.PI / 2 * c) / (seatsInRow - 1); // quarter circle (90 degrees)
      seats.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY - radius * Math.sin(angle),
      });
    }
  }
  return seats;
}
