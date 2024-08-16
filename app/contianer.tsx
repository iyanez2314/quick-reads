export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-[1250px] min-h-screen">{children}</main>
  );
}
