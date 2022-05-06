import { useEffect, useState } from "react"



export default function Debugger(props) {
    const [running, setRunning] = useState(false)
    const [debugText, setDebugText] = useState("")
    const [reader, setReader] = useState(false)

    useEffect(() => {
        if(props.accessControl === 4 && running === false) {
            beginListening()
        }
        if((props.accessControl === 1 || props.accessControl === 5) && running === true) {
            stopListening(props.accessControl)
        }

        async function beginListening() {
            setDebugText("")
            try {
                const treader = props.port.readable.getReader()
                await treader.cancel()
                await treader.releaseLock()
                setReader(props.port.readable.getReader())
                setRunning(true)
            }
            catch (error) {
                console.log(error)
            }
        }

        
    }, [props.accessControl, running, props.setAccessControl])

    async function stopListening(a) {
        await reader.cancel()
        await reader.releaseLock()
        setReader(false)
        if(a === 1) props.setAccessControl(3)
        if(a === 5) props.setAccessControl(0)
        setRunning(false)
    }



    useEffect(() => {
        async function readFromStream() {
            const {done, value} = await reader.read()
            if(done) {
                await stopListening()
                return 
            }
            const t = debugText.concat(new TextDecoder().decode(value))
            setDebugText(t)
            // need to get debug to actually get set and rerun 
        }
        if(props.accessControl === 4 && reader && running) {
            readFromStream()
        }
    }, [reader, debugText, running, props.accessControl])
   

    return (
        <div className="flex justify-center w-full flex-col">
            <span className="text-slate-500 w-full text-center border-b">Debug Terminal</span>
            <div className="flex-col flex text-slate-500 pl-2">
            {debugText.split('\r').map((line, index) => {
                return <span key={index+"debugTerminalLine"}>{'> '}{line}</span>
            })}
            </div>
        </div>
    )
}