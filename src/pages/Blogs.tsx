import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import Home from './pages/Home';
// Import other pages as needed

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/blogs',
    element: <Blogs />
  },
  {
    path: '/blogs/:id',
    element: <BlogDetail />
  },
  // Add other routes as needed
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
