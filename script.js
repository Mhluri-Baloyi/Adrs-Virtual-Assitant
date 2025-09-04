document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const quickRepliesContainer = document.getElementById('quick-replies');
    const typingIndicator = document.getElementById('typing-indicator');
    const themeToggle = document.getElementById('theme-toggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');

    let chatHistory = JSON.parse(localStorage.getItem('adrsChatHistory')) || [];

    const botResponses = {
        "check my balance": "To check your balance, I'll need your account reference number and the last four digits of your Social Security Number. Please call us at 1-800-555-1234 to provide this information securely. Never share sensitive information in this chat.",
        "set up payment plan": "We can definitely help you set up a payment plan that works for you. To discuss your options, please contact one of our agents at 1-800-555-1234. They are trained to create a plan tailored to your situation.",
        "make a payment": "You can make a payment through our secure online portal or by calling our automated payment line at 1-800-555-5555. Would you like a link to the portal?",
        "talk to an agent": "Of course. Please call our office at 1-800-555-1234 during business hours (M-F 8am-6pm, Sat 9am-1pm) to speak with a representative. They will be happy to assist you.",
        "default": "I understand you have a question. For specific account inquiries, please call us at 1-800-555-1234. Our representatives are available to provide detailed information about your account in a secure manner.",
        "greeting": "Hello! Welcome to Accounts Debt Recovery Services. I am a virtual assistant here to help you with general questions. How can I assist you today?",
        "farewell": "Thank you for contacting ADRS. Resolving your account today helps protect your credit record. Have a great day!"
    };

    const quickReplies = [
        { text: "Check my balance", trigger: "check my balance" },
        { text: "Set up payment plan", trigger: "set up payment plan" },
        { text: "Make a payment", trigger: "make a payment" },
        { text: "Talk to an agent", trigger: "talk to an agent" },
    ];

    const addMessage = (sender, text) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', sender);
        messageElement.textContent = text;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        if (sender === 'user' || sender === 'bot') {
            chatHistory.push({ sender, text });
            localStorage.setItem('adrsChatHistory', JSON.stringify(chatHistory));
        }
    };

    const showTypingIndicator = () => {
        typingIndicator.style.display = 'block';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };

    const hideTypingIndicator = () => {
        typingIndicator.style.display = 'none';
    };

    const generateBotResponse = (userMessage) => {
        showTypingIndicator();
        setTimeout(() => {
            hideTypingIndicator();
            const lowerCaseMessage = userMessage.toLowerCase();
            let response = botResponses.default;

            for (const key in botResponses) {
                if (lowerCaseMessage.includes(key)) {
                    response = botResponses[key];
                    break;
                }
            }
            addMessage('bot', response);
            addMessage('bot', botResponses.farewell);
            renderQuickReplies();
        }, 1500 + Math.random() * 500);
    };

    const renderQuickReplies = () => {
        quickRepliesContainer.innerHTML = '';
        quickReplies.forEach(reply => {
            const button = document.createElement('button');
            button.classList.add('quick-reply');
            button.textContent = reply.text;
            button.addEventListener('click', () => {
                handleUserInput(reply.trigger);
            });
            quickRepliesContainer.appendChild(button);
        });
    };
    
    const handleUserInput = (inputText) => {
        const trimmedMessage = inputText.trim();
        if (trimmedMessage) {
            addMessage('user', trimmedMessage);
            quickRepliesContainer.innerHTML = ''; // Hide quick replies after user action
            generateBotResponse(trimmedMessage);
        }
    };

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleUserInput(messageInput.value);
        messageInput.value = '';
    });

    // --- Theme Switcher ---
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('adrsTheme', theme);
    };

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });

    // --- Sidebar Toggle for Mobile ---
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });

    // Close sidebar when clicking outside of it on mobile
    document.addEventListener('click', (e) => {
        if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== sidebarToggle && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('open');
        }
    });

    // --- Initial Load ---
    const loadChat = () => {
        if (chatHistory.length > 0) {
            chatHistory.forEach(msg => addMessage(msg.sender, msg.text));
        } else {
            addMessage('bot', botResponses.greeting);
        }
        renderQuickReplies();
    };

    const savedTheme = localStorage.getItem('adrsTheme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    loadChat();
});

