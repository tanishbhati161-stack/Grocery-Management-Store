import { Bell, Search, UserCircle } from "lucide-react";
import logo from "../../image/logo.jpg"
function Navbar() {
  return (
    <header className="navbar">

      <div className="search-box">
        <Search size={19} />

        <input
          type="text"
          placeholder="Search products, orders..."
        />
      </div>

      <div className="navbar-right">

        <button className="icon-button">
          <Bell size={20} />
        </button>

        <div className="profile">

          <div className="profile-avatar">
            TB
          </div>

          <div>
            <strong>Admin User</strong>
            <span>Administrator</span>
          </div>

        </div>

        <UserCircle size={22} />

      </div>

    </header>
  );
}

export default Navbar;