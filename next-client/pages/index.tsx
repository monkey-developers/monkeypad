import type { NextPage } from 'next'
import { io } from 'socket.io-client'

const socket = io("ws://localhost:8000");

const Home: NextPage = () => {
  return (
    <div className='bg-red-100'>
      <p>Hello</p>
    </div>
  )
}

export default Home
