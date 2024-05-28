import { IoChatbubble, IoPersonAdd } from "react-icons/io5";
import { GiGymBag, GiProgression } from "react-icons/gi";
import { FaUserCircle } from "react-icons/fa";
import * as utils from "../../Utils/utils";
import { IoMdExit } from "react-icons/io";
import { FaGear } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../../api";

export default function Sidebar() {
    const handleLogout = () => {
        utils.eraseCookie("token");
        window.location.pathname = "/login";
    };

    const [pt_id, setPt_id] = useState(0);
    useEffect(() => {
        api.post(`/users/getPT`, { token: utils.getCookie("token") }).then((r) => {
            const data = r.data;
            const pt = data.pt;
            setPt_id(pt.id)

        }).catch((_) => { });
    }, []);

    return <div className="drawer-side">
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            <p className="text-4xl font-bold bg-base-200 text-base-content mx-auto">Pocket Coach</p>
            {!utils.isNormalUser() ? <div className="text-xl badge badge-outline badge badge-success bg-base-200 text-base-content mt-2 mx-auto">PT edition</div> : <></>}
            <div className="divider"></div>
            {!utils.isNormalUser() ? <li className="text-xl font-bold border-emerald-100 border-width-2"><Link to={`/PT/${pt_id}`}><IoPersonAdd size={32} />My Page</Link></li> : <></>}
            <li className="text-xl font-bold"><Link to={"/"}><GiGymBag size={32} />Workouts</Link></li>
            {utils.isNormalUser() ? <li className="text-xl font-bold"><Link to={"/subscriptions"}><IoPersonAdd size={32} />Personal Trainers</Link></li> : <></>}
            <li className="text-xl font-bold"><Link to={"/chat"}><IoChatbubble size={32} />Chat</Link></li>
            {utils.isNormalUser() ? <li className="text-xl font-bold"><Link to={"/progress"}><GiProgression size={32} />Progress</Link></li> : <li className="text-xl font-bold"><Link to={"/progress"}><GiProgression size={32} />My Athletes Progress</Link></li>}
            {/*<li className="text-xl font-bold"><Link to={`/PT/${pt_id}`}><FaUserCircle size={32} />Profile</Link></li> */}
            <li className="text-xl font-bold"><Link to={"/settings"}><FaGear size={32} />Settings</Link></li>
            <li className="text-xl font-bold"><button onClick={handleLogout}><IoMdExit size={32} />Log Out</button></li>
        </ul>
    </div>
}
