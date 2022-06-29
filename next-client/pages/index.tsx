import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useState } from 'react'

const Home: NextPage = () => {
  const [pageName, setPageName] = useState("");
  const router = useRouter()

  const handleInput = (event: any) => { setPageName(event.target.value); }

  return (
    <main className='flex items-center flex-col h-screen justify-center bg-slate-200 gap-5'>
      <h1 className='text-3xl font-bold'>Welcome to Monkeypad!</h1>
      <p className='text-1xl'>Which note do you want to select? :</p>
      <input onChange={handleInput} type="text" className='shadow appearance-none border rounded w-96 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' />
      <button onClick={() => router.push(pageName)} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' >
        Enter
      </button>
    </main >
  )
}

export default Home
