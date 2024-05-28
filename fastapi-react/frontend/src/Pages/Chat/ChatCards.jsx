import { useEffect, useState } from "react";
import ChatCard from "../../Components/Chat/ChatCard";
import * as utils from "../../Utils/utils";
import { api } from "../../api";

export default function ChatCards() {
    const [data, setData] = useState([]);

    // get pts or athletes
    useEffect(() => {
        api.post(`/users/${utils.isNormalUser() ? 'getSubs' : 'getUsersSubToPt'}`, { token: utils.getCookie("token") }).then((r) => {
            const d = r.data;
            if (d.result === "ok") {
                setData(utils.isNormalUser() ? d.pts : d.users);
            }
        }).catch((_) => { });
    }, []);

    return (<>
        <div className='w-11/12 mx-auto'>
            <h1 className='my-3 text-2xl font-bold'>{utils.isNormalUser() ? 'My personal trainers:' : 'My athletes:'}</h1>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.length > 0 ?
                    data.map((d, i) => <ChatCard className="basis-1/3" key={i} data={d} />)
                    : <span className="text-xl">No data available.</span>}
            </div>
        </div>
    </>);
}
