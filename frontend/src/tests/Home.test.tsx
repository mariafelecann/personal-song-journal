import {render} from '@testing-library/react';
import {describe, expect, it} from 'vitest';
import Home from '../pages/Home';
describe('Home Component', () => {
    it('renders without crashing', () => {
        const renderedComp = render(<Home />);
        expect(renderedComp).toMatchSnapshot();
    });

    // it('navigates to Diagram view on Diagram button click', () => {
    //     render(<Home />);
    //     fireEvent.click(screen.getByText('Diagram'));
    //     expect(screen.getByText('Diagram'));
    // });
    // it('renders initial page with song list', () => {
    //     const {getByText} = render(<Home />);
    //     expect(getByText('Your Personal Music Journal'));
    //     expect(getByText('Add New Song'));
    // });

    // it('renders AddSong page when "Add New Song" button is clicked', () => {
    //     const {getByText} = render(<Home />);
    //     fireEvent.click(getByText('Add New Song'));
    //     expect(getByText('Add New Song'));
    // });

    // it('renders EditSong page when "Edit" button is clicked', () => {
    //     const {getByText} = render(<Home />);
    //     fireEvent.click(getByText('Edit'));
    //     expect(getByText('Edit Song'));
    // });
});
