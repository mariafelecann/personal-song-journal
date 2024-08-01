import {useState} from 'react';
import './AddSongForm.style.css';
import {ISong} from './objects/MySong.type';
type EditFormProps = {
    onBackButtonClick: () => void;
    data: ISong;
    onUpdateClickHandler: (data: ISong) => void;
};

const EditSong = (props: EditFormProps) => {
    const {data, onBackButtonClick, onUpdateClickHandler} = props;
    const [songName, SetTitle] = useState(data.songName);
    const [artistName, SetArtist] = useState(data.artistName);
    const [rating, SetRating] = useState(data.rating);
    const [review, SetReview] = useState(data.review);
    const [genreId, SetGenre] = useState(data.genreId);

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
        const titleError = validateTitle(songName);
        const artistError = validateArtist(artistName);
        const ratingError = validateRating(rating.toString());
        const reviewError = validateReview(review);

        if (titleError || artistError || ratingError || reviewError) {
            onBackButtonClick();
        } else {
            const updatedData: ISong = {
                songId: data.songId,
                songName: songName,
                artistName: artistName,
                rating: rating,
                review: review,
                genreId: genreId,
            };

            onUpdateClickHandler(updatedData);
            onBackButtonClick();
        }
    };

    const validateTitle = (title: string): string | null => {
        if (!title || typeof title !== 'string') {
            return 'Title should be a string';
        }
        return null;
    };

    const validateArtist = (artist: string): string | null => {
        if (!artist || typeof artist !== 'string') {
            return 'Artist should be a string';
        }
        return null;
    };

    const validateRating = (rating: string): string | null => {
        const parsedRating = parseInt(rating);
        if (isNaN(parsedRating)) {
            return 'Rating should be a number';
        }
        return null;
    };

    const validateReview = (review: string): string | null => {
        if (!review || typeof review !== 'string') {
            return 'Review should be a string';
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
                        value={songName}
                        onChange={titleChangeHandler}
                    />
                </div>
                <div>
                    <label>Artist:</label>
                    <input
                        className='input-box'
                        type='text'
                        value={artistName}
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
                        value={genreId}
                        onChange={genreChangeHandler}
                    />
                </div>
            </div>
            <div className='buttons-container'>
                <button onClick={onBackButtonClick}>Back</button>
                <button type='submit'>Update Song</button>
            </div>
        </form>
    );
};

export default EditSong;
