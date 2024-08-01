// // describe('AddSong', () => {
// //     it('renders the form and submits data', () => {
// //         const onBackButtonClick = vi.fn();
// //         const onSubmitHandler = vi.fn();

// import {render} from '@testing-library/react';
// import {vi} from 'vitest';
// import AddSong from '../components/AddSongForm';

// //         render(
// //             <AddSong
// //                 onBackButtonClick={onBackButtonClick}
// //                 onSubmitHandler={onSubmitHandler}
// //             />,
// //         );

// //         // Check if the form renders
// //         expect(screen.getByText('Add a new Song!'));

// //         // Fill in the form fields
// //         fireEvent.change(screen.getByLabelText('Title:'), {
// //             target: {value: 'Test Song'},
// //         });
// //         fireEvent.change(screen.getByLabelText('Artist:'), {
// //             target: {value: 'Test Artist'},
// //         });
// //         fireEvent.change(screen.getByLabelText('Rating:'), {
// //             target: {value: '5'},
// //         });
// //         fireEvent.change(screen.getByLabelText('Review:'), {
// //             target: {value: 'Great song!'},
// //         });

// //         // Submit the form
// //         fireEvent.click(screen.getByText('Add Song'));

// //         // Check if onSubmitHandler was called with the correct data
// //         expect(onSubmitHandler).toHaveBeenCalledWith({
// //             id: expect.any(String),
// //             title: 'Test Song',
// //             artist: 'Test Artist',
// //             rating: 5,
// //             review: 'Great song!',
// //         });
// //     });
// // });

// // describe('AddSong', () => {
// //     it('renders the form and submits data', async () => {
// //         const onBackButtonClick = vi.fn();
// //         const onSubmitHandler = vi.fn();

// //         render(
// //             <AddSong
// //                 onBackButtonClick={onBackButtonClick}
// //                 onSubmitHandler={onSubmitHandler}
// //             />,
// //         );

// //         // Check if the form renders
// //         expect(screen.getByText('Add a new Song!')).not.toBeNull();

// //         // Fill in the form fields
// //         userEvent.type(screen.getByLabelText('Title:'), 'Test Song');
// //         userEvent.type(screen.getByLabelText('Artist:'), 'Test Artist');
// //         userEvent.type(screen.getByLabelText('Rating:'), '5');
// //         userEvent.type(screen.getByLabelText('Review:'), 'Great song!');

// //         // Submit the form
// //         userEvent.click(screen.getByText('Add Song'));

// //         // Wait for any asynchronous updates to complete
// //         await vi.nextTick();

// //         // Check if onSubmitHandler was called with the correct data
// //         expect(onSubmitHandler).toHaveBeenCalledWith({
// //             id: expect.any(String),
// //             title: 'Test Song',
// //             artist: 'Test Artist',
// //             rating: 5,
// //             review: 'Great song!',
// //         });
// //     });
// // });

// // describe('AddSong', () => {
// //     it('renders the form and submits data', async () => {
// //         const onBackButtonClick = vi.fn();
// //         const onSubmitHandler = vi.fn();

// //         render(
// //             <AddSong
// //                 onBackButtonClick={onBackButtonClick}
// //                 onSubmitHandler={onSubmitHandler}
// //             />,
// //         );
// //         expect(screen.getAllByText('Add a new Song!')).not.toBeNull();

// //         userEvent.type(screen.getByLabelText('Title:'), 'Test Song');
// //         userEvent.type(screen.getByLabelText('Artist:'), 'Test Artist');
// //         userEvent.type(screen.getByLabelText('Rating:'), '5');
// //         userEvent.type(screen.getByLabelText('Review:'), 'Great song!');

// //         userEvent.click(screen.getByText('Add Song'));

// //         await waitFor(() => {
// //             expect(onSubmitHandler).toHaveBeenCalledWith({
// //                 id: expect.any(String),
// //                 title: 'Test Song',
// //                 artist: 'Test Artist',
// //                 rating: 5,
// //                 review: 'Great song!',
// //             });
// //         });
// //     });
// // });
// import {describe, expect, it} from 'vitest';

// describe('AddSong', () => {
//     it('renders the form and submits data', async () => {
//         const onBackButtonClick = vi.fn();
//         const onSubmitHandler = vi.fn();

//         const renderedComp = render(
//             <AddSong
//                 onBackButtonClick={onBackButtonClick}
//                 onSubmitHandler={onSubmitHandler}
//             />,
//         );
//         expect(renderedComp).toMatchSnapshot();
//     });
// });
