function onMouseMove(e: MouseEvent) {
  const target = e.target as HTMLElement;

  const x = e.offsetX;
  const y = e.offsetY;

  target.style.transformOrigin = `${x}px ${y}px`;
  target.style.transform = "scale(2)";
}

function onMouseLeave(e: MouseEvent) {
  const target = e.target as HTMLElement;

  target.style.transformOrigin = "center center";
  target.style.transform = "scale(1)";
}

export default {
  onMouseMove,
  onMouseLeave,
};
