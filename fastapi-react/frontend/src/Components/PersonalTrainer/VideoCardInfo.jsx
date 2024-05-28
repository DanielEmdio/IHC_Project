import { Link } from "react-router-dom";
import { FaPlay } from "react-icons/fa";
import { CiClock2 } from "react-icons/ci";
import { API_URL } from "../../api";

export default function VideoCardInfo({ workout }) {
    return (
        <div>
            <img
                src={`${API_URL}/images/${workout.thumbnail}`}
                alt=""
                className="w-full h-64 object-cover object-center rounded-lg"
                height="400"
                style={{
                    aspectRatio: "600/400",
                    objectFit: "cover",
                }}
                width="600"
            />
            <h3 className="text-xl font-bold mb-2 mt-4">{workout.title}</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-2">
                {workout.description.substring(0, 100)}...
            </p>
            <div className="flex items-center my-2">
                <CiClock2 className='icon text-base mr-1' />
                <p>
                    Duration: {workout.duration}
                </p>
            </div>
            <div className="flex justify-between">
                <div>
                    {workout.tags.map((muscle, index) => (
                        <div key={index} className="badge badge-lg">{muscle}</div>
                    ))}
                </div>
                <Link className="hover:text-blue-700 mt-4" to={`/video/${workout.id}`}>
                    <button className="btn btn-primary"><FaPlay />Check it out!</button>
                </Link>
            </div>
        </div>
    )
}
