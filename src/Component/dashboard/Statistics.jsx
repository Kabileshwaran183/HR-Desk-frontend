export default function Statistics() {
    return (
        <div className="col-span-1">
            <h3 className="font-semibold text-lg mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-100 rounded-xl text-center">
                    <p className="text-xl font-bold">28 h</p>
                    <p className="text-sm text-gray-500">Tracked time</p>
                </div>
                <div className="p-4 bg-gray-100 rounded-xl text-center">
                    <p className="text-xl font-bold">18</p>
                    <p className="text-sm text-gray-500">Finished tasks</p>
                </div>
            </div>
            <div className="p-4 bg-purple-100 rounded-xl mt-4 text-center">
                <p className="text-sm">Pro Plan</p>
                <p className="text-lg font-bold">$9.99 <span className="text-sm font-medium">p/m</span></p>
                <p className="text-xs text-gray-600">More productivity with premium!</p>
            </div>
        </div>
    );
}
  