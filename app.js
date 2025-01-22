let angles = { roletaA: -90, roletaB: -90 }; // Ângulo inicial de cada roleta
let isSpinning = { roletaA: false, roletaB: false }; // Status para evitar conflitos durante o giro

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
  // Evita múltiplos giros simultâneos
  if (isSpinning[canvasId]) return;

  isSpinning[canvasId] = true; // Define que a roleta está girando
  const canvas = document.getElementById(canvasId);
  const som = document.getElementById("roleta-som");
  let startAngle = angles[canvasId]; // Começa do ângulo atual
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
      const newAngle = easedProgress * (totalRotations * 360 + finalAngle);
      canvas.style.transform = `rotate(${startAngle + newAngle}deg)`; // Mantém o ângulo atual e adiciona o novo
      requestAnimationFrame(animate);
    } else {
      som.pause(); // Para o som
      angles[canvasId] = (startAngle + totalRotations * 360 + finalAngle) % 360; // Atualiza o ângulo final
      isSpinning[canvasId] = false; // Libera para novo giro
    }
  }

  requestAnimationFrame(animate);
}

function reiniciarRoleta(canvasId) {
  angles[canvasId] = -90; // Reseta o ângulo para o inicial
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

// Alternar tema claro/escuro
const themeSwitcher = document.getElementById('themeSwitcher');
themeSwitcher.addEventListener('change', () => {
  document.body.classList.toggle('dark-mode');
  document.querySelector('footer').classList.toggle('dark-mode');
});
