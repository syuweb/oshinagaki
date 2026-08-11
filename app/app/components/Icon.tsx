/*
    アイコン表示コンポーネント
    ＜使い方＞
        <Icon name="menu" size={32} className="text-red" />
            name：アイコン名。Google Fonts の Material Symbols で使用できるアイコン名を指定する。
                    https://fonts.google.com/icons
            size：アイコンのフォントサイズ（px）。省略時は24px。
            className：追加するCSSクラス。Tailwind CSSのクラスも指定できる。
                      省略時は空文字。
 */

// Iconコンポーネントが受け取るPropsの型
type IconProps = {
    name: string;           // アイコン名
    size?: number;          // フォントサイズ（px）。省略時は24px
    className?: string;     // 追加するCSSクラス。省略時は空文字
};

// アイコン表示コンポーネント
export function Icon({
    name,
    size = 24,
    className = "",
}: IconProps) {
    return (
        // Material Symbolsのアイコンを表示するspan要素
        // Material Symbolsのアイコンフォントを使用
        <span
            className={`material-symbols-outlined ${className}`}
            style={{ fontSize: size }}
        >
            {/* nameに指定されたアイコン名を表示 */}
            {name}
        </span>
    );
}
