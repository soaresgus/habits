import './libs/dayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header/Header';
import { SummaryTable } from './components/Summary/SummaryTable';
import './styles/global.css';

export function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-screen h-screen flex items-center justify-center">
        <main className="w-full max-w-5xl px-6 flex flex-col gap-16">
          <Header />
          <SummaryTable />
        </main>
      </div>
    </QueryClientProvider>
  );
}
