import { Outlet, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api, API_URL } from "../../api";
import * as utils from "../../Utils/utils";

export default function PtSubPage() {
    const { id } = useParams();
    const [Pt, setPt] = useState({
        name: "",
        photo: "",
        description: "",
        tags: [],
        slots: 0,
        price: ""
    });

    useEffect(() => {
        api.post(`/users/getPtById/${id}`, { token: utils.getCookie("token") }).then((response) => {
            const data = response.data;
            const element = data.pt;

            setPt({
                name: element.name,
                photo: element.photo,
                description: element.description,
                tags: element.tags.split(","),
                slots: element.slots,
                price: element.price
            })

        }).catch((_) => { });
    }, []);

    return (
        <div className="grid justify-items-center font-sans antialiased text-gray-900 leading-normal tracking-wider h-full bg-cover bg-[url('Assets/Gym.jpg')] bg-no-repeat">
            <div className="max-w-4xl flex items-center h-auto w-full lg:h-screen flex-wrap mx-auto my-32 lg:my-0">
                {/*Main Col*/}
                <div className="lg:w-3/5 rounded-lg lg:rounded-l-lg lg:rounded-r-none shadow-2xl bg-white opacity-95 mx-6 lg:mx-0">
                    <div className="p-4 md:p-12 text-center lg:text-left">
                        <img src={Pt.photo} alt="" className="block lg:hidden rounded-full shadow-xl mx-auto -mt-16 h-48 w-48 bg-cover bg-center" />
                        <h1 className="text-3xl font-bold pt-8 lg:pt-0">{Pt.name}</h1>
                        <div className="mx-auto lg:mx-0 w-4/5 pt-3 border-b-2 border-green-500 opacity-25"></div>
                        <Outlet context={Pt}></Outlet>
                    </div>
                </div>
                {Pt.photo !== '' ? <div className="w-full lg:w-2/5">
                    <img src={`${API_URL}/images/${Pt.photo}`} className="rounded-none lg:rounded-lg shadow-2xl hidden lg:block" alt="" />
                </div> : null}
            </div>
        </div>
    )
}
