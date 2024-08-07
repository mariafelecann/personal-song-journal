import axios from 'axios';
import {useEffect, useState} from 'react';
import {IGenre} from '../../components/objects/MyGenre.type';
import {GenrePageEnum} from './GenrePageEnum';

import '../Home.style.css';
import AddGenre from './AddGenreModal';
import EditGenre from './EditGenreModal';
import GenreTable from './GenreTable';

const GenreHome = () => {
    const [MyGenreList, SetGenreList] = useState([] as IGenre[]);
    const [ShownPage, SetShownPage] = useState(GenrePageEnum.list);
    const [DataToEdit, SetDataToEdit] = useState({} as IGenre);
    const [errorMessage, setErrorMessage] = useState('');
    //const client = new W3CWebSocket('ws://localhost:4000/');
    const connection = process.env.REACT_APP_BACKEND_URL;

    useEffect(() => {
        axios
            .get(connection + '/crud-operations/genres')
            .then((response) => {
                SetGenreList(response.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.error('Error fetching genres:', error);
            });
    });

    // useEffect(() => {
    //     client.onmessage = (message: IMessageEvent) => {
    //         const dataString =
    //             typeof message.data === 'string'
    //                 ? message.data
    //                 : new TextDecoder().decode(message.data);
    //         const updatedSongs = JSON.parse(dataString);
    //         SetGenreList(updatedSongs);
    //     };
    // }, []);

    const onAddGenreClickHandle = () => {
        SetShownPage(GenrePageEnum.add);
    };

    const showListPage = () => {
        SetShownPage(GenrePageEnum.list);
    };

    const onSubmitAddGenre = (data: IGenre) => {
        SetGenreList([...MyGenreList, data]);
    };

    const onClickDeleteGenre = (data: IGenre) => {
        const indexToDelete = MyGenreList.indexOf(data);
        if (indexToDelete) {
            const temporaryGenreList = [...MyGenreList];
            temporaryGenreList.splice(indexToDelete, 1);
            SetGenreList(temporaryGenreList);

            axios
                .delete(connection + `/crud-operations/genres/${data.genreId}`)
                .then((response) => {
                    console.log('Genre deleted successfully:', response.data);
                })
                .catch((error) => {
                    console.error(
                        'There was an error deleting the genre:',
                        error.toString(),
                    );
                });
        } else {
            console.log('error in deleting');
        }
    };

    const onClickEditGenre = (data: IGenre) => {
        SetShownPage(GenrePageEnum.edit);
        SetDataToEdit(data);
    };

    const UpdateSong = (data: IGenre) => {
        try {
            const filteredData = MyGenreList.filter(
                (x) => x.genreId === data.genreId,
            )[0];
            const indexToUpdate = MyGenreList.indexOf(filteredData);
            const temporaryData = [...MyGenreList];
            temporaryData[indexToUpdate] = data;
            SetGenreList(temporaryData);

            axios
                .put(
                    connection + `/crud-operations/genres/${data.genreId}`,
                    data,
                )
                .then((response) => {
                    console.log('Genre updated successfully:', response.data);
                })
                .catch((error) => {
                    if (error.response && error.response.status === 404) {
                        setErrorMessage(error.response.data);
                    } else {
                        console.error(
                            'There was an error updating the genre:',
                            error.toString(),
                        );
                    }
                });
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='container'>
            <header className='header-title'>
                <h2 className='title'>GENRES</h2>
            </header>

            <section className='content'>
                {ShownPage == GenrePageEnum.list && (
                    <div className='container'>
                        <input
                            className='add-form'
                            type='button'
                            value={'Add New Genre'}
                            onClick={onAddGenreClickHandle}
                        />
                        <div className='song-list-container'>
                            <div className='song-list-wrapper'>
                                <GenreTable
                                    list={MyGenreList}
                                    onDeleteClickHandler={onClickDeleteGenre}
                                    onEditClickHandler={onClickEditGenre}
                                />
                            </div>
                        </div>
                    </div>
                )}
                {ShownPage == GenrePageEnum.add && (
                    <AddGenre
                        onBackButtonClick={showListPage}
                        onSubmitHandler={onSubmitAddGenre}
                    />
                )}
                {ShownPage == GenrePageEnum.edit && (
                    <EditGenre
                        data={DataToEdit}
                        onBackButtonClick={showListPage}
                        onUpdateClickHandler={UpdateSong}
                    />
                )}

                {errorMessage && (
                    <div className='popup' style={{color: 'red'}}>
                        <p>{errorMessage}</p>
                        <button onClick={() => setErrorMessage('')}>
                            Close
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default GenreHome;
