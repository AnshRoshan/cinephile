import { addDoc } from 'firebase/firestore'
import { useContext, useState } from 'react'
import { TailSpin } from 'react-loader-spinner'
import swal from 'sweetalert'
import { movieRef } from '../firebase/firebase'
import { Appstate } from '../App'
import { useNavigate } from 'react-router-dom'

function AddMovie() {
  const navigate = useNavigate()
  const useAppState = useContext(Appstate)
  const [form, setForm] = useState({
    title: '',
    year: 2023,
    description: '',
    image: '',
    rating: 0,
    rated: 0,
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
  }

  const handleAddMovie = async () => {
    setLoading(true)
    try {
      if (useAppState.login) {
        await addDoc(movieRef, form)
        swal({
          title: 'Succesfuly Added',
          icon: 'success',
          buttons: false,
          timer: 3000,
        })
      } else {
        navigate('/login')
      }
    } catch (error) {
      console.error('Error adding document: ', error)
      swal({
        title: 'Error',
        text: 'An error occurred while adding the movie.',
        icon: 'error',
        buttons: false,
        timer: 3000,
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <section className="text-gray-300 body-font relative">
        <div className="container px-5 py-8 mx-auto">
          <div className="flex flex-col text-center w-full mb-4">
            <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-yellow-50">
              Add Movie
            </h1>
          </div>
          <div className="lg:w-1/2 md:w-2/3 mx-auto">
            <div className="flex flex-wrap -m-2">
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label
                    for="title"
                    className="leading-7 text-sm text-gray-300"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={(event) => {
                      setForm({ ...form, title: event.target.value })
                    }}
                    className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-1/2">
                <div className="relative">
                  <label for="year" className="leading-7 text-sm text-gray-300">
                    Year
                  </label>
                  <input
                    type="number"
                    id="year"
                    name="year"
                    value={form.year}
                    onChange={(event) => {
                      setForm({ ...form, year: event.target.value })
                    }}
                    className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  />
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    for="image"
                    className="leading-7 text-sm text-gray-300"
                  >
                    Image Link
                  </label>
                  <textarea
                    id="image"
                    name="image"
                    value={form.image}
                    onChange={(event) => {
                      setForm({ ...form, image: event.target.value })
                    }}
                    className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-ou"
                  ></textarea>
                </div>
              </div>
              <div className="p-2 w-full">
                <div className="relative">
                  <label
                    for="description"
                    className="leading-7 text-sm text-gray-300"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={(event) => {
                      setForm({ ...form, description: event.target.value })
                    }}
                    className="w-full bg-gray-100 rounded border border-gray-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
                  ></textarea>
                </div>
              </div>
              <div className="p-2 w-full">
                <button
                  onClick={AddMovie}
                  className="flex mx-auto text-white bg-green-500 border-0 py-2 px-8 focus:outline-none hover:bg-green-700 rounded text-lg"
                >
                  {loading ? <TailSpin height={25} color="white" /> : 'Submit'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
export default AddMovie
