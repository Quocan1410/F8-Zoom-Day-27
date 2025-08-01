// slideshow.js - Custom Events Implementation

let currentSlide = 0;
let isTransitioning = false;

document.addEventListener("DOMContentLoaded", () => {
    const slides = document.querySelectorAll(".slide");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");

    function changeSlide(direction) {
        if (isTransitioning) return;

        const oldSlideIndex = currentSlide;
        const oldSlide = slides[currentSlide];

        // Tính toán index slide mới
        if (direction === "next") {
            currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
        } else {
            currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
        }

        const newSlide = slides[currentSlide];

        if (oldSlide === newSlide) return;

        isTransitioning = true;
        console.log(`🎬 Bắt đầu chuyển từ slide ${oldSlideIndex} → ${currentSlide}`);

        // Bắt đầu hiệu ứng - fade out slide hiện tại
        oldSlide.style.opacity = "0";
        oldSlide.style.transform = direction === "next" ? "translateX(-100%)" : "translateX(100%)";

        // YÊU CẦU: Chờ transitionend event hoàn thành
        oldSlide.addEventListener("transitionend", function handleTransitionEnd(e) {
            // Chỉ xử lý khi transition của opacity hoặc transform hoàn thành
            if (e.propertyName === "opacity" || e.propertyName === "transform") {
                oldSlide.removeEventListener("transitionend", handleTransitionEnd);

                console.log(`✅ Transition cũ hoàn thành (${e.propertyName})`);

                // Ẩn slide cũ và chuẩn bị slide mới
                oldSlide.classList.remove("active");
                oldSlide.style.opacity = "";
                oldSlide.style.transform = "";

                // Hiển thị slide mới
                newSlide.classList.add("active");
                newSlide.style.opacity = "0";
                newSlide.style.transform = direction === "next" ? "translateX(100%)" : "translateX(-100%)";

                // Force reflow
                newSlide.offsetHeight;

                // Animate slide mới vào
                newSlide.style.opacity = "1";
                newSlide.style.transform = "translateX(0)";

                // Chờ slide mới hoàn thành animation
                newSlide.addEventListener("transitionend", function handleNewTransitionEnd(e) {
                    if (e.propertyName === "opacity" || e.propertyName === "transform") {
                        newSlide.removeEventListener("transitionend", handleNewTransitionEnd);

                        // Clean up styles
                        newSlide.style.opacity = "";
                        newSlide.style.transform = "";

                        isTransitioning = false;
                        console.log(`🎯 Transition mới hoàn thành`);

                        // YÊU CẦU: DISPATCH CUSTOM EVENT với detail chứa old và current
                        const slideChangeEvent = new CustomEvent("slideshow:change", {
                            detail: {
                                old: oldSlide, // slide element cũ
                                current: newSlide, // slide element hiện tại
                                oldIndex: oldSlideIndex,
                                currentIndex: currentSlide,
                            },
                        });

                        // YÊU CẦU: Dispatch trên document
                        document.dispatchEvent(slideChangeEvent);
                        console.log(`🚀 Event 'slideshow:change' dispatched!`);
                    }
                });
            }
        });
    }

    // Event listeners cho buttons
    prevBtn.addEventListener("click", () => {
        changeSlide("prev");
    });

    nextBtn.addEventListener("click", () => {
        changeSlide("next");
    });

    // YÊU CẦU: Listen for custom slideshow:change event để demo
    document.addEventListener("slideshow:change", (e) => {
        console.log("📢 slideshow:change event received:", {
            oldSlide: e.detail.old,
            currentSlide: e.detail.current,
            oldIndex: e.detail.oldIndex,
            currentIndex: e.detail.currentIndex,
        });
    });

    // Keyboard controls
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") prevBtn.click();
        if (e.key === "ArrowRight") nextBtn.click();
    });

    console.log("🎬 Slideshow initialized - Mở Console để xem events");
});
