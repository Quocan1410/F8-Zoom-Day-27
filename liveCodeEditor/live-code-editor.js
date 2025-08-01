// live-code-editor.js - Theo đúng yêu cầu đề bài

let codeModified = false;

document.addEventListener("DOMContentLoaded", () => {
    const codeInput = document.getElementById("codeInput");
    const previewFrame = document.getElementById("previewFrame");
    const contextMenu = document.getElementById("contextMenu");
    const clearCodeItem = document.getElementById("clearCode");
    const copyCodeItem = document.getElementById("copyCode");
    const saveCodeItem = document.getElementById("saveCode");

    // YÊU CẦU 4: Bắt event 'input' và cập nhật srcDoc
    function updatePreview() {
        previewFrame.srcdoc = codeInput.value;
        codeModified = true;
    }

    codeInput.addEventListener("input", updatePreview);

    // Initial preview
    updatePreview();

    // YÊU CẦU 5: Hiển thị confirm khi F5 hoặc tắt tab
    window.addEventListener("beforeunload", (e) => {
        if (codeModified) {
            e.preventDefault();
            e.returnValue = "Bạn có chắc muốn rời khỏi? Code chưa được lưu.";
            return "Bạn có chắc muốn rời khỏi? Code chưa được lưu.";
        }
    });

    // Ngăn F5 refresh với confirm
    document.addEventListener("keydown", (e) => {
        if (e.key === "F5") {
            e.preventDefault();
            if (codeModified) {
                if (confirm("Bạn có chắc muốn làm mới trang? Code chưa được lưu sẽ bị mất.")) {
                    location.reload();
                }
            } else {
                location.reload();
            }
        }
    });

    // YÊU CẦU 6: Custom Context Menu Implementation

    // 6.1: Ngăn context menu mặc định, hiển thị custom menu
    document.addEventListener("contextmenu", (e) => {
        e.preventDefault(); // Ngăn context menu mặc định

        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Lấy kích thước context menu
        contextMenu.style.display = "block";
        const menuRect = contextMenu.getBoundingClientRect();
        const menuWidth = menuRect.width;
        const menuHeight = menuRect.height;
        contextMenu.style.display = "none";

        // YÊU CẦU 6.2: Hiển thị tại vị trí con trỏ chuột (bên phải và phía dưới)
        let posX = mouseX;
        let posY = mouseY;

        // YÊU CẦU 6.3: Điều chỉnh nếu gần cạnh viewport
        if (mouseX + menuWidth > window.innerWidth) {
            posX = mouseX - menuWidth; // Hiển thị bên trái con trỏ
        }

        if (mouseY + menuHeight > window.innerHeight) {
            posY = mouseY - menuHeight; // Hiển thị phía trên con trỏ
        }

        contextMenu.style.left = posX + "px";
        contextMenu.style.top = posY + "px";
        contextMenu.style.display = "block";
    });

    // YÊU CẦU 6.4: Ẩn context menu khi click bất kỳ đâu (hành vi mặc định)
    document.addEventListener("click", (e) => {
        if (!contextMenu.contains(e.target)) {
            contextMenu.style.display = "none";
        }
    });

    // Ẩn context menu khi nhấn Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            contextMenu.style.display = "none";
        }
    });

    // YÊU CẦU 6.1: Chức năng "Xóa code"
    clearCodeItem.addEventListener("click", () => {
        if (confirm("Bạn có chắc muốn xóa toàn bộ code?")) {
            codeInput.value = "";
            previewFrame.srcdoc = "";
            codeModified = false;
        }
        contextMenu.style.display = "none";
    });

    // Bonus: Copy code
    copyCodeItem.addEventListener("click", () => {
        navigator.clipboard
            .writeText(codeInput.value)
            .then(() => {
                // Visual feedback
                const originalHTML = copyCodeItem.innerHTML;
                copyCodeItem.innerHTML = '<i class="fas fa-check"></i> Đã copy!';
                setTimeout(() => {
                    copyCodeItem.innerHTML = originalHTML;
                }, 1000);
            })
            .catch((err) => {
                alert("Không thể copy code");
            });
        contextMenu.style.display = "none";
    });

    // Bonus: Save code
    saveCodeItem.addEventListener("click", () => {
        const code = codeInput.value;
        const blob = new Blob([code], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "my-code.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        contextMenu.style.display = "none";
    });

    // Enhanced keyboard shortcuts
    document.addEventListener("keydown", (e) => {
        // Ctrl/Cmd + S để save
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault();
            saveCodeItem.click();
        }
    });

    // Tab indentation cho textarea
    codeInput.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const start = codeInput.selectionStart;
            const end = codeInput.selectionEnd;

            // Insert 2 spaces
            codeInput.value = codeInput.value.substring(0, start) + "  " + codeInput.value.substring(end);
            codeInput.selectionStart = codeInput.selectionEnd = start + 2;

            // Trigger input event để update preview
            codeInput.dispatchEvent(new Event("input"));
        }
    });
});
