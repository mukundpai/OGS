import React, { useState } from 'react';

const Oracle = () => {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [loading, setLoading] = useState(false);

    const typeWriterEffect = (text) => {
        let i = 0;
        const speed = 20;
        setOutput('');

        function type() {
            if (i < text.length) {
                setOutput(prev => prev + text.charAt(i));
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    };

    const askOracle = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setOutput(''); // Clear previous output

        try {
            const res = await fetch('/api/oracle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: input })
            });

            const data = await res.json();

            if (data.response) {
                typeWriterEffect(data.response);
            } else {
                typeWriterEffect("SYSTEM ERROR: SIGNAL LOST.");
            }
        } catch (err) {
            console.error(err);
            typeWriterEffect("ERROR: CONNECTION SEVERED. TRY AGAIN.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="oracle" className="oracle-section">
            <div className="container">
                <div className="terminal-window">
                    <div className="terminal-header">
                        <span>SYSTEM: OG_ORACLE_V9</span>
                        <span>STATUS: ONLINE</span>
                        <span>MODE: CURATION</span>
                    </div>

                    <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-2">THE ORACLE</h3>
                        <p className="text-gray text-xs">DEFINE YOUR AESTHETIC. LET THE MACHINE CURATE.</p>
                    </div>

                    <input
                        type="text"
                        className="oracle-input"
                        placeholder="> Enter your vibe (e.g. I like cyberpunk, dark themes, and fast cars...)"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && askOracle()}
                        disabled={loading}
                    />

                    <div className="flex justify-between items-center">
                        <button onClick={askOracle} className="oracle-btn" disabled={loading}>
                            <span>{loading ? "CALCULATING..." : "INITIALIZE CURATION"}</span> <span className="text-xl">✨</span>
                        </button>
                        <span className="text-gray text-xs hidden-mobile">POWERED BY GEMINI 2.5</span>
                    </div>

                    <div className="oracle-output">
                        {output}
                        <span className="cursor">_</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Oracle;
