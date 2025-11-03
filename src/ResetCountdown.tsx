import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './App.css';

type Props = {
    token: string;
};

const ResetCountdown: React.FC<Props> = ({ token }) => {
    const [minutes, setMinutes] = useState<number>(0);
    const [seconds, setSeconds] = useState<number>(0);
    const [title, setTitle] = useState<string>('Update Within');

    useEffect(() => {
        try {
            const decoded: { exp: number } = jwtDecode(token);
            const expirationTime = decoded.exp * 1000; // convert to ms
            const updateCountdown = () => {
                const now = Date.now();
                const diff = expirationTime - now;
            
                if (diff > 0) {
                    const totalSeconds = Math.floor(diff / 1000);
                    const mins = Math.floor(totalSeconds / 60);
                    const secs = totalSeconds % 60;
                    setMinutes(mins);
                    setSeconds(secs);
                } else {
                    setMinutes(0);
                    setSeconds(0);
                    setTitle("Time's up");
                    window.history.pushState({}, '', window.location.pathname);
                    window.dispatchEvent(new Event('token-cleared'));
                }
            };
            

            updateCountdown(); // initial
            const interval = setInterval(updateCountdown, 1000);
            return () => clearInterval(interval);
        } catch (err) {
            
        }
    }, [token]);

    return (
        <div className="black-friday-component">
            <h1>{title}</h1>
            <div className="timer">
                <div className="item">
                    <div className="minutes">
                        <div className="min">
                            <span>{String(minutes).padStart(2, '0')}</span>
                        </div>
                    </div>
                    <p>min</p>
                </div>
                <span className="colon">:</span>
                <div className="item">
                    <div className="seconds">
                        <div className="sec">
                            <span>{String(seconds).padStart(2, '0')}</span>
                        </div>
                    </div>
                    <p>sec</p>
                </div>
            </div>
        </div>
    );
};

export default ResetCountdown;

/**
 * usage
 * <ResetCountdown token={yourJwtToken} />
 */