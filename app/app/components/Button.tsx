"use client";

type ButtonVariant = "primary" | "secondary" | "danger";

type Props = {
    variant?: ButtonVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
    variant = "primary",
    className = "",
    ...props
}: Props) {
    const base =
        "min-h-[44px] px-4 rounded-xl text-sm font-medium";

    const variants: Record<ButtonVariant, string> = {
        primary: "bg-blue-600 text-white",
        secondary: "bg-gray-200 text-gray-800",
        danger: "bg-red-600 text-white",
    };

    return (
        <button
            className={`${base} ${variants[variant]} ${className}`}
            {...props}
        />
    );
}
