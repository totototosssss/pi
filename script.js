let piData = "";
let currentIndex = 0;
let isGameOver = false;

const displayEl = document.getElementById('pi-sequence');
const currentScoreEl = document.getElementById('current-score');
const highScoreEl = document.getElementById('high-score');
const statusEl = document.getElementById('status-message');
const restartBtn = document.getElementById('restart-btn');

const savedHigh = localStorage.getItem('piHighScore');
if (savedHigh) {
    highScoreEl.textContent = savedHigh;
}

fetch('pi.txt')
    .then(response => response.text())
    .then(text => {
        piData = text.replace(/[^0-9]/g, ''); 
        statusEl.textContent = "Start!";
    })
    .catch(err => {
        statusEl.textContent = "Error: pi.txtが見つかりません";
    });

document.querySelectorAll('.keypad button').forEach(btn => {
    btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        handleInput(btn.dataset.num);
    });
    btn.addEventListener('click', () => {
        handleInput(btn.dataset.num);
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        handleInput(e.key);
    }
});

restartBtn.addEventListener('click', resetGame);

function handleInput(num) {
    if (isGameOver || !piData) return;

    const correctDigit = piData[currentIndex];

    if (num === correctDigit) {
        currentIndex++;
        updateDisplay(num);
    } else {
        gameOver();
    }
}

function updateDisplay(num) {
    currentScoreEl.textContent = currentIndex;
    
    if (currentIndex <= 10) {
        displayEl.textContent += num;
    } else {
        displayEl.textContent = "..." + piData.substring(currentIndex - 10, currentIndex);
    }
}

function gameOver() {
    isGameOver = true;
    displayEl.classList.add('wrong');
    statusEl.textContent = "失敗...";
    restartBtn.style.display = 'block';

    const currentHigh = parseInt(highScoreEl.textContent) || 0;
    if (currentIndex > currentHigh) {
        localStorage.setItem('piHighScore', currentIndex);
        highScoreEl.textContent = currentIndex;
        statusEl.textContent = "新記録！";
    }
}

function resetGame() {
    currentIndex = 0;
    isGameOver = false;
    displayEl.textContent = "3.";
    displayEl.classList.remove('wrong');
    statusEl.textContent = "Start!";
    currentScoreEl.textContent = "0";
    restartBtn.style.display = 'none';
}
