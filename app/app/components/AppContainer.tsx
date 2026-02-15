export default function AppContainer({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="px-4 pb-24">
            {children}
        </div>
    );
}
