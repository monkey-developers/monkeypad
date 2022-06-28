import { useRouter } from 'next/router'
import { io } from 'socket.io-client'

const socket = io("ws://localhost:8000");

export default function Page() {
    const router = useRouter()
    const { page } = router.query
    return (
        <>
            <p>Page {page}</p>
        </>
    )
}
