import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";

export default function SmtpServer() {
    const [isRunning, setIsRunning] = useState(false);

    function startServer() {
        try {
            invoke("start_server");
            setIsRunning(true);
        } catch (ex) {
            console.log(ex);
        }
    }

    function stopServer() {
        invoke("stop_server")
            .then((_) => setIsRunning(false))
            .catch((error) => console.log(error));
    }

     useEffect(function () {
         invoke("start_server")
             .then((msg) => console.log(msg))
             .catch((error) => console.log(error));
     }, []);

    return (
        <div className="w-full h-full">
            <div>Server is {isRunning ? "running" : "stopped"}</div>
            <button
                type="button"
                className="border px-3 py-2 ml-5"
                onClick={startServer}
            >
                start
            </button>
            <button
                type="button"
                className="border px-3 py-2 ml-5"
                onClick={stopServer}
            >
                stop
            </button>
        </div>
    );
}
