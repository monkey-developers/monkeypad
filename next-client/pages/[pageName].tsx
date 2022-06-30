import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'

const url = process.env.NEXT_PUBLIC_API_URL;
const socket = io("ws://" + url, { transports : ['websocket', 'polling', 'flashsocket'] });

interface pageData {
    body: {
        pageName: string,
        pageBody: string,
        pageUser: number;
    },
}

export default function Page() {

    const [pageBody, setPageBody] = useState("");
    const [users, setUsers] = useState(0);

    const router = useRouter()
    const { pageName } = router.query

    useEffect(() => {
        fetchData()
        socket.on("page_updated", () => {
            console.log("Someone updated the page, updating...")
            fetchData()
        })
    }, [socket, pageName])

    const fetchData = () => {
        socket.emit("get_page", pageName, (response: pageData) => {
            setPageBody(response.body.pageBody);
            setUsers(response.body.pageUser);
        });
    }

    const updateBody = (newBodyValue: string) => {
        setPageBody(newBodyValue);
        socket.emit("update_page", pageName, newBodyValue);
    }

    function handleBodyChange(event: any) {
        updateBody(event.target.value)
    }

    return (
        <section className='flex items-center flex-col h-screen justify-center bg-slate-200 gap-5'>
            <header className='text-center'>
                <h1 className='text-2xl font-bold'> {pageName} monkeypad</h1>
                <h2>{users} users in this monkeypad</h2>
            </header>
            <textarea className='w-full h-screen resize-none' onChange={handleBodyChange} value={pageBody} />
        </section>
    )
}
