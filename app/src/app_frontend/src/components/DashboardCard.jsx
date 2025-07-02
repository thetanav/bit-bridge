import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">BitFinance</h1>
      <nav className="space-x-4">
        <a href="#" className="hover:text-blue-400">Dashboard</a>
        <a href="#" className="hover:text-blue-400">Deposit</a>
        <a href="#" className="hover:text-blue-400">Borrow</a>
        <a href="#" className="hover:text-blue-400">Farming</a>
        <a href="#" className="hover:text-blue-400">History</a>
        <a href="#" className="hover:text-blue-400">Connect Wallet</a>
      </nav>
    </header>
  );
};

export default Header;
