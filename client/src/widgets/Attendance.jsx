import { Alert, Button, Skeleton, Stack, Typography } from "@mui/material";
import { DateTimeNow, FormatDate } from "../functions/dates";
import { useFetch, useRequest } from "../providers/AppProvider";
import server_route_names from "../routes/server_route_names";
import LegacyCard from "../subcomponents/LegacyCard";
import { useAuth } from "../providers/AuthProvider";
import moment from "moment";
import { useEffect, useState } from "react";
import LegacyModal from "../subcomponents/LegacyModal";

export default function Attendance(){
    const { user, logout } = useAuth();
    let today = DateTimeNow().date;
    const { data: attendance, fetching: loading, reFetch } = useFetch(`${server_route_names.attendance}?date=${today}`);
    const { data: attendanceRecord, loading: attendanceLoading, sendRequest: updateAttendance } = useRequest();
    const [signOutAlert, setSignOutAlert] = useState(false);

    useEffect(() => {
        if (attendanceRecord) {
            reFetch();
        }
    }, [attendanceRecord]);

    const signIn = async () => {
        let dateTime = DateTimeNow();
        await updateAttendance({
            url: `${server_route_names["attendance.signin"]}`,
            type: "post",
            data: {
                userId: user?._id,
                attendanceDate: today,
                clockInTime: dateTime.iso,
                dateTime: dateTime.iso
            }
        });
    }

    const signOut = async () => {
        let dateTime = DateTimeNow();
        await updateAttendance({
            url: `${server_route_names["attendance.signout"]}`,
            type: "post",
            data: {
                userId: user?._id,
                attendanceDate: today,
                clockOutTime: dateTime.iso,
                dateTime: dateTime.iso
            }
        });
        logout();
    }

    const changeWorkingState = async (workingState) => {
        let dateTime = DateTimeNow();
        await updateAttendance({
            url: `${server_route_names["attendance.status"]}`,
            type: "post",
            data: {
                userId: user?._id,
                attendanceDate: today,
                workingState: workingState,
                dateTime: dateTime.iso
            }
        });
    }

    if (loading) {
        return (
            <LegacyCard title="Attendance" sectioned>
                <Skeleton variant="text"></Skeleton>
                <Skeleton variant="text"></Skeleton>
                <Skeleton variant="text"></Skeleton>
            </LegacyCard>
        )
    }

    const alertProps = <LegacyModal
        open={signOutAlert}
        title="Have you finished working?"
        onClose={() => {
            setSignOutAlert(false);
        }}
        onCancel={() => {
            setSignOutAlert(false);
        }}
        primaryAction={{
            title: "Sign out",
            color: "error",
            onClick: signOut,
            disabled: attendanceLoading
        }}
    >
        Please note that signing out will mark your attendance for today, and you won't be able to undo this action. Your working hours will be calculated accordingly, and you won't be able to sign in again for today.
    </LegacyModal>;

    return(
        <>
            {alertProps}
            <LegacyCard title="Attendance">
                <LegacyCard.Section>
                    <Stack direction="column" spacing={2} alignItems="center">
                        {
                            !attendance?.clockInTime && <Alert variant="outlined" severity="warning">You haven't checked in for attendance today!</Alert>
                        }
                        {
                            attendance?.clockInTime && <div>
                                <Typography>
                                    You signed in today at {moment(attendance?.clockInTime).format("hh:mm A")}
                                </Typography>
                                {
                                    attendance?.clockOutTime && <Typography>
                                        You signed out today at {moment(attendance?.clockOutTime).format("hh:mm A")}
                                    </Typography>
                                }
                            </div>
                        }
                        <CalculateWorkingTime attendance={attendance}/>
                        <Stack direction="row" spacing={1} alignItems="center">
                            {
                                (attendance && attendance?.workingState === "WORKING" && !attendance?.clockOutTime) && <Button
                                    variant="contained"
                                    disabled={attendanceLoading}
                                    onClick={() => {
                                        changeWorkingState("ON_BREAK");
                                    }}
                                >
                                    Take a break
                                </Button>
                            }
                            {
                                (attendance && attendance?.workingState === "ON_BREAK" && !attendance?.clockOutTime) && <Button
                                    variant="contained"
                                    disabled={attendanceLoading}
                                    onClick={() => {
                                        changeWorkingState("WORKING")
                                    }}
                                >
                                    Break sign out
                                </Button>
                            }
                            {
                                (!attendance) && <Button
                                    variant="contained"
                                    disabled={attendanceLoading}
                                    onClick={signIn}
                                >Sign in</Button>
                            }
                            {
                                attendance && !attendance?.clockOutTime && <Button
                                    color="error"
                                    variant="contained"
                                    disabled={attendance?.workingState === "ON_BREAK" || attendanceLoading}
                                    onClick={() => {
                                        setSignOutAlert(true);
                                    }}
                                >Sign out</Button>
                            }
                        </Stack>
                    </Stack>
                </LegacyCard.Section>
            </LegacyCard>
        </>
    )
}

