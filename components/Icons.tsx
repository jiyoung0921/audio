'use client';

import React from 'react';

interface IconProps {
    size?: number;
    color?: string;
    weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill';
    className?: string;
}

const defaultProps: IconProps = {
    size: 24,
    color: 'currentColor',
    weight: 'regular',
};

// Microphone Icon - Premium Design
export function Microphone({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1.5 : weight === 'light' ? 2 : weight === 'bold' ? 3 : 2.5;

    if (weight === 'fill') {
        return (
            <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill={color}>
                <path d="M128,24a40,40,0,0,0-40,40v64a40,40,0,0,0,80,0V64A40,40,0,0,0,128,24Z" />
                <path d="M200,128a8,8,0,0,0-16,0,56,56,0,0,1-112,0,8,8,0,0,0-16,0,72.08,72.08,0,0,0,64,71.54V224H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V199.54A72.08,72.08,0,0,0,200,128Z" />
            </svg>
        );
    }

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <rect x="88" y="24" width="80" height="136" rx="40" ry="40" />
            <path d="M200,128a72,72,0,0,1-144,0" />
            <line x1="128" y1="200" x2="128" y2="232" />
            <line x1="96" y1="232" x2="160" y2="232" />
        </svg>
    );
}

// House Icon
export function House({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1 : weight === 'light' ? 1.5 : weight === 'bold' ? 2.5 : 2;

    if (weight === 'fill') {
        return (
            <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill={color}>
                <path d="M224,115.5V208a16,16,0,0,1-16,16H168a16,16,0,0,1-16-16V168a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v40a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V115.5a16,16,0,0,1,5.2-11.8l80-72.7a16,16,0,0,1,21.6,0l80,72.7A16,16,0,0,1,224,115.5Z" />
            </svg>
        );
    }

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <path d="M152,208V160a8,8,0,0,0-8-8H112a8,8,0,0,0-8,8v48a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V115.5a8,8,0,0,1,2.6-5.9l80-72.7a8,8,0,0,1,10.8,0l80,72.7a8,8,0,0,1,2.6,5.9V208a8,8,0,0,1-8,8H160A8,8,0,0,1,152,208Z" />
        </svg>
    );
}

// FileAudio Icon
export function FileAudio({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1 : weight === 'light' ? 1.5 : weight === 'bold' ? 2.5 : 2;

    if (weight === 'fill') {
        return (
            <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill={color}>
                <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,180a20,20,0,1,1-28-18.32V136a8,8,0,0,1,16,0v25.68A20,20,0,0,1,160,180Z" />
            </svg>
        );
    }

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <path d="M200,224H56a8,8,0,0,1-8-8V40a8,8,0,0,1,8-8h96l56,56V216A8,8,0,0,1,200,224Z" />
            <polyline points="152 32 152 88 208 88" />
            <circle cx="140" cy="180" r="20" />
            <line x1="140" y1="160" x2="140" y2="120" />
        </svg>
    );
}

// ClockCounterClockwise Icon (History)
export function ClockCounterClockwise({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1 : weight === 'light' ? 1.5 : weight === 'bold' ? 2.5 : 2;

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="128 80 128 128 168 152" />
            <polyline points="72 104 32 104 32 64" />
            <path d="M67.6,192A88,88,0,1,0,65.8,65.8l-34,33.9" />
        </svg>
    );
}

// GearSix Icon (Settings)
export function GearSix({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1 : weight === 'light' ? 1.5 : weight === 'bold' ? 2.5 : 2;

    if (weight === 'fill') {
        return (
            <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill={color}>
                <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Zm88-29.84q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.21,107.21,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.71,107.71,0,0,0-26.25-10.87,8,8,0,0,0-7.06,1.49L130.16,40.1q-2.16-.06-4.32,0L107.2,25.14a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.54a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40.1,125.84q-.06,2.16,0,4.32L25.14,148.8a8,8,0,0,0-1.48,7.06,107.21,107.21,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49l18.64-14.92q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06Z" />
            </svg>
        );
    }

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="128" cy="128" r="40" />
            <path d="M130.05,206.11c-1.34,0-2.69,0-4,0L109,228.71a103.92,103.92,0,0,1-29.3-12.13L97.32,188.3a81.23,81.23,0,0,1-29.57-17.06L39.47,187.76a103.92,103.92,0,0,1-12.13-29.3l22.6-17a82.41,82.41,0,0,1,0-27L27.34,97.32a103.92,103.92,0,0,1,12.13-29.3L67.75,85.54a81.23,81.23,0,0,1,17.06-29.57L68.29,27.69A103.92,103.92,0,0,1,97.59,15.56l17,22.6a81.61,81.61,0,0,1,27,0l17-22.6a103.92,103.92,0,0,1,29.3,12.13L170.32,55.97a81.23,81.23,0,0,1,29.57,17.06l28.28-16.52a103.92,103.92,0,0,1,12.13,29.3l-22.6,17a82.41,82.41,0,0,1,0,27l22.6,17.08a103.92,103.92,0,0,1-12.13,29.3l-28.28-16.52a81.23,81.23,0,0,1-17.06,29.57l16.52,28.28a103.92,103.92,0,0,1-29.3,12.13Z" />
        </svg>
    );
}

