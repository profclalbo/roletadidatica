let angles = { roletaA: -90, roletaB: -90 }; // Ângulo inicial de cada roleta

function desenharRoleta(canvasId, setores) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  const width = canvas.width = 200;
  const height = canvas.height = 200;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = width / 2;
  const anguloPorSetor = (2 * Math.PI) / setores.length;

  setores.forEach((setor, i) => {
    const startAngle = i * anguloPorSetor;
    const endAngle = startAngle + anguloPorSetor;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = setor.color;
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const textAngle = startAngle + anguloPorSetor / 2;
    const textX = centerX + Math.cos(textAngle) * radius * 0.7;
    const textY = centerY + Math.sin(textAngle) * radius * 0.7;
    ctx.fillText(setor.label, textX, textY);
  });
}

function girarRoleta(canvasId) {
  const canvas = document.getElementById(canvasId);
  const som = document.getElementById("roleta-som");
  let startAngle = angles[canvasId];
  const totalRotations = Math.floor(Math.random() * 3 + 5); // Rotação aleatória
  const finalAngle = Math.random() * 360; // Ângulo final aleatório
  const startTime = performance.now();

  som.currentTime = 0;
  som.loop = true;
  som.play().catch(err => console.log("Erro ao reproduzir som:", err));

  function animate(time) {
    const elapsed = (time - startTime) / 1000; // Tempo decorrido em segundos
    const duration = 6; // Duração total do giro
    const progress = elapsed / duration; // Progresso entre 0 e 1

    if (progress < 1) {
      const easedProgress = 1 - Math.pow(1 - progress, 3); // Curva suave para desacelerar
      const currentAngle = easedProgress * (totalRotations * 360 + finalAngle);
      angles[canvasId] = startAngle + currentAngle;
      canvas.style.transform = `rotate(${angles[canvasId]}deg)`;
      requestAnimationFrame(animate);
    } else {
      som.pause(); // Para o som
      angles[canvasId] = (startAngle + totalRotations * 360 + finalAngle) % 360; // Salva o ângulo final
    }
  }

  requestAnimationFrame(animate);
}

function reiniciarRoleta(canvasId) {
  angles[canvasId] = -90; // Ângulo inicial
  const canvas = document.getElementById(canvasId);
  canvas.style.transition = "transform 0.5s ease-out";
  canvas.style.transform = "rotate(-90deg)";
}

const setoresA = [
  { label: "Azul", color: "#007bff" },
  { label: "Vermelho", color: "#dc3545" },
];
const setoresB = [
  { label: "Azul", color: "#007bff" },
  { label: "Vermelho", color: "#dc3545" },
  { label: "Azul", color: "#007bff" },
  { label: "Vermelho", color: "#dc3545" },
];

desenharRoleta("roletaA", setoresA);
desenharRoleta("roletaB", setoresB);
