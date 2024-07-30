import {render} from '@testing-library/react';
import {describe, it, vi} from 'vitest';
import SortFilter from '../pages/SortFilter';
describe('SortFilter', () => {
    it('renders without crashing', () => {
        const onBackButtonClick = vi.fn();
        const DummySongList = [
            {
                id: '1',
                title: 'Our Last Summer',
                artist: 'Abba',
                rating: 8,
                review: 'This song reminds me of summer',
            },
            {
                id: '2',
                title: 'Ca o Molie',
                artist: 'Subcarpati',
                rating: 9,
                review: 'It makes me feel understood',
            },
            {
                id: '3',
                title: 'You Spin Me Round (Like A Record)',
                artist: 'Dead or Alive',
                rating: 7,
                review: 'Makes me want to dance!',
            },
        ];
        render(
            <SortFilter
                onBackButtonClick={onBackButtonClick}
                list={DummySongList}
            />,
        );
    });
});
