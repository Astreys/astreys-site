import { Route, Routes } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Work } from './pages/Work';
import { Spotting } from './pages/Spotting';
import { NotFound } from './pages/NotFound';

/**
 * Pages are imported eagerly. The whole site is a few kilobytes of JS, and
 * lazy routes would complicate hydrating pre-rendered HTML for no gain.
 */
export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="work" element={<Work />} />
        <Route path="spotting" element={<Spotting />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
