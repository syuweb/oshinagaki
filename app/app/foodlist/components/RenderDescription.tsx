/*
    説明文表示
    ＜概要＞
        説明文を表示する。
        文中のURLはドメイン名で表示し、クリッカブルにする。
    ＜使い方＞
        <RenderDescription text={text} />

        text：説明文（URL含む）
*/

export function RenderDescription(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split(urlRegex).map((part, index) => {
        if (part.match(/^https?:\/\/[^\s]+$/)) {
            const host = new URL(part).hostname.replace(/^www\./, "");

            return (
                <a
                    key={index}
                    href={part}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                >
                    🔗 {host}
                </a>
            );
        }

        return <span key={index}>{part}</span>;
    });
}
