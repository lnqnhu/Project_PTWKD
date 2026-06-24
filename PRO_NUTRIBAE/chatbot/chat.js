document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle');
    const chatBox = document.getElementById('chatbox');
    const closeChat = document.getElementById('close-chat');
    const imageUpload = document.getElementById('imageUpload');
    let currentImageBase64 = null;

    // 1. Xử lý Đóng/Mở Chatbox
    chatToggle.addEventListener('click', () => {
        chatBox.style.display = chatBox.style.display === 'none' || chatBox.style.display === '' ? 'flex' : 'none';
    });

    closeChat.addEventListener('click', () => {
        chatBox.style.display = 'none';
    });

    // 2. Xử lý khi người dùng chọn ảnh
    imageUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            currentImageBase64 = event.target.result;
            // Hiển thị thông báo nhỏ gọn để người dùng biết ảnh đã được tải lên
            appendMessage('user', 'Đã tải lên 1 ảnh 📷. Hãy nhập thêm câu hỏi và nhấn gửi!');
        };
        reader.readAsDataURL(file);
    });

    // 3. Tự động gửi nhắc nhở (Tính năng Đồng hành)
    setTimeout(() => {
        appendMessage('bot', '💧 Đã 2 tiếng trôi qua, bạn nhớ uống một ngụm nước nhé!');
    }, 120000); // Demo: Nhắc sau 2 phút (120,000 ms)
});

// Hàm gửi tin nhắn
async function sendMessage() {
    const inputField = document.getElementById('userInput');
    const message = inputField.value.trim();
    const imageBase64 = window.currentImageBase64; // Lấy ảnh nếu có

    if (!message && !imageBase64) return;

    // Hiển thị tin nhắn User
    if (message) appendMessage('user', message);
    
    // Reset input
    inputField.value = '';
    window.currentImageBase64 = null;
    document.getElementById('imageUpload').value = '';

    // Hiển thị trạng thái Bot đang "gõ"
    const typingId = appendMessage('bot', 'NutriBae đang suy nghĩ...');

    try {
        const response = await fetch('http://localhost:3000/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, imageBase64 })
});
        
        const data = await response.json();
        
        // Cập nhật lại UI với câu trả lời thực tế
        document.getElementById(typingId).innerText = data.reply || data.error || "Có lỗi xảy ra!";

    } catch (error) {
        document.getElementById(typingId).innerText = "Lỗi kết nối. Vui lòng thử lại!";
    }
}

// Hàm hỗ trợ render UI cho khung chat
function appendMessage(sender, text) {
    const chatMessages = document.getElementById('chat-messages');
    const msgDiv = document.createElement('div');
    const msgId = 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
    
    msgDiv.id = msgId;
    msgDiv.className = sender === 'user' ? 'user-message' : 'bot-message';
    msgDiv.innerText = text;
    
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Cuộn xuống cuối
    
    return msgId;
}
function openChatBox(e) {
    if (e) e.preventDefault(); // chặn hành vi mặc định của link
    document.getElementById("chatbox").style.display = "block";
}

document.getElementById("close-chat").onclick = function() {
    document.getElementById("chatbox").style.display = "none";
};
