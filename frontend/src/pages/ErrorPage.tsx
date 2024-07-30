import '../pages/ErrorPage.style.css';
type ErrorProps = {
    new_error: string;
    onBackButtonClick: () => void;
};

const ErrorPage = ({new_error, onBackButtonClick}: ErrorProps) => {
    <button onClick={onBackButtonClick}>Back</button>;
    return (
        <div className='error'>
            <div className='error-text'>{new_error}</div>
        </div>
    );
};

export default ErrorPage;
