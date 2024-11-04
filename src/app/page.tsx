import WordOfDay from '../components/wordofday';
import LlamaBackground from '../components/llama-background';

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <LlamaBackground />
      <div className="relative z-10">
        <WordOfDay />
      </div>
    </main>
  );
} 