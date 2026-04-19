const API_BASE = '/api';

class ApiService {
    static async post(endpoint, data) {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    static async get(endpoint) {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }

    static async callAgent(userInput) {
        return this.post('/agent', { user_input: userInput });
    }

    static async callTool(toolEndpoint, text) {
        return this.post(toolEndpoint, { text: text });
    }

    static async getHistory() {
        return this.get('/history');
    }
}
