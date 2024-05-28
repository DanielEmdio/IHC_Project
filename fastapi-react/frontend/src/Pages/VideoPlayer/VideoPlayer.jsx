import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as utils from "../../Utils/utils";
import { api, API_URL } from '../../api';
import ReactPlayer from 'react-player';

function VideoPlayer() {
    // Estado para controlar se a descrição está expandida ou não
    const [isExpanded, setIsExpanded] = useState(false);
    const [exercises, setExercises] = useState([]);
    const [videoIdx, setVideoIdx] = useState(-1);
    const { WorkoutID } = useParams();
    const [pt_name, setPtName] = useState(""); // get pt_name from pt_id

    const [workout, setWorkout] = useState({
        pt_id: "",
        releasedate: "",
    });

    const [video, setVideo] = useState({
        path: "",
        title: "",
        rating: "",
        description: ""
    });

    const toggleDescription = () => {
        setIsExpanded(!isExpanded);
    };

    useEffect(() => {
        api.post(`/workouts/getWorkoutInfo?workout_id=${WorkoutID}`, { token: utils.getCookie("token") }).then((r) => {
            const data = r.data;
            const workout_info = data.workout;

            setWorkout({
                pt_id: workout_info.personal_trainer_id,
                releasedate: workout_info.releasedate,
            });
        }).catch((_) => { });
    }, [WorkoutID]);

    useEffect(() => {
        api.post(`/exercises/getWorkoutExercises?workout_id=${WorkoutID}`, { token: utils.getCookie("token") }).then((r) => {
            const data = r.data;
            // const element = data.exercises[0]; // In this case, we are only interested in the first video
            let videosInfo = [];
            data.exercises.forEach(element => {
                videosInfo.push({
                    path: element.path,
                    title: element.name,
                    rating: element.rating,
                    description: element.description,
                })
            });

            setExercises(videosInfo);
            setVideoIdx(0);
            setVideo(videosInfo[0]);
        }).catch((_) => { });
    }, [WorkoutID]);

    useEffect(() => {
        if (workout.pt_id) {
            api.post(`/users/getPtById/${workout.pt_id}`, { token: utils.getCookie("token") }).then((r) => {
                const data = r.data;
                if (data["result"] === "ok") {
                    setPtName(data["pt"]["name"]);
                }
            }).catch((_) => { });
        }
    }, [workout.pt_id]);

    const nextExercise = () => {
        const newIndex = videoIdx + 1;
        if (newIndex < exercises.length) {
            setVideoIdx(newIndex);
            setVideo(exercises[newIndex]);
        }
        else {
            alert("Workout completed!");
        }
    }

    const previousExercise = () => {
        const newIndex = videoIdx - 1;
        if (newIndex >= 0) {
            setVideoIdx(newIndex);
            setVideo(exercises[newIndex]);
        }
    }

    return (
        <div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center', height: '560px' }}>
                {video.path ? 
                    <div style={{ backgroundColor: 'rgb(200, 200, 200)', padding: '8px' }}>
                        <ReactPlayer
                            url={`${API_URL}/exercises/${video.path}`}
                            width="960px"
                            height="540px"
                            controls
                        />
                    </div> 
                : null}
            </div>
            <p><br></br></p>
            <div className=" w-11/12 mx-auto" style={{ marginBottom: '30px' }}>
                <p style={{ fontSize: '2.5em' }}>{video.title}</p>
                <p>{workout.releasedate}</p>
                <Link to={`/PT_sub/${workout.pt_id}`}> <button><p style={{backgroundColor: 'rgb(100, 200, 100)', padding: '10px', borderRadius: '10px', marginTop: '20px', fontSize: '1.5em', display: 'inline-block', color: 'white'}}>{pt_name}</p></button> </Link>
            </div>

            <div className=" w-11/12 mx-auto" style={{ backgroundColor: 'rgb(220, 220, 220)', padding: '5px', borderRadius: '5px' }}>
                <p style={{ fontSize: '1.2em', marginBottom: '10px', textDecoration: 'underline', fontWeight: 'bold' }}>Description</p>
                {/* Renderiza a descrição com base no estado isExpanded */}
                <p>
                    {isExpanded ? video.description : `${video.description.substring(0, 100)}...`}
                </p>
                {/* Botão para expandir/retrair a descrição */}
                <button onClick={toggleDescription}>
                    {isExpanded ? 'Show Less' : 'Show More'}
                </button>
            </div>

            <div className="flex justify-center">
                {videoIdx > 0 ? 
                <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-full w-full max-w-md" onClick={previousExercise} >
                    <p className="flex justify-center">
                        Previous exercise
                    </p>
                </button>
                : null}
                {videoIdx < exercises.length - 1 ?
                    <button className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full w-full max-w-md" onClick={nextExercise} >
                        <p className="flex justify-center">
                            Next exercise
                        </p>
                    </button>
                    :
                    <Link to="/">
                        <button className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded-full w-full max-w-md" onClick={nextExercise} >
                            <p className="flex justify-center">
                                Complete workout
                            </p>
                        </button>
                    </Link>
                }
            </div>
            <br />
        </div >
    );
}

export default VideoPlayer;
