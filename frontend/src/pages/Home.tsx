import axios from 'axios';
import Cookies from 'js-cookie';
import {useEffect, useState} from 'react';
import {IMessageEvent, w3cwebsocket as W3CWebSocket} from 'websocket';
import AddSong from '../components/AddSongForm';
import EditSong from '../components/EditSongForm';
import {PageEnum} from '../components/PageEnum';
import SongList from '../components/SongList';
import {ISong} from '../components/objects/MySong.type';
import Diagram from './Diagram';
import ErrorPage from './ErrorPage';
import './Home.style.css';
// import SortFilter from './SortFilter';
import WelcomePage from './WelcomePage';
import GenreHome from './genre_information/GenreHome';

const Home = () => {
    const [MySongList, SetSongList] = useState([] as ISong[]);
    const [ShownPage, SetShownPage] = useState(PageEnum.list);
    const [DataToEdit, SetDataToEdit] = useState({} as ISong);
    const [errorMessage, setErrorMessage] = useState('');
    const [connectionErrorMessage, setConnectionErrorMessage] = useState('');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isServer, setIsServer] = useState('false');
    const [firstCachedData, setFirstCachedData] = useState('true');
    const connection = 'http://localhost:3000';
    const client = new W3CWebSocket('ws://localhost:4000/');
    const [syncData, setSyncData] = useState('false');
    const [isServerAndOnline, setIsServerAndOnline] = useState('false');
    const [showRequestButton, setShowRequestButton] = useState(false);

    const handleLogout = () => {
        axios
            .post(connection + '/welcome/logout')
            .then((response) => {
                console.log(response.data);
                Cookies.remove('token');
                SetShownPage(PageEnum.welcome);
            })
            .catch((error) => {
                console.error('Failed to logout:', error.response.data);
                alert('Logout failed.');
            });
    };

    const handleRequestButton = () => {
        //const token = localStorage.getItem('token');
        const token = Cookies.get('token');
        //console.log('token before request:', token);
        if (!token) {
            console.error('No token found in local storage.');
            return;
        }

        axios
            .get(connection + '/welcome/protectedRoute', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log(
                    'Access to protected route successful:',
                    response.data,
                );
                alert('Access to protected route successful!');
            })
            .catch((error) => {
                console.error(
                    'Failed to access protected route:',
                    error.response.data,
                );
                alert('Failed to access protected route!');
            });
    };

    useEffect(() => {
        if (firstCachedData == 'true') {
            setFirstCachedData('false');
            axios
                .get(connection + '/crud-operations/songs')
                .then((response) => {
                    SetSongList(response.data);
                    console.log(response.data);
                    localStorage.setItem(
                        'MySongList',
                        JSON.stringify(response.data),
                    );
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [firstCachedData]);

    useEffect(() => {
        const checkServerStatus = () => {
            axios
                .get(connection + '/health-check')
                .then((response) => {
                    console.log('Server is up:', response.data);

                    setIsServer('true');
                })
                .catch((error) => {
                    console.error('Server is down:', error);

                    setIsServer('false');
                });
        };

        const intervalId = setInterval(checkServerStatus, 5000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        const handleOnlineStatus = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener('online', handleOnlineStatus);
        window.addEventListener('offline', handleOnlineStatus);

        return () => {
            window.removeEventListener('online', handleOnlineStatus);
            window.removeEventListener('offline', handleOnlineStatus);
        };
    }, []);

    const syncLocalDataWithServer = () => {
        const localData = JSON.parse(
            localStorage.getItem('MySongList') || '[]',
        );
        if (localData && localData.length > 0) {
            localData.forEach((song: ISong) => {
                axios
                    .get(connection + `/crud-operations/${song.songId}`)
                    .then((response) => {
                        console.log('syncing with the server.');
                        if (response.data) {
                            axios
                                .put(
                                    connection +
                                        `/crud-operations/${song.songId}`,
                                    song,
                                )
                                .then((response) => {
                                    console.log('Updated song:', response.data);
                                    removeSongFromLocalStorage(song.songId);
                                })
                                .catch((error) => {
                                    console.error(
                                        'Error updating song:',
                                        error,
                                    );
                                });
                        } //else {
                        // console.log('adding a new song by syncing', song);
                        // axios
                        //     .post(
                        //         'http://localhost:3000/crud-operations/',
                        //         song,
                        //     )
                        //     .then((response) => {
                        //         console.log('Added song:', response.data);
                        //         removeSongFromLocalStorage(song.songId);
                        //     })
                        //     .catch((error) => {
                        //         console.error('Error adding song:', error);
                        //     });
                        //}
                    })
                    .catch((error) => {
                        console.error('Error checking song existence:', error);
                        console.log('adding a new song by syncing', song);
                        axios
                            .post(connection + '/crud-operations/', song)
                            .then((response) => {
                                console.log('Added song:', response.data);
                                removeSongFromLocalStorage(song.songId);
                            })
                            .catch((error) => {
                                console.error('Error adding song:', error);
                            });
                    });
            });
        }
        localStorage.clear();
    };

    // useEffect(() => {
    //     console.log('syncing with the server.');
    //     if (isOnline) {
    //         // console.log('syncing with the server.');
    //         if (syncData == 'true') {
    //             syncLocalDataWithServer();
    //             setSyncData('false');
    //         }
    //     }
    // }, [isOnline]);

    useEffect(() => {
        if (isServer == 'true' && isOnline) {
            setErrorMessage('');
            setIsServerAndOnline('true');
        }
    }, [isServer, isOnline]);

    useEffect(() => {
        console.log('syncing with the server.');
        if (isServer == 'true') {
            if (syncData == 'true') {
                syncLocalDataWithServer();
                setSyncData('false');
            }
        }
    }, [isServer]);

    const removeSongFromLocalStorage = (songId: string) => {
        const localData = JSON.parse(
            localStorage.getItem('MySongList') || '[]',
        );
        const updatedLocalData = localData.filter(
            (item: ISong) => item.songId !== songId,
        );
        localStorage.setItem('MySongList', JSON.stringify(updatedLocalData));
    };

    useEffect(() => {
        if (!isOnline) {
            //SetShownPage(PageEnum.error);
            setConnectionErrorMessage(
                'Internet is down. Please try again later.',
            );
            setIsServerAndOnline('false');
            setSyncData('true');
            setErrorMessage('Internet is down!');
            const localData = JSON.parse(
                localStorage.getItem('MySongList') || '[]',
            );

            localStorage.setItem('MySongList', JSON.stringify(localData));
            return;
        }
        if (isServer == 'false') {
            setIsServerAndOnline('false');
            setErrorMessage('Server is down!');
            setSyncData('true');
            const localData = JSON.parse(
                localStorage.getItem('MySongList') || '[]',
            );

            localStorage.setItem('MySongList', JSON.stringify(localData));
            return;
        }
        axios
            .get(connection + '/crud-operations/songs')
            .then((response) => {
                SetSongList(response.data);
                console.log(response.data);
                localStorage.setItem(
                    'MySongList',
                    JSON.stringify(response.data),
                );
            })
            .catch((error) => {
                const cachedData = localStorage.getItem('MySongList');
                if (cachedData) {
                    SetSongList(JSON.parse(cachedData));
                }

                // setConnectionErrorMessage(
                //     'Server error. Please try again later.',
                // );
                // SetShownPage(PageEnum.error);
                console.error('Error fetching songs:', error);
            });
    }, [isOnline, isServer]);

    useEffect(() => {
        client.onmessage = (message: IMessageEvent) => {
            const dataString =
                typeof message.data === 'string'
                    ? message.data
                    : new TextDecoder().decode(message.data);
            const updatedSongs = JSON.parse(dataString);
            SetSongList(updatedSongs);
        };
    }, []);

    const onAddSongClickHandle = () => {
        SetShownPage(PageEnum.add);
    };

    const onDiagramClickHandler = () => {
        SetShownPage(PageEnum.diagram);
    };

    const onSearchClickHandler = () => {
        SetShownPage(PageEnum.sort_filter);
    };

    const showListPage = () => {
        SetShownPage(PageEnum.list);
    };

    const onSubmitAddSong = (data: ISong) => {
        SetSongList([...MySongList, data]);
    };

    const onClickDeleteSong = (data: ISong) => {
        const indexToDelete = MySongList.indexOf(data);
        if (indexToDelete) {
            const temporarySongList = [...MySongList];
            temporarySongList.splice(indexToDelete, 1);
            SetSongList(temporarySongList);

            axios
                .delete(connection + `/crud-operations/${data.songId}`)
                .then((response) => {
                    console.log('Song deleted successfully:', response.data);
                })
                .catch((error) => {
                    console.error(
                        'There was an error deleting the song:',
                        error.toString(),
                    );
                });
        } else {
            console.log('error in deleting');
        }
    };
    const onGenreInfoClickHandler = () => {
        SetShownPage(PageEnum.genres);
    };

    const onClickEditSong = (data: ISong) => {
        SetShownPage(PageEnum.edit);
        SetDataToEdit(data);
    };

    // const UpdateSong = (data: ISong) => {
    //     try {
    //         const filteredData = MySongList.filter(
    //             (x) => x.songId === data.songId,
    //         )[0];
    //         const indexToUpdate = MySongList.indexOf(filteredData);
    //         const temporaryData = [...MySongList];
    //         temporaryData[indexToUpdate] = data;
    //         SetSongList(temporaryData);

    //         axios
    //             .put(
    //                 `http://localhost:3000/crud-operations/${data.songId}`,
    //                 data,
    //             )
    //             .then((response) => {
    //                 console.log('Song updated successfully:', response.data);
    //             })
    //             .catch((error) => {
    //                 if (error.response && error.response.status === 404) {
    //                     setErrorMessage(error.response.data);
    //                 } else {
    //                     console.error(
    //                         'There was an error updating the song:',
    //                         error.toString(),
    //                     );
    //                 }
    //             });
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const UpdateSong = (data: ISong) => {
        try {
            const filteredData = MySongList.filter(
                (x) => x.songId === data.songId,
            )[0];
            const indexToUpdate = MySongList.indexOf(filteredData);
            const temporaryData = [...MySongList];
            temporaryData[indexToUpdate] = data;
            SetSongList(temporaryData);
            if (isOnline && isServer == 'true') {
                axios
                    .put(connection + `/crud-operations/${data.songId}`, data)
                    .then((response) => {
                        console.log(
                            'Song updated successfully:',
                            response.data,
                        );
                    })
                    .catch((error) => {
                        if (error.response && error.response.status === 404) {
                            setErrorMessage(error.response.data);
                        } else {
                            console.error(
                                'There was an error updating the song:',
                                error.toString(),
                            );
                        }
                    });
            } else {
                const localData = JSON.parse(
                    localStorage.getItem('MySongList') || '[]',
                );
                const updatedLocalData = localData.map((song: ISong) =>
                    song.songId === data.songId ? data : song,
                );
                localStorage.setItem(
                    'MySongList',
                    JSON.stringify(updatedLocalData),
                );
                console.log(updatedLocalData);
                const updatedSongList = MySongList.map((song) =>
                    song.songId === data.songId ? data : song,
                );
                SetSongList(updatedSongList);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='container'>
            {errorMessage && (
                <div className='popup' style={{color: 'red'}}>
                    <h2>{errorMessage}</h2>
                </div>
            )}

            <section className='content'>
                {ShownPage == PageEnum.list && (
                    <div>
                        <header className='header-title'>
                            <h2 className='title'>
                                Your Personal Music Journal
                            </h2>
                            <button
                                onClick={handleLogout}
                                style={{color: 'red'}}
                            >
                                Logout
                            </button>
                        </header>
                        <aside className='sidebar'>
                            <button onClick={onDiagramClickHandler}>
                                Diagram
                            </button>
                            <button onClick={onSearchClickHandler}>
                                Search and Filter
                            </button>
                            <button onClick={onGenreInfoClickHandler}>
                                GENRES Info
                            </button>
                            <button
                                onClick={() =>
                                    console.log('Navigate to About Us page')
                                }
                            >
                                About Us
                            </button>
                            <button onClick={handleRequestButton}>
                                Request Protected Route
                            </button>
                        </aside>
                        <div className='container'>
                            <input
                                className='add-form'
                                type='button'
                                value={'Add New Song'}
                                onClick={onAddSongClickHandle}
                            />
                            <div className='song-list-container'>
                                <div className='song-list-wrapper'>
                                    <SongList
                                        list={MySongList}
                                        onDeleteClickHandler={onClickDeleteSong}
                                        onEditClickHandler={onClickEditSong}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {ShownPage == PageEnum.add && (
                    <AddSong
                        onBackButtonClick={showListPage}
                        onSubmitHandler={onSubmitAddSong}
                        isBothServerAndOnline={isServerAndOnline}
                    />
                )}
                {ShownPage == PageEnum.edit && (
                    <EditSong
                        data={DataToEdit}
                        onBackButtonClick={showListPage}
                        onUpdateClickHandler={UpdateSong}
                    />
                )}
                {ShownPage == PageEnum.diagram && (
                    <Diagram
                        list={MySongList}
                        onBackButtonClick={showListPage}
                    />
                )}
                {/* {ShownPage == PageEnum.sort_filter && (
                    <SortFilter
                        list={MySongList}
                        onBackButtonClick={showListPage}
                    />
                )} */}
                {ShownPage == PageEnum.error && (
                    <ErrorPage
                        new_error={connectionErrorMessage}
                        onBackButtonClick={showListPage}
                    />
                )}
                {ShownPage == PageEnum.welcome && <WelcomePage />}

                {ShownPage == PageEnum.genres && <GenreHome />}
            </section>
        </div>
    );
};

export default Home;
