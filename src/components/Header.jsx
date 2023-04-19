import AddCircleIcon from '@mui/icons-material/AddCircle'
import { Button } from '@mui/material'
import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { Appstate } from '../App'

function Header() {
  const useAppState = useContext(Appstate)
  const [logSign, setLogSign] = useState(false)

  return (
    <div className="Appbar z-10 p-2 border-b-2 border-gray-200  flex justify-between sticky top-0 bg-white">
      <Link to={'/'}>
        <span className="font-bold text-2xl text-red-400 cursor-pointer">
          cine
          <span className="text-blue-200 ">{' Phile'}</span>
        </span>
      </Link>
      {useAppState.login ? (
        <Link to={'/add'}>
          <Button variant="contained" color="secondary">
            <AddCircleIcon className="mr-1" />
            Add New
          </Button>
        </Link>
      ) : (
        <Link to={logSign ? '/login' : '/signup'}>
          <button
            onClick={() => setLogSign(!logSign)}
            variant="contained"
            className="bg-green-600 p-2 px-4 rounded-2xl font-bold tracking-wider "
          >
            {logSign ? 'Login' : 'Signup'}
          </button>
        </Link>
      )}
    </div>
  )
}

export default Header
