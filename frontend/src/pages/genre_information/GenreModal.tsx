import {IGenre} from '../../components/objects/MyGenre.type';
import './GenreModal.style.css';

type DetailsModalProps = {
    onClose: () => void;
    data: IGenre;
};

const GenreModal = (props: DetailsModalProps) => {
    const {onClose, data} = props;
    return (
        <div id='myModal' className='modal'>
            <div className='modal-content'>
                <span className='close' onClick={onClose}>
                    &times;
                </span>
                <div>
                    <div>
                        <h3 className='h-style'>
                            <label className='label-style'>
                                {data.genreName}
                            </label>
                        </h3>
                        <h5>Genre: {data.genreName}</h5>
                    </div>
                    <div>
                        <label className='label-style'>
                            {data.genreDescription}
                        </label>
                    </div>
                    <div>
                        <label className='label-style'>
                            Origin: {data.genreOrigin}{' '}
                        </label>
                        <label className='label-style'>
                            Popularity from 1 - 10: {data.popularity}{' '}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default GenreModal;
