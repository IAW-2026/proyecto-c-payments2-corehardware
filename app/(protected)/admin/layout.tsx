export default function AdminLayout({
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