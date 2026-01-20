export default function AuthLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-screen h-screen bg-gradient-to-br from-purple-300 to-pink-400">
            <div className="w-full h-full flex items-center justify-center">
                {children}
            </div>
        </div>
    );
}
