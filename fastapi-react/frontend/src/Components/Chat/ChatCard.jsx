import { IoChatboxEllipses } from "react-icons/io5";
import { Link } from "react-router-dom";
import { API_URL } from "../../api";

export default function PtCard({ data }) {
    return (
        <div className="card w-90 bg-base-100 shadow-xl pt-3">
            <figure><img className="my-3" src={data.photo !== '' ? `${API_URL}/images/${data.photo}` : ''} alt="" /></figure>
            <div className="card-body">
                <h2 className="card-title">
                    {data.name}
                </h2>
                <div className="card-actions justify-end">
                    <Link to={`/chat/${data.id}`}><button className="btn btn-primary"><IoChatboxEllipses size={30}></IoChatboxEllipses>Chat</button></Link>
                </div>
            </div>
        </div>
    );
}
