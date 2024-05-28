import { Link } from 'react-router-dom';
import { API_URL } from '../../api';

export default function PtCard({ Pt }) {
    return (
        <div className="card w-90 bg-base-100 shadow-xl">
            <figure><img className="my-2" src={`${API_URL}/images/${Pt.photo}`} alt="" /></figure>
            <div className="card-body">
                <h2 className="card-title">
                    {Pt.name}
                </h2>
                <p>{Pt.decription}</p>
                <div className="card-actions justify-end">
                    {Pt.tags.map((tag, index) => (
                        <div key={index} className="badge badge-outline">{tag}</div>
                    ))}
                </div>
                <div className="card-actions justify-end">
                    <div>
                        <Link to={`/chat/${Pt.id}`}><button className="btn btn-primary">Chat</button></Link>
                    </div>
                    <div>
                        <Link to={`/PT_sub/${Pt.id}`}><button className="btn btn-primary">View</button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
