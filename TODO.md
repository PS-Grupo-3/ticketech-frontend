# TODO: Fix Seat Positioning in Sectors

## Current Issue
Seats are displayed outside the sector instead of inside it. This happens because seat positions are not offset by the sector's shape position (shape.x, shape.y).

## Steps to Complete
- [x] Update SeatDots.tsx to offset seat positions by shape.x and shape.y for all shapes (rectangles and others).
- [x] Add debug logging to SeatDots.tsx for seat positioning calculations.
- [ ] Test the changes in the VenueEditorPage to ensure seats appear inside sectors.
- [ ] Verify that seats are correctly positioned for different shape types (rectangle, circle, etc.).

## Dependent Files
- src/modules/venue/components/SeatDots.tsx

## Followup Steps
- Run the application and check the venue editor canvas.
- Ensure seats are visible inside the sector boundaries.
- If issues persist, check console logs for debug information.
