import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="flex justify-between items-center p-4 bg-gray-900">
      <h1 className="text-2xl font-bold text-white">BitFinance</h1>
      <div className="flex gap-6 text-white text-lg">
        <Link to="/" className="hover:text-yellow-400">Dashboard</Link>
        <Link to="/deposit" className="hover:text-yellow-400">Deposit</Link>
        <Link to="/borrow" className="hover:text-yellow-400">Borrow</Link>
        <Link to="/yield" className="hover:text-yellow-400">Farming</Link>
        <Link to="/history" className="hover:text-yellow-400">History</Link>
        <Link to="/connect-wallet" className="hover:text-yellow-400">Connect Wallet</Link>
      </div>
    </nav>
  );
}

export default Navbar;
