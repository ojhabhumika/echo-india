import React, { useState, useEffect } from "react"
import axios from "axios"
import { PageHeader, Table, Input } from "antd"
import { useLocation } from "react-router-dom"
const { Search } = Input

interface book {
  id: number
  book_author: string
  book_title: string
  book_publication_year: number
  book_publication_country: string
  book_publication_city: string
  book_pages: number
}

interface getBooksPayload {
  page: number
  itemsPerPage: number
  filters?: any[]
}

const Books: React.FC = () => {

  const defaultPage: number = 1
  const defaultPageSize: number = 10

  let pageQuery: number = +(useQuery("page")) || defaultPage
  let pageSizeQuery: number = +(useQuery("pageSize")) || defaultPageSize

  const [loading, setLoading] = useState<boolean>(false)
  const [books, setBooks] = useState<book[]>([])
  const [page, setPage] = useState<number>(pageQuery)
  const [pageSize, setPageSize] = useState<number>(pageSizeQuery)
  const [totalBooksCount, setTotalBooksCount] = useState<number>(0)
  const [filterText, setFilterText] = useState<string>("")

  const columns = [
    {
      title: "#",
      render: (value: any, item: any, index: number) => (page - 1) * pageSize + index + 1,
    },
    {
      title: "Title",
      dataIndex: "book_title",
    },
    {
      title: "Author",
      dataIndex: "book_author",
      render: (text: string[]) => text[0],
    },
    {
      title: "Page Count",
      dataIndex: "book_pages",
    },
    {
      title: "Publication City",
      dataIndex: "book_publication_city",
    },
    {
      title: "Publication Country",
      dataIndex: "book_publication_country",
    },
    {
      title: "Publication Year",
      dataIndex: "book_publication_year",
    },
  ]

  useEffect(() => {
    getBooksData()
  }, [page, pageSize])

  useEffect(() => {
    (page > 1 && filterText) ? setPage(1) : getBooksData()
  }, [filterText])

  const getBooksData = async () => {
    setLoading(true)
    setBooks([])
    try {

      window.history.replaceState(null, "", `?page=${page}&pageSize=${pageSize}`)

      const payload: getBooksPayload = {
        page,
        itemsPerPage: pageSize,
      }

      if (filterText) {
        payload.filters = [{ type: "all", values: [filterText] }]
      }

      const res: any = await axios.post(`http://nyx.vima.ekt.gr:3000/api/books`, payload)
      const { books, count } = res.data
      //console.table(books[0])
      setBooks(books)
      setTotalBooksCount(count)
      window.scrollTo(0, 0)

    } catch (err) {
      console.log("err :>> ", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ margin: "10px 35px" }} data-testid="test-books" >
      <PageHeader
        onBack={() => alert("In Progress")}
        title="Books"
        subTitle="Search the world's most comprehensive index of full-text books."
        extra={[
          <Search
            key="1"
            placeholder="Search Books.."
            onSearch={(value: string) => setFilterText(value)}
            enterButton
            allowClear
            size="large"
          />,
        ]}
      />

      <Table
        rowKey="id"
        columns={columns}
        loading={loading}
        dataSource={books}
        pagination={{
          current: page,
          pageSize,
          total: totalBooksCount,
          onChange: (page) => setPage(page),
          onShowSizeChange: (current, pageSize) => setPageSize(pageSize),
        }}
      />
    </div>
  )
}

const useQuery = (name: string): string => {
  const queryValue = new URLSearchParams(useLocation().search).get(name)
  return queryValue ?? ""
}

export default Books



