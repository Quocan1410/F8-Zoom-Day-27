// tender.js - Dating App Logic

// YÊU CẦU 2: Tạo mảng players (ít nhất 5), disliked, liked
const players = [
    {
        name: "Hoàng Long",
        age: 28,
        bio: "Full-stack developer, coffee enthusiast và guitar player",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face",
    },
    {
        name: "Thảo Nguyên",
        age: 23,
        bio: "Professional dancer, yoga instructor và art lover",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face",
    },
    {
        name: "Đức Minh",
        age: 30,
        bio: "Fitness trainer, nutritionist và mountain climbing enthusiast",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face",
    },
    {
        name: "Kim Anh",
        age: 26,
        bio: "Marketing specialist, foodie và book lover",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face",
    },
    {
        name: "Tuấn Anh",
        age: 29,
        bio: "Architect, vintage camera collector và jazz music lover",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face",
    },
];

let disliked = [];
let liked = [];
let currentPlayerIndex = 0;

// YÊU CẦU 5: Ngưỡng quẹt
const swipeThreshold = 50;

document.addEventListener("DOMContentLoaded", () => {
    initTender();
});

function initTender() {
    const cardStack = document.getElementById("cardStack");
    cardStack.innerHTML = "";
    updateStats();
    createCards();
}

function createCards() {
    const cardStack = document.getElementById("cardStack");

    // Tạo tối đa 3 cards để có hiệu ứng stack depth
    for (let i = 0; i < Math.min(3, players.length - currentPlayerIndex); i++) {
        const playerIndex = currentPlayerIndex + i;
        if (playerIndex >= players.length) break;

        const card = createCard(players[playerIndex], i);
        cardStack.appendChild(card);
    }
}

function createCard(player, stackIndex) {
    const card = document.createElement("div");
    card.className = "tender-card";
    card.style.zIndex = 10 - stackIndex;

    // Stack effect
    const scale = 1 - stackIndex * 0.03;
    const translateY = stackIndex * 10;
    card.style.transform = `scale(${scale}) translateY(${translateY}px)`;

    // YÊU CẦU 3: Render từ players array
    card.innerHTML = `
        <div class="card-image" style="background-image: url('${player.image}')">
            <div class="card-overlay"></div>
        </div>
        <div class="card-info">
            <div class="card-name">${player.name}</div>
            <div class="card-age">${player.age} tuổi</div>
            <div class="card-bio">${player.bio}</div>
        </div>
    `;

    // Chỉ setup interaction cho card đầu tiên (top card)
    if (stackIndex === 0) {
        setupCardInteraction(card, player);
    }

    return card;
}

function setupCardInteraction(card, player) {
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;

    // YÊU CẦU: Tối ưu mobile - SỬ DỤNG TOUCH EVENTS
    card.addEventListener("touchstart", handleStart, { passive: false });
    card.addEventListener("touchmove", handleMove, { passive: false });
    card.addEventListener("touchend", handleEnd, { passive: false });

    // Mouse events cho desktop testing
    card.addEventListener("mousedown", handleStart);
    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseup", handleEnd);
    card.addEventListener("mouseleave", handleEnd);

    function handleStart(e) {
        e.preventDefault();
        isDragging = true;

        // Lấy tọa độ từ touch hoặc mouse
        const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

        startX = clientX;
        startY = clientY;

        // Remove transition khi đang drag
        card.style.transition = "none";
    }

    function handleMove(e) {
        if (!isDragging) return;
        e.preventDefault();

        const clientX = e.type.includes("touch") ? e.touches[0].clientX : e.clientX;
        const clientY = e.type.includes("touch") ? e.touches[0].clientY : e.clientY;

        currentX = clientX - startX;
        currentY = clientY - startY;

        // YÊU CẦU 4: Hiệu ứng chuyển động và nghiêng
        const rotation = currentX * 0.1;
        const opacity = Math.max(0.7, 1 - Math.abs(currentX) / 150);

        card.style.transform = `translateX(${currentX}px) translateY(${currentY * 0.3}px) rotate(${rotation}deg)`;
        card.style.opacity = opacity;

        // YÊU CẦU 4: Màu sắc theo hướng swipe
        const overlay = card.querySelector(".card-overlay");
        card.classList.remove("swipe-left", "swipe-right");

        if (currentX > 30) {
            // YÊU CẦU 4: Quẹt phải - màu tone xanh
            card.classList.add("swipe-right");
            overlay.innerHTML = '<i class="fas fa-heart"></i>';
        } else if (currentX < -30) {
            // YÊU CẦU 4: Quẹt trái - màu tone đỏ
            card.classList.add("swipe-left");
            overlay.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            overlay.innerHTML = "";
        }
    }

    function handleEnd(e) {
        if (!isDragging) return;
        isDragging = false;

        // Add transition cho animation
        card.classList.add("animating");

        // YÊU CẦU 5: Kiểm tra ngưỡng swipe (>= 50px)
        if (Math.abs(currentX) >= swipeThreshold) {
            // Đủ ngưỡng - thực hiện swipe
            if (currentX > 0) {
                swipeRight(card, player);
            } else {
                swipeLeft(card, player);
            }
        } else {
            // YÊU CẦU 5: Không đủ ngưỡng - trở về vị trí ban đầu
            card.style.transform = `scale(1) translateY(0px)`;
            card.style.opacity = "1";
            card.classList.remove("swipe-left", "swipe-right");
            card.querySelector(".card-overlay").innerHTML = "";

            setTimeout(() => {
                card.classList.remove("animating");
                card.style.transition = "none";
            }, 400);
        }

        currentX = 0;
        currentY = 0;
    }
}

