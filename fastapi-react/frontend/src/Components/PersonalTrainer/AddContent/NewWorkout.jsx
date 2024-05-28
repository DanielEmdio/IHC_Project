import React, { useState } from 'react';
import { MdFileUpload } from "react-icons/md";
import { FaClock } from "react-icons/fa";
import Select from 'react-select';
import ListExercise from './List_exercise';
import * as utils from "../../../Utils/utils";
import { api } from '../../../api';

export default function NewWorkout() {
    const [thumbnail, setThumbnail] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [chosenTags, setChosenTags] = useState([]);
    //const [personalTrainerId, setPersonalTrainerId] = useState('');
    const [duration, setDuration] = useState('');
    const [exercises, setExercises] = useState([]);
    const [isChecked, setIsChecked] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [isPremium, setIsPremium] = useState(false); 
    

    const handleTagChange = (chosenTags) => {
        setChosenTags(chosenTags);
    };

    const handleThumbnailChange = (event) => {
        setThumbnail(event.target.files[0]);
    };


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
    // const handleExercisesUpdate = (newExercises) => {
    //     setExercises(newExercises);
    // };

    const handlePremiumChange = (event) => {
        setIsPremium(event.target.checked); // Update state based on checkbox
    };

    const handleDurationChange = (event) => {
        setDuration(event.target.value);
    };

    


    const handleSubmit = async (event) => {
        event.preventDefault();

        if (exercises.length === 0) {
            setErrorMessage('You must add at least one exercise.');
            return;
        }


        const workoutData = {
            title: title,
            //thumbnail: thumbnail,
            description: description,
            tags: chosenTags.map(tag => tag.value).join(','), // Convert array of tags to string
            duration: duration+" min",
            premium: isPremium,
            releasedate: new Date().toISOString().slice(0, 10)
        }
        
        console.log(workoutData);

        const exerciseSetNumbers = {}; // Map to keep track of set numbers

        for(let i = 0; i < exercises.length; i++){
            delete(exercises[i].value);
            delete(exercises[i].label);

            // If exercise id is found in the map, increment the set number
            if (exercises[i].id in exerciseSetNumbers) {
                exercises[i].set_num = exerciseSetNumbers[exercises[i].id] + 1;
            }
            else {
                exercises[i].set_num = 1;
            }


            // Update the set number in the map
            exerciseSetNumbers[exercises[i].id] = exercises[i].set_num;
        }
        //console.log("exercises: ",exercises); 
        const response = await api.post("/workouts/addWorkout", {token: {token: utils.getCookie("token")} ,workout: workoutData, workout_exercises:exercises});
        if(response.data.result === "ok"){
            console.log("data: ",response.data);
        }else{
            alert("Error adding workout");
            return;
        }
        const workout_id = response.data.workout.id;

        
        // save thumbnail
        if(thumbnail!=null){
            const renamedThumbnailFile = new File([thumbnail], `${title}_thumbnail_${workout_id}.png`, { type: thumbnail.type });

            const formData = new FormData();
            formData.append("thumbnail", renamedThumbnailFile);


            const response2 = await api.post(`/workouts/uploadWorkoutThumbnail`, formData);
            const data2 = response2.data;
            if (data2["result"] !== "ok") {
                //setErrMsg(data3["error"]);
                return;
            }
        }   
        //setIsModalOpen(false); // Close modal
        document.getElementById('modal_add_workout').close();
        //setShowSuccessMessage(true); // Show success message
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
            <div className="p-8 bg-white grow">
                <form onSubmit={handleSubmit}>
                    <fildset>
                        <h2 className="text-2xl font-semibold mb-7 text-center text-gray-800">Upload New Workout</h2>
                        <div className="mb-4">
                            <input type="text" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded text-black" required/>
                        </div>
                        <div className="mb-4">
                            <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 border border-gray-300 rounded h-32 text-black" required></textarea>
                        </div>

                        <Select
                            options={tags}
                            value={chosenTags}
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
                                className="w-1/4 text-sm text-gray-500 file-input file-input-bordered 
                            file-input-primary file:text-white file:hover:bg-[#009977]"/>
                        </div>

                        <p className='text-black mb-2'>Exercises:</p>

                        <ListExercise exercises={exercises} setExercises={setExercises} isChecked={isChecked} setIsChecked={setIsChecked} setErrorMessage={setErrorMessage}/>
                        {errorMessage && (
                            <div className="text-red-500 mb-4">{errorMessage}</div>
                        )}
                        <div className="flex items-center justify-self-start">
                            <input type="checkbox" id="premium" checked={isPremium} onChange={handlePremiumChange} className="mr-2" />
                            <label htmlFor="premium" className="text-black">Premium</label>
                        </div>
                        <div className="divider"></div>

                        <div className='grid grid-cols-3'>
                            <h3 className='text-black justify-self-start'>Difficulty:</h3>
                            <h3 className='text-black justify-self-start'>Duration:</h3>
                            <p></p>
                            <div className="rating justify-self-start my-2">
                                <input type="radio" name="rating-4" className="mask mask-star-2 bg-green-500 size-10" checked/>
                                <input type="radio" name="rating-4" className="mask mask-star-2 bg-green-500 size-10"  />
                                <input type="radio" name="rating-4" className="mask mask-star-2 bg-green-500 size-10" />
                            </div>
                            <div className='flex justify-self-start'>
                                <FaClock className='text-green-500 size-10 my-2' />
                                <input type="number"
                                    min="0" // Impede valores negativos
                                    step="1" // Passo de 1 para impedir valores decimais
                                    placeholder="minutes" // Mantém o placeholder visível
                                    value={duration}
                                    onChange={handleDurationChange}
                                    className="my-2 input input-bordered w-3/4 h-3/4 mx-2 max-w-xs text-black"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full my-1 btn btn-secondary text-white  font-bold mb-2 px-4 rounded focus:outline-none focus:shadow-outline" > <MdFileUpload size={25} /> Upload Workout</button>
                        </div>
                    </fildset>
                </form>
            </div>
        </div>
    );
}
