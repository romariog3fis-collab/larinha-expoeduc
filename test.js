const models = ['google/gemini-2.5-flash-free', 'google/gemini-2.0-flash-exp:free', 'google/gemini-2.0-flash-lite-preview-02-05:free', 'meta-llama/llama-3-8b-instruct:free', 'openrouter/free'];

async function test() {
    for (const model of models) {
        console.log(`Testing ${model}...`);
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model,
                    messages: [{ role: 'user', content: 'Diga "Olá" em português' }]
                })
            });
            const text = await response.text();
            console.log(`Result for ${model}: ${response.status} - ${text.substring(0, 100)}`);
        } catch (e) {
            console.error(`Error for ${model}:`, e.message);
        }
    }
}
test();
