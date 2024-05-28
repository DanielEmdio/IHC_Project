import { Link } from "react-router-dom";

export default function PtSubscriptioncard({ Pt }) {
    return (
        <div className="card w-90 bg-base-100 shadow-xl">
            <figure><img className="my-2" src={Pt.photo} alt="pt-image" /></figure>
            <div className="card-body">
                <h2 className="card-title">
                    {Pt.name}
                </h2>
                <p>{Pt.decription}</p>
                <div className="card-actions justify-center">
                    {Pt.tags.map((tag, index) => (
                        <div key={index} className="badge badge-outline">{tag}</div>
                    ))}
                </div>
                <div className="card-actions justify-center">
                    <Link to={"/PT_sub/1"}><button className="btn btn-primary ">View subscription details</button></Link>
                </div>
            </div>
        </div>
    );
}
