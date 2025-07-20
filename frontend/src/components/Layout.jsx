import React from 'react';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

function Layout() {
  return (
    <div className="flex h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <ChatArea />
      </div>
    </div>
  );
}

export default Layout;
