import { MdOutlineKeyboardDoubleArrowUp, MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
import { FaRegTrashAlt, FaRegCopy } from "react-icons/fa";
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { api } from "../../../api";
import * as utils from "../../../Utils/utils" ; 

export default function ListExercise({ exercises,setExercises,isChecked,setIsChecked,setErrorMessage}) {
    const [selectedExercises, setSelectedExercises] = useState([]);
    //const [exercises, setExercises] = useState([]);    //they are already defined in the parent component
    const [mocked_exercises, setMockedExercises] = useState([]);

    // const mocked_exercises = [
    //     { value: "Push ups", label: "Push ups" },
    //     { value: "Biceps Curls", label: "Biceps Curls" },
    //     { value: "Squats", label: "Squats" },
    // ];

    useEffect(() => {
        api.post("/exercises/getExercises", {token: utils.getCookie("token")}).then((r) => {
            const data = r.data;
            const newMockedExercises = data.exercises.map(exercise => ({
                value: exercise.name,
                label: exercise.name,
                exercise_id: exercise.id,

            }));
            console.log("newMockedExercises: ",newMockedExercises)
            setMockedExercises(newMockedExercises);
        })
        .catch((e) => { 
            console.log(e);
        });
    }, []);

    //const [isChecked, setIsChecked] = useState([]);       //they are already defined in the parent component

    
    
    const handleExerciseChange = (selectedOption) => {
        setSelectedExercises(selectedOption);
        handleExerciseAdd(selectedOption);
    };

    /*
    const handleExerciseSubmit = (selectedOption) => {
        setExercises(prevExercises => [...prevExercises, selectedOption]);
    };
    */
   
    const handleExerciseAdd = (selectedOption) =>{
        const newExercise = {
            ...selectedOption,
            reps_or_time: 0,  // Initialize with default repetitions value
            is_time: false, // Initialize with default isChecked value
        };
        setExercises(prevExercises => [...prevExercises, newExercise]);
        setSelectedExercises([]);
        setErrorMessage('');
    }; // adicciona exercicios à lista

    const handleDeleteExercise = (index) => {
        const newExercises = [...exercises];
        newExercises.splice(index, 1);
        setExercises(newExercises);
    }; // remove exercicios da lista

    const handleMoveExerciseUp = (index) => {
        if (index > 0) {
            const newExercises = [...exercises];
            const temp = newExercises[index];
            newExercises[index] = newExercises[index - 1];
            newExercises[index - 1] = temp;
            setExercises(newExercises);
        }
    }; // move exercicio para cima

    const handleMoveExerciseDown = (index) => {
        if (index < exercises.length - 1) {
            const newExercises = [...exercises];
            const temp = newExercises[index];
            newExercises[index] = newExercises[index + 1];
            newExercises[index + 1] = temp;
            setExercises(newExercises);
            
        }
    }; // move exercicio para baixo

    const handleCopyExercise = (index) => {
        const newExercises = [...exercises];
        newExercises.splice(index, 0, exercises[index]);
        setExercises(newExercises);
    }; // copia exercicio

    const handleRepetitionsChange = (index, reps_or_time) => {
        const newExercises = [...exercises];
        newExercises[index].reps_or_time = reps_or_time;
        setExercises(newExercises);
    };

    const handleToggle = (index) => {
        // update the exercise state with the new isChecked value
        const newExercises = [...exercises];
        newExercises[index].is_time = !newExercises[index].is_time;
        setExercises(newExercises);

        // update the visual state of the checkbox
        setIsChecked(prevState => {
            const newState = [...prevState];
            newState[index] = !newState[index];
            return newState;
        });
    };

    return (
        <>
            {exercises.length > 0 ?
                (
                    <div className='grid grid-col-1'>
                        {exercises.map((exercise, index) => (
                            <div key={index} className='flex justify-between bg-gray-100 rounded-full px-4 py-1 m-1 text-xs text-black'>
                                <div className='basis-1/6'>
                                    <span className='mr-1'>{index + 1}º</span>
                                    <span className='font-bold'>{exercise.label}</span>
                                </div>
                                <div>
                                    <input key={index} type="checkbox" checked={isChecked[index] || false} onChange={() => handleToggle(index)} className="toggle toggle-primary mx-2 h-5/6" />
                                    {isChecked[index] ?
                                        (
                                            <>
                                                <span>Duration (sec):</span>
                                            </>
                                        ) :
                                        <>
                                            <span>Repetitions:</span>
                                        </>
                                    }
                                    <input 
                                        type='number' 
                                        min="0" 
                                        value={exercise.reps_or_time}
                                        onChange={(e) => handleRepetitionsChange(index, parseInt(e.target.value) || 0)}
                                        className='w-12 mx-2'
                                    />
                                </div>
                                
                                <div>
                                    <button type="button" onClick={() => handleDeleteExercise(index)}><FaRegTrashAlt className='mx-2 text-red-500' /></button>
                                    <button type="button" onClick={() => handleCopyExercise(index)}><FaRegCopy className='mx-2 text-yellow-500' /></button>
                                    <button type="button" onClick={() => handleMoveExerciseUp(index)}><MdOutlineKeyboardDoubleArrowUp className='mx-2 text-blue-500' /></button>
                                    <button type="button" onClick={() => handleMoveExerciseDown(index)}><MdOutlineKeyboardDoubleArrowDown className='mx2 text-blue-500' /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) :
                <p className='text-gray-500 mb-4 text-center font-bold'>No exercises added yet</p>
            }

            <div className='flex mt-3'>
                <Select
                    options={mocked_exercises}
                    value={selectedExercises}
                    onChange={handleExerciseChange}
                    isMulti={false}
                    className='mb-4 text-black w-full mx-2'
                    placeholder="Add your exercises"
                    isSearchable={true}
                />
            </div>
        </>
    );
}
