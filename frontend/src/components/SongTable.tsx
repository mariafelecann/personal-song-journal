import {useEffect, useState} from 'react';
import SongModal from './SongDetailsModal';
import './SongTable.style.css';
import {ISong} from './objects/MySong.type';

type TableProps = {
    list: ISong[];
};

const SongList = (props: TableProps) => {
    const {list} = props;
    const [showModal, setShowModal] = useState(false);
    const [dataToShow, setDataToShow] = useState(null as ISong | null);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [sortedList, setSortedList] = useState<ISong[]>(list);

    useEffect(() => {
        const sortedList = [...list].slice().sort((a, b) => {
            if (sortOrder === 'desc') {
                return b.rating - a.rating;
            } else {
                return a.rating - b.rating;
            }
        });
        setSortedList(sortedList);
    }, [sortOrder, list]);

    const handleSortOrderChange = (
        event: React.ChangeEvent<HTMLSelectElement>,
    ) => {
        setSortOrder(event.target.value as 'asc' | 'desc');
    };

    const ViewSongDetails = (data: ISong) => {
        setDataToShow(data);
        setShowModal(true);
    };

    const onCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div>
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
                            <td>
                                <div>
                                    <input
                                        type='button'
                                        value={'View'}
                                        onClick={() => ViewSongDetails(song)}
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
