﻿class SlotMachine {
    constructor(balance) {
        this.balance = balance;
        this.symbols = ["🍒", "🍋", "🔔", "⭐", "💎"];
        this.payouts = {
            "🍒🍒🍒": 5,
            "🍋🍋🍋": 10,
            "🔔🔔🔔": 20,
            "⭐⭐⭐": 50,
            "💎💎💎": 100
        };
        this.betAmount = 2;
    }

    spin() {
        if (this.balance < this.betAmount) return null;

        this.balance -= this.betAmount;

        let spinResult;

        if (this.balance == 2) {
            spinResult = [
                this.symbols[0],
                this.symbols[0],
                this.symbols[0]
            ];
        } else {
            spinResult = [
                this.getRandomSymbol(),
                this.getRandomSymbol(),
                this.getRandomSymbol()
            ];
        }

        let resultKey = spinResult.join("");
        let prize = this.payouts[resultKey] || 0;
        this.balance += prize;

        return { result: spinResult, prize, balance: this.balance };
    }

    getRandomSymbol() {
        return this.symbols[Math.floor(Math.random() * this.symbols.length)];
    }
}

const canvas = document.getElementById("slotCanvas");
const ctx = canvas.getContext("2d");
const spinButton = document.getElementById("spinButton");
const saldoDisplay = document.getElementById("saldo");
const mensagemDisplay = document.getElementById("mensagem");

let game = new SlotMachine(10);

function drawSlots(symbols) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";

    for (let i = 0; i < symbols.length; i++) {
        ctx.fillText(symbols[i], 50 + i * 100, 100);
    }
}

function spinSlots() {

    mensagemDisplay.textContent = "ta com sorte?"

    let spinData = game.spin();
    if (!spinData) {
        mensagemDisplay.textContent = "Saldo insuficiente! 💰";
        spinButton.disabled = true;
        return;
    }

    let { result, prize, balance } = spinData;
    let animationFrames = 15;
    let frame = 0;

    let animationInterval = setInterval(() => {
        let tempResult = [
            game.getRandomSymbol(),
            game.getRandomSymbol(),
            game.getRandomSymbol()
        ];
        drawSlots(tempResult);

        if (frame >= animationFrames) {
            clearInterval(animationInterval);
            drawSlots(result);
            mensagemDisplay.textContent = prize > 0 ? `🎉 Você ganhou R$${prize}!` : "😢 Nada dessa vez.";
            if (balance == 0) {
                mensagemDisplay.textContent = "SE FUDEU kkkk";
            }
            saldoDisplay.textContent = `💰 Saldo: R$${balance}`;
            if (balance < game.betAmount) spinButton.disabled = true;
        }
        frame++;
    }, 100);
}

spinButton.addEventListener("click", spinSlots);
drawSlots(["❓", "❓", "❓"]);