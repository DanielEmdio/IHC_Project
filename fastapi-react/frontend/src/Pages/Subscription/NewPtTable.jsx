import { useEffect, useState } from "react";
import * as utils from "../../Utils/utils";
import { api, API_URL } from "../../api";
import { Link } from "react-router-dom";

export default function NewPtTable() {
    const [mockedData, setMockedData] = useState([]);

    useEffect(() => {
        getAvailablePTs();
    }, []);

    function getAvailablePTs() {
        api.post("/users/getNewPts", { token: utils.getCookie("token") }).then((response) => {
            const data = response.data;
            let newMockedData = [];

            data.pts.forEach(element => {
                newMockedData.push({
                    id: element.id,
                    name: element.name,
                    photo: element.photo,
                    description: element.description,
                    tags: element.tags.split(","),
                    price: element.price
                })
            });

            setMockedData(newMockedData);
        }).catch((_) => { });
    }

    function subscribe(pt_id) {
        // ask the user if he realy wants to subscribe, if yes, send the request to the server and reload the page
        if (!window.confirm("Are you sure you want to subscribe to this PT?")) {
            return;
        }

        api.post(`/users/subscribeToPT/${pt_id}`, { token: utils.getCookie("token") }).then((response) => {
            getAvailablePTs();
        }).catch((_) => {
            alert("Error subscribing to PT!");
        });
    }

    return (
        <div className=" w-11/12 mx-auto">
            <h1 className='my-3 mt-5 text-2xl font-bold'>Recomended personal trainers:</h1>
            <div className="overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Specialty</th>
                            <th>Description</th>
                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockedData.map((Pt, index) => (
                            <tr key={index}>
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="mask mask-squircle w-12 h-12">
                                                <img src={`${API_URL}/images/${Pt.photo}`} alt="Avatar Tailwind CSS Component" />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{Pt.name}</div>
                                            <div className="text-sm opacity-50">{Pt.price}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    {Pt.tags.map((tag, index) => (
                                        <span key={index} className="badge badge-ghost badge-sm mx-1">{tag}</span>
                                    ))}
                                </td>
                                <td>{Pt.description}</td>
                                <th>
                                    <button className="btn btn-success btn-xs text-white" onClick={() => subscribe(Pt.id)}>Subscribe</button>
                                </th>
                                <th>
                                    <Link to={`/PT_nonSub/${Pt.id}/main`}><button className="btn btn-ghost btn-xs">details</button></Link>
                                </th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
