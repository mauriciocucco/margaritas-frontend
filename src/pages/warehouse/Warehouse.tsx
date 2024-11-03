import Inventory from "./components/inventory/Inventory";
import PurchaseHistory from "./components/purchase-history/PurchaseHistory";
import "./Warehouse.css";

const Warehouse = () => {
  return (
    <div className="main-warehouse-container">
      <h1>Bodega</h1>
      <div className="tables-container">
        <Inventory></Inventory>
        <PurchaseHistory></PurchaseHistory>
      </div>
    </div>
  );
};

export default Warehouse;
