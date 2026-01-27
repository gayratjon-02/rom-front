import React, { useRef, useLayoutEffect, useState, useEffect } from 'react';
import { animate } from 'animejs';
import styles from '../../scss/Signup.module.scss';
import { Typography, Alert, Snackbar } from '@mui/material';
import { API_URL } from '../../libs/components/types/config';

// --- Shared Components ---
interface SnakeInputProps {
    label: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
}

const SnakeInput = ({ label, type = "text", value, onChange, name }: SnakeInputProps) => {
    const pathRef = useRef<SVGPathElement>(null);
    const pathLengthRef = useRef<number>(0);

    useLayoutEffect(() => {
        if (pathRef.current) {
            const length = pathRef.current.getTotalLength();
            pathLengthRef.current = length;
            pathRef.current.style.strokeDasharray = `${length}`;
            pathRef.current.style.strokeDashoffset = `${length}`;
        }
    }, []);

    const handleFocus = () => {
        if (!pathRef.current) return;
        animate(pathRef.current, {
            strokeDashoffset: [pathLengthRef.current, 0],
            opacity: [0, 1],
            easing: 'easeInOutSine',
            duration: 300,
        });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!pathRef.current) return;
        if (e.target.value === "") {
            animate(pathRef.current, {
                strokeDashoffset: [0, pathLengthRef.current],
                opacity: [1, 0],
                easing: 'easeInOutSine',
                duration: 300,
            });
        }
    };

    return (
        <div className={styles.inputGroup}>
            <input
                className={styles.inputField}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder=" "
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
            <label className={styles.label}>{label}</label>
            <svg className={styles.snakeSvg} viewBox="0 0 300 2" preserveAspectRatio="none">
                <path
                    ref={pathRef}
                    className={styles.snakePath}
                    d="M0,2 L300,2"
                />
            </svg>
        </div>
    );
};

// --- Page Component ---
const SignupPage = () => {
    const [isSignup, setIsSignup] = useState(false);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    // Toggle Animation Logic
    useEffect(() => {
        if (!overlayRef.current) return;

        // Mobile check (simple) - if window width < 768, don't animate left/right position if we change CSS to 100%
        // But for now, let's keep animation logic generic or handled by CSS overrides if possible.
        // Actually, for mobile we might force left:0 via CSS !important, so JS animation is ignored visually.

        if (isSignup) {
            animate(overlayRef.current, {
                left: '0%',
                easing: 'easeInOutQuad',
                duration: 600
            });
        } else {
            animate(overlayRef.current, {
                left: '50%',
                easing: 'easeInOutQuad',
                duration: 600
            });
        }

        // Animate Inputs Stagger
        setTimeout(() => {
            const inputs = overlayRef.current?.querySelectorAll(`.${styles.inputGroup}`);
            if (inputs) {
                animate(inputs, {
                    opacity: 0,
                    translateY: 20,
                    duration: 0
                });
                animate(inputs, {
                    opacity: [0, 1],
                    translateY: [20, 0],
                    delay: (el, i) => i * 100,
                    easing: 'easeOutExpo'
                });
            }
        }, 100);

    }, [isSignup]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async () => {
        try {
            const response = await fetch(`${API_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (response.ok) {
                setStatus({ type: 'success', message: 'Account created! Please login.' });
                setFormData({ name: '', email: '', password: '' });
                setTimeout(() => setIsSignup(false), 2000);
            } else {
                setStatus({ type: 'error', message: data.message || 'Registration failed' });
            }
        } catch (error) {
            setStatus({ type: 'error', message: 'Network error.' });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>

                {/* Left Background (For switching to Signup) - Visible in Login Mode */}
                <div className={styles.backgroundLayer}>
                    <h2>Don't have an account?</h2>
                    <p>Join us to create amazing visuals.</p>
                    <button className={styles.toggleButton} onClick={() => setIsSignup(true)}>
                        Sign Up
                    </button>
                </div>

                {/* Right Background (For switching to Login) - Visible in Signup Mode */}
                <div className={styles.backgroundLayer}>
                    <h2>Already have an account?</h2>
                    <p>Welcome back to ROMIMI.</p>
                    <button className={styles.toggleButton} onClick={() => setIsSignup(false)}>
                        Sign In
                    </button>
                </div>

                {/* Overlay Card (Slides) */}
                <div className={styles.overlayCard} ref={overlayRef}>
                    <div className={styles.formContent}>
                        <h1>ROMIMI</h1>
                        <h2>{isSignup ? 'Create Account' : 'Welcome Back'}</h2>

                        {isSignup ? (
                            <>
                                <SnakeInput name="name" label="Name" value={formData.name} onChange={handleInputChange} />
                                <SnakeInput name="email" label="Email" value={formData.email} onChange={handleInputChange} />
                                <SnakeInput name="password" label="Password" type="password" value={formData.password} onChange={handleInputChange} />
                                <button className={styles.submitButton} onClick={handleSignup}>Create Account</button>
                            </>
                        ) : (
                            <>
                                <SnakeInput label="Email" />
                                <SnakeInput label="Password" type="password" />
                                {/* Login logic explicitly untouched */}
                                <button className={styles.submitButton}>Sign In</button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <Snackbar
                open={!!status}
                autoHideDuration={6000}
                onClose={() => setStatus(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={status?.type} onClose={() => setStatus(null)}>
                    {status?.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default SignupPage;