function swipeLeft(card, player) {
    // Thêm vào mảng disliked
    disliked.push(player);

    // YÊU CẦU 4: Hiệu ứng chuyển động card chạy qua trái
    card.style.transform = "translateX(-120vw) rotate(-30deg) scale(0.8)";
    card.style.opacity = "0";

    removeCardFromDOM(card);
}

function swipeRight(card, player) {
    // Thêm vào mảng liked
    liked.push(player);

    // YÊU CẦU 4: Hiệu ứng chuyển động card chạy qua phải
    card.style.transform = "translateX(120vw) rotate(30deg) scale(0.8)";
    card.style.opacity = "0";

    removeCardFromDOM(card);
}

function removeCardFromDOM(card) {
    // YÊU CẦU 6: Xóa card element khỏi DOM sau animation
    setTimeout(() => {
        card.remove();

        currentPlayerIndex++;
        updateStats();

        // Thêm card mới nếu còn players
        if (currentPlayerIndex + 2 < players.length) {
            const newCard = createCard(players[currentPlayerIndex + 2], 2);
            document.getElementById("cardStack").appendChild(newCard);
        }

        // Cập nhật vị trí các cards còn lại
        updateCardStack();

        // Kiểm tra nếu hết players
        if (currentPlayerIndex >= players.length) {
            showEndScreen();
        }
    }, 400);
}

function updateCardStack() {
    const cards = document.querySelectorAll(".tender-card");
    cards.forEach((card, index) => {
        card.style.zIndex = 10 - index;
        const scale = 1 - index * 0.03;
        const translateY = index * 10;

        card.style.transition = "all 0.3s ease";
        card.style.transform = `scale(${scale}) translateY(${translateY}px)`;

        // Setup interaction cho card mới ở top
        if (index === 0 && currentPlayerIndex + index < players.length) {
            setTimeout(() => {
                card.style.transition = "none";
                setupCardInteraction(card, players[currentPlayerIndex + index]);
            }, 300);
        }
    });
}

function updateStats() {
    document.getElementById("stats").innerHTML = `<i class="fas fa-heart"></i> ${liked.length} | <i class="fas fa-times"></i> ${disliked.length}`;
}

function showEndScreen() {
    const cardStack = document.getElementById("cardStack");
    cardStack.innerHTML = `
        <div class="no-more-cards">
            <div style="font-size: 4rem; margin-bottom: 1rem;"><i class="fas fa-party-horn"></i></div>
            <h2 style="color: #ff6b6b; margin-bottom: 1rem;">Hết người rồi!</h2>
            <p style="margin-bottom: 2rem; font-size: 1.1rem;">
                <strong>Liked:</strong> ${liked.length} người<br>
                <strong>Disliked:</strong> ${disliked.length} người
            </p>
            <button class="reset-btn" onclick="resetTender()">
                <i class="fas fa-redo"></i> Chơi lại
            </button>
        </div>
    `;
}

// Button event listeners
document.getElementById("dislikeBtn").addEventListener("click", () => {
    const topCard = document.querySelector(".tender-card");
    if (topCard && currentPlayerIndex < players.length) {
        topCard.style.transition = "all 0.2s ease";
        topCard.style.transform = "translateX(-30px) rotate(-10deg)";
        setTimeout(() => {
            swipeLeft(topCard, players[currentPlayerIndex]);
        }, 100);
    }
});

document.getElementById("likeBtn").addEventListener("click", () => {
    const topCard = document.querySelector(".tender-card");
    if (topCard && currentPlayerIndex < players.length) {
        topCard.style.transition = "all 0.2s ease";
        topCard.style.transform = "translateX(30px) rotate(10deg)";
        setTimeout(() => {
            swipeRight(topCard, players[currentPlayerIndex]);
        }, 100);
    }
});

function resetTender() {
    currentPlayerIndex = 0;
    liked = [];
    disliked = [];
    initTender();
}

// Global function
window.resetTender = resetTender;
