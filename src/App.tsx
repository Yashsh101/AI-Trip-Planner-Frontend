import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Trip from './pages/Trip';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<Home />} path="/" />
          <Route element={<Trip />} path="/trip/:id" />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
