export default function imgZoom(id:string) {
  let img = document.getElementsByName(id);
  const box = document.getElementById(`box${id}`);

  box!.addEventListener("mousemove", (e) => {
    const x = e.offsetX;
    const y = e.offsetY;
    for (let index = 0; index < img.length; index++) {
      img[index]!.style.transformOrigin = `${x}px ${y}px`;
      img[index]!.style.transform = "scale(2)";
    }
  });
  for (let index = 0; index < img.length; index++) {
    box!.addEventListener("mouseleave", () => {
      img[index]!.style.transformOrigin = "center center";
      img[index]!.style.transform = "scale(1)";
      img = ''
    });
  }
}

