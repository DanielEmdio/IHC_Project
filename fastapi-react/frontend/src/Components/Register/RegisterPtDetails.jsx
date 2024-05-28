import { MdOutlineMail, MdDescription, MdAddBox, MdLanguage, MdCastForEducation, MdBiotech } from "react-icons/md";
import { FaUser, FaTag, FaHourglassHalf } from "react-icons/fa";
import React, { useState, useRef, useEffect } from 'react';
import * as utils from "../../Utils/utils";
import { Link } from 'react-router-dom';
import { api } from "../../api";
import Select from 'react-select';

function RegisterPt() {
    const userRef = useRef();
    const [file, setFile] = useState('');

    // details will be dictionary with the following keys: name, email, description, tags, photo, price, slots, lang, hours, education, bg
    const [details, setDetails] = useState({
        name: "",
        email: "",
        description: "",
        tags: "",
        price: '',
        slots: 0,
        lang: "",
        hours: "",
        education: "",
        bg: ""
    });

    const [tempprice, setTempPrice] = useState(0);
    const [period, setPeriod] = useState("Monthly");

    const [previewphoto, setPreviewPhoto] = useState({ photo: '' });
    const [photofile, setPhoto] = useState(null);

    //const [file, setFile] = useState('');
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
        userRef.current.focus();
    }, []);
    useEffect(() => {
        setErrMsg('');
    }, [details]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0]; // Obter o arquivo da lista de arquivos selecionados
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            const maxSizeInBytes = 5 * 1024 * 1024; // 5 MB
            if (file.size > maxSizeInBytes) {
                setErrMsg("File is too large! Maximum size is 5MB");
                return;
            }
            setPreviewPhoto({ ...previewphoto, photo: imageUrl }); // Criar um URL temporário para a imagem e definir no estado
            setPhoto(file);
        }
    };

    const lags =[
        { value: "Portuguese", label: "Portuguese" },
        { value: "English", label: "English" },
        { value: "Spanish", label: "Spanish" },
        { value: "French", label: "French" },
        { value: "German", label: "German" },
        { value: "Italian", label: "Italian" },
        { value: "Russian", label: "Russian" },
        { value: "Chinese", label: "Chinese" },
        { value: "Japanese", label: "Japanese" },
        { value: "Korean", label: "Korean" },
        { value: "Arabic", label: "Arabic" },
        { value: "Hindi", label: "Hindi" },
        { value: "Bengali", label: "Bengali" },
        { value: "Urdu", label: "Urdu" },
        { value: "Turkish", label: "Turkish" },
        { value: "Vietnamese", label: "Vietnamese" },
        { value: "Thai", label: "Thai" },
        { value: "Swedish", label: "Swedish" },
        { value: "Dutch", label: "Dutch" },
        { value: "Polish", label: "Polish" },
        { value: "Romanian", label: "Romanian" },
        { value: "Hungarian", label: "Hungarian" },
        { value: "Czech", label: "Czech" },
        { value: "Greek", label: "Greek" }
    ];
    const [languages, setLanguages] = useState('');
    const handleLanguageChange = (language) => {
        setLanguages(language);
        setDetails({ ...details, lang: language.map(lang => lang.value).join(',') });
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
    const [targetMuscles, setTargetMuscles] = useState('');
    const handleTagChange = (targetMuscles) => {
        setTargetMuscles(targetMuscles);
        setDetails({ ...details, tags: targetMuscles.map(muscle => muscle.value).join(',') });
    };

    const updateDetails = async () => {
        // Atualize o estado com base no estado anterior
        const updatedDetails = { ...details };

        // Atualize o campo 'price'
        updatedDetails.price = `${tempprice} - ${period}`;

        // Atualize os campos 'lang' e 'tags'
        updatedDetails.lang = languages.map(lang => lang.value).join(',');
        updatedDetails.tags = targetMuscles.map(muscle => muscle.value).join(',');

        // Atualize o estado
        setDetails(updatedDetails);
    };

    const handleSubmit = async (form) => {
        form.preventDefault();

        try {

            // Atualize os detalhes antes de continuar
            await updateDetails();

            //console.log("details : " + details);
            const response1 = await api.post(`/users/registerPTdetails`, { token: { "token": utils.getCookie("token") }, details: details });

            const data1 = response1.data;
            if (data1["result"] !== "ok") {
                setErrMsg(data1["error"]);
                return;
            }

            // Agora, antes de enviar a solicitação para salvar a foto, alteremos o nome do arquivo para pt_id
            const pt_id = data1.pt_id; // Supondo que a resposta inclua o pt_id
            const renamedFile = new File([photofile], `${pt_id}.png`, { type: photofile.type });

            const formData = new FormData();
            formData.append("photofile", renamedFile);

            const response2 = await api.post(`/users/safePTphoto`, formData);
            const data2 = response2.data;
            if (data2["result"] !== "ok") {
                setErrMsg(data2["error"]);
                return;
            }

            // Lógica para sucesso
            utils.goToHome();
        } catch (error) {
            // Lógica para lidar com erros
            console.error(error);
        }
    };

    return (
        <div className="flex justify-center">
            <form onSubmit={handleSubmit} className="flex flex-wrap gap-4">
                <div className="flex flex-col flex-1 md:w-1/2 bg-opacity-25 border-2 border-white border-opacity-20 backdrop-blur-md shadow-md text-white rounded-lg p-8 bg-black">
                    <h1 className='text-3xl text-center'>Please fill in the form!</h1>
                    <div role="tablist" className="tabs tabs-lifted my-3">
                        <Link to={"/register/trainer/details"} role="tab" className="tab tab-active">Trainer</Link>
                    </div>
                    <div className='input-box relative w-full h-12 my-3'>
                        <input
                            type='text'
                            placeholder='Name'
                            ref={userRef}
                            autoComplete='off'
                            id='name'
                            onChange={(e) => setDetails({ ...details, name: e.target.value })}
                            value={details.name}
                            required
                            className='w-full h-full bg-transparent outline-none border-2 border-white border-opacity-20 rounded-full text-white text-base pl-20 pr-5 py-3'
                        />
                        <FaUser className='icon absolute right-4 top-1/2 transform -translate-y-1/2 text-base' />
                    </div>
                    <div className='input-box relative w-full h-12 my-3'>
                        <input
                            type='text'
                            placeholder='Email'
                            ref={userRef}
                            autoComplete='off'
                            id='email'
                            onChange={(e) => setDetails({ ...details, email: e.target.value })}
                            value={details.email}
                            required
                            className='w-full h-full bg-transparent outline-none border-2 border-white border-opacity-20 rounded-full text-white text-base pl-20 pr-5 py-3'
                        />
                        <MdOutlineMail className='icon absolute right-4 top-1/2 transform -translate-y-1/2 text-base' />
                    </div>
                    <div className="input-box relative w-full my-3">
                        <textarea
                            type="text"
                            placeholder="Description"
                            onChange={(e) => setDetails({ ...details, description: e.target.value })}
                            value={details.description}
                            className="w-full bg-transparent outline-none border-2 border-white border-opacity-20 rounded-lg text-white text-base pl-4 pr-10 pt-3 pb-2 resize-none"
                            rows="3"
                            required
                        />
                        <MdDescription className='icon absolute right-4 top-1/2 transform -translate-y-1/2 text-base' />
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

                    <span className="text-white mb-1">Price</span>
                    <div className="input-box relative w-full h-12 my-3">
                        <input
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Price"
                            onChange={(e) => {
                                setTempPrice(parseInt(e.target.value, 10));
                                setDetails({ ...details, price: `${parseInt(e.target.value, 10)} - ${period}` });
                            }}
                            value={tempprice}
                            style={{ '-moz-appearance': 'textfield' }}
                            onWheel={(e) => e.target.blur()}
                            className="w-2/3 h-full bg-transparent outline-none border-2 border-white border-opacity-20 rounded-full text-white text-base pl-20 pr-10 py-3"
                            required
                        />
                        <select
                            onChange={(e) => {
                                setPeriod(e.target.value);
                                setDetails({ ...details, price: `${tempprice} - ${e.target.value}` });
                            }}
                            value={period}
                            className="absolute right-0 top-0 h-full bg-transparent outline-none border-none text-white text-base pl-2 pr-3"
                        >
                            <option value="monthly">Monthly</option>
                            <option value="yearly">Yearly</option>
                        </select>
                    </div>
                    <span className="text-white mb-1">Slots</span>
                    <div className="input-box relative w-full h-12 my-3">
                        <input
                            type="number"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="Slots (Max Athletes)"
                            onChange={(e) => setDetails({ ...details, slots: parseInt(e.target.value, 10) })}
                            value={details.slots}
                            style={{ '-moz-appearance': 'textfield' }}
                            onWheel={(e) => e.target.blur()}
                            className="w-full h-full bg-transparent outline-none border-2 border-white border-opacity-20 rounded-full text-white text-base pl-20 pr-10 py-3"
                            required
                        />
                        <MdAddBox className='icon absolute right-4 top-1/2 transform -translate-y-1/2 text-base' />
                    </div>
                </div>
                <div className="flex flex-col flex-1 md:w-1/2 bg-opacity-25 border-2 border-white border-opacity-20 backdrop-blur-md shadow-md text-white rounded-lg p-8 bg-black">
                    <Select
                        options={lags}
                        value={languages}
                        onChange={handleLanguageChange}
                        isMulti={true}
                        className='mb-4 text-black'
                        placeholder="Languages"
                        required
                    />
                    <div className="w-full">
                        <div className="input-box relative w-full h-12 my-3">
                            <input
                                type="text"
                                placeholder="Hours Available"
                                onChange={(e) => setDetails({ ...details, hours: e.target.value })}
                                value={details.hours}
                                className="w-full h-full bg-transparent outline-none border-2 border-white border-opacity-20 rounded-full text-white text-base pl-20 pr-5 py-3"
                                required
                            />
                            <FaHourglassHalf className='icon absolute right-4 top-1/2 transform -translate-y-1/2 text-base' />
                        </div>
                        <div className="input-box relative w-full my-3">
                            <textarea
                                type="text"
                                placeholder="Education"
                                onChange={(e) => setDetails({ ...details, education: e.target.value })}
                                value={details.education}
                                className="w-full bg-transparent outline-none border-2 border-white border-opacity-20 rounded-lg text-white text-base pl-4 pr-10 pt-3 pb-2 resize-none"
                                rows="3"
                                required
                            />
                            <MdCastForEducation className='icon absolute right-4 top-1/2 transform -translate-y-1/2 text-base' />
                        </div>
                        <div className="input-box relative w-full my-3">
                            <textarea
                                type="text"
                                placeholder="Bio"
                                onChange={(e) => setDetails({ ...details, bg: e.target.value })}
                                value={details.bg}
                                className="w-full bg-transparent outline-none border-2 border-white border-opacity-20 rounded-lg text-white text-base pl-4 pr-10 pt-3 pb-2 resize-none"
                                rows="3"
                            />
                            <MdBiotech className='icon absolute right-4 top-1/2 transform -translate-y-1/2 text-base' />
                        </div>
                    </div>

                    <div className="flex items-center mb-3">
                        <div className="flex items-center mr-3">
                            <label htmlFor="photo" className="block text-base font-medium mr-3">
                                Profile Picture:
                            </label>
                            <input onChange={handlePhotoChange} type="file" id="photo" accept="image/*" required className="file-input file-input-bordered w-full max-w-xs text-black mb-3" />
                        </div>

                        {previewphoto.photo && (
                            <div className="flex items-center">
                                <label className="block text-base font-medium mr-3">
                                    Preview:
                                </label>
                                <img src={previewphoto.photo} alt="Preview" className="max-w-xs mb-3" style={{ maxWidth: '100px' }} />
                            </div>
                        )}
                    </div>
                    <label htmlFor="time" className="mb-3 block text-base font-medium">
                        Probative:
                    </label>
                    <input onChange={(e) => setFile(e.target.value)} value={file} required type="file" className="file-input file-input-bordered w-full max-w-xs text-black mb-3" />
                    <div className='w-full text-red-500 text-center mb-2'> {errMsg} </div>
                    <button type='submit' className='w-full md:w-auto h-12 bg-white border-none outline-none rounded-full shadow-md cursor-pointer text-base font-bold text-gray-700'>Register</button>
                </div>
            </form>
        </div>
    );
}

export default RegisterPt;
