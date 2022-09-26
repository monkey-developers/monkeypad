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

        const currentTheme = theme === 'system' ? systemTheme : theme;

        if (currentTheme === 'dark'){
            return(
            <a className='rounded-full cursor-pointer flex p-4 w-[3.5rem] bg-gray-100' onClick={()=>setTheme('light')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="text-teal-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>

                </a>
        )
        }

        else{
            return(
            <a className='rounded-full cursor-pointer flex p-4 w-[3.5rem] bg-gray-100' onClick={()=>setTheme('dark')}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="text-teal-500">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>

                </a>
        )
        }

        

        
    }

    return (
        <>
        <section className='flex items-center flex-col h-screen justify-center'>
            <header className='text-center justify-between top-6 fixed flex gap-5 w-11/12'>

                 <h6 className='dark:text-white flex bg-teal-50 rounded-full text-2xl flex py-2 px-10 items-center font-bold '>
                      <h1 className='text-3xl text-teal-500'>{pageName}</h1>&nbsp;monkey</h6>
                <div className='flex'>
                    <div className='flex gap-5 mr-32'>
                        
                        {/* FUNÇÕES DE MARKDOWN DESABILITADAS PORQUE O DEV É BURRO E TA APANHANDO PRA FAZER */}
                        {/* <a className='rounded-full bg-teal-50'> <div className='rounded-full cursor-pointer flex p-4 w-[3.5rem]'><Image src={fontIcon} alt="" /></div></a>
                        <a className='rounded-full bg-teal-50'> <div className=' cursor-pointer flex p-4 w-[3.5rem]'><Image src={spaceIcon} alt="" /></div></a> */}
                        {renderThemeChanger()}
                        <Link href="https://github.com/monkey-developers"><a target="_blank" className='rounded-full bg-teal-50'> <div className='rounded-full cursor-pointer flex p-4 w-[3.5rem]'><Image src={gitHubIcon} alt=""/></div></a></Link>
                    </div>

       
                        <h6 className='rounded-full flex items-center py-2 px-6 bg-teal-50 text-teal-500 text-2xl'>{users}</h6>

                </div>
            </header>
            <textarea className='w-full px-16 mt-32 outline-0 h-screen space tracking-wider resize-none' onChange={handleBodyChange} value={pageBody} />
        </section> 
        <a href='/' className='rounded-full fixed flex text-2xl py-2 px-8 font-bold bottom-10 right-16'>Monkey <h5 className='text-teal-500'>Pad</h5></a>
        </>
    )
}
