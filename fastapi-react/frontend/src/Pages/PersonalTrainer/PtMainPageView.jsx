import { Link, useParams } from "react-router-dom"
import VideoCardInfo from "../../Components/PersonalTrainer/VideoCardInfo"
import { FaPlay } from "react-icons/fa"
import { CiClock2 } from "react-icons/ci"
import { FaCircleUp } from "react-icons/fa6";
import { CgMoreR } from "react-icons/cg";
import { IoChatbubble } from "react-icons/io5";
import { IoReturnUpBack } from "react-icons/io5";
import { useEffect, useState } from "react";
import { API_URL, api } from "../../api";
import * as utils from "../../Utils/utils";

export default function PtMainPageView() {
    const { id } = useParams();
    const [mockedData, setMockedData] = useState([]);
    const [most_recent, setMost_recent] = useState({
        id: 0,
        title: "",
        thumbnail: "",
        description: "",
        duration: "", // deverá ser ajustado
        //rating: element.rating,
        releasedate: "",
        tags: [],
    });

    useEffect(() => {
        api.post(`/workouts/getPTworkouts/${id}`).then((r) => {
            const data = r.data;
            let newMockedData = [];

            data.workouts.forEach(element => {
                newMockedData.push({
                    id: element.id,
                    title: element.title,
                    thumbnail: element.thumbnail,
                    description: "", // element.description,
                    duration: element.duration, // deverá ser ajustado
                    // rating: element.rating,
                    releasedate: element.releasedate,
                    tags: element.tags.split(",") // element.mainMuscles.split(","),
                });
            });

            // Ordenar por release date
            newMockedData.sort((a, b) => {
                const dateA = convertToDate(a.releasedate);
                const dateB = convertToDate(b.releasedate);
                return dateB - dateA;
            });

            setMost_recent(newMockedData[0]);
            setMockedData(newMockedData);

            // setMost_recent(mockedData[0]);
        }).catch((_) => { });
    }, [id]);

    // Função para converter string de data no formato "DD-MM-YYYY" para um objeto Date
    function convertToDate(dateString) {
        const [day, month, year] = dateString.split('-');
        return new Date(`${year}-${month}-${day}`);
    }

    const [Pt, setPt] = useState([]);
    useEffect(() => {
        api.post(`/users/getPtById/${id}`, { token: utils.getCookie("token") }).then((r) => {
            const data = r.data;
            const element = data.pt;

            setPt({
                name: element.name,
                photo: element.photo,
                description: element.description,
                tags: element.tags.split(","),
            });

        }).catch((_) => { });
    }, [id]);

    return (
        <section className="w-full">
            <header className="bg-emerald-900 text-zinc-50 py-4"> {/* navbar */}
                <div className="container mx-auto px-4 md:px-6">
                    <nav className="flex items-center justify-between">
                        <div className="text-2xl font-bold">
                            <div className="flex items-center">
                                <div className="avatar mx-2">
                                    <div className="w-24 rounded-full ring ring-offset-base-100 ring-offset-2">
                                        <img src={`${API_URL}/images/${Pt.photo}`} alt="" />
                                    </div>
                                </div>
                                {Pt.name}
                            </div>
                        </div>
                        <div className="space-x-4 flex justify-end">
                            <div className="flex items-center my-2">
                                <Link href=""><FaCircleUp className='icon text-base mr-1' /></Link>
                                <Link href="">
                                    Top Workouts
                                </Link>
                            </div>
                            <div className="flex items-center my-2">
                                <Link href=""><CgMoreR className='icon text-base mr-1' /></Link>
                                <Link href="">
                                    Other Workouts
                                </Link>
                            </div>
                            <div className="flex items-center my-2">
                                <Link href=""><IoChatbubble className='icon text-base mr-1' /></Link>
                                <Link href="">
                                    Chat
                                </Link>
                            </div>
                            <div className="flex items-center my-2">
                                <Link href=""><IoReturnUpBack className='icon text-base mr-1' /></Link>
                                <Link href="">
                                    Back
                                </Link>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>
            <main className="container mx-auto px-4 md:px-6 py-8">
                <section className="mb-8">  {/* Secção reservada ao workout mais recent do pt */}
                    <h2 className="text-2xl font-bold mb-4">Most Recent</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <img
                                alt="Top Story"
                                className="w-full h-64 object-cover object-center rounded-lg"
                                height="400"
                                src={`${API_URL}/images/${most_recent.thumbnail}`}
                                style={{
                                    aspectRatio: "600/400",
                                    objectFit: "cover",
                                }}
                                width="600"
                            />
                        </div>
                        <div className="flex flex-col justify-center">
                            <h3 className="text-xl font-bold mb-2">{most_recent.title}</h3>
                            <p className="text-zinc-500 dark:text-zinc-400">
                                {most_recent.description.substring(0, 100)}...
                            </p>
                            <div className="flex items-center my-2">
                                <CiClock2 className='icon text-base mr-1' />
                                <p>
                                    Duration: {most_recent.duration}
                                </p>
                            </div>
                            <div>
                                {most_recent.tags.map((tag, index) => (
                                    <span key={index} className="badge badge-ghost badge-sm mx-1 flex-row-1 justify-start">{tag}</span>
                                ))}
                            </div>
                            <Link className="text-blue-500 hover:text-blue-700 mt-4" to={`/video/${most_recent.id}`}>
                                <button className="btn btn-primary"><FaPlay />Check it out!</button>
                            </Link>
                        </div>
                    </div>
                </section>
                <div className="divider "></div>
                <section className="mb-8"> {/* Secção reservada aos workout mais vistos, recomendados, não sei esta por decidir */}
                    <h2 className="text-2xl font-bold mb-4">Top Wokouts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {mockedData.map((workout, index) => (
                            <VideoCardInfo key={index} workout={workout} />
                        ))}
                    </div>
                </section>
                <div className="divider"></div>
                <section className="mb-8"> {/* Secção reservada aos restantes workouts */}
                    <h2 className="text-2xl font-bold mb-4">Other Workouts</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {mockedData.map((workout, index) => (
                            <VideoCardInfo key={index} workout={workout} />
                        ))}
                    </div>
                </section>
            </main>
        </section>
    )
}
