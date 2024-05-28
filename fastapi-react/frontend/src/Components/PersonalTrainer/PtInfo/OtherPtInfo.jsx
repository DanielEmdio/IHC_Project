import { FaUserCircle, FaUserGraduate, FaInfo, FaStar, FaCalendarAlt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as utils from "../../../Utils/utils";
import { BiWorld } from "react-icons/bi";
import { api } from '../../../api';

export default function OtherPtInfo() {
    const [Pt, setPt] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        api.post(`/users/getPtById/${id}`, { token: utils.getCookie("token") }).then((r) => {
            const data = r.data;
            const element = data.pt;

            setPt({
                name: element.name,
                photo: element.photo,
                description: element.description,
                tags: element.tags.split(","),
                slots: element.slots,
                price: element.price,
                rating: element.rating,
                n_comments: element.n_comments,
                lang: element.lang,
                hours: element.hours
            });

        }).catch((_) => { });
    }, []);

    return (
        <>
            <div role="tablist" className="tabs-bordered mt-6 pb-16 lg:pb-0 w-4/5 lg:w-2/3 mx-auto flex flex-wrap items-center justify-between">
                <Link to={`/PT_nonSub/${id}/main`} role="tab" className="tab"><FaUserCircle size='15' title='Main' /></Link>
                <Link to={`/PT_nonSub/${id}/bg`} role="tab" className="tab"><FaUserGraduate size='15' title='Background' /></Link>
                <Link to={`/PT_nonSub/${id}/other`} role="tab" className="tab-active"><FaInfo size='15' title='Info' /></Link>
                <Link to={`/PT_nonSub/${id}/rating`} role="tab" className="tab"><FaStar size='15' title='Rating' /></Link>
            </div>
            <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start"><FaCalendarAlt className="h-4 fill-current text-green-700 mr-4" />Availability:</p>
            <div className="divider"></div>
            <div className="overflow-x-auto">
                {Pt.hours ? (<table className="table">
                    <thead>
                        <tr>
                            <th>Days</th>
                            <th>Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Pt.hours.map((day, index) => (
                            <tr key={index}>
                                <th>{day[0]}</th>
                                <td>{day[1]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>) : 'No information Available!'}
            </div>
            <p className="pt-4 mb-1 text-base font-bold flex items-center justify-center lg:justify-start"><BiWorld className="h-4 fill-current text-green-700 mr-4" />Languages spoken:</p>
            {Pt.lang ? Pt.lang.map((tag, index) => (
                <span key={index} className="badge badge-ghost badge-sm mx-1 flex-row-1 justify-start">{tag}</span>
            )) : 'No information Available!'}
        </>
    )
}
