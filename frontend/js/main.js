const TOOLS_CONFIG = {
    'resume': { title: 'Resume Analyzer', desc: 'Paste your resume text to get ATS scoring and feedback.', endpoint: '/analyze-resume' },
    'devops': { title: 'DevOps Generator', desc: 'Describe your deployment needs to generate Docker and K8s configs.', endpoint: '/generate-devops' },
    'planner': { title: 'Daily Planner', desc: 'Enter your goals to get a prioritized daily schedule.', endpoint: '/planner' },
    'summarizer': { title: 'Notes Summarizer', desc: 'Paste long text to get bullet points and key takeaways.', endpoint: '/summarize' },
    'blog': { title: 'Blog Writer', desc: 'Enter a topic to generate an SEO-optimized blog post.', endpoint: '/blog-writer' },
    'interview': { title: 'Interview Prep', desc: 'Enter a job role to generate technical and HR questions.', endpoint: '/interview' },
    'agent': { title: 'Smart Agent', desc: 'Tell the agent what you need, and it will pick the right tool for you.', endpoint: '/agent', isAgent: true }
};

let currentView = 'dashboard';
let currentTool = null;
let lastGeneratedRawOutput = '';

document.addEventListener('DOMContentLoaded', () => {
    UI.initTheme();
    setupNavigation();
    setupDashboardAgent();
    setupToolWorkspace();
    setupActions();
});

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
            
            const view = item.getAttribute('data-view');
            switchView(view);
        });
    });

    // Tool cards on dashboard
    document.querySelectorAll('.tool-card').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.getAttribute('data-target');
            document.querySelector(`.nav-item[data-view="${target}"]`).click();
        });
    });
}

function switchView(view) {
    document.querySelectorAll('.view-container').forEach(v => v.classList.remove('active-view'));
    const pageTitle = document.getElementById('page-title');

    if (view === 'dashboard' || view === 'history') {
        document.getElementById(`view-${view}`).classList.add('active-view');
        pageTitle.textContent = view.charAt(0).toUpperCase() + view.slice(1);
        currentTool = null;
        
        if (view === 'history') {
            loadHistory();
        }
    } else {
        // It's a tool view
        document.getElementById('view-tool').classList.add('active-view');
        currentTool = view;
        
        const config = TOOLS_CONFIG[view];
        pageTitle.textContent = config.title;
        document.getElementById('tool-heading').textContent = config.title;
        document.getElementById('tool-description').textContent = config.desc;
        document.getElementById('tool-input').value = '';
        UI.setOutputState('empty');
    }
    
    currentView = view;
}

function setupDashboardAgent() {
    const input = document.getElementById('dashboard-agent-input');
    const btn = document.getElementById('dashboard-agent-btn');
    
    const executeAgent = () => {
        const text = input.value.trim();
        if (text) {
            document.querySelector('.nav-item[data-view="agent"]').click();
            document.getElementById('tool-input').value = text;
            document.getElementById('tool-submit').click();
            input.value = '';
        }
    };

    btn.addEventListener('click', executeAgent);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') executeAgent();
    });
}

function setupToolWorkspace() {
    const submitBtn = document.getElementById('tool-submit');
    const inputArea = document.getElementById('tool-input');

    submitBtn.addEventListener('click', async () => {
        const text = inputArea.value.trim();
        if (!text) {
            UI.showToast('Please enter some input first.', 'error');
            return;
        }

        UI.setOutputState('loading');
        submitBtn.disabled = true;

        try {
            let result;
            const config = TOOLS_CONFIG[currentTool];
            
            if (config.isAgent) {
                result = await ApiService.callAgent(text);
            } else {
                result = await ApiService.callTool(config.endpoint, text);
            }

            lastGeneratedRawOutput = result.output;
            UI.setOutputState('result', result.output, result.tool_name);
            UI.showToast('Generated successfully!', 'success');
        } catch (error) {
            UI.setOutputState('empty');
            UI.showToast('Failed to generate response. Check your API key or backend logs.', 'error');
        } finally {
            submitBtn.disabled = false;
        }
    });
}

function setupActions() {
    document.getElementById('copy-btn').addEventListener('click', () => {
        if (lastGeneratedRawOutput) {
            UI.copyToClipboard(lastGeneratedRawOutput);
        }
    });

    document.getElementById('download-btn').addEventListener('click', () => {
        if (lastGeneratedRawOutput) {
            const config = TOOLS_CONFIG[currentTool];
            const name = config ? config.title.replace(' ', '_').toLowerCase() : 'taskpilot_output';
            UI.downloadAsTxt(lastGeneratedRawOutput, name);
        }
    });

    document.getElementById('refresh-history').addEventListener('click', loadHistory);
}

async function loadHistory() {
    try {
        document.getElementById('history-container').innerHTML = '<div class="loading-state">Loading history...</div>';
        const data = await ApiService.getHistory();
        UI.renderHistory(data.history);
    } catch (error) {
        UI.showToast('Failed to load history.', 'error');
        document.getElementById('history-container').innerHTML = '<div class="empty-state">Failed to load history</div>';
    }
}
