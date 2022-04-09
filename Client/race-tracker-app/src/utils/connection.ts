import { HubConnection } from '@microsoft/signalr';
import axios from 'axios';

const apiBaseUrl = 'http://localhost:7071';
const axiosConfig = {};

export type PositionMapped = {
  [id: number]: {
    competitor: string;
    controlPoint: number;
    time: string;
  };
};

export type Position = {
  id: number;
  competitor: string;
  controlPoint: number;
  time: string;
};

export const startConnection = async (connection: HubConnection) => {
  try {
    await connection.start();
  } catch (error: any) {
    alert('Error occured while connecting to SignalR!');
    setTimeout(() => startConnection(connection), 3000);
  }
};

export const getConnection = async () => {
  const response = await axios.post(
    `${apiBaseUrl}/api/GetSignalRConnection`,
    null,
    axiosConfig
  );

  return response.data;
};

export const getCompetitorPositions: () => Promise<
  Array<Position>
> = async () => {
  const response = await axios.post(
    `${apiBaseUrl}/api/GetCompetitorPositions`,
    null,
    axiosConfig
  );

  return response.data;
};

const mapPositions = (positions: Array<Position>): Array<PositionMapped> =>
  positions.map((positionDto) => ({
    [positionDto.id]: {
      competitor: positionDto.competitor,
      controlPoint: positionDto.controlPoint,
      time: positionDto.time,
    },
  }));
