import {useState} from 'react';
import {IGenre} from '../../components/objects/MyGenre.type';
import './AddGenreModal.style.css';
type EditFormProps = {
    onBackButtonClick: () => void;
    data: IGenre;
    onUpdateClickHandler: (data: IGenre) => void;
};

const EditGenre = (props: EditFormProps) => {
    const {data, onBackButtonClick, onUpdateClickHandler} = props;
    const [name, SetName] = useState(data.genreName);
    const [description, SetDescription] = useState(data.genreDescription);
    const [newOrigin, SetOrigin] = useState(data.genreOrigin);
    const [newPopularity, SetPopularity] = useState(data.popularity);
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
        const popularityError = validatePopularity(newPopularity.toString());

        if (nameError || descriptionError || originError || popularityError) {
            onBackButtonClick();
        } else {
            const updatedData: IGenre = {
                genreName: name,
                genreDescription: description,
                genreOrigin: newOrigin,
                popularity: newPopularity,
                genreId: data.genreId,
            };

            onUpdateClickHandler(updatedData);
            onBackButtonClick();
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
                <h3>Edit a Genre!</h3>
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
                        value={origin}
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
                <button type='submit'>Update Genre</button>
            </div>
        </form>
    );
};

export default EditGenre;
