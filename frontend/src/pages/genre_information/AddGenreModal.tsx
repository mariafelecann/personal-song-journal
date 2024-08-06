import axios from 'axios';
import {useState} from 'react';
import {IGenre} from '../../components/objects/MyGenre.type';
import './AddGenreModal.style.css';
type AddGenreProps = {
    onBackButtonClick: () => void;
    onSubmitHandler: (data: IGenre) => void;
};
const AddGenre = (props: AddGenreProps) => {
    const {onBackButtonClick, onSubmitHandler} = props;
    const [name, SetName] = useState('');
    const [description, SetDescription] = useState('');
    const [newOrigin, SetOrigin] = useState('');
    const [newPopularity, SetPopularity] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const connection = process.env.BACKEND_URL;
    const nameChangeHandler = (e: any) => {
        SetName(e.target.value);
    };

    const descriptionChangeHandler = (e: any) => {
        SetDescription(e.target.value);
    };
    const originChangeHandler = (e: any) => {
        SetOrigin(e.target.value);
    };
    const popularityChangeHandler = (e: any) => {
        SetPopularity(e.target.value);
    };
    const onSubmitClickHandler = (e: any) => {
        e.preventDefault();
        const nameError = validateName(name);
        const descriptionError = validateDescription(description);
        const originError = validateOrigin(newOrigin);
        const popularityError = validatePopularity(newPopularity);

        if (nameError || descriptionError || originError || popularityError) {
            onBackButtonClick();
        } else {
            console.log(name);
            const data: IGenre = {
                genreName: name,
                genreDescription: description,
                genreOrigin: newOrigin,
                popularity: parseInt(newPopularity),
                genreId: new Date().toJSON().toString(),
            };

            axios
                .post(connection + `/crud-operations/genres/`, data)
                .then((response) => {
                    console.log('Genre added successfully:', response.data);
                    onSubmitHandler(data);
                    onBackButtonClick();
                })
                .catch((error) => {
                    if (
                        error.response &&
                        error.response.status === 404 &&
                        error.response.data === 'Genre already exists'
                    ) {
                        setErrorMessage('Genre already exists');
                    } else {
                        console.error(
                            'There was an error adding the genre:',
                            error.toString(),
                        );
                    }
                });
        }
    };

    const validateName = (title: string): string | null => {
        if (!title || typeof title !== 'string') {
            return 'title should be a string';
        }
        return null;
    };

    const validateDescription = (artist: string): string | null => {
        if (!artist || typeof artist !== 'string') {
            return 'artist should be a string';
        }
        return null;
    };

    const validateOrigin = (origin: string): string | null => {
        if (!origin || typeof origin !== 'string') {
            return 'origin should be a string';
        }
        return null;
    };

    const validatePopularity = (popularity: string): string | null => {
        const parsedPopularity = parseInt(popularity);
        if (isNaN(parsedPopularity)) {
            return 'popularity should be a number';
        }
        return null;
    };
    return (
        <form
            className='add-song-form-container'
            onSubmit={onSubmitClickHandler}
        >
            <header>
                <h3>Add a new Genre!</h3>
            </header>
            <div className='elements-container'>
                <div>
                    <label>Name:</label>
                    <input
                        className='input-box'
                        type='text'
                        value={name}
                        onChange={nameChangeHandler}
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        className='input-box'
                        type='text'
                        value={description}
                        onChange={descriptionChangeHandler}
                    />
                </div>
                <div>
                    <label>Origin:</label>
                    <input
                        className='input-box'
                        type='text'
                        value={newOrigin}
                        onChange={originChangeHandler}
                    />
                </div>
                <div>
                    <label>Popularity:</label>
                    <input
                        className='input-box'
                        type='text'
                        value={newPopularity}
                        onChange={popularityChangeHandler}
                    />
                </div>
            </div>
            <div className='buttons-container'>
                <button onClick={onBackButtonClick}>Back</button>
                <button type='submit'>Add Genre</button>
            </div>
            {errorMessage && (
                <div className='popup'>
                    <p>{errorMessage}</p>
                    <button
                        onClick={() => {
                            setErrorMessage('');
                            onBackButtonClick;
                        }}
                    >
                        Close
                    </button>
                </div>
            )}
        </form>
    );
};

export default AddGenre;
