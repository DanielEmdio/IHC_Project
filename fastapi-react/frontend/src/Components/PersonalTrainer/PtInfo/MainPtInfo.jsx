import { FaUserCircle, FaUserGraduate, FaInfo, FaStar, FaIdBadge, FaEuroSign } from "react-icons/fa";
import { Link, useOutletContext, useParams } from "react-router-dom";
import { GiCardAceSpades } from "react-icons/gi";

export default function MainPtInfo() {
    const Pt = useOutletContext();
    const { id } = useParams();

    return (
        <>
            <div role="tablist" className="tabs-bordered mt-6 pb-16 lg:pb-0 w-4/5 lg:w-2/3 mx-auto flex flex-wrap items-center justify-between">
                <Link to={`/PT_nonSub/${id}/main`} role="tab" className="tab-active"><FaUserCircle size='15' title='Main' /></Link>
                <Link to={`/PT_nonSub/${id}/bg`} role="tab" className="tab"><FaUserGraduate size='15' title='Background' /></Link>
                <Link to={`/PT_nonSub/${id}/other`} role="tab" className="tab"><FaInfo size='15' title='Info' /></Link>
                <Link to={`/PT_nonSub/${id}/rating`} role="tab" className="tab"><FaStar size='15' title='Rating' /></Link>
            </div>
            <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start"><GiCardAceSpades className="h-4 fill-current text-green-700 mr-4" />Specialty:</p>
            {Pt.tags ? Pt.tags.map((tag, index) => (
                <span key={index} className="badge badge-ghost badge-sm mx-1 flex-row-1 justify-start">{tag}</span>
            )) : 'No information Available!'}
            <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start"><FaIdBadge className="h-4 fill-current text-green-700 mr-4" />Slots left: <kbd className="kbd kbd-sm ml-1 text-black">{Pt.slots}</kbd> </p>
            <p className="pt-4 text-base font-bold flex items-center justify-center lg:justify-start"><FaEuroSign className="h-4 fill-current text-green-700 mr-4" />Price: <kbd className="kbd kbd-sm ml-1 text-black">{Pt.price}</kbd> </p>
            <p className="pt-8 text-sm">{Pt.description}</p>
        </>
    )
}
