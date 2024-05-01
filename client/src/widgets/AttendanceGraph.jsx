import { useFetch } from '../providers/AppProvider';
import server_route_names from '../routes/server_route_names';
import LegacyCard from '../subcomponents/LegacyCard';
import moment from 'moment';
import AttendanceChart from './components/AttendanceChart';

export default function AttendanceGraph({ }) {
    const todayDate = new Date();
    const month = todayDate.getMonth() + 1;
    const year = todayDate.getFullYear();
    const { data: attendance } = useFetch(`${server_route_names.attendance}?get_by=month&month=${month}`);
    const monthTitle = moment(new Date(year, month, 0)).format("MMMM YYYY");
    return (
        <LegacyCard sectioned title={`Attendance for ${monthTitle}`}>
            <AttendanceChart attendanceRecords={attendance} monthTitle={monthTitle} />
        </LegacyCard>
    );
};
