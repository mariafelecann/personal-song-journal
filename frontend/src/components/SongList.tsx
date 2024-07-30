import axios from 'axios';
import {useEffect, useState} from 'react';
import SongModal from './SongDetailsModal';
import './SongList.style.css';
import {ISong} from './objects/MySong.type';

type ListProps = {
    list: ISong[];
    onDeleteClickHandler: (data: ISong) => void;
    onEditClickHandler: (data: ISong) => void;
};

const SongList = (props: ListProps) => {
    const {list, onDeleteClickHandler, onEditClickHandler} = props;
    const [showModal, setShowModal] = useState(false);
    const [dataToShow, setDataToShow] = useState(null as ISong | null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [sortedList, setSortedList] = useState<ISong[]>(list);
    const [songsPerPage, setSongsPerPage] = useState<number>(5);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [genreNames, setGenreNames] = useState<Map<string, string>>(
        new Map(),
    );
    const connection = 'http://localhost:3000';

    useEffect(() => {
        const fetchGenreNames = async () => {
            const genreNamesMap = new Map();
            for (const song of list) {
                const genreName = await fetchGenreNameById(song.genreId);
                genreNamesMap.set(song.genreId, genreName);
            }
            setGenreNames(genreNamesMap);
        };

        fetchGenreNames();
    }, [list]);

    const fetchGenreNameById = async (genreId: string) => {
        try {
            const response = await axios.get(
                connection + `/crud-operations/genres/name/${genreId}`,
            );
            return response.data.genreName;
        } catch (error) {
            console.error('Failed to fetch genre name:', error);
            //throw new Error('Failed to fetch genre name');
        }
    };

    const totalSongs = list.length;
    const totalPages = Math.ceil(totalSongs / songsPerPage);
    const indexOfLastSong = currentPage * songsPerPage;
    const indexOfFirstSong = indexOfLastSong - songsPerPage;
    const currentSongs = list.slice(indexOfFirstSong, indexOfLastSong);

    useEffect(() => {
        const sortedList = [...list].slice().sort((a, b) => {
            if (sortOrder === 'desc') {
                return b.rating - a.rating;
            } else {
                return a.rating - b.rating;
            }
        });
        setSortedList(sortedList);
        const indexOfLastSong = currentPage * songsPerPage;
        const indexOfFirstSong = indexOfLastSong - songsPerPage;
        const currentSongs = sortedList.slice(
            indexOfFirstSong,
            indexOfLastSong,
        );
        setSortedList(currentSongs);
    }, [sortOrder, list, currentPage, songsPerPage]);

    const handleSortOrderChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setSortOrder(event.target.value as 'asc' | 'desc');
    };

    const handleSongsPerPageChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setSongsPerPage(parseInt(event.target.value));
    };

    const ViewSongDetails = (data: ISong) => {
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
                    value={songsPerPage}
                    onChange={handleSongsPerPageChange}
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
                            <h1>Title</h1>
                        </th>
                        <th>
                            <h1>Artist</h1>
                        </th>
                        <th>
                            <h1 className='rate'>Rating</h1>
                        </th>
                        <th>
                            <h1>Review</h1>
                        </th>
                        <th>
                            <h1>Genre</h1>
                        </th>
                        <th>
                            <h1 className='wide-actions'>Actions</h1>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedList.map((song) => (
                        <tr key={song.songId}>
                            <td>{song.songName}</td>
                            <td>{song.artistName}</td>
                            <td>{song.rating}</td>
                            <td>{song.review}</td>
                            {/* <td>{song.genreId}</td> */}
                            <td>{genreNames.get(song.genreId) || 'Unknown'}</td>
                            <td>
                                <div>
                                    <input
                                        type='button'
                                        value={'View'}
                                        onClick={() => ViewSongDetails(song)}
                                    />
                                    <input
                                        type='button'
                                        value={'Edit'}
                                        onClick={() => onEditClickHandler(song)}
                                    />
                                    <input
                                        type='button'
                                        value={'Delete'}
                                        onClick={(e: any) => {
                                            e.preventDefault();
                                            onDeleteClickHandler(song);
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
                <SongModal onClose={onCloseModal} data={dataToShow} />
            )}
        </div>
    );
};

export default SongList;