// CheckCircle Icon
export function CheckCircle({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1 : weight === 'light' ? 1.5 : weight === 'bold' ? 2.5 : 2;

    if (weight === 'fill') {
        return (
            <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill={color}>
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm45.66,85.66-56,56a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L112,148.69l50.34-50.35a8,8,0,0,1,11.32,11.32Z" />
            </svg>
        );
    }

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="128" cy="128" r="96" />
            <polyline points="88 136 112 160 168 104" />
        </svg>
    );
}

// WarningCircle Icon
export function WarningCircle({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1 : weight === 'light' ? 1.5 : weight === 'bold' ? 2.5 : 2;

    if (weight === 'fill') {
        return (
            <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill={color}>
                <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm-8,56a8,8,0,0,1,16,0v56a8,8,0,0,1-16,0Zm8,104a12,12,0,1,1,12-12A12,12,0,0,1,128,184Z" />
            </svg>
        );
    }

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="128" cy="128" r="96" />
            <line x1="128" y1="80" x2="128" y2="136" />
            <circle cx="128" cy="172" r="10" fill={color} />
        </svg>
    );
}

// Play Icon
export function Play({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1 : weight === 'light' ? 1.5 : weight === 'bold' ? 2.5 : 2;

    if (weight === 'fill') {
        return (
            <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill={color}>
                <path d="M232.4,114.49,88.32,26.35a16,16,0,0,0-16.2-.3A15.86,15.86,0,0,0,64,39.87V216.13A15.94,15.94,0,0,0,80,232a16.07,16.07,0,0,0,8.36-2.35L232.4,141.51a15.81,15.81,0,0,0,0-27Z" />
            </svg>
        );
    }

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <polygon points="72 39.88 224 128 72 216.12 72 39.88" />
        </svg>
    );
}

// Pause Icon
export function Pause({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1 : weight === 'light' ? 1.5 : weight === 'bold' ? 2.5 : 2;

    if (weight === 'fill') {
        return (
            <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill={color}>
                <path d="M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z" />
            </svg>
        );
    }

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <rect x="152" y="40" width="56" height="176" rx="8" />
            <rect x="48" y="40" width="56" height="176" rx="8" />
        </svg>
    );
}

// Stop Icon
export function Stop({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1 : weight === 'light' ? 1.5 : weight === 'bold' ? 2.5 : 2;

    if (weight === 'fill') {
        return (
            <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill={color}>
                <path d="M200,40H56A16,16,0,0,0,40,56V200a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V56A16,16,0,0,0,200,40Z" />
            </svg>
        );
    }

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <rect x="48" y="48" width="160" height="160" rx="8" />
        </svg>
    );
}

// Upload Icon
export function Upload({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1 : weight === 'light' ? 1.5 : weight === 'bold' ? 2.5 : 2;

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <line x1="128" y1="152" x2="128" y2="40" />
            <polyline points="88 80 128 40 168 80" />
            <path d="M216,152v56a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V152" />
        </svg>
    );
}

// SignOut Icon
export function SignOut({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1 : weight === 'light' ? 1.5 : weight === 'bold' ? 2.5 : 2;

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="112 40 48 40 48 216 112 216" />
            <line x1="112" y1="128" x2="224" y2="128" />
            <polyline points="184 88 224 128 184 168" />
        </svg>
    );
}

// User Icon
export function User({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1 : weight === 'light' ? 1.5 : weight === 'bold' ? 2.5 : 2;

    if (weight === 'fill') {
        return (
            <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill={color}>
                <path d="M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.84,8c18.84-32.56,52.14-52,89.08-52s70.24,19.44,89.08,52a8,8,0,1,0,13.84-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z" />
            </svg>
        );
    }

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="128" cy="96" r="64" />
            <path d="M32,216c19.37-33.47,54.55-56,96-56s76.63,22.53,96,56" />
        </svg>
    );
}

// Folder Icon
export function Folder({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1 : weight === 'light' ? 1.5 : weight === 'bold' ? 2.5 : 2;

    if (weight === 'fill') {
        return (
            <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill={color}>
                <path d="M216,72H130.67L102.93,51.2a16.12,16.12,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V200a16,16,0,0,0,16,16H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72Z" />
            </svg>
        );
    }

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <path d="M216,72H130.67a8,8,0,0,1-4.8-1.6L98.13,49.6a8,8,0,0,0-4.8-1.6H40a8,8,0,0,0-8,8V200a8,8,0,0,0,8,8H216a8,8,0,0,0,8-8V80A8,8,0,0,0,216,72Z" />
        </svg>
    );
}

// Trash Icon
export function Trash({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1 : weight === 'light' ? 1.5 : weight === 'bold' ? 2.5 : 2;

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <line x1="216" y1="56" x2="40" y2="56" />
            <line x1="104" y1="104" x2="104" y2="168" />
            <line x1="152" y1="104" x2="152" y2="168" />
            <path d="M200,56V208a8,8,0,0,1-8,8H64a8,8,0,0,1-8-8V56" />
            <path d="M168,56V40a16,16,0,0,0-16-16H104A16,16,0,0,0,88,40V56" />
        </svg>
    );
}

// X Icon (Close)
export function X({ size = 24, color = 'currentColor', weight = 'regular', className }: IconProps) {
    const strokeWidth = weight === 'thin' ? 1 : weight === 'light' ? 1.5 : weight === 'bold' ? 2.5 : 2;

    return (
        <svg className={className} width={size} height={size} viewBox="0 0 256 256" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
            <line x1="200" y1="56" x2="56" y2="200" />
            <line x1="200" y1="200" x2="56" y2="56" />
        </svg>
    );
}
