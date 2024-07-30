import {useEffect, useState} from 'react';
import {IGenre} from '../../components/objects/MyGenre.type';
import GenreModal from './GenreModal';
import './GenreTable.style.css';

type ListProps = {
    list: IGenre[];
    onDeleteClickHandler: (data: IGenre) => void;
    onEditClickHandler: (data: IGenre) => void;
};

const GenreTable = (props: ListProps) => {
    const {list, onDeleteClickHandler, onEditClickHandler} = props;
    const [showModal, setShowModal] = useState(false);
    const [dataToShow, setDataToShow] = useState(null as IGenre | null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [sortedList, setSortedList] = useState<IGenre[]>(list);
    const [genresPerPage, setGenresPerPage] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);

    const totalGenres = list.length;
    const totalPages = Math.ceil(totalGenres / genresPerPage);
    const indexOfLastSong = currentPage * genresPerPage;
    const indexOfFirstSong = indexOfLastSong - genresPerPage;
    const currentSongs = list.slice(indexOfFirstSong, indexOfLastSong);

    useEffect(() => {
        const sortedList = [...list].slice().sort((a, b) => {
            if (sortOrder === 'desc') {
                return b.popularity - a.popularity;
            } else {
                return a.popularity - b.popularity;
            }
        });
        setSortedList(sortedList);
        const indexOfLastSong = currentPage * genresPerPage;
        const indexOfFirstSong = indexOfLastSong - genresPerPage;
        const currentSongs = sortedList.slice(
            indexOfFirstSong,
            indexOfLastSong,
        );
        setSortedList(currentSongs);
    }, [sortOrder, list, currentPage, genresPerPage]);

    const handleSortOrderChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setSortOrder(event.target.value as 'asc' | 'desc');
    };

    const handleGenresPerPageChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setGenresPerPage(parseInt(event.target.value));
    };

    const ViewGenreDetails = (data: IGenre) => {
        setDataToShow(data);
        setShowModal(true);
    };

    const onCloseModal = () => {
        setShowModal(false);
    };
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <article>
                <div className='pagination'>
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        Previous
                    </button>
                    <span>
                        {currentPage} / {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next
                    </button>
                </div>
                <select
                    className='sort-button'
                    value={genresPerPage}
                    onChange={handleGenresPerPageChange}
                >
                    <option value={5}>5 per page</option>
                    <option value={10}>10 per page</option>
                    <option value={20}>20 per page</option>
                </select>
            </article>
            <table className='container'>
                <thead>
                    <tr>
                        <th>
                            <h1>Name</h1>
                        </th>
                        <th>
                            <h1>Description</h1>
                        </th>
                        <th>
                            <h1 className='rate'>Origin</h1>
                        </th>
                        <th>
                            <h1>Popularity</h1>
                        </th>

                        <th>
                            <h1 className='wide-actions'>Actions</h1>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedList.map((genre) => (
                        <tr key={genre.genreId}>
                            <td>{genre.genreName}</td>
                            <td>{genre.genreDescription}</td>
                            <td>{genre.genreOrigin}</td>
                            <td>{genre.popularity}</td>

                            <td>
                                <div>
                                    <input
                                        type='button'
                                        value={'View'}
                                        onClick={() => ViewGenreDetails(genre)}
                                    />
                                    <input
                                        type='button'
                                        value={'Edit'}
                                        onClick={() =>
                                            onEditClickHandler(genre)
                                        }
                                    />
                                    <input
                                        type='button'
                                        value={'Delete'}
                                        onClick={(e: any) => {
                                            e.preventDefault();
                                            onDeleteClickHandler(genre);
                                        }}
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <select
                className='sort-button'
                value={sortOrder}
                onChange={handleSortOrderChange}
            >
                <option value='asc'>ascending by rating</option>
                <option value='desc'>descending by rating</option>
            </select>

            {showModal && dataToShow !== null && (
                <GenreModal onClose={onCloseModal} data={dataToShow} />
            )}
        </div>
    );
};

export default GenreTable;
