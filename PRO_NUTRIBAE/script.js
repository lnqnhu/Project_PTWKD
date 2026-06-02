// Smooth scrolling animation

const links = document.querySelectorAll('nav a');

links.forEach(link => {

    link.addEventListener('click', function(e){

        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));

        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
        });

    });

});


// Simple scroll animation

window.addEventListener('scroll', () => {

    const cards = document.querySelectorAll('.card, .price-card, .review-card');

    cards.forEach(card => {

        const cardTop = card.getBoundingClientRect().top;

        if(cardTop < window.innerHeight - 100){
            card.style.opacity = 1;
            card.style.transform = 'translateY(0px)';
        }

    });

});

// COUNTING ANIMATION CHO HERO STATS
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const suffix = element.getAttribute('data-suffix') || '';
    
    const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(counter);
        }
        element.textContent = Math.floor(current) + suffix;
    }, 16);
}

// Use IntersectionObserver để trigger animation khi element vào view
document.addEventListener('DOMContentLoaded', () => {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.hasAttribute('data-animated')) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target, 2000);
                entry.target.setAttribute('data-animated', 'true');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
});

// MODAL CHI TIẾT SẢN PHẨM
document.addEventListener('DOMContentLoaded', () => {
    const foodModal = document.getElementById('foodModal');
    const modalClose = document.querySelector('.modal-close');
    const foodCards = document.querySelectorAll('.food-card');

    // Mở modal khi click vào food-card
    foodCards.forEach(card => {
        card.addEventListener('click', function(e) {
            const name = this.getAttribute('data-name');
            const image = this.getAttribute('data-image');
            const cal = this.getAttribute('data-cal');
            const portion = this.getAttribute('data-portion');
            const fat = this.getAttribute('data-fat');
            const protein = this.getAttribute('data-protein');
            const carbs = this.getAttribute('data-carbs');
            const fiber = this.getAttribute('data-fiber');
            
            // Đổ dữ liệu vào modal
            document.getElementById('modalName').textContent = name;
            document.getElementById('modalImage').src = image;
            document.getElementById('modalCal').textContent = cal + ' cal';
            document.getElementById('modalPortion').textContent = 'Khẩu phần: ' + portion;
            document.getElementById('modalFat').textContent = fat;
            document.getElementById('modalProtein').textContent = protein;
            document.getElementById('modalCarbs').textContent = carbs;
            document.getElementById('modalFiber').textContent = fiber;
            
            // Hiển thị modal
            foodModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Đóng modal khi click nút X
    modalClose.addEventListener('click', () => {
        foodModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    });

    // Đóng modal khi click bên ngoài modal-content
    foodModal.addEventListener('click', (e) => {
        if (e.target === foodModal) {
            foodModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Đóng modal khi ấn phím ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && foodModal.classList.contains('active')) {
            foodModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});
    /* FAQ */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");

    question.addEventListener("click", () => {

        item.classList.toggle("active");

    });

});

//chatbot
window.onload = function(){

    const chatbox =
    document.getElementById("chatbox");

    document
    .getElementById("chat-toggle")
    .onclick = function(){

        chatbox.style.display = "flex";
    };

    document
    .getElementById("close-chat")
    .onclick = function(){

        chatbox.style.display = "none";
    };
}
function sendMessage(){

    let input =
    document.getElementById("userInput");

    let message = input.value;

    if(message.trim() === "")
        return;

    let chat =
    document.getElementById("chat-messages");


    chat.innerHTML +=
    `
    <div class="user-message">
        ${message}
    </div>
    `;

    input.value="";


    setTimeout(()=>{

        chat.innerHTML +=
        `
        <div class="bot-message">
            Tôi đang xử lý...
        </div>
        `;

        chat.scrollTop =
        chat.scrollHeight;

    },500);
}