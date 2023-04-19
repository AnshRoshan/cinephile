import { getDoc, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { ProgressBar, ThreeCircles } from 'react-loader-spinner'
import ReactStars from 'react-stars'
import { movieRef } from '../firebase/firebase'
import { Link } from 'react-router-dom'

function Card() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function getData() {
      setLoading(true)
      const _data = await getDocs(movieRef)
      _data.forEach((doc) => {
        setData((previous) => [...previous, { ...doc.data(), id: doc.id }])
      })
      setLoading(false)
    }
    getData()
  }, [])
  return (
    <div key="0000" className="flex flex-wrap items-center justify-center gap-8  p-3 mt-2  ">
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <ProgressBar
            height={300}
            width={600}
            ariaLabel="progress-bar-loading"
            wrapperStyle={{}}
            wrapperClass="progress-bar-wrapper"
            borderColor="#FFFFFF"
            barColor="#51E5FF"
          />
        </div>
      ) : (
        data.map((element, id) => {
          return (
            <Link to={`/detail/${element.id}`}>
              <div
                key={element.id}
                className="flex flex-col  card rounded-lg shadow-lg p-2 hover:-translate-y-3 cursor-pointer font-medium mt-6 transition-all duration-100 "
              >
                <img
                  className="h-60 w-40 md:h-72  md:w-52  self-center"
                  src={element.image}
                  alt="No image"
                />
                <h1>
                  <span className="text-gray-500 mr-2"></span>
                  {element.title}
                </h1>
                <h1 className="flex items-center ">
                  <span className="text-gray-500 mr-2">Rating : </span>
                  <ReactStars value={element.rating / element.rated} count={5} edit={false} />
                </h1>
                <h1>
                  <span className="text-gray-500 mr-2">Year : </span>
                  {element.year}
                </h1>
              </div>
            </Link>
          )
        })
      )}
    </div>
  )
}
export default Card
