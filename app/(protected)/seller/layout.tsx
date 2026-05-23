export default function SellerLayout({
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