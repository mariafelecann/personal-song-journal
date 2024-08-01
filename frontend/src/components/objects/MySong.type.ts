export interface ISong {
    songId: string;
    songName: string;
    artistName: string;
    rating: number;
    review: string;
    genreId : string;
}

export const DummySongList = [
    {
        id: new Date().toJSON().toString(),
        title: 'Our Last Summer',
        artist: 'Abba',
        rating: 8,
        review: 'This song reminds me of summer',
    },
    {
        id: new Date().toJSON().toString(),
        title: 'Ca o Molie',
        artist: 'Subcarpati',
        rating: 9,
        review: 'It makes me feel understood',
    },
    {
        id: new Date().toJSON().toString(),
        title: 'You Spin Me Round (Like A Record)',
        artist: 'Dead or Alive',
        rating: 7,
        review: 'Makes me want to dance!',
    },
];
