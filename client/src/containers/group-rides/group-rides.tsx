import React from 'react';
import { Card, Col, Row, Skeleton } from "antd"
import classes from './group-rides.module.css';

// TODO not sure what this will actually be, just basing it off the mock
interface RideData {
  title: string;
  date: Date;
  startLocation: string;
  endLocation: string;
  description: string;
}

const randomRideDataTest: RideData[] = [];
for (let i = 0; i < 30; i++) {
  randomRideDataTest.push({
    title: `Tuesday Night Group Ride #${i}`,
    date: new Date(),
    startLocation: 'McCormick Waterfall 123 N Main',
    endLocation: 'Alive one 321 S 69th Street',
    description: 'There\'s metered parking for...',
  });
}

const Ride: React.FC<{ rideData: RideData }> = ({ rideData }) => {
  const { title, date, startLocation, endLocation, description } = rideData;
  // TODO make these pretty and cool, images
  return (
    <Card
      style={{ width: 300, marginTop: 16 }}
    >
      <Skeleton loading={false} active>
        <Card.Meta
          title={title}
          description={description}
        />
      </Skeleton>
    </Card>
  );
}

export const GroupRides: React.FC = () => {
  // TODO add react-virtualized to do infinite scrolling
  return (
    <Row className={classes.rides} gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]} justify="space-around">
      {randomRideDataTest.map((rideData, i) => (<Col><Ride key={i} rideData={rideData}/></Col>))}
    </Row>
  );
}
