import axios from 'axios';
import {useState} from 'react';
import './AddSongForm.style.css';
import {ISong} from './objects/MySong.type';

type AddSongProps = {
    onBackButtonClick: () => void;
    onSubmitHandler: (data: ISong) => void;
    isBothServerAndOnline: string;
};
const AddSong = (props: AddSongProps) => {
    const {
        onBackButtonClick,
        onSubmitHandler,
        isBothServerAndOnline: isServerAndOnline,
    } = props;
    const [title, SetTitle] = useState('');
    const [artist, SetArtist] = useState('');
    const [rating, SetRating] = useState('');
    const [review, SetReview] = useState('');
    const [genre, SetGenre] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const connection = process.env.REACT_APP_BACKEND_URL;

    const genreChangeHandler = (e: any) => {
        SetGenre(e.target.value);
    };

    const titleChangeHandler = (e: any) => {
        SetTitle(e.target.value);
    };

    const artistChangeHandler = (e: any) => {
        SetArtist(e.target.value);
    };
    const ratingChangeHandler = (e: any) => {
        SetRating(e.target.value);
    };
    const reviewChangeHandler = (e: any) => {
        SetReview(e.target.value);
    };
    const onSubmitClickHandler = (e: any) => {
        e.preventDefault();
        const titleError = validateTitle(title);
        const artistError = validateArtist(artist);
        const ratingError = validateRating(rating);
        const reviewError = validateReview(review);

        if (titleError || artistError || ratingError || reviewError) {
            onBackButtonClick();
        } else {
            const data: ISong = {
                songId: new Date().toJSON().toString(),
                songName: title,
                artistName: artist,
                rating: parseInt(rating),
                review: review,
                genreId: genre,
            };

            //onSubmitHandler(data);
            // onBackButtonClick();
            if (isServerAndOnline == 'true') {
                axios
                    .post(connection + `/crud-operations/`, data)
                    .then((response) => {
                        console.log('Song added successfully:', response.data);
                        onSubmitHandler(data);
                        onBackButtonClick();
                    })
                    .catch((error) => {
                        if (
                            error.response &&
                            error.response.status === 404 &&
                            error.response.data === 'Song already exists'
                        ) {
                            setErrorMessage('Song already exists');
                        } else {
                            console.error(
                                'There was an error adding the song:',
                                error.toString(),
                            );
                        }
                    });
            } else {
                //const newSongJson = JSON.stringify(data);
                const localData = JSON.parse(
                    localStorage.getItem('MySongList') || '[]',
                );
                localData.push(data);
                localStorage.setItem('MySongList', JSON.stringify(localData));
                console.log('New song added to local storage:', data);
                onBackButtonClick();
            }
        }
    };
    const validateTitle = (title: string): string | null => {
        if (!title || typeof title !== 'string') {
            return 'title should be a string';
        }
        return null;
    };

    const validateArtist = (artist: string): string | null => {
        if (!artist || typeof artist !== 'string') {
            return 'artist should be a string';
        }
        return null;
    };

    const validateRating = (rating: string): string | null => {
        const parsedRating = parseInt(rating);
        if (isNaN(parsedRating)) {
            return 'rating should be a number';
        }
        return null;
    };

    const validateReview = (review: string): string | null => {
        if (!review || typeof review !== 'string') {
            return 'review should be a string';
        }
        return null;
    };
    return (
        <form
            className='add-song-form-container'
            onSubmit={onSubmitClickHandler}
        >
            <header>
                <h3>Add a new Song!</h3>
            </header>
            <div className='elements-container'>
                <div>
                    <label>Title:</label>
                    <input
                        className='input-box'
                        type='text'
                        value={title}
                        onChange={titleChangeHandler}
                    />
                </div>
                <div>
                    <label>Artist:</label>
                    <input
                        className='input-box'
                        type='text'
                        value={artist}
                        onChange={artistChangeHandler}
                    />
                </div>
                <div>
                    <label>Rating:</label>
                    <input
                        className='input-box'
                        type='text'
                        value={rating}
                        onChange={ratingChangeHandler}
                    />
                </div>
                <div>
                    <label>Review:</label>
                    <input
                        className='input-box'
                        type='text'
                        value={review}
                        onChange={reviewChangeHandler}
                    />
                </div>
                <div>
                    <label>Genre ID:</label>
                    <input
                        className='input-box'
                        type='text'
                        value={genre}
                        onChange={genreChangeHandler}
                    />
                </div>
            </div>
            <div className='buttons-container'>
                <button onClick={onBackButtonClick}>Back</button>
                <button type='submit'>Add Song</button>
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

export default AddSong;
