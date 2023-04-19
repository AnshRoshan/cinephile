import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactStars from 'react-stars'
import { doc } from 'firebase/firestore'
import { db } from '../firebase/firebase'
import { getDoc } from 'firebase/firestore'
import { InfinitySpin, LineWave } from 'react-loader-spinner'
import Review from './Review'

function Detail() {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    title: '',
    year: '',
    description: '',
    image: '',
    rating: '',
    rated: '',
  })

  useEffect(() => {
    async function getData() {
      setLoading(true)
      const _doc = doc(db, 'movies', id)
      const _data = await getDoc(_doc)
      setData(_data.data())
      setLoading(false)
    }
    getData()
  }, [])
  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <LineWave width="300" height={300} color="#FFFFFF" />
        </div>
      ) : (
        <div className="detail flex flex-wrap justify-center   mx-4 my-4">
          <img
            className="h-96 sm:mr-4 sm:sticky sm:top-20 "
            src={data.image}
            alt=""
          />
          <div className="sm:w-1/2 sm:p-4 ">
            <h1 className="text-3xl  font-bold">
              {data.title}{' '}
              <span className="text-xl text-gray-400">({data.year})</span>
            </h1>
            <ReactStars
              value={data.rating / data.rated}
              count={5}
              edit={false}
            />
            <p>{data.description}</p>
            <Review id={id} prevrating={data.rating} userRated={data.rated} />
          </div>
        </div>
      )}
    </>
  )
}
export default Detail
