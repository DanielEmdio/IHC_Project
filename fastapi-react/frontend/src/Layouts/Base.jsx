import Sidebar from "../Components/Sidebar/Sidebar";
import { IoChatbubble } from "react-icons/io5";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Base() {
    return <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
            <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">Open drawer</label>
            <Outlet></Outlet>
        </div>
        <Sidebar></Sidebar>
        <button  style={{ position: 'fixed', bottom: '50px', right: '50px', backgroundColor: '#0C9', color: 'white', borderRadius: '50%', padding: '15px', cursor: 'pointer' }}>
            <Link to={"/chat"}><IoChatbubble size={50} /></Link>
        </button>
    </div>
}
