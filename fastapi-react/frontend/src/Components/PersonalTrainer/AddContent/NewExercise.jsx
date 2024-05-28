import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import NewCommonMistake from './NewCommonMistake';
import { MdFileUpload } from "react-icons/md";
import { api } from '../../../api';
import * as utils from "../../../Utils/utils";

export default function NewExercise() {
    const [commonMistakes, setCommonMistakes] = useState([]);
    const [video, setVideo] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [targetMuscles, setTargetMuscles] = useState('');
    const [errMsg, setErrMsg] = useState('');
    //const [personalTrainerId, setPersonalTrainerId] = useState('');
    //console.log(commonMistakes);

    const [difficulty, setDifficulty] = useState('Warmup');
    const [dificulty_db, setDificulty_db] = useState('1');
    const difficulties = ['Warmup', 'Light', 'Moderate', 'Hard', 'Max effort'];
    const dificulties_db = ['1', '2', '3', '4', '5'];


    const handleDifficultyChange = (index) => {
        setDifficulty(difficulties[index]);
        setDificulty_db(dificulties_db[index]);
    };

    console.log('NewCommonMistake props:', { commonMistakes, setCommonMistakes });

    const handleTagChange = (targetMuscles) => {
        setTargetMuscles(targetMuscles);
    };

    const handleVideoChange = (event) => {
        setVideo(event.target.files[0]);
    };

    const handleThumbnailChange = (event) => {
        setThumbnail(event.target.files[0]);
    }

    useEffect(() => {
        setErrMsg('');
    }, [title, description, targetMuscles, video, thumbnail, commonMistakes]);

    const tags = [
        { value: "Full Body", label: "Full Body" },
        { value: "Cardio", label: "Cardio" },
        { value: "Strength", label: "Strength" },
        { value: "Endurance", label: "Endurance" },
        { value: "Flexibility", label: "Flexibility" },
        { value: "Balance", label: "Balance" },
        { value: "Agility", label: "Agility" },
        { value: "Speed", label: "Speed" },
        { value: "Power", label: "Power" },
        { value: "Plyometrics", label: "Plyometrics" },
        { value: "Core", label: "Core" },
        { value: "Upper Body", label: "Upper Body" },
        { value: "Lower Body", label: "Lower Body" },
        { value: "Back", label: "Back" },
        { value: "Chest", label: "Chest" },
        { value: "Shoulders", label: "Shoulders" },
        { value: "Arms", label: "Arms" },
        { value: "Legs", label: "Legs" },
        { value: "Glutes", label: "Glutes" },
        { value: "Abs", label: "Abs" },
        { value: "Biceps", label: "Biceps" },
        { value: "Triceps", label: "Triceps" },
        { value: "Quads", label: "Quads" },
        { value: "Hamstrings", label: "Hamstrings" },
        { value: "Calves", label: "Calves" },
        { value: "Pectorals", label: "Pectorals" },
        { value: "Deltoids", label: "Deltoids" },
        { value: "Trapezius", label: "Trapezius" },
        { value: "Latissimus Dorsi", label: "Latissimus Dorsi" }
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();

        const exercisedetails = {
            name: title,
            description: description,
            dificulty: dificulty_db,               // frontend needs to be done.................
            muscletargets: targetMuscles.map(muscle => muscle.value).join(','),
        };
        

        console.log(exercisedetails);
        console.log(targetMuscles[0].value);

        console.log(video);
        console.log(thumbnail);
        
        try {
            //console.log("details : " + details);
            const response1 = await api.post(`/users/safePTNewExerciseDetails`, { token: { "token": utils.getCookie("token") }, exercisedetails: exercisedetails });

            const data1 = response1.data;
            if (data1["result"] !== "ok") {
                setErrMsg(data1["error"]);
                return;
            }
            // save video
            
            // Agora, antes de enviar a solicitação para salvar o video, alteremos o nome do arquivo para title_exercise_id.mp4
            const exercise_id = data1.exercise_id; // Supondo que a resposta inclua o pt_id
            const renamedFile = new File([video], `${title}_${exercise_id}.mp4`, { type: video.type });

            const formData2 = new FormData();
            formData2.append("video", renamedFile);
            
            console.log("formData2----", formData2);
            const response2 = await api.post(`/users/safePTNewExerciseVideo`, formData2);
            const data2 = response2.data;
            if (data2["result"] !== "ok") {
                setErrMsg(data2["error"]);
                return;
            }
            
            // save thumbnail

            const renamedFile2 = new File([thumbnail], `${title}_thumbnail_${exercise_id}.png`, { type: thumbnail.type });

            const formData3 = new FormData();
            formData3.append("thumbnail", renamedFile2);

            const response3 = await api.post(`/users/safePTNewExerciseThumbnail`, formData3);
            const data3 = response3.data;
            if (data3["result"] !== "ok") {
                setErrMsg(data3["error"]);
                return;
            }

            // save common mistakes if any

            if (commonMistakes.length > 0) {
                //commonMistakes = [ {description: "mistake1", file: File}, {description: "mistake2", file: File}]
                for (let i = 0; i < commonMistakes.length; i++) {
                    const mistake = commonMistakes[i];

                    // save description

                    const response4 = await api.post(`/users/safePTNewExerciseCommonMistakeDescription`, { description: mistake.description , exercise_id: exercise_id});

                    const data4 = response4.data;
                    if (data4["result"] !== "ok") {
                        setErrMsg(data4["error"]);
                        return;
                    }

                    //save video
                    
                    const common_mistake_id = data4.common_mistake_id;
                    console.log(`test ------ ${title}_mistake_${common_mistake_id}_${i}.mp4`);

                    const renamedFile3 = new File([mistake.file], `${title}_mistake_${common_mistake_id}_${i}.mp4`, { type: mistake.file.type });
                    const formData5 = new FormData();
                    formData5.append("video", renamedFile3);
                    const response5 = await api.post(`/users/safePTNewExerciseCommonMistakeVideo`, formData5);

                    const data5 = response5.data;
                    if (data5["result"] !== "ok") {
                        setErrMsg(data5["error"]);
                        return;
                    }

                    
                }
            }
            document.getElementById('modal_add_exercise').close();
            // Lógica para sucesso
            //utils.goToHome();
        } catch (error) {
            // Lógica para lidar com erros
            console.error(error);
        }
    };

    /*
        const handleTagChange = (tag) => {
            setTempDetailsTags(prevDetails => {
                const isTagSelected = prevDetails.tags.includes(tag[0]);
                //console.log(tag[0]);
                //console.log(isTagSelected);
                if (isTagSelected) {
                    // Se o idioma já estiver selecionado, remove da lista de idiomas selecionados e atualiza o lang details
                    return {
                        ...prevDetails,
                        tags: prevDetails.tags.filter(tag => tag !== tag[0])
                    };
                } else {
                    // Se o idioma ainda não estiver selecionado, adiciona à lista de idiomas selecionados e atualiza o lang details
                    //setDetails({ ...details, tags: details.tags.concat(tag[0]) });
                    return {
                        ...prevDetails,
                        tags: prevDetails.tags.concat(tag[0])
                    };
                }
    
            });
            //console.log(tempdetailstags.tags);
        };
    */

    return (
        <div className="flex justify-center  h-screen ">
            <form onSubmit={handleSubmit}>
            <div className="p-10 bg-white grow">
                <h2 className="text-2xl font-semibold mb-3 text-center text-gray-800">Upload New Exercise</h2>
                <p className='text-black mb-2'>Exercise video:</p>
                <div className="mb-4">
                    <input
                        type="file" accept="video/mp4"
                        onChange={handleVideoChange}
                        required
                        className="w-full text-sm text-gray-500 file-input file-input-bordered 
                    file-input-primary file:text-white file:hover:bg-[#009977]"/>
                </div>
                <div className="mb-4">
                    <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 border border-gray-300 rounded text-black" />
                </div>
                <div className="mb-4">
                    <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} required className="w-full p-2 border border-gray-300 rounded h-32 text-black"></textarea>
                </div>

                <Select
                    options={tags}
                    value={targetMuscles}
                    onChange={handleTagChange}
                    isMulti={true}
                    className='mb-4 text-black'
                    placeholder="Tags"
                    required
                />

                <p className='text-black mb-2'>Tumbnail:</p>
                <div className="mb-4">
                    <input
                        type="file" accept="image/*"
                        onChange={handleThumbnailChange}
                        required
                        className="w-full text-sm text-gray-500 file-input file-input-bordered 
                    file-input-primary file:text-white file:hover:bg-[#009977]"/>
                </div>

                <p className='text-black mb-1'>Exercise difficulty:</p>
                <div className="rating flex justify-center mb-1">
                    <input type="radio" name="rating-4" value="Warmup" className="mask mask-star-2 bg-lime-500 size-10" checked={difficulty === 'Warmup'}         onChange={() => handleDifficultyChange(0)} />
                    <input type="radio" name="rating-4" value="Light" className="mask mask-star-2 bg-green-500 size-10" checked={difficulty === 'Light'}          onChange={() => handleDifficultyChange(1)} />
                    <input type="radio" name="rating-4" value="Moderate" className="mask mask-star-2 bg-yellow-500 size-10" checked={difficulty === 'Moderate'}   onChange={() => handleDifficultyChange(2)} />
                    <input type="radio" name="rating-4" value="Hard" className="mask mask-star-2 bg-orange-500 size-10" checked={difficulty === 'Hard'}           onChange={() => handleDifficultyChange(3)} />
                    <input type="radio" name="rating-4" value="Max effort" className="mask mask-star-2 bg-red-500 size-10" checked={difficulty === 'Max effort'}  onChange={() => handleDifficultyChange(4)} />
                </div>
                <div className="rating flex justify-center text-black mb-3">
                    <p>{difficulty}</p>
                </div>

                <NewCommonMistake commonMistakes={commonMistakes} setCommonMistakes={setCommonMistakes} />
                <div className='text-red-500 text-center mb-2'> {errMsg} </div>
                <button type="submit" className="w-full btn btn-secondary text-white font-bold py-2 mb-2 px-4 rounded focus:outline-none focus:shadow-outline" ><MdFileUpload size={25} /> Upload Exercise</button>
            </div>
            </form>
        </div>
    );
}
