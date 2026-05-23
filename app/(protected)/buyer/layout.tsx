export default function BuyerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div>
            <div>Sidebar</div>
            {children}
        </div>
    );
}