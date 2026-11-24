import { useEffect, useState } from 'react'

const SSE_URL = "http://localhost:8000/api/progress"

export default function App(){
    const [progress, setProgress] = useState(0)
    const [status, setStatus] = useState("idle")
    const [error, setError] = useState("")

    useEffect(() => {
        const eventSource = new EventSource(SSE_URL)
        setStatus("running")


        eventSource.addEventListener("progress", (event) => {
            setProgress(Number(event.data))
        })

        eventSource.addEventListener("complete", (event) => {
            setStatus("done")
            setProgress(100)

            eventSource.close()
        })

        eventSource.onerror = () => {
            setError("Соединение с сервером потеряно. Проверьте, что backend запущен.")
            setStatus("error")
            eventSource.close()
        }


        return () => {
            eventSource.close()
        }
    }, [])

    return (
        <div className="app">
            <h1>Live-прогресс задачи (SSE)</h1>

            <progress value={progress} max={100} />

            <div className="precent">{progress}%</div>

            {status === "running" && <p className="status">Задача выполняется...</p>}
            {status === "done" && (
                <p className="status done">✓ Задача выполнена – соединение закрыто</p>
            )}
            {status === "error" && <p className="status error">{error}</p>}
        </div>
    )
}