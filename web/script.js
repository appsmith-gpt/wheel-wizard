/* Wheel Wizard web app logic */

// Retrieve saved labels from localStorage or use defaults
let labels = JSON.parse(localStorage.getItem('wheelLabels')) || ['Yes', 'No', 'Maybe'];
const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const radius = canvas.width / 2;
let rotation = 0; // current rotation angle in radians
let spinning = false;

// Define a set of pastel colors for wheel segments
const colors = [
  '#FFCDD2','#F8BBD0','#E1BEE7','#D1C4E9','#C5CAE9','#BBDEFB','#B3E5FC','#B2EBF2','#B2DFDB','#C8E6C9','#DCEDC8','#F0F4C3','#FFECB3','#FFE0B2','#FFCCBC','#D7CCC8'
];

// DOM elements
const labelInput = document.getElementById('labelInput');
const addLabelBtn = document.getElementById('addLabel');
const labelList = document.getElementById('labelList');
const spinBtn = document.getElementById('spinBtn');
const resultSection = document.getElementById('result');
const resultText = document.getElementById('resultText');
const darkToggle = document.getElementById('darkToggle');

// Initialize theme based on localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
document.body.classList.add(savedTheme);
darkToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

// Render the list of labels in the UI
function renderLabelList() {
  labelList.innerHTML = '';
  labels.forEach((label, index) => {
    const li = document.createElement('li');
    li.textContent = label;
    const removeBtn = document.createElement('button');
    removeBtn.textContent = '✖';
    removeBtn.title = 'Remove label';
    removeBtn.onclick = () => {
      if (spinning) return;
      labels.splice(index, 1);
      saveLabels();
      renderLabelList();
      drawWheel();
    };
    li.appendChild(removeBtn);
    labelList.appendChild(li);
  });
}

// Save labels array to localStorage
function saveLabels() {
  localStorage.setItem('wheelLabels', JSON.stringify(labels));
}

// Draw the wheel with current labels and rotation
function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const total = labels.length;
  if (total === 0) return;
  const anglePer = (2 * Math.PI) / total;
  for (let i = 0; i < total; i++) {
    const start = rotation + i * anglePer;
    const end = start + anglePer;
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius - 5, start, end, false);
    ctx.closePath();
    ctx.fillStyle = colors[i % colors.length];
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw label
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(start + anglePer / 2);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#000';
    if (document.body.classList.contains('dark')) ctx.fillStyle = '#fff';
    ctx.font = '14px sans-serif';
    ctx.fillText(labels[i], radius - 20, 0);
    ctx.restore();
  }
  // Draw pointer
  ctx.save();
  ctx.translate(radius, radius);
  ctx.fillStyle = '#000';
  ctx.beginPath();
  ctx.moveTo(0, -radius + 5);
  ctx.lineTo(-8, -radius + 20);
  ctx.lineTo(8, -radius + 20);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

// Easing function for spin animation
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Spin the wheel
function spin() {
  if (spinning || labels.length === 0) return;
  spinning = true;
  resultSection.hidden = true;
  const spins = Math.floor(Math.random() * 3) + 3; // 3 to 5 full rotations
  const targetIndex = Math.floor(Math.random() * labels.length);
  // The wheel is drawn such that index 0 is at rotation 0; pointer is at top.
  const finalRotation = (2 * Math.PI * spins) + ((labels.length - targetIndex) * (2 * Math.PI / labels.length)) + (Math.PI / labels.length);
  const startRotation = rotation;
  const totalRotation = finalRotation - (startRotation % (2 * Math.PI));
  const duration = 3500;
  const startTime = performance.now();
  function animate(time) {
    const elapsed = time - startTime;
    const t = Math.min(elapsed / duration, 1);
    const eased = easeOutCubic(t);
    rotation = startRotation + totalRotation * eased;
    drawWheel();
    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      const selectedIndex = labels.length - 1 - targetIndex;
      showResult(labels[selectedIndex]);
      triggerConfetti();
    }
  }
  requestAnimationFrame(animate);
}

// Show result section
function showResult(label) {
  resultText.textContent = label;
  resultSection.hidden = false;
}

// Simple confetti animation
function triggerConfetti() {
  const confettiCanvas = document.createElement('canvas');
  confettiCanvas.width = canvas.width;
  confettiCanvas.height = canvas.height;
  confettiCanvas.style.position = 'absolute';
  confettiCanvas.style.left = canvas.offsetLeft + 'px';
  confettiCanvas.style.top = canvas.offsetTop + 'px';
  confettiCanvas.style.pointerEvents = 'none';
  document.getElementById('wheelSection').appendChild(confettiCanvas);
  const ctx2 = confettiCanvas.getContext('2d');
  const pieces = [];
  const colors2 = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722'];
  for (let i = 0; i < 50; i++) {
    pieces.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * confettiCanvas.height - confettiCanvas.height,
      w: 6,
      h: 12,
      color: colors2[Math.floor(Math.random() * colors2.length)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI
    });
  }
  function draw() {
    ctx2.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    pieces.forEach(p => {
      ctx2.save();
      ctx2.translate(p.x, p.y);
      ctx2.rotate(p.angle);
      ctx2.fillStyle = p.color;
      ctx2.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx2.restore();
      p.y += p.speed;
      p.angle += 0.05;
    });
    if (pieces.some(p => p.y < confettiCanvas.height + 20)) {
      requestAnimationFrame(draw);
    } else {
      confettiCanvas.remove();
    }
  }
  draw();
}

// Add new label from input
addLabelBtn.addEventListener('click', () => {
  const value = labelInput.value.trim();
  if (!value || spinning) return;
  labels.push(value);
  labelInput.value = '';
  saveLabels();
  renderLabelList();
  drawWheel();
});

labelInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    addLabelBtn.click();
  }
});

// Spin button
spinBtn.addEventListener('click', spin);

// Dark mode toggle
darkToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  document.body.classList.toggle('light', !isDark);
  darkToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  drawWheel();
});

// Setup initial UI
renderLabelList();
drawWheel();
