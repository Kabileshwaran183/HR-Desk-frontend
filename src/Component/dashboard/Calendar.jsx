export default function Calendar() {
    const events = [
        {
            date: "Oct 20, 2021", entries: [
                { time: "10:00", title: "Facebook Brand", type: "Dribbble shot", color: "border-orange-400" },
                { time: "13:20", title: "Task Management", type: "Design", color: "border-purple-700" },
            ]
        },
        {
            date: "Oct 21, 2021", entries: [
                { time: "10:00", title: "Sleep App", type: "UX Research", color: "border-purple-700" },
                { time: "13:20", title: "Task Management", type: "Design", color: "border-orange-400" },
                { time: "10:00", title: "Meet Up", type: "Dribbble Shot", color: "border-cyan-300" },
            ]
        },
        {
            date: "Oct 22, 2021", entries: [
                { time: "10:00", title: "Meet Up", type: "Dribbble Shot", color: "border-cyan-300" },
                { time: "11:00", title: "Mobile App", type: "Design", color: "border-teal-500" },
            ]
        }
    ];

    return (
        <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Calendar</h3>
            <div className="space-y-4 text-sm">
                {events.map((day, i) => (
                    <div key={i}>
                        <p className="text-gray-500 font-medium">{day.date}</p>
                        {day.entries.map((entry, j) => (
                            <div key={j} className={`ml-2 pl-2 border-l-4 ${entry.color} mt-1`}>
                                <p><strong>{entry.time}</strong> — {entry.type} <span className="text-gray-600">({entry.title})</span></p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
  