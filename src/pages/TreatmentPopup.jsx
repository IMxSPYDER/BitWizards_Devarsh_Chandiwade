const TreatmentPopup = ({ treatment, close }) => {
    if (!treatment) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="h-[90%] overflow-auto bg-white p-5 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-3">Treatment Plan</h2>
                <p className="text-gray-700">{treatment}</p>
                <button 
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded" 
                    onClick={close}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default TreatmentPopup;
