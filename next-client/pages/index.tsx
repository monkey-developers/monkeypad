import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import { useState } from 'react'
import monkeyPic from '../public/monkey.jpg'

const Home: NextPage = () => {
  const [pageName, setPageName] = useState("");
  const router = useRouter()

  const handleInput = (event: any) => { setPageName(event.target.value); };

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') { router.push(pageName) }
  };

  return (
    <main className='dark:bg-slate-900 flex items-center flex-col h-screen justify-center bg-slate-300 gap-5'>
      <h1 className='dark:text-white text-5xl mb-20 font-bold'>Welcome to Monkeypad!</h1>
      <Image src={monkeyPic} alt="Picture of a Monkey" width={300} height={300} />
      
      <p className='dark:text-white text-2xl'>Which note do you want to select?</p>
      <div className='flex mt-20'>
      <input onKeyDown={handleKeyDown} onChange={handleInput} type="text" className='shadow appearance-none rounded-l-3xl w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
      <button onClick={() => router.push(pageName)} className='bg-teal-500 border hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-r-3xl focus:outline-none focus:shadow-outline' >
        Enter
      </button>
      </div>
    </main >
  )
}

export default Home
