function Analysis() {
    const result = JSON.parse(localStorage.getItem("analysis"));

    return (
        <div className="p-10 bg-black text-white min-h-screen">
            <h1 className="text-3xl mb-6">Analysis Result</h1>

            <h2 className="text-xl">Skills:</h2>
            <ul>
                {result.skills.map((s, i) => <li key={i}>{s}</li>)}
            </ul>

            <h2 className="text-xl mt-4">Careers:</h2>
            <ul>
                {result.careers.map((c, i) => <li key={i}>{c}</li>)}
            </ul>

            <h2 className="text-xl mt-4">Missing Skills:</h2>
            <ul>
                {result.missingSkills.map((m, i) => <li key={i}>{m}</li>)}
            </ul>

            <h2 className="text-xl mt-4">Roadmap:</h2>
            <p>{result.roadmap}</p>
        </div>
    );
}

export default Analysis;