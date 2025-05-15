export default function TaskList() {
    const tasks = [
        { title: "Prepare Figma file", project: "Mobile App", color: "border-orange-400" },
        { title: "Design UX wireframes", project: "UX wireframes", color: "border-purple-700" },
        { title: "Research", project: "Mobile App", color: "border-teal-600", checked: true },
    ];

    return (
        <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Tasks for today</h3>
            <div className="space-y-3">
                {tasks.map((task, i) => (
                    <div key={i} className={`border-l-4 pl-3 p-3 rounded-lg bg-white shadow-sm ${task.color}`}>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked={task.checked} />
                            <div>
                                <p className="text-sm font-medium">{task.project}</p>
                                <p className="text-xs text-gray-500">{task.title}</p>
                            </div>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
}
  