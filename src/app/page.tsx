import Posts from "./posts/page";

export default function Home() {
  return (
    <div>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <Posts />
      </main>
    </div>
  );
}
