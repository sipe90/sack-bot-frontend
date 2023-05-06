import { useEffect, useRef, useState } from 'react'
import useGuildState from './useGuildState'

type ConnectionState = "disconnected" | "connected" | "finished"

const useEvents = () => {
    const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected")
    const [retryTimeout, setRetryTimeOut] = useState(0)

    const wsRef = useRef<WebSocket | null>(null)

    const { selectedGuildId } = useGuildState()

    useEffect(() => {
        if (selectedGuildId && connectionState === "disconnected") {
            const url = `ws://localhost:3000/ws/events?guildId=${selectedGuildId}`
            setTimeout(() => {
                const ws = new WebSocket(url)

                const increaseTimeout = () => setRetryTimeOut(Math.max(Math.min(retryTimeout * 2, 30000), 250))

                ws.onopen = () => {
                    setRetryTimeOut(0)
                    setConnectionState("connected")
                }

                ws.onmessage = (ev) => {
                    console.log(ev.data)
                }

                ws.onclose = (ev) => {
                    if (!ev.wasClean) {
                        console.error(`WebSocket connection closed unexpectedly: (${ev.code}) ${ev.reason}`)
                        increaseTimeout()
                        setConnectionState("disconnected")
                    }
                    if (ev.code === 1008) {
                        setConnectionState("finished")
                    }
                }

                ws.onerror = (ev) => {
                    console.error(ev)
                    if (connectionState === "disconnected") {
                        increaseTimeout()
                    }
                }

                wsRef.current = ws
            }, retryTimeout)
        }
    }, [selectedGuildId, connectionState, retryTimeout])

    return {
        ws: wsRef.current,
        connectionState
    }
}

export default useEvents
