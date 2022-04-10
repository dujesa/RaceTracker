import React, { useState, useCallback, useEffect } from 'react';
import { HubConnectionBuilder } from '@microsoft/signalr';

import './App.css';
import {
  getCompetitorPositions,
  getConnection,
  Position,
  startConnection,
} from './utils/connection';

const App = () => {
  const [competitorPositions, setCompetitorPositions] = useState<
    Array<Position>
  >([]);

  const updateCompetitorPositions = (newPosition: Position) => {
    setCompetitorPositions((prev) => [
      ...prev.filter((position) => position.id !== newPosition.id),
      newPosition,
    ]);
  };

  const setupConnection = useCallback(async () => {
    const positions = await getCompetitorPositions();
    setCompetitorPositions(positions);

    const connectionInfo = await getConnection();

    const accessToken = connectionInfo.accessToken;
    const options = {
      accessTokenFactory: async () => {
        if (!accessToken) {
          const response = await getConnection();
          return response.accessToken;
        }

        return accessToken;
      },
    };

    const connection = new HubConnectionBuilder()
      .withUrl(connectionInfo.url, options)
      .build();

    connection.on('updatePositions', updateCompetitorPositions);
    connection.onclose(() => {
      alert('Disconnected, connecting...');
      startConnection(connection);
    });

    startConnection(connection);
  }, []);

  useEffect(() => {
    setupConnection();
  }, [setupConnection]);

  return (
    <div style={{ margin: '0 30%' }}>
      <h1>Race tracker</h1>
      <div>
        {competitorPositions.map((position: Position, i) => (
          <p className='fade' key={i}>
            {position.competitor}@{position.controlPoint}: {position.time}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
