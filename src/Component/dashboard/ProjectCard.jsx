export default function ProjectCard({ color, title, tasks, progress, avatars }) {
    return (
        <div className={`rounded-2xl p-4 text-white ${color} shadow-lg`}>
            <div className="flex justify-between items-center">
                <span className="text-sm">{avatars}+ People</span>
                <button>⋮</button>
            </div>
            <h2 className="text-lg font-bold mt-2">{title}</h2>
            <p className="text-sm mt-1">{tasks}</p>
            <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mt-4">
                <div className="bg-white h-2 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
        </div>
    );
}
