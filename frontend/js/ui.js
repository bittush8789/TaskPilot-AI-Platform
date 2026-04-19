class UI {
    static initTheme() {
        const toggleBtn = document.getElementById('theme-toggle');
        const root = document.documentElement;
        
        // Check local storage or system preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            root.setAttribute('data-theme', savedTheme);
        } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.setAttribute('data-theme', 'dark');
        }

        toggleBtn.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    static showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let icon = 'fa-circle-info';
        if (type === 'success') icon = 'fa-circle-check';
        if (type === 'error') icon = 'fa-circle-exclamation';

        toast.innerHTML = `
            <i class="fa-solid ${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    static setOutputState(state, content = null, toolName = null) {
        const emptyState = document.getElementById('output-empty');
        const loadingState = document.getElementById('output-loading');
        const resultState = document.getElementById('output-result');
        const resultContent = document.getElementById('result-content');
        const resultBadge = document.getElementById('result-badge');

        emptyState.classList.add('hidden');
        loadingState.classList.add('hidden');
        resultState.classList.add('hidden');

        if (state === 'empty') {
            emptyState.classList.remove('hidden');
        } else if (state === 'loading') {
            loadingState.classList.remove('hidden');
        } else if (state === 'result') {
            resultState.classList.remove('hidden');
            resultBadge.textContent = toolName;
            
            // Parse markdown using marked.js
            resultContent.innerHTML = marked.parse(content);
            
            // Apply syntax highlighting
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
        }
    }

    static renderHistory(historyData) {
        const container = document.getElementById('history-container');
        container.innerHTML = '';
        
        if (!historyData || historyData.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fa-solid fa-clock-rotate-left" style="font-size: 32px; opacity: 0.5; margin-bottom: 12px;"></i><p>No history found</p></div>';
            return;
        }
        
        historyData.forEach(item => {
            const date = new Date(item.created_at).toLocaleString();
            const el = document.createElement('div');
            el.className = 'history-item fade-in';
            el.innerHTML = `
                <div class="history-header">
                    <span class="history-tool">${item.tool_name}</span>
                    <span class="history-date">${date}</span>
                </div>
                <div class="history-content">
                    <div class="history-input">
                        <strong>Input:</strong><br>
                        ${item.user_input}
                    </div>
                    <div class="history-output markdown-body">
                        <strong>Output:</strong><br>
                        ${marked.parse(item.ai_output)}
                    </div>
                </div>
            `;
            container.appendChild(el);
        });
    }

    static copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard!', 'success');
        }).catch(err => {
            this.showToast('Failed to copy', 'error');
        });
    }

    static downloadAsTxt(content, filename) {
        const element = document.createElement('a');
        const file = new Blob([content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${filename}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
}
