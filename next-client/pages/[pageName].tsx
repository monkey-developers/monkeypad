import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Image from 'next/image';
import spaceIcon from '../public/line-spacing.png';
import gitHubIcon from '../public/github-logo.png';
import fontIcon from '../public/font.png';
import darkModeIcon from '../public/brightness-and-contrast.png';
import { useTheme } from 'next-themes';
import Link from 'next/link';


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

    const {systemTheme, theme, setTheme} = useTheme();

    const renderThemeChanger = () =>{
        return(
            <button className='rounded-full cursor-pointer flex p-4 w-16 bg-gray-100'>
                <Image src={darkModeIcon} alt=""/>
                </button>
        )

        const currentTheme = theme === 'system' ? systemTheme : theme;

    }

    return (
        <>
        <section className='flex items-center flex-col h-screen justify-center'>
            <header className='text-center justify-between top-6 fixed flex gap-5 w-11/12'>
                <h1 className='text-2xl flex rounded-full py-2 px-10 items-center font-bold bg-gray-100'>


                    <h1 className='text-3xl text-teal-500'>{pageName}</h1>&nbsp;monkey</h1>
                <div className='flex'>
                    <div className='flex gap-5 mr-32'>
                        <Link href="#"><a> <div className='rounded-full cursor-pointer flex p-4 w-16 bg-gray-100'><Image src={fontIcon} alt="" /></div></a></Link>
                        <Link href="#"><a><div className='rounded-full cursor-pointer flex p-4 w-16 bg-gray-100'><Image src={spaceIcon} alt="" /></div></a></Link>
                        {renderThemeChanger()}
                        <Link href="#"><a> <div className='rounded-full cursor-pointer flex p-4 w-16 bg-gray-100'><Image src={gitHubIcon} alt=""/></div></a></Link>
                    </div>

                    <div className='rounded-full flex items-center py-2 px-6 bg-gray-100'>
                        <h6 className='text-teal-500 text-3xl'>{users}</h6>
                    </div>

                </div>
            </header>
            <textarea className='w-full px-16 mt-28 outline-0 h-screen space tracking-wider resize-none' onChange={handleBodyChange} value={pageBody} />
            
        </section>
        <div className='fixed flex text-2xl rounded-full bg-gray-100 py-2 px-4 font-bold bottom-10 right-20'>Monkey <div className='text-teal-500'>Pad</div></div>
        </>
    )
}
