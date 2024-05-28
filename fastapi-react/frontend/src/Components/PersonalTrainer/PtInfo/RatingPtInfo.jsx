import { FaUserCircle, FaUserGraduate, FaInfo, FaStar, FaComment } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import * as utils from "../../../Utils/utils";
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import { api } from '../../../api';

export default function RatingPtInfo() {
    const [Pt, setPt] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        api.post(`/users/getPtById/${id}`, { token: utils.getCookie("token") }).then((r) => {
            const data = r.data;
            const element = data.pt

            setPt({
                name: element.name,
                photo: element.photo,
                description: element.description,
                tags: element.tags.split(","),
                slots: element.slots,
                price: element.price,
                rating: element.rating,
                n_comments: element.n_comments
            })

        }).catch((_) => { });
    }, []);

    return (
        <>
            <div role="tablist" className="tabs-bordered mt-6 pb-16 lg:pb-0 w-4/5 lg:w-2/3 mx-auto flex flex-wrap items-center justify-between">
                <Link to={`/PT_nonSub/${id}/main`} role="tab" className="tab"><FaUserCircle size='15' title='Main' /></Link>
                <Link to={`/PT_nonSub/${id}/bg`} role="tab" className="tab"><FaUserGraduate size='15' title='Background' /></Link>
                <Link to={`/PT_nonSub/${id}/other`} role="tab" className="tab"><FaInfo size='15' title='Info' /></Link>
                <Link to={`/PT_nonSub/${id}/rating`} role="tab" className="tab-active"><FaStar size='15' title='Rating' /></Link>
            </div>
            <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start"><FaStar className="h-4 fill-current text-green-700 mr-4" />Rating:</p>

            <br></br>
            <Box
                sx={{ '& > legend': { mt: 2 } }}>
                <Rating name="read-only" value={parseInt(Pt.rating)} readOnly />
            </Box>
        </>
    )
}
