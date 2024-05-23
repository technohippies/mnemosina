import { Component } from 'solid-js';
import { Routes, Route, Router } from '@solidjs/router';
import { routes } from '../routes';

const Root: Component = () => {
  return (
    <Router>
      <div class="flex flex-col h-screen">
        <Routes>
          {routes.map(route => (
            // Directly pass the component as a JSX element
            <Route path={route.path} element={<route.component />} />
          ))}
        </Routes>
      </div>
    </Router>
  );
};

export default Root;