import { Outlet } from "react-router-dom";

export default function Sign() {
    return (
        <div className="flex justify-center items-center h-screen bg-[url('Assets/Gym.jpg')] bg-no-repeat bg-cover">
            <Outlet></Outlet>
        </div>
    );
}
