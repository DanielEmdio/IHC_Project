import React, { useState } from "react";
// import { useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { FaRegTrashAlt } from "react-icons/fa";

export default function NewCommonMistake({ commonMistakes, setCommonMistakes }) {
    //const [common_mistakes, setCommonMistakes] = useState([]);
    const [newMistake, setNewMistake] = useState({ description: '', file: null });

    const handleDescriptionChange = (event) => {
        setNewMistake(prevState => ({ ...prevState, description: event.target.value }));
    };

    const handleFileChange = (event) => {
        setNewMistake(prevState => ({ ...prevState, file: event.target.files[0] }));
    };

    const handleAddMistake = () => {
        if (!newMistake.description || !newMistake.file) {
            return;
        }
        setCommonMistakes([...commonMistakes, newMistake]);
        setNewMistake({ description: '', file: null });
    };

    const handleDeleteMistake = (index) => {
        const newMistakes = [...commonMistakes];
        newMistakes.splice(index, 1);
        setCommonMistakes(newMistakes);
    };

    // useEffect(() => {
    //     console.log(common_mistakes);
    // }, [common_mistakes]);

    return (
        <div className='flex'>
            <div className="basis-2/3">
                <p className='text-black mb-2'>Common mistakes:</p>
                <div className="flex justify-start p-2 outline outline-1 outline-green-500 rounded-xl mb-4">
                    <div className=" w-3/4  mb-3 grid grid-col-2 gap-2">
                        <textarea
                            placeholder="Description"
                            className="w-full p-2 border border-gray-300 rounded h-32 text-black"
                            value={newMistake.description}
                            onChange={handleDescriptionChange}>
                        </textarea>
                        <div>
                            <p className='text-gray-400 text-sm mb-1'>Example video:</p>
                            <input
                                type="file" accept="video/mp4"
                                className="w-full text-sm text-gray-500 file-input file-input-bordered file-input-primary file:text-white file:hover:bg-[#009977]"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                    <button type="button" onClick={handleAddMistake} className="self-center btn btn-square h-60 w-auto text-white btn-primary text-base ml-3 flex flex-col items-center">
                        <div><FaPlus></FaPlus></div>
                        <div>Add common mistake</div>
                    </button>
                </div>
            </div>

            <div className="basis-1/3 place-self-auto mx-5 overflow-auto max-h-72 w-full">
                {commonMistakes.length > 0 ?(
                <table className="table">
                    {/* head */}
                    <thead>
                    <tr>
                        <th></th>
                        <th>Number</th>
                        <th>Video</th>
                        <th>Delete</th>
                    </tr>
                    </thead>
                    <tbody>
                    {commonMistakes.map((mistake, index) => (
                    <tr
                    className="bg-base-200" 
                    key={index}>
                        <th></th>
                        <td>{index + 1}</td>
                        <td>{mistake.file ? mistake.file.name : 'No video'}</td>
                        <td>
                            <button type="button" onClick={() => handleDeleteMistake(index)}><FaRegTrashAlt className='mx-2 text-red-500'/></button>
                        </td>
                    </tr>
                    ))}
                    </tbody>
                </table>
                ) : (
                    <p className='text-gray-400 text-center'>No common mistakes added</p>
                )}
            </div>
        </div>
    );
}
