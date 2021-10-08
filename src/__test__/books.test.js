import { render, waitFor, cleanup } from '@testing-library/react'
import Books from '../pages/Books'
import axios from 'axios'
window.scrollTo = jest.fn();

jest.mock('react-router-dom', () => ({
    useLocation: () => new URLSearchParams({
        pathname: '/books',
        search: '?page=1'
    })
}))

jest.mock('axios')

Object.defineProperty(window, 'matchMedia', {
    value: () => {
        return {
            matches: false,
            addListener: () => { },
            removeListener: () => { }
        }
    }
})

afterEach(cleanup)

test("should render Books component", async () => {

    let response = {
        count: 2,
        books: [{
            book_author: ['Ανώνυμος'],
            book_pages: 104,
            book_publication_city: "Βενετία",
            book_publication_country: "Ιταλία",
            book_publication_year: 1529,
            book_title: "Ο Αλέξανδρος ο Μακεδών",
            id: 2086
        },
        {
            book_author: ['Ανώνυμος'],
            book_pages: 104,
            book_publication_city: "Βενετία",
            book_publication_country: "Ιταλία",
            book_publication_year: 1529,
            book_title: "Ο Αλέξανδρος ο Μακεδών",
            id: 2087
        }]
    }

    axios.post.mockResolvedValue({
        data: response,
    })

    const { getByTestId, asFragment } = render(<Books />);

    await waitFor(() => {
        const listNode = getByTestId('test-books')
        expect(listNode).toBeDefined();
        expect(asFragment(<Books />)).toMatchSnapshot()
    })

})