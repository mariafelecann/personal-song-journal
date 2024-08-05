import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import {ISong} from '../components/objects/MySong.type';

type DiagramProps = {
    list: ISong[];
    onBackButtonClick: () => void;
};

const Diagram = ({list, onBackButtonClick}: DiagramProps) => {
    const chartData = list.map((song, index) => ({
        // name: `Song ${index + 1}`,
        index: `Song ${index + 1}`,
        songName: song.songName,
        rating: song.rating,
    }));

    return (
        <div>
            <h1>Diagram Page</h1>
            <LineChart
                width={800}
                height={400}
                data={chartData}
                margin={{top: 5, right: 30, left: 20, bottom: 5}}
            >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type='monotone'
                    dataKey='rating'
                    stroke='#8884d8'
                    activeDot={{r: 8}}
                />
            </LineChart>
            <button onClick={onBackButtonClick}>Back</button>
        </div>
    );
};

export default Diagram;
