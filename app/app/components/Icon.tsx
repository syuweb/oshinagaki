/*
    アイコン
    ＜使い方＞
    
    <Icon name="menu" size={32} className="text-red"/>
        name：アイコン名。以下のURLでアイコン名を確認する
                https://fonts.google.com/icons
        size：アイコンのフォントサイズ。デフォルトは24
        className：TailwindのclassNameをそのまま指定できる    
*/

type IconProps = {
    name: string;
    size?: number;          // デフォルト：24
    className?: string;     // デフォルト：""
};

export function Icon({ name, size = 24, className = "" }: IconProps) {
    return (
        <span
            className={`material-symbols-outlined ${className}`}
            style={{ fontSize: size }}
        >
            {name}
        </span>
    );
}
