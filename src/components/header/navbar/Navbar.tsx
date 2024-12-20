import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "/images/logo.jpg";

const Navbar = () => {
  const items = [
    { to: "/", label: "Ordenar" },
    { to: "/warehouse", label: "Bodega" },
    { to: "/recipes", label: "Recetas" },
  ];

  return (
    <nav className="nav-list">
      <div className="container-Logo">
        <Link to="/">
          <img className="logo" src={logo} alt="Logo Margaritas" />
        </Link>
      </div>
      <div className={"nav-items"}>
        <ul className="ul-list">
          {items.map((item, index) => (
            <li key={index}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
                to={item.to}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