function CalculateWorkingTime({ attendance }) {
    const [clockInTime, setClockInTime] = useState(attendance?.clockInTime?new Date(attendance?.clockInTime):null);
    const [workingTime, setWorkingTime] = useState(0);
    const [breakTime, setBreakTime] = useState(0);

    useEffect(() => {
        if (attendance?.clockInTime) {
            setClockInTime(new Date(attendance?.clockInTime));
        }
    }, [attendance]);

    useEffect(() => {
        let totalBreakTime = 0;
        if (attendance?.breaks) {
            attendance.breaks.forEach(breakItem => {
            const breakStartTime = new Date(breakItem.clockInTime);
            const breakEndTime = new Date(breakItem.clockOutTime);
            totalBreakTime += breakEndTime - breakStartTime;
            });
            setBreakTime(totalBreakTime);
        }
    }, [attendance]);

    useEffect(() => {
        const bIntervalId = setInterval(() => {
            if (attendance?.workingState === "ON_BREAK") {
                let totalBreakTime = 0;
                if (attendance?.breakTime && attendance?.workingState === "ON_BREAK") {
                    const breakStartTime = new Date(attendance?.breakTime);
                    const breakEndTime = new Date();
                    totalBreakTime += breakEndTime - breakStartTime;
                }
                if (attendance?.breaks) {
                    attendance.breaks.forEach(breakItem => {
                        const breakStartTime = new Date(breakItem.clockInTime);
                        const breakEndTime = new Date(breakItem.clockOutTime);
                        totalBreakTime += breakEndTime - breakStartTime;
                    });
                    setBreakTime(totalBreakTime);
                }
            }
        }, 1000);
        return () => clearInterval(bIntervalId);
    }, [attendance]);

  useEffect(() => {
    const intervalId = setInterval(() => {
        if (clockInTime && attendance?.attendanceDate && attendance?.workingState === "WORKING") {
            const currentTime = attendance.clockOutTime ? new Date(attendance.clockOutTime) : new Date();
            const elapsedTime = currentTime - clockInTime - breakTime;
            setWorkingTime(elapsedTime);
        }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [clockInTime]);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000) % 60;
    const minutes = Math.floor(milliseconds / (1000 * 60)) % 60;
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    return `${hours}h ${minutes}m ${seconds}s`;
  };

    return (
        <Stack direction="column" spacing={2} alignItems="center">
            {
                (attendance?.attendanceDate && attendance?.workingState === "WORKING") && 
                (<Stack direction="column" spacing={0} alignItems="center">
                    <Typography variant="h5">
                        { (workingTime > 0)?formatTime(workingTime):"0h 00m 00s" }
                    </Typography>
                    <Typography variant="">Working Time</Typography>
                </Stack>)
            }
            {
                (attendance?.attendanceDate && attendance?.workingState === "ON_BREAK") && (
                    <Stack direction="column" spacing={0} alignItems="center">
                        <Typography variant="h5">
                            { breakTime > 0?formatTime(breakTime):"0h 00m 00s" }
                        </Typography>
                        <Typography variant="">Break Time</Typography>
                    </Stack>
                )
            }
        </Stack>
    );
};