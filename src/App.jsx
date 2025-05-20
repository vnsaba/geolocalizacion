import { ConfigProvider } from 'antd';
import es_ES from 'antd/lib/locale/es_ES';

// import { HomePage } from './components/pages/HomePage'
// const RoutePage = lazy(() => import('./components/pages/RoutePage'));
// import { RoutePage } from './components/pages';
// import { HomePage } from './components/pages/'
import './App.css';
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const RoutePage = lazy(() => import('./pages/RoutePage.jsx'));
import { Spin } from 'antd';

const App = () => {
  return (
    <Router>
      <Suspense fallback={<div style={{
        display: 'flex', justifyContent:
          'center', alignItems: 'center', height: '100vh'
      }}><Spin size="large"
        /></div>}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/route" element={<RoutePage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export { App }