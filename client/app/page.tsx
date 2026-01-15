import LoginPage from "./login/page";

export default function Home() {
  return (
    <div className="w-full h-screen">
      <h1 className="text-4xl font-bold text-zinc-800 dark:text-zinc-200">
        <LoginPage />
      </h1>
    </div>
  );
}
