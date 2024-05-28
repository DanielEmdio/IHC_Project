export default function PtTable() {
    return (
        <div className="flex flex-row border-solid bg-slate-400 rounded-xl">
            <img src="https://picsum.photos/200/200" alt="" className="basis-1/4 m-3" />
            <div className="basis-3/4 grid grid-cols-3">
                <div className="self-center"><h1 className="text-2xl font-bold ">Name:</h1><p className="bg-white">Igor Voitenko</p></div>
                <div className="self-center"><h1 className="text-2xl font-bold">Specialty:</h1><div className="flex flex-row">
                    <div className="badge badge-outline">Full Body</div>
                    <div className="badge badge-outline">Cardio</div>
                    <div className="badge badge-outline">Strength</div>
                </div></div>
                <div className="self-center"><h1 className="text-2xl font-bold">Rating:</h1><p>*****</p></div>
                <div className="self-center"><h1 className="text-3xl font-bold">Age:</h1><p>31</p></div>
                <div className="self-center"><h1 className="text-3xl font-bold">Languages:</h1><div className="flex flex-row">
                    <div className="badge badge-outline">English</div>
                    <div className="badge badge-outline">Portuguese</div>
                </div></div>
                <div className="self-center"><h1 className="text-3xl font-bold">Comments:</h1><p>View 11806 comments</p></div>
            </div>
        </div>
    )
}
