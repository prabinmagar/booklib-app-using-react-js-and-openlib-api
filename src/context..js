import React, { useState, useContext, useEffect } from 'react'
import { useCallback } from 'react'
const URL = 'http://openlibrary.org/search.json?title='
const URLSI = 'https://openlibrary.org/search/inside.json?q='
const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [resultTitle, setResultTitle] = useState('')

  const searchText = useCallback(async () => {
    setLoading(true)
    try {
      const newResponse = await fetch(`${URLSI}${searchTerm}`)
      const newData = await newResponse.json()
      const { hits } = newData.hits
      if (hits) {
        const getMatch = hits.slice(0, 5)
        const { edition } = getMatch[0]
        const match = edition.key
        window.open(`https://openlibrary.org${match}`)
      } else {
        setResultTitle('No Search Result Found!')
      }
      setLoading(false)
      setSearchTerm('')
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }, [searchTerm])

  const fetchBooks = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`${URL}${searchTerm}`)
      const data = await response.json()
      const { docs } = data

      if (docs) {
        const newBooks = docs.slice(0, 20).map(bookSingle => {
          const {
            key,
            author_name,
            cover_i,
            edition_count,
            first_publish_year,
            title
          } = bookSingle

          return {
            id: key,
            author: author_name,
            cover_id: cover_i,
            edition_count: edition_count,
            first_publish_year: first_publish_year,
            title: title
          }
        })

        setBooks(newBooks)

        if (newBooks.length > 1) {
          setResultTitle('Your Search Result')
        } else {
          setResultTitle('No Search Result Found!')
        }
      } else {
        setBooks([])
        setResultTitle('No Search Result Found!')
      }
      setSearchTerm('')
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }, [searchTerm])

  useEffect(() => {
    searchText()
  }, [searchTerm, searchText])

  return (
    <AppContext.Provider
      value={{
        loading,
        books,
        setSearchTerm,
        resultTitle,
        setResultTitle
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
