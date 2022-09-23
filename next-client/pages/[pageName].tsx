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
        <>
        <section className='flex items-center flex-col h-screen justify-center'>
            <header className='text-center justify-between top-6 fixed flex gap-5 w-11/12'>
                <h1 className='text-2xl flex rounded-full py-2 px-10 items-center font-bold bg-slate-100'>

                    <h1 className='text-3xl text-blue-500'>{pageName}</h1>&nbsp;monkey</h1>

                <div className='flex'>
                    <div className='flex gap-5 mr-32'>
                        <div className='rounded-full cursor-pointer flex px-6 py-4 bg-slate-100'>T</div>
                        <div className='rounded-full cursor-pointer flex px-6 py-4 bg-slate-100'>F</div>
                        <div className='rounded-full cursor-pointer flex px-6 py-4 bg-slate-100'>P</div>
                        <div className='rounded-full cursor-pointer flex px-6 py-4 bg-slate-100'>C</div>
                    </div>

                    <div className='rounded-full flex px-4 py-2 bg-slate-100'>
                        <h6 className='text-3xl'>{users}</h6>
                    </div>

                </div>
            </header>
            <textarea className='w-full mt-10 outline-0 h-screen resize-none' onChange={handleBodyChange} value={pageBody} />
            
        </section>
        <div className='fixed flex text-2xl font-bold bottom-10 right-20'>Monkey <div className='text-blue-500'>Pad</div></div>
        </>
    )
}
