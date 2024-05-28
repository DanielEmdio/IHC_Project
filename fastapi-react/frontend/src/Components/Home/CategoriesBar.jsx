import Workoutcard from "../../Components/Home/Workoutcard";
import { useState, useEffect } from "react";
import * as utils from "../../Utils/utils";
import { api } from '../../api';
import AddVideo from "../../Pages/Home/AddVideo";

export default function CategoriesBar() {
    const [activeButton, setActiveButton] = useState("all");
    const [mockedData, setMockedData] = useState([]);
    const [showAddVideo, setShowAddVideo] = useState(false);

    useEffect(() => {
        api.post("/workouts/getAccessibleWorkouts", { token: utils.getCookie("token") }).then((r) => {
            const data = r.data;
            let newMockedData = [];
            data.workouts.forEach(element => {
                newMockedData.push({
                    id: element.id,
                    title: element.title,
                    thumbnail: element.thumbnail,
                    duration: element.duration,
                    rating: element.rating,
                    releasedate: element.releasedate,
                    difficulty: element.difficulty,                                  // deverá ser ajustado
                    mainMuscles: element.tags.split(","),
                })
            });

            setMockedData(newMockedData);
        }).catch((_) => { });
    }, []);

    const toggleAddVideo = () => {
        setShowAddVideo(!showAddVideo);  // Alternar visibilidade de AddVideo
        setActiveButton("addvideo");
    };

    const popularClick = (e) => {
        if (showAddVideo) {
            setShowAddVideo(!showAddVideo);
        }
        e.preventDefault();
        setActiveButton("popular");

        api.post("/workouts/getAccessibleWorkouts", { token: utils.getCookie("token") }).then((r) => {
            const data = r.data;
            let newMockedData = [];
            data.workouts.forEach(element => {
                newMockedData.push({
                    id: element.id,
                    title: element.title,
                    thumbnail: element.thumbnail,
                    duration: element.duration,                             // deverá ser ajustado
                    rating: element.rating,
                    releasedate: element.releasedate,
                    difficulty: element.difficulty,                                  // deverá ser ajustado
                    mainMuscles: element.tags.split(","),
                })
            });

            // Ordenar por rating
            newMockedData.sort((a, b) => b.rating - a.rating);

            setMockedData(newMockedData);
        }).catch((_) => { });
    }

    const recentClick = (e) => {
        if (showAddVideo) {
            setShowAddVideo(!showAddVideo);
        }
        e.preventDefault();
        setActiveButton("recent");

        api.post("/workouts/getAccessibleWorkouts", { token: utils.getCookie("token") }).then((r) => {
            const data = r.data;
            let newMockedData = [];
            data.workouts.forEach(element => {
                newMockedData.push({
                    id: element.id,
                    title: element.title,
                    thumbnail: element.thumbnail,
                    duration: element.duration,                             // deverá ser ajustado
                    rating: element.rating,
                    releasedate: element.releasedate,
                    difficulty: element.difficulty,                                  // deverá ser ajustado
                    mainMuscles: element.tags.split(","),
                })
            });

            // Ordenar por release date
            newMockedData.sort((a, b) => {
                const dateA = convertToDate(a.releasedate);
                const dateB = convertToDate(b.releasedate);
                return dateB - dateA;
            });


            setMockedData(newMockedData);
        }).catch((_) => { });
    }

    // Função para converter string de data no formato "DD-MM-YYYY" para um objeto Date
    function convertToDate(dateString) {
        const [day, month, year] = dateString.split('-');
        return new Date(`${year}-${month}-${day}`);
    }

    const exclusiveClick = (e) => {
        if (showAddVideo) {
            setShowAddVideo(!showAddVideo);
        }
        e.preventDefault();
        setActiveButton("exclusive");

        api.post("/workouts/getPTPreWorkouts", { token: utils.getCookie("token") }).then((r) => {
            const data = r.data;
            let newMockedData = [];
            data.workouts.forEach(element => {
                newMockedData.push({
                    id: element.id,
                    title: element.title,
                    thumbnail: element.thumbnail,
                    duration: element.duration,                             // deverá ser ajustado
                    rating: element.rating,
                    releasedate: element.releasedate,
                    PTUsername: element.username,
                    difficulty: element.difficulty,                                  // deverá ser ajustado
                    mainMuscles: element.tags.split(","),
                })
            });

            setMockedData(newMockedData);
        }).catch((_) => { });
    }

    const AllClick = (e) => {
        if (showAddVideo) {
            setShowAddVideo(!showAddVideo);
        }
        e.preventDefault();
        setActiveButton("all");

        api.post("/workouts/getAccessibleWorkouts", { token: utils.getCookie("token") }).then((r) => {
            const data = r.data;
            let newMockedData = [];
            data.workouts.forEach(element => {
                newMockedData.push({
                    id: element.id,
                    title: element.title,
                    thumbnail: element.thumbnail,
                    duration: element.duration,                             // deverá ser ajustado
                    rating: element.rating,
                    releasedate: element.releasedate,
                    difficulty: element.difficulty,                                  // deverá ser ajustado
                    mainMuscles: element.tags.split(","),
                })
            });

            setMockedData(newMockedData);
        }).catch((_) => { });

    }
    //{!utils.isNormalUser() ? <a onClick={toggleAddVideo} className={`btn btn-ghost text-xl ${activeButton === "addvideo" ? "active" : ""}`}>Add Video</a> : <></>}
    return (
        <>
            <div className="navbar bg-base-100 rounded-xl my-10">
                <a onClick={AllClick} className={`btn btn-ghost text-xl ${activeButton === "all" ? "active" : ""}`}>All</a>
                <a onClick={popularClick} className={`btn btn-ghost text-xl ${activeButton === "popular" ? "active" : ""}`}>Popular</a>
                <a onClick={recentClick} className={`btn btn-ghost text-xl ${activeButton === "recent" ? "active" : ""}`}>Recent</a>
                {utils.isNormalUser() ? <a onClick={exclusiveClick} className={`btn btn-ghost text-xl ${activeButton === "exclusive" ? "active" : ""}`}>Exclusive</a> : <></>}
            </div>
            <div className="flex flex-col gap-4">
                {(mockedData.length === 0 && !showAddVideo) ? (
                    <div className='text-center'>No workouts available.</div>
                ) : (
                    mockedData.map((workout, index) => (
                        <Workoutcard key={index} workout={workout} />
                    )))}
                {showAddVideo && <AddVideo />}
            </div>
        </>
    );
}
