import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'

const socket = io("ws://localhost:8000");

interface pageData {
    body: {
        pageName: string,
        pageBody: string,
    },
}

export default function Page() {

    const [pageBody, setPageBody] = useState("");

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
        <>
            <header className='text-center'>
                <h1 className='text-2xl font-bold'> {pageName} </h1>
            </header>
            <textarea className='border-2 border-black' onChange={handleBodyChange} value={pageBody} />
        </>
    )
}
