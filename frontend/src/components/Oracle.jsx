import React, { useState, useEffect } from 'react';

const Oracle = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [progress, setProgress] = useState(84.72);
    const [terminalOutput, setTerminalOutput] = useState('');
    const [loading, setLoading] = useState(false);

    // Fluctuate/increment calibration progress slightly to look alive
    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                const change = (Math.random() * 0.04 - 0.01);
                const next = prev + change;
                return next > 99.9 ? 84.72 : parseFloat(next.toFixed(2));
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const typeWriterEffect = (text) => {
        let i = 0;
        const speed = 15;
        setTerminalOutput('');

        function type() {
            if (i < text.length) {
                setTerminalOutput(prev => prev + text.charAt(i));
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    };

    const handleJoinWaitlist = (e) => {
        e.preventDefault();
        if (!email.trim() || !email.includes('@')) {
            typeWriterEffect("SYSTEM_ERROR: INVALID IDENTIFICATION FORMAT. TRY AGAIN.");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            setSubmitted(true);
            setLoading(false);
            const successMsg = `[SYS_INFO]: ACCESS PROTOCOL INITIALIZED.\nWaitlist slot #${Math.floor(1000 + Math.random() * 9000)} secured for user [${email.toUpperCase()}].\nSecurity credentials and decryption keys will be transmitted upon ORACLE v2.0 deployment.`;
            typeWriterEffect(successMsg);
            setEmail('');
        }, 1200);
    };

    return (
        <section id="oracle" className="oracle-section">
            <div className="container">
                <div className="terminal-window">
                    <div className="terminal-header">
                        <span>SYSTEM: OG_ORACLE_V9_UPGRADE</span>
                        <span className="blink-text text-yellow">STATUS: CALIBRATING</span>
                        <span>MODE: DEEP_LEARNING_V2</span>
                    </div>

                    <div className="text-center mb-8">
                        <div className="system-tag">RESTRICTED_ACCESS</div>
                        <h3 className="text-3xl font-bold tracking-wider mb-2 mt-4 font-mono text-glow">THE ORACLE v2.0</h3>
                        <p className="text-gray text-xs font-mono uppercase tracking-wider">
                            Define your aesthetic. Let the machine curate. Coming in the next drop.
                        </p>
                    </div>

                    {/* Calibration Progress Bar */}
                    <div className="calibration-box font-mono mb-8">
                        <div className="flex justify-between text-xs mb-2">
                            <span>NEURAL NETWORK CALIBRATION</span>
                            <span className="text-yellow font-bold">{progress}% COMPLETE</span>
                        </div>
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <div className="flex justify-between text-xxs text-gray mt-1">
                            <span>COGNITIVE NODES: 4,096/4,096</span>
                            <span>AESTHETIC MATRIX: SYNCING</span>
                        </div>
                    </div>

                    {/* Waitlist form */}
                    {!submitted ? (
                        <form onSubmit={handleJoinWaitlist} className="waitlist-form">
                            <input
                                type="email"
                                className="oracle-input font-mono"
                                placeholder="> ENTER EMAIL FOR ACCESS KEYS (e.g. pilot@oglabs.co)..."
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />

                            <div className="flex justify-between items-center flex-wrap gap-4">
                                <button type="submit" className="oracle-btn glow-button" disabled={loading}>
                                    <span>{loading ? "INITIALIZING ACCESS..." : "REQUEST ACCESS CREDENTIALS"}</span> 
                                    <span className="text-xl">⚡</span>
                                </button>
                                <span className="text-gray text-xs">LAUNCH PROTOCOL SECURED BY GEMINI</span>
                            </div>
                        </form>
                    ) : (
                        <div className="flex justify-start">
                            <button onClick={() => setSubmitted(false)} className="oracle-btn-secondary text-xs font-mono">
                                &lt; SUBMIT ANOTHER REQUEST
                            </button>
                        </div>
                    )}

                    {/* Terminal output response */}
                    {(terminalOutput || submitted) && (
                        <div className="oracle-output font-mono">
                            {terminalOutput}
                            <span className="cursor font-bold">_</span>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Oracle;
