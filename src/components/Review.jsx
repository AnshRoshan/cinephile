import { Rating } from '@mui/material'
import { useContext, useEffect, useState } from 'react'
import ReactStars from 'react-stars'
import {
  addDoc,
  serverTimestamp,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { TailSpin, ThreeDots } from 'react-loader-spinner'
import swal from 'sweetalert'
import { reviewsRef } from '../firebase/firebase'
import { db } from '../firebase/firebase'
import { Appstate } from '../App'
import { useNavigate } from 'react-router-dom'

function Review({ id, prevrating, userRated }) {
  const navigate = useNavigate()
  const useAppState = useContext(Appstate)
  const [rating, setRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [revloading, setRevLoading] = useState(false)
  const [data, setData] = useState([])
  const [textreview, setTextReview] = useState('')
  const [newadd, setNewadd] = useState(0)

  const sendReview = async () => {
    setLoading(true)
    try {
      if (useAppState.login) {
        await addDoc(reviewsRef, {
          movieid: id,
          name: useAppState.userName,
          rating: rating,
          thought: textreview,
          timestamp: serverTimestamp(),
          // timestamp: new Date().getTime(),
        })
        setRating(0)
        setTextReview('')
        const docref = doc(db, 'movies', id)
        await updateDoc(docref, {
          rating: prevrating + rating,
          rated: userRated + 1,
        })
        swal({
          title: 'Succesfuly Added',
          icon: 'success',
          buttons: false,
          timer: 2000,
        })
        setNewadd(newadd + 1)
      } else {
        navigate('/login')
      }
    } catch (error) {
      console.error(error)
      swal({
        title: error.mesage,
        icon: 'error',
        buttons: false,
        timer: 3000,
      })
    }

    setLoading(false)
  }

  useEffect(() => {
    async function getData() {
      setRevLoading(true)
      setData([])
      let task = query(reviewsRef, where('movieid', '==', id))
      const querySnapshot = await getDocs(task)
      querySnapshot.forEach((doc) => {
        setData((prev) => [...prev, doc.data()])
      })
      setRevLoading(false)
    }
    getData()
  }, [newadd])

  return (
    <div className="border-t-2  border-slate-300 w-full mt-4 ">
      <ReactStars
        value={rating}
        size={30}
        onChange={(rate) => setRating(rate)}
      />
      <input
        type="text"
        placeholder="write your review"
        className="w-full card p-3  outline-none"
        value={textreview}
        onChange={(event) => {
          setTextReview(event.target.value)
        }}
      />
      <button
        className="w-full flex justify-center bg-green-600 py-2"
        onClick={sendReview}
      >
        {loading ? (
          <TailSpin height={25} color="white" className="" />
        ) : (
          'Submit'
        )}
      </button>
      {revloading ? (
        <div className="mt-3 flex justify-center">
          <ThreeDots color="white" height={10} />
        </div>
      ) : (
        <div>
          {data.map((e, i) => {
            return (
              <div
                key={i}
                className=" bg-slate-800 my-3 py-2 px-5 border-b rounded-md border-gray-400"
              >
                <div className="text-sm text-blue-600 flex justify-between  items-center">
                  {e.name}
                  <span className=" text-xs text-white">
                    --- {e.timestamp.toDate().toLocaleString()}
                  </span>
                </div>
                <ReactStars value={e.rating} count={5} edit={false} />
                <div>{e.thought}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
export default Review
