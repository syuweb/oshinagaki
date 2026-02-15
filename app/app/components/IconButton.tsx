"use client";

import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
};

export function IconButton({ children, onClick, disabled }: Props) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="
                min-h-[44px] min-w-[44px]
                flex items-center justify-center
                text-gray-700
                active:bg-gray-200
                disabled:opacity-40
            "
        >
            {children}
        </button>
    );
}
