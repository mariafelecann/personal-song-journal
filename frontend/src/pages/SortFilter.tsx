import axios from 'axios';
import {useEffect, useState} from 'react';
import SongTable from '../components/SongTable';
import {ISong} from '../components/objects/MySong.type';
import './SortFilter.style.css';

type SortFilterProps = {
    list: ISong[];
    onBackButtonClick: () => void;
};

const SortFilter = ({onBackButtonClick}: SortFilterProps) => {
    const [searchText, setSearchText] = useState('');
    const [sortDirection, setSortDirection] = useState('');
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [filteredSongs, setFilteredSongs] = useState<ISong[]>([]);

    useEffect(() => {
        const fetchFilteredSongs = async () => {
            try {
                const response = await axios.get(
                    'https://cpnrb56tas.eu-west-3.awsapprunner.com/:3000/filter',
                    {
                        params: {
                            searchText,
                            sortDirection,
                            pageNumber,
                            pageSize,
                        },
                    },
                );
                setFilteredSongs(response.data.songs);
            } catch (error) {
                console.error('Error fetching filtered songs:', error);
            }
        };

        fetchFilteredSongs();
    }, [searchText, sortDirection, pageNumber, pageSize]);

    return (
        <div>
            <div className='container-search-filter'>
                <div className='search-controls'>
                    <div className='search-flex'>
                        <input
                            type='text'
                            placeholder='Search text'
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                        />
                        <select
                            value={sortDirection}
                            onChange={(e) => setSortDirection(e.target.value)}
                        >
                            <option value=''>Select sorting direction:</option>
                            <option value='title:asc'>Title Ascending </option>
                            <option value='title:desc'>Title Descending</option>
                        </select>
                    </div>
                    <div className='pagination'>
                        <div>
                            <label>Page Number:</label>
                            <input
                                type='number'
                                placeholder='Page number'
                                value={pageNumber}
                                onChange={(e) =>
                                    setPageNumber(parseInt(e.target.value))
                                }
                            />
                        </div>
                        <div>
                            <label>Number of songs / page : </label>
                            <select
                                value={pageSize}
                                onChange={(e) =>
                                    setPageSize(parseInt(e.target.value))
                                }
                            >
                                <option value='1'>1</option>
                                <option value='2'>2</option>
                                <option value='5'>5</option>
                                <option value='10'>10</option>
                                <option value='15'>15</option>
                                <option value='20'>20</option>
                                {/* Add more options as needed */}
                            </select>
                        </div>
                    </div>
                </div>
                {/* <ul className='song-list'>
                    {filteredSongs.map((song) => (
                        <li key={song.id} className='song-item'>
                            {song.title}
                            {song.artist}
                            {song.rating}
                            {song.review}
                        </li>
                    ))}
                </ul> */}
                <div className='song-list'>
                    <SongTable list={filteredSongs} />
                </div>
                <button onClick={onBackButtonClick}>Back</button>
            </div>
        </div>
    );
};

export default SortFilter;